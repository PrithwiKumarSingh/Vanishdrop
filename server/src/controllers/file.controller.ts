import type { RequestHandler } from 'express';
import {
  deleteFile,
  getDownloadableFile,
  listActiveFiles,
  uploadFile,
} from '../services/file.service.js';
import { FileServiceError } from '../services/file.service.js';

export const getFiles: RequestHandler = async (_request, response, next) => {
  try {
    response.json({ success: true, files: await listActiveFiles() });
  } catch (error) {
    next(error);
  }
};

export const upload: RequestHandler = async (request, response, next) => {
  try {
    if (!request.file) throw new FileServiceError(400, 'Choose a file to upload.');
    const result = await uploadFile({
      buffer: request.file.buffer,
      originalName: request.file.originalname,
      mimeType: request.file.mimetype,
    });
    response.status(201).json({ success: true, ...result });
  } catch (error) {
    console.warn(JSON.stringify({ event: 'upload_rejected', error: error instanceof Error ? error.message : String(error) }));
    next(error);
  }
};

export const download: RequestHandler = async (request, response, next) => {
  try {
    const fileId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const { file, stream } = await getDownloadableFile(fileId);
    response.setHeader('Content-Type', file.mimeType);
    response.setHeader('Content-Length', String(file.size));
    response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    stream.pipe(response);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (request, response, next) => {
  try {
    const authorization = request.header('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
    if (!token) throw new FileServiceError(401, 'A valid deletion token is required.');
    const fileId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    await deleteFile(fileId, token);
    response.json({ success: true });
  } catch (error) {
    next(error);
  }
};
