export const allowedExtensions = ['.pdf', '.xls', '.xlsx', '.doc', '.docx'] as const;

export type AllowedExtension = (typeof allowedExtensions)[number];

export interface PublicFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  deleteAvailableAt: string;
  expiresAt: string;
}

export interface UploadResult {
  file: PublicFile;
  deleteToken: string;
}
