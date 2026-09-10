import { AlertTriangle, X } from 'lucide-react';
import type { SharedFile } from '../types/file';

interface DeleteModalProps {
  file: SharedFile;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ file, deleting, onCancel, onConfirm }: DeleteModalProps) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><AlertTriangle size={21} /></div>
        <button type="button" onClick={onCancel} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close delete dialog"><X size={18} /></button>
      </div>
      <h2 id="delete-title" className="mb-2 text-xl font-bold tracking-[-0.03em] text-ink">Delete this file?</h2>
      <p className="mb-1 truncate text-sm font-semibold text-slate-600" title={file.name}>{file.name}</p>
      <p className="mb-7 text-sm leading-6 text-slate-500">This removes the file for everyone immediately. You won’t be able to undo this action.</p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={deleting} className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
        <button type="button" onClick={onConfirm} disabled={deleting} className="min-h-11 rounded-xl bg-rose-500 px-5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60">{deleting ? 'Deleting…' : 'Delete file'}</button>
      </div>
    </div>
  </div>
);
