import { uploadFile } from '@/services/fileUploadService';
import { FILE_UPLOAD } from '@/constants';
import { FileUploadOptions, UploadResult } from '@/types/fileUploadType';

export const uploadProfilePicture = async (
  file: Express.Multer.File,
  userId?: string,
): Promise<UploadResult> => {
  const uploadOptions: FileUploadOptions = {
    path: `${FILE_UPLOAD.PROFILE_PICTURE.PATH}${userId ? `/${userId}` : ''}`,
    metadata: {
      type: FILE_UPLOAD.PROFILE_PICTURE.METADATA_TYPE,
      uploadedAt: new Date().toISOString(),
    },
    maxSize: FILE_UPLOAD.PROFILE_PICTURE.MAX_SIZE,
    allowedExtensions: FILE_UPLOAD.PROFILE_PICTURE.ALLOWED_EXTENSIONS,
  };

  return await uploadFile(file, uploadOptions);
};

export const uploadDocument = async (
  file: Express.Multer.File,
  documentType: string,
  userId?: string,
): Promise<UploadResult> => {
  const uploadOptions: FileUploadOptions = {
    path: `${FILE_UPLOAD.DOCUMENT.PATH}/${documentType}${userId ? `/${userId}` : ''}`,
    metadata: {
      type: FILE_UPLOAD.DOCUMENT.METADATA_TYPE,
      documentType,
      uploadedAt: new Date().toISOString(),
    },
    maxSize: FILE_UPLOAD.DOCUMENT.MAX_SIZE,
    allowedExtensions: FILE_UPLOAD.DOCUMENT.ALLOWED_EXTENSIONS,
  };

  return await uploadFile(file, uploadOptions);
};
