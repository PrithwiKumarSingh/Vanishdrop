import { createReadStream } from 'node:fs';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

export interface StorageProvider {
  upload(file: Buffer, key: string, mimeType: string): Promise<void>;
  download(key: string): Promise<NodeJS.ReadableStream>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

const cleanSetting = (value: string): string => value.trim().replace(/^['"]|['"]$/g, '').trim();

const normalizeSupabaseUrl = (value: string): string => {
  const cleaned = cleanSetting(value);
  let parsed: URL;

  try {
    parsed = new URL(cleaned);
  } catch {
    throw new Error('SUPABASE_URL must be a valid project URL, for example https://your-project-ref.supabase.co.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
    throw new Error('SUPABASE_URL must start with http:// or https:// and point to your Supabase project.');
  }

  // The Supabase client adds /storage/v1 itself. Accepting these common pasted
  // endpoint variants prevents an invalid double-storage path in the request.
  if (parsed.pathname === '/' || parsed.pathname === '/storage/v1' || parsed.pathname === '/storage/v1/') {
    return parsed.origin;
  }

  throw new Error('SUPABASE_URL must be the project URL only; remove paths such as /storage/v1 or /storage/v1/s3.');
};

const validateBucketName = (value: string): string => {
  const bucket = cleanSetting(value);
  if (!bucket || bucket.includes('/') || bucket.includes('\\') || bucket !== value.trim()) {
    throw new Error('SUPABASE_BUCKET must be the bucket ID only, for example VanishDrop-files.');
  }
  return bucket;
};

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly rootPath: string) {}

  private resolveKey(key: string): string {
    const resolved = path.resolve(this.rootPath, key);
    if (resolved !== path.resolve(this.rootPath) && !resolved.startsWith(`${path.resolve(this.rootPath)}${path.sep}`)) {
      throw new Error('Invalid storage key');
    }
    return resolved;
  }

  async upload(file: Buffer, key: string, _mimeType: string): Promise<void> {
    const filePath = this.resolveKey(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, file, { flag: 'wx' });
  }

  async download(key: string): Promise<NodeJS.ReadableStream> {
    return createReadStream(this.resolveKey(key));
  }

  async delete(key: string): Promise<void> {
    try {
      await unlink(this.resolveKey(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await access(this.resolveKey(key));
      return true;
    } catch {
      return false;
    }
  }
}

export class SupabaseStorageProvider implements StorageProvider {
  private readonly client: SupabaseClient;

  constructor(
    private readonly bucket: string,
    url: string,
    serviceRoleKey: string,
  ) {
    this.client = createClient(normalizeSupabaseUrl(url), cleanSetting(serviceRoleKey), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async upload(file: Buffer, key: string, mimeType: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).upload(key, file, {
      contentType: mimeType,
      upsert: false,
    });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
  }

  async download(key: string): Promise<NodeJS.ReadableStream> {
    const { data, error } = await this.client.storage.from(this.bucket).download(key);
    if (error || !data) throw new Error(`Supabase download failed: ${error?.message ?? 'file not found'}`);
    return Readable.fromWeb(data.stream() as unknown as import('node:stream/web').ReadableStream);
  }

  async delete(key: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).remove([key]);
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  }

  async exists(key: string): Promise<boolean> {
    const { data, error } = await this.client.storage.from(this.bucket).list('', { limit: 100, search: key });
    if (error) throw new Error(`Supabase lookup failed: ${error.message}`);
    return data.some((object) => object.name === key);
  }
}

const createStorageProvider = (): StorageProvider => {
  if (env.storageProvider === 'supabase') {
    if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
      throw new Error('STORAGE_PROVIDER=supabase requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    return new SupabaseStorageProvider(validateBucketName(env.supabaseBucket), env.supabaseUrl, env.supabaseServiceRoleKey);
  }
  return new LocalStorageProvider(env.localStoragePath);
};

export const storageProvider: StorageProvider = createStorageProvider();
