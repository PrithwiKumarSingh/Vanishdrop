import type { ErrorRequestHandler, RequestHandler } from 'express';
import multer from 'multer';
import { FileServiceError } from '../services/file.service.js';

export const notFoundMiddleware: RequestHandler = (_request, response) => {
  response.status(404).json({ success: false, message: 'Route not found.' });
};

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof FileServiceError) {
    response.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    response.status(413).json({ success: false, message: 'File is too large. Maximum file size is 10 MB.' });
    return;
  }
  if (error instanceof multer.MulterError) {
    response.status(400).json({ success: false, message: 'Please upload one file at a time.' });
    return;
  }
  console.error(JSON.stringify({ event: 'unhandled_error', error: String(error) }));
  response.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
};
