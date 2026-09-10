import { Schema, model, type Document, type Model } from 'mongoose';

export type FileStatus = 'active' | 'deleted' | 'expired';

export interface FileDocument extends Document {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  uploadTime: Date;
  deleteAvailableAt: Date;
  expiresAt: Date;
  deletedAt?: Date;
  status: FileStatus;
  uploaderTokenHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<FileDocument>(
  {
    originalName: { type: String, required: true, trim: true, maxlength: 255 },
    storedName: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    storageKey: { type: String, required: true, unique: true },
    uploadTime: { type: Date, required: true, index: true },
    deleteAvailableAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: true },
    deletedAt: { type: Date },
    status: { type: String, enum: ['active', 'deleted', 'expired'], default: 'active', index: true },
    uploaderTokenHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

fileSchema.index({ status: 1, expiresAt: 1 });

export const FileModel: Model<FileDocument> = model<FileDocument>('File', fileSchema);
