import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast = ({ message, type = 'success', onClose }: ToastProps) => (
  <div className={`fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-soft backdrop-blur-md animate-[toast-in_.25s_ease-out] ${type === 'success' ? 'border-emerald-100 bg-white/95 text-ink' : 'border-rose-100 bg-rose-50/95 text-rose-800'}`} role="status">
    {type === 'success' ? <CheckCircle2 className="shrink-0 text-emerald-500" size={20} /> : <AlertCircle className="shrink-0 text-rose-500" size={20} />}
    <span className="min-w-0 flex-1 text-sm font-medium">{message}</span>
    <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss notification">
      <X size={16} />
    </button>
  </div>
);
