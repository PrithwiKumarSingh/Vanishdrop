import { ArrowDownToLine, Clock3, Download, Trash2 } from 'lucide-react';
import type { SharedFile } from '../types/file';
import { formatFileSize, formatRelativeTime } from '../utils/file';
import { useCountdown } from '../hooks/useCountdown';
import { getDownloadUrl } from '../lib/api';
import { FileIcon } from './FileIcon';

interface FileCardProps {
  file: SharedFile;
  isOwned: boolean;
  onDelete: (file: SharedFile) => void;
}

export const FileCard = ({ file, isOwned, onDelete }: FileCardProps) => {
  const expiration = useCountdown(file.expiresAt);
  const deleteCountdown = useCountdown(file.deleteAvailableAt);
  const totalLifetime = new Date(file.expiresAt).getTime() - new Date(file.uploadedAt).getTime();
  const remainingLifetime = Math.max(0, new Date(file.expiresAt).getTime() - Date.now());
  const lifetimePercent = totalLifetime > 0 ? Math.min(100, Math.round((remainingLifetime / totalLifetime) * 100)) : 0;

  if (expiration.complete) return null;

  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:flex-row sm:items-center sm:p-5">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cobalt via-lilac to-aqua opacity-70" />
      <FileIcon name={file.name} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="min-w-0 truncate text-sm font-bold text-ink" title={file.name}>{file.name}</h3>
          {isOwned && <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cobalt">yours</span>}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-400">
          <span>{formatFileSize(file.size)}</span><span className="text-slate-300">•</span><span>{formatRelativeTime(file.uploadedAt)}</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
          <Clock3 size={14} strokeWidth={2.2} />
          <span>Expires in {expiration.label}</span>
        </div>
        <div className="mt-3 h-1 max-w-[220px] overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-300 transition-[width] duration-1000" style={{ width: `${lifetimePercent}%` }} /></div>
      </div>
      <div className="flex shrink-0 gap-2 sm:flex-col sm:items-stretch sm:gap-2">
        <a href={getDownloadUrl(file.id)} download className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-xs font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 sm:min-w-[116px]">
          <Download size={16} /> <span>Download</span>
        </a>
        {isOwned && !deleteCountdown.complete && <button type="button" disabled className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-[11px] font-bold text-slate-400 sm:min-w-[116px]" title="Deletion becomes available five minutes after upload">
          <Clock3 size={14} /> <span>Delete in {deleteCountdown.label}</span>
        </button>}
        {isOwned && deleteCountdown.complete && !expiration.complete && <button type="button" onClick={() => onDelete(file)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 px-3 text-xs font-bold text-rose-500 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 sm:min-w-[116px]">
          <Trash2 size={15} /> <span>Delete</span>
        </button>}
        {!isOwned && <span className="hidden items-center justify-center gap-1.5 px-2 text-[11px] font-semibold text-slate-400 sm:flex"><ArrowDownToLine size={14} /> Public file</span>}
      </div>
    </article>
  );
};
