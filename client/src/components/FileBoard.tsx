import { FolderOpen, RefreshCw } from 'lucide-react';
import type { SharedFile } from '../types/file';
import { FileCard } from './FileCard';

interface FileBoardProps {
  files: SharedFile[];
  owned: Record<string, string>;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onDelete: (file: SharedFile) => void;
}

export const FileBoard = ({ files, owned, loading, refreshing, error, onRefresh, onDelete }: FileBoardProps) => (
  <section className="mx-auto max-w-6xl animate-fade-up px-4 py-16 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="recent-files-title">
    <div className="mb-7 flex items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cobalt"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cobalt" /> Live board</div><div className="flex flex-wrap items-center gap-3"><h2 id="recent-files-title" className="text-2xl font-bold tracking-[-0.04em] text-ink sm:text-3xl">Recent files</h2>{!loading && !error && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-400 shadow-sm">{files.length} {files.length === 1 ? 'file' : 'files'}</span>}</div><p className="mt-2 text-sm text-slate-500">Files shared publicly from this VanishDrop.</p></div><button type="button" onClick={onRefresh} disabled={loading || refreshing} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-500 transition hover:border-indigo-200 hover:text-cobalt disabled:opacity-50"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Refresh</span></button></div>
    {loading && <div className="grid gap-3" aria-label="Loading files"><div className="h-[116px] animate-pulse rounded-2xl bg-white/70" /><div className="h-[116px] animate-pulse rounded-2xl bg-white/70" /></div>}
    {!loading && error && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700" role="alert"><p className="font-bold">We couldn’t load the public files.</p><p className="mt-1">{error}</p><button type="button" onClick={onRefresh} className="mt-3 font-bold underline underline-offset-2">Try again</button></div>}
    {!loading && !error && files.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm"><FolderOpen size={25} /></div><h3 className="text-base font-bold text-ink">The board is clear</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Upload the first file and it will show up here for every device.</p></div>}
    {!loading && !error && files.length > 0 && <div className="grid gap-3">{files.map((file) => <FileCard key={file.id} file={file} isOwned={Boolean(owned[file.id])} onDelete={onDelete} />)}</div>}
  </section>
);
