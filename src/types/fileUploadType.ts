export interface FileUploadOptions {
  path?: string;
  fileName?: string;
  metadata?: Record<string, string>;
  public?: boolean;
  contentType?: string;
  useOriginalName?: boolean;
  maxSize?: number;
  allowedExtensions?: string[];
}

export interface FileMetadata {
  originalName: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
  path: string;
  publicUrl?: string;
  customMetadata?: Record<string, string>;
}

export interface UploadResult {
  fileName: string;
  fullPath: string;
  publicUrl?: string;
  metadata: FileMetadata;
  size: number;
  contentType: string;
}

export interface DeleteResult {
  success: boolean;
  path: string;
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}
