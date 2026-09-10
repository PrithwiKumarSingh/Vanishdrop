import type { ApiErrorResponse, FilesResponse, SharedFile, UploadResponse } from '../types/file';

export const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => ({}))) as Partial<ApiErrorResponse>;
  if (!response.ok) throw new Error(payload.message ?? 'Something went wrong. Please try again.');
  return payload as T;
};

export const fetchFiles = async (): Promise<SharedFile[]> => {
  const response = await fetch(`${apiBaseUrl}/files`);
  const payload = await parseResponse<FilesResponse>(response);
  return payload.files;
};

export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
  // XMLHttpRequest is used here only for upload progress; all other API calls use fetch.
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${apiBaseUrl}/files`);
    request.responseType = 'json';
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener('load', () => {
      const payload = request.response as UploadResponse | ApiErrorResponse | null;
      if (request.status >= 200 && request.status < 300) resolve(payload as UploadResponse);
      else reject(new Error(payload && 'message' in payload ? payload.message : 'Upload failed. Please try again.'));
    });
    request.addEventListener('error', () => reject(new Error('Upload failed. Check your connection and try again.')));
    const body = new FormData();
    body.append('file', file);
    request.send(body);
  });
};

export const deleteFile = async (fileId: string, deleteToken: string): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${deleteToken}` },
  });
  await parseResponse<{ success: true }>(response);
};

export const getDownloadUrl = (fileId: string): string => `${apiBaseUrl}/files/${fileId}/download`;
