export interface SharedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  deleteAvailableAt: string;
  expiresAt: string;
}

export interface UploadResponse {
  success: true;
  file: SharedFile;
  deleteToken: string;
}

export interface FilesResponse {
  success: true;
  files: SharedFile[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
