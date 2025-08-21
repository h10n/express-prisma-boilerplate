import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  deleteMultipleFiles,
  getFileMetadata,
  fileExists,
  generateSignedUrl,
} from '@/services/fileUploadService';
import { FileUploadError } from '@/errors/FileUploadError';
import {
  FileUploadOptions,
  UploadResult,
  DeleteResult,
} from '@/types/fileUploadType';

const createSuccessResponse = (
  data: any,
  message: string,
  statusCode: number = 200,
) => ({
  success: true,
  data,
  message,
  statusCode,
});

const createErrorResponse = (
  error: string,
  errorCode: string,
  statusCode: number = 400,
) => ({
  success: false,
  error: {
    code: errorCode,
    message: error,
  },
  statusCode,
});

export const handleSingleFileUpload = async (
  file: Express.Multer.File,
  options: FileUploadOptions = {},
): Promise<{
  success: boolean;
  data?: UploadResult;
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!file) {
      return createErrorResponse('No file provided', 'NO_FILE_PROVIDED', 400);
    }

    const result = await uploadFile(file, options);
    return createSuccessResponse(result, 'File uploaded successfully', 201);
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse('Upload failed', 'UPLOAD_FAILED', 500);
  }
};

export const handleMultipleFilesUpload = async (
  files: Express.Multer.File[],
  options: FileUploadOptions = {},
): Promise<{
  success: boolean;
  data?: UploadResult[];
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!files || files.length === 0) {
      return createErrorResponse('No files provided', 'NO_FILES_PROVIDED', 400);
    }

    const results = await uploadMultipleFiles(files, options);
    return createSuccessResponse(
      results,
      `${results.length} files uploaded successfully`,
      201,
    );
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse('Upload failed', 'UPLOAD_FAILED', 500);
  }
};

export const handleFileDeletion = async (
  filePath: string,
): Promise<{
  success: boolean;
  data?: DeleteResult;
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!filePath) {
      return createErrorResponse('No file path provided', 'NO_FILE_PATH', 400);
    }

    const result = await deleteFile(filePath);

    if (result.success) {
      return createSuccessResponse(result, 'File deleted successfully', 200);
    } else {
      return createErrorResponse(
        result.error || 'Delete failed',
        'DELETE_FAILED',
        400,
      );
    }
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse('Delete failed', 'DELETE_FAILED', 500);
  }
};

export const handleMultipleFilesDeletion = async (
  filePaths: string[],
): Promise<{
  success: boolean;
  data?: any;
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!filePaths || filePaths.length === 0) {
      return createErrorResponse(
        'No file paths provided',
        'NO_FILE_PATHS',
        400,
      );
    }

    const results = await deleteMultipleFiles(filePaths);
    const successful = results.filter((result) => result.success);
    const failed = results.filter((result) => !result.success);

    return createSuccessResponse(
      {
        successful: successful.length,
        failed: failed.length,
        results,
      },
      `Deleted ${successful.length} files successfully, ${failed.length} failed`,
      200,
    );
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse('Delete failed', 'DELETE_FAILED', 500);
  }
};

export const handleGetFileMetadata = async (
  filePath: string,
): Promise<{
  success: boolean;
  data?: any;
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!filePath) {
      return createErrorResponse('No file path provided', 'NO_FILE_PATH', 400);
    }

    const metadata = await getFileMetadata(filePath);
    return createSuccessResponse(
      metadata,
      'File metadata retrieved successfully',
      200,
    );
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse(
      'Failed to get metadata',
      'METADATA_FAILED',
      500,
    );
  }
};

export const handleCheckFileExists = async (
  filePath: string,
): Promise<{
  success: boolean;
  data?: { exists: boolean };
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!filePath) {
      return createErrorResponse('No file path provided', 'NO_FILE_PATH', 400);
    }

    const exists = await fileExists(filePath);
    return createSuccessResponse(
      { exists },
      'File existence checked successfully',
      200,
    );
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse(
      'Failed to check file existence',
      'CHECK_FAILED',
      500,
    );
  }
};

export const handleGenerateSignedUrl = async (
  filePath: string,
  expirationInSeconds: number = 3600,
): Promise<{
  success: boolean;
  data?: { signedUrl: string };
  error?: any;
  statusCode: number;
}> => {
  try {
    if (!filePath) {
      return createErrorResponse('No file path provided', 'NO_FILE_PATH', 400);
    }

    const signedUrl = await generateSignedUrl(filePath, expirationInSeconds);
    return createSuccessResponse(
      { signedUrl },
      'Signed URL generated successfully',
      200,
    );
  } catch (error) {
    if (error instanceof FileUploadError) {
      return createErrorResponse(
        error.message,
        error.errorCode,
        error.statusCode,
      );
    }
    return createErrorResponse(
      'Failed to generate signed URL',
      'SIGNED_URL_FAILED',
      500,
    );
  }
};
