import { ArrowDown, Check, Cloud, Sparkles, TimerReset, UploadCloud } from 'lucide-react';
import { UploadVanishDrop } from './Uploadvanishdrop';

interface HeroSectionProps {
  uploading: boolean;
  progress: number;
  onFile: (file: File) => void;
}

const highlights = ['No account', '10 MB max', '5 min delete lock'];

export const HeroSection = ({ uploading, progress, onFile }: HeroSectionProps) => (
  <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-9 sm:px-6 sm:pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
    <div className="max-w-xl animate-fade-up">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-cobalt shadow-sm"><Sparkles size={14} /> The simple way to move a file</div>
      <h1 className="max-w-lg text-[clamp(2.8rem,7vw,5.25rem)] font-extrabold leading-[0.96] tracking-[-0.075em] text-ink">Your file.<br /><span className="bg-gradient-to-r from-cobalt via-[#6675ed] to-lilac bg-clip-text text-transparent">Everywhere.</span></h1>
      <p className="mt-6 max-w-md text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">A fast, no-login bridge between your devices. Upload on your computer, open VanishDrop on your phone, and carry on.</p>
      <div className="mt-8 flex flex-wrap gap-2.5">{highlights.map((highlight) => <span key={highlight} className="flex items-center gap-2 rounded-full border border-white/90 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check size={13} strokeWidth={3} /></span>{highlight}</span>)}</div>
      <div className="mt-8 hidden items-center gap-6 text-xs font-semibold text-slate-400 sm:flex"><span className="flex items-center gap-2"><TimerReset size={15} className="text-amber-500" /> Auto-expires after 12 hours</span><span className="flex items-center gap-2"><UploadCloud size={15} className="text-cobalt" /> PDF, Word & Excel</span></div>
    </div>
    <div className="relative animate-fade-up [animation-delay:120ms] lg:pl-5">
      <div className="absolute -right-3 -top-5 hidden h-28 w-28 rounded-full border-[18px] border-aqua/20 sm:block" />
      <div className="glass-card relative rounded-[32px] border border-white p-3 shadow-soft sm:p-5">
        <div className="flex items-center justify-between px-2 pb-4 sm:px-3"><div><p className="text-sm font-bold text-ink">Send a file</p><p className="mt-0.5 text-xs text-slate-400">No sign-up. No friction.</p></div><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2f6ff] text-cobalt"><Cloud size={18} /></div></div>
        <UploadVanishDrop uploading={uploading} progress={progress} onFile={onFile} />
        <p className="px-2 pt-4 text-center text-[11px] leading-5 text-slate-400 sm:px-3">By uploading, you agree that your file will be <span className="font-bold text-slate-500">publicly visible</span> and deleted after 12 hours.</p>
      </div>
      <div className="absolute -bottom-7 -left-4 hidden animate-float-slow items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-card sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500"><ArrowDown size={18} /></div><div><p className="text-[11px] font-bold text-ink">Ready on your phone</p><p className="text-[10px] font-medium text-slate-400">Just open VanishDrop.</p></div></div>
      <div className="absolute -right-6 top-24 hidden animate-float-delayed items-center gap-2 rounded-xl border border-white bg-white px-3 py-2.5 shadow-card lg:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-[11px] font-bold text-slate-500">Public & temporary</span></div>
    </div>
  </section>
);
