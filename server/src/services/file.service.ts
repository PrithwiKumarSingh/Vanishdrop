import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { FileModel, type FileDocument } from '../models/file.model.js';
import { type PublicFile, type UploadResult } from '../types/file.js';
import { createDeleteToken, hashDeleteToken, tokensMatch } from '../utils/token.js';
import { getExtension, hasValidSignature, isMimeAllowed, sanitizeOriginalName } from '../utils/file-validation.js';
import { storageProvider } from './storage.service.js';

const minutesFromNow = (date: Date, minutes: number): Date => new Date(date.getTime() + minutes * 60 * 1000);
const hoursFromNow = (date: Date, hours: number): Date => new Date(date.getTime() + hours * 60 * 60 * 1000);

export const isDeletionAvailable = (deleteAvailableAt: Date, now = new Date()): boolean => now >= deleteAvailableAt;

export const isExpired = (expiresAt: Date, now = new Date()): boolean => now >= expiresAt;

const toPublicFile = (file: Pick<FileDocument, '_id' | 'originalName' | 'size' | 'mimeType' | 'uploadTime' | 'deleteAvailableAt' | 'expiresAt'>): PublicFile => ({
  id: file._id.toString(),
  name: file.originalName,
  size: file.size,
  mimeType: file.mimeType,
  uploadedAt: file.uploadTime.toISOString(),
  deleteAvailableAt: file.deleteAvailableAt.toISOString(),
  expiresAt: file.expiresAt.toISOString(),
});

export class FileServiceError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'FileServiceError';
  }
}

export const uploadFile = async (input: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}): Promise<UploadResult> => {
  const originalName = sanitizeOriginalName(input.originalName);
  const extension = getExtension(originalName);
  if (!extension) throw new FileServiceError(415, 'This file type is not supported.');
  if (input.buffer.byteLength > env.maxFileSizeMb * 1024 * 1024) {
    throw new FileServiceError(413, `File is too large. Maximum file size is ${env.maxFileSizeMb} MB.`);
  }
  if (!isMimeAllowed(input.mimeType, extension) || !hasValidSignature(input.buffer, extension)) {
    throw new FileServiceError(415, 'The file content does not match its file type.');
  }

  const now = new Date();
  const storedName = `${crypto.randomUUID()}${extension}`;
  const storageKey = storedName;
  const deleteToken = createDeleteToken();

  await storageProvider.upload(input.buffer, storageKey, input.mimeType);
  try {
    const created = await FileModel.create({
      originalName,
      storedName,
      mimeType: input.mimeType,
      size: input.buffer.byteLength,
      storageKey,
      uploadTime: now,
      deleteAvailableAt: minutesFromNow(now, env.deleteLockMinutes),
      expiresAt: hoursFromNow(now, env.expirationHours),
      status: 'active',
      uploaderTokenHash: hashDeleteToken(deleteToken),
    });
    console.info(JSON.stringify({ event: 'upload_successful', fileId: created.id, size: created.size }));
    return { file: toPublicFile(created), deleteToken };
  } catch (error) {
    await storageProvider.delete(storageKey);
    throw error;
  }
};

export const listActiveFiles = async (): Promise<PublicFile[]> => {
  const now = new Date();
  const files = await FileModel.find({ status: 'active', expiresAt: { $gt: now } })
    .sort({ uploadTime: -1 })
    .select('originalName size mimeType uploadTime deleteAvailableAt expiresAt')
    .lean();
  return files.map((file) => toPublicFile(file));
};

export const getDownloadableFile = async (id: string): Promise<{ file: FileDocument; stream: NodeJS.ReadableStream }> => {
  if (!mongoose.isValidObjectId(id)) throw new FileServiceError(404, 'File not found. It may have expired or been deleted.');
  const file = await FileModel.findOne({ _id: id, status: 'active' }).select('+uploaderTokenHash');
  if (!file || isExpired(file.expiresAt)) throw new FileServiceError(404, 'File not found. It may have expired or been deleted.');
  if (!(await storageProvider.exists(file.storageKey))) {
    throw new FileServiceError(404, 'File not found. It may have expired or been deleted.');
  }
  console.info(JSON.stringify({ event: 'download', fileId: file.id }));
  return { file, stream: await storageProvider.download(file.storageKey) };
};

export const deleteFile = async (id: string, deleteToken: string): Promise<void> => {
  if (!mongoose.isValidObjectId(id)) throw new FileServiceError(404, 'File not found. It may have expired or been deleted.');
  const file = await FileModel.findOne({ _id: id, status: 'active' }).select('+uploaderTokenHash');
  if (!file) throw new FileServiceError(404, 'File not found. It may have expired or been deleted.');
  if (!tokensMatch(deleteToken, file.uploaderTokenHash)) throw new FileServiceError(403, 'You do not have permission to delete this file.');
  if (isExpired(file.expiresAt)) throw new FileServiceError(404, 'File not found. It may have expired or been deleted.');
  if (!isDeletionAvailable(file.deleteAvailableAt)) {
    const minutes = Math.ceil((file.deleteAvailableAt.getTime() - Date.now()) / 60_000);
    throw new FileServiceError(409, `This file can be deleted after ${minutes} minute${minutes === 1 ? '' : 's'}.`);
  }

  await storageProvider.delete(file.storageKey);
  await FileModel.deleteOne({ _id: file._id });
  console.info(JSON.stringify({ event: 'manual_deletion', fileId: file.id }));
};

export const cleanupExpiredFiles = async (): Promise<{ cleaned: number; failed: number }> => {
  const expired = await FileModel.find({ status: 'active', expiresAt: { $lte: new Date() } }).select('+uploaderTokenHash');
  let cleaned = 0;
  let failed = 0;
  for (const file of expired) {
    try {
      await storageProvider.delete(file.storageKey);
      await FileModel.deleteOne({ _id: file._id });
      cleaned += 1;
      console.info(JSON.stringify({ event: 'automatic_expiration', fileId: file.id }));
    } catch (error) {
      failed += 1;
      console.error(JSON.stringify({ event: 'cleanup_failure', fileId: file.id, error: String(error) }));
    }
  }
  return { cleaned, failed };
};
