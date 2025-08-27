import { uploadFile, uploadMultipleFiles } from '@/services/fileUploadService';
import { FileUploadOptions, UploadResult } from '@/types/fileUploadType';

export const uploadProfilePicture = async (
  file: Express.Multer.File,
  userId?: string,
): Promise<UploadResult> => {
  const uploadOptions: FileUploadOptions = {
    path: `users/profile-pictures${userId ? `/${userId}` : ''}`,
    metadata: {
      type: 'profile-picture',
      uploadedAt: new Date().toISOString(),
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  };

  return await uploadFile(file, uploadOptions);
};

export const uploadDocument = async (
  file: Express.Multer.File,
  documentType: string,
  userId?: string,
): Promise<UploadResult> => {
  const uploadOptions: FileUploadOptions = {
    path: `users/documents/${documentType}${userId ? `/${userId}` : ''}`,
    metadata: {
      type: 'document',
      documentType,
      uploadedAt: new Date().toISOString(),
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
  };

  return await uploadFile(file, uploadOptions);
};

export const uploadMultipleFilesWithOptions = async (
  files: Express.Multer.File[],
  options: FileUploadOptions,
): Promise<UploadResult[]> => {
  return await uploadMultipleFiles(files, options);
};
