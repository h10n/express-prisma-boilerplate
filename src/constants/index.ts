export const REQUEST_STATUSES = {
  ERROR: 'error',
  FAIL: 'fail',
  SUCCESS: 'success',
};

export const APP_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export const ERROR_CODES = {
  OPERATIONAL_ERROR: 'OPERATIONAL_ERROR',
  APP_ERROR: 'APP_ERROR',
  REQUEST_VALIDATION_ERROR: 'REQUEST_VALIDATION_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
};

export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Something went wrong! Please try again later.',
  VALIDATION_ERROR: 'Request Validation Error',
};

export const FILE_UPLOAD = {
  DEFAULT_MAX_SIZE: 10 * 1024 * 1024,
  DEFAULT_ALLOWED_EXTENSIONS: [
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
  ],
  DEFAULT_UPLOAD_PATH: 'uploads',
  DEFAULT_SIGNED_URL_EXPIRATION: 3600,
  DEFAULT_PUBLIC_URL_EXPIRATION: 24 * 60 * 60,
  MAX_FILENAME_LENGTH: 100,
  FIREBASE_STORAGE_BASE_URL: 'https://storage.googleapis.com',
  PROFILE_PICTURE: {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
    PATH: 'users/profile-pictures',
    METADATA_TYPE: 'profile-picture',
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024,
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt'],
    PATH: 'users/documents',
    METADATA_TYPE: 'document',
  },
};
