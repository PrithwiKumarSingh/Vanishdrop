import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { FileUp, ShieldCheck, UploadCloud } from 'lucide-react';
import { formatFileSize, isSupportedFile } from '../utils/file';

interface UploadVanishDropProps {
  uploading: boolean;
  progress: number;
  onFile: (file: File) => void;
}

const maxSize = 40 * 1024 * 1024;

export const UploadVanishDrop = ({ uploading, progress, onFile }: UploadVanishDropProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const acceptFile = (file?: File) => {
    if (!file) return;
    if (!isSupportedFile(file)) {
      setLocalError('This file type is not supported.');
      return;
    }
    if (file.size > maxSize) {
      setLocalError(`File is too large. Maximum size is 10 MB.`);
      return;
    }
    setLocalError(null);
    onFile(file);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  if (uploading) {
    return (
      <div className="flex min-h-[278px] flex-col items-center justify-center rounded-[28px] border border-indigo-100 bg-indigo-50/55 px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-cobalt shadow-card">
          <FileUp size={28} className="animate-pulse" />
        </div>
        <p className="mb-1 text-base font-semibold text-ink">Uploading your file</p>
        <p className="mb-5 text-sm text-slate-500">Keep this tab open for a moment</p>
        <div className="w-full max-w-xs">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Upload progress</span><span>{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-indigo-100"><div className="h-full rounded-full bg-cobalt transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`group relative flex min-h-[278px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 text-center transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${dragging ? 'scale-[1.01] border-cobalt bg-indigo-50' : 'border-[#ccd7ea] bg-[#fbfcff] hover:border-cobalt/70 hover:bg-indigo-50/40'}`}
    >
      <input ref={inputRef} type="file" className="sr-only" accept=".pdf,.xls,.xlsx,.doc,.docx" onChange={onInputChange} />
      <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition ${dragging ? 'bg-cobalt text-white shadow-lg shadow-indigo-200' : 'animate-pulse-soft bg-indigo-50 text-cobalt group-hover:bg-cobalt group-hover:text-white'}`}>
        <UploadCloud size={29} strokeWidth={1.8} />
      </div>
      <p className="mb-1 text-lg font-semibold tracking-[-0.02em] text-ink">Drop a file here</p>
      <p className="mb-4 text-sm text-slate-500">or <span className="font-semibold text-cobalt">browse from your device</span></p>
      <div className="mb-5 flex flex-wrap justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX'].map((type) => <span key={type} className="rounded-md bg-white px-2 py-1 shadow-sm">{type}</span>)}
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><ShieldCheck size={14} className="text-emerald-500" /> Max file size {formatFileSize(maxSize)}</div>
      {localError && <p className="absolute bottom-3 left-4 right-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600" role="alert">{localError}</p>}
    </div>
  );
};
