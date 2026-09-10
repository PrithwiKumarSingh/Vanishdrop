import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteFile as deleteFileRequest, fetchFiles, uploadFile as uploadFileRequest } from '../lib/api';
import type { SharedFile } from '../types/file';

const OWNED_STORAGE_KEY = 'VanishDrop_owned_files';

type OwnedFiles = Record<string, string>;

const readOwnedFiles = (): OwnedFiles => {
  try {
    return JSON.parse(localStorage.getItem(OWNED_STORAGE_KEY) ?? '{}') as OwnedFiles;
  } catch {
    return {};
  }
};

const writeOwnedFiles = (owned: OwnedFiles): void => localStorage.setItem(OWNED_STORAGE_KEY, JSON.stringify(owned));

export const useFiles = () => {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [owned, setOwned] = useState<OwnedFiles>(() => readOwnedFiles());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const nextFiles = await fetchFiles();
      if (mounted.current) {
        setFiles(nextFiles);
        setError(null);
      }
    } catch (requestError) {
      if (mounted.current && !quiet) setError(requestError instanceof Error ? requestError.message : 'Unable to load files.');
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') void refresh(true);
    };
    const interval = window.setInterval(refreshIfVisible, 30_000);
    document.addEventListener('visibilitychange', refreshIfVisible);
    return () => {
      mounted.current = false;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [refresh]);

  const upload = useCallback(async (file: File, onProgress: (progress: number) => void) => {
    const result = await uploadFileRequest(file, onProgress);
    const nextOwned = { ...readOwnedFiles(), [result.file.id]: result.deleteToken };
    writeOwnedFiles(nextOwned);
    setOwned(nextOwned);
    setFiles((current) => [result.file, ...current.filter((item) => item.id !== result.file.id)]);
    return result.file;
  }, []);

  const remove = useCallback(async (file: SharedFile) => {
    const token = owned[file.id];
    if (!token) throw new Error('This file is not owned by the current browser.');
    await deleteFileRequest(file.id, token);
    const nextOwned = { ...owned };
    delete nextOwned[file.id];
    writeOwnedFiles(nextOwned);
    setOwned(nextOwned);
    setFiles((current) => current.filter((item) => item.id !== file.id));
  }, [owned]);

  return { files, owned, loading, refreshing, error, refresh, upload, remove };
};
