import { bucket } from '@/config/firebaseStorage';
import { FileUploadError } from '@/errors/FileUploadError';
import { FILE_UPLOAD } from '@/constants';
import {
  DeleteResult,
  FileUploadOptions,
  UploadResult,
} from '@/types/fileUploadType';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
    .substring(0, FILE_UPLOAD.MAX_FILENAME_LENGTH);
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

  const basePath = options.path || FILE_UPLOAD.DEFAULT_UPLOAD_PATH;
  return `${basePath}/${fileName}`;
};

const createFileMetadata = (
  file: Express.Multer.File,
  options: FileUploadOptions,
): any => ({
  contentType: options.contentType || file.mimetype,
  metadata: {
    originalName: file.originalname,
    uploadedAt: new Date().toISOString(),
    ...options.metadata,
  },
});

const createUploadOptions = (options: FileUploadOptions): any => {
  const uploadOptions: any = {
    resumable: false,
  };

  if (options.public) {
    uploadOptions.predefinedAcl = 'publicRead';
  }

  return uploadOptions;
};

const getFileReference = (filePath: string) => bucket.file(filePath);

const getFileMetadataInternal = async (filePath: string) => {
  try {
    const fileRef = getFileReference(filePath);
    const [metadata] = await fileRef.getMetadata();
    return metadata;
  } catch (error) {
    throw FileUploadError.metadataRetrievalFailed(filePath);
  }
};

const generateSignedUrlInternal = async (
  filePath: string,
  expirationInSeconds: number,
): Promise<string> => {
  try {
    const fileRef = getFileReference(filePath);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + expirationInSeconds * 1000,
    });
    return url;
  } catch (error) {
    throw FileUploadError.signedUrlGenerationFailed(filePath);
  }
};

const isFilePubliclyAccessible = (metadata: any): boolean => {
  return (
    metadata.acl &&
    metadata.acl.some(
      (rule: any) => rule.entity === 'allUsers' && rule.role === 'READER',
    )
  );
};

const generatePublicUrl = (filePath: string): string => {
  return `${FILE_UPLOAD.FIREBASE_STORAGE_BASE_URL}/${bucket.name}/${filePath}`;
};

export const validateFile = (
  file: Express.Multer.File,
  options: FileUploadOptions = {},
): void => {
  const maxSize = options.maxSize || FILE_UPLOAD.DEFAULT_MAX_SIZE;
  const allowedExtensions =
    options.allowedExtensions || FILE_UPLOAD.DEFAULT_ALLOWED_EXTENSIONS;

  if (file.size > maxSize) {
    throw FileUploadError.fileTooLarge(maxSize);
  }

  const fileExtension = extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw FileUploadError.invalidFileType(allowedExtensions);
  }
};

export const generateSignedUrl = async (
  filePath: string,
  expirationInSeconds: number = FILE_UPLOAD.DEFAULT_SIGNED_URL_EXPIRATION,
): Promise<string> => {
  return generateSignedUrlInternal(filePath, expirationInSeconds);
};

export const getAccessibleFileUrl = async (
  filePath: string,
  options: { public: boolean } = { public: true },
): Promise<string> => {
  try {
    if (options.public) {
      const publicUrl = generatePublicUrl(filePath);
      const metadata = await getFileMetadataInternal(filePath);

      if (isFilePubliclyAccessible(metadata)) {
        return publicUrl;
      }
    }

    return generateSignedUrlInternal(
      filePath,
      FILE_UPLOAD.DEFAULT_PUBLIC_URL_EXPIRATION,
    );
  } catch (error) {
    if (error instanceof FileUploadError) {
      throw error;
    }
    throw FileUploadError.fileAccessError();
  }
};

export const uploadFile = async (
  file: Express.Multer.File,
  options: FileUploadOptions = {},
): Promise<UploadResult> => {
  try {
    validateFile(file, options);

    const filePath = buildFilePath(file.originalname, options);
    const fileRef = getFileReference(filePath);
    const metadata = createFileMetadata(file, options);
    const uploadOptions = createUploadOptions(options);

    await fileRef.save(file.buffer, { ...uploadOptions, metadata });

    if (options.public) {
      try {
        await fileRef.makePublic();
      } catch (error) {
        // Silent fallback - file might already be public
      }
    }

    let publicUrl: string | undefined;
    if (options.public) {
      try {
        publicUrl = await getAccessibleFileUrl(filePath, { public: true });
      } catch (error) {
        publicUrl = generatePublicUrl(filePath);
      }
    }

    return {
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
    const fileRef = getFileReference(filePath);
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
    throw FileUploadError.deleteFailed(filePath);
  }
};

export const deleteMultipleFiles = async (
  filePaths: string[],
): Promise<DeleteResult[]> => {
  const deletePromises = filePaths.map((filePath) => deleteFile(filePath));
  return Promise.all(deletePromises);
};

export const getFileMetadata = async (filePath: string) => {
  return getFileMetadataInternal(filePath);
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const fileRef = getFileReference(filePath);
    const [exists] = await fileRef.exists();
    return exists;
  } catch (error) {
    return false;
  }
};
