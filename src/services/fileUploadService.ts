import { bucket } from '@/config/firebaseStorage';
import { FileUploadError } from '@/errors/FileUploadError';
import {
  DeleteResult,
  FileUploadOptions,
  FileValidationResult,
  UploadResult,
} from '@/types/fileUploadType';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;
const DEFAULT_ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.mp4',
  '.mp3',
  '.zip',
];

export const validateFile = (
  file: Express.Multer.File,
  options: FileUploadOptions = {},
): FileValidationResult => {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  const allowedExtensions =
    options.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS;

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxSize} bytes`,
    };
  }

  const fileExtension = extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
    };
  }

  return { isValid: true };
};

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
    .substring(0, 100);
};

const generateUniqueFileName = (originalName: string): string => {
  const extension = extname(originalName);
  const uniqueId = randomUUID();
  return `${uniqueId}${extension}`;
};

const buildFilePath = (
  originalName: string,
  options: FileUploadOptions,
): string => {
  let fileName: string;

  if (!options.useOriginalName) {
    fileName = generateUniqueFileName(originalName);
  } else if (options.fileName) {
    fileName = sanitizeFileName(options.fileName);
  } else {
    fileName = sanitizeFileName(originalName);
  }

  const basePath = options.path || 'uploads';
  return `${basePath}/${fileName}`;
};

export const uploadFile = async (
  file: Express.Multer.File,
  options: FileUploadOptions = {},
): Promise<UploadResult> => {
  try {
    const validation = validateFile(file, options);
    if (!validation.isValid) {
      throw FileUploadError.invalidFileType(
        options.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS,
      );
    }

    const filePath = buildFilePath(file.originalname, options);
    const fileBuffer = file.buffer;

    const fileRef = bucket.file(filePath);

    const metadata: any = {
      contentType: options.contentType || file.mimetype,
      metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
        ...options.metadata,
      },
    };

    const uploadOptions: any = {
      metadata,
      resumable: false,
    };

    if (options.public) {
      uploadOptions.predefinedAcl = 'publicRead';
    }

    await fileRef.save(fileBuffer, uploadOptions);

    if (options.public) {
      try {
        await fileRef.makePublic();
      } catch (error) {
        // Silent fallback
      }
    }

    let publicUrl: string | undefined;
    if (options.public) {
      try {
        publicUrl = await getAccessibleFileUrl(filePath, { public: true });
      } catch (error) {
        publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
      }
    }

    const result: UploadResult = {
      fileName: fileRef.name,
      fullPath: filePath,
      publicUrl,
      size: file.size,
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        uploadedAt: new Date(),
        customMetadata: options.metadata,
      },
    };

    return result;
  } catch (error) {
    if (error instanceof FileUploadError) {
      throw error;
    }

    throw FileUploadError.uploadFailed(file.originalname);
  }
};

export const uploadMultipleFiles = async (
  files: Express.Multer.File[],
  options: FileUploadOptions = {},
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadFile(file, options));
  return Promise.all(uploadPromises);
};

export const deleteFile = async (filePath: string): Promise<DeleteResult> => {
  try {
    const fileRef = bucket.file(filePath);

    const [exists] = await fileRef.exists();
    if (!exists) {
      throw FileUploadError.fileNotFound(filePath);
    }

    await fileRef.delete();

    return {
      success: true,
      path: filePath,
    };
  } catch (error) {
    if (error instanceof FileUploadError) {
      throw error;
    }

    return {
      success: false,
      path: filePath,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const deleteMultipleFiles = async (
  filePaths: string[],
): Promise<DeleteResult[]> => {
  const deletePromises = filePaths.map((filePath) => deleteFile(filePath));
  return Promise.all(deletePromises);
};

export const getFileMetadata = async (filePath: string) => {
  try {
    const fileRef = bucket.file(filePath);
    const [metadata] = await fileRef.getMetadata();
    return metadata;
  } catch (error) {
    throw FileUploadError.fileNotFound(filePath);
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const fileRef = bucket.file(filePath);
    const [exists] = await fileRef.exists();
    return exists;
  } catch (error) {
    return false;
  }
};

export const generateSignedUrl = async (
  filePath: string,
  expirationInSeconds: number = 3600,
): Promise<string> => {
  try {
    const fileRef = bucket.file(filePath);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + expirationInSeconds * 1000,
    });
    return url;
  } catch (error) {
    throw FileUploadError.fileNotFound(filePath);
  }
};

export const getAccessibleFileUrl = async (
  filePath: string,
  options: { public: boolean } = { public: true },
): Promise<string> => {
  try {
    const fileRef = bucket.file(filePath);

    if (options.public) {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

      const [metadata] = await fileRef.getMetadata();
      if (
        metadata.acl &&
        metadata.acl.some(
          (rule: any) => rule.entity === 'allUsers' && rule.role === 'READER',
        )
      ) {
        return publicUrl;
      }
    }

    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    return signedUrl;
  } catch (error) {
    throw new FileUploadError(
      'Failed to get accessible file URL',
      'FILE_ACCESS_ERROR',
    );
  }
};
