import path from 'node:path';
import { allowedExtensions, type AllowedExtension } from '../types/file.js';

export const mimeByExtension: Record<AllowedExtension, string[]> = {
  '.pdf': ['application/pdf', 'application/octet-stream'],
  '.doc': ['application/msword', 'application/octet-stream'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
  '.xls': ['application/vnd.ms-excel', 'application/octet-stream'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/octet-stream'],
};

export const getExtension = (filename: string): AllowedExtension | null => {
  const extension = path.extname(filename).toLowerCase();
  return (allowedExtensions as readonly string[]).includes(extension) ? (extension as AllowedExtension) : null;
};

export const sanitizeOriginalName = (filename: string): string => {
  const baseName = path.basename(filename).replace(/[\u0000-\u001f<>:"/\\|?*]/g, '-').trim();
  return baseName.slice(0, 255) || 'untitled-file';
};

const startsWithBytes = (buffer: Buffer, bytes: number[]): boolean =>
  bytes.every((value, index) => buffer[index] === value);

export const hasValidSignature = (buffer: Buffer, extension: AllowedExtension): boolean => {
  if (extension === '.pdf') return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  if (extension === '.doc' || extension === '.xls') return startsWithBytes(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  if (extension === '.docx') return startsWithBytes(buffer, [0x50, 0x4b, 0x03, 0x04]) && buffer.includes('word/');
  if (extension === '.xlsx') return startsWithBytes(buffer, [0x50, 0x4b, 0x03, 0x04]) && buffer.includes('xl/');
  return false;
};

export const isMimeAllowed = (mimeType: string, extension: AllowedExtension): boolean =>
  mimeByExtension[extension].includes(mimeType.toLowerCase());
