import { Eye, ShieldCheck, TimerReset } from 'lucide-react';

export const PrivacyNotice = () => (
  <section className="border-y border-slate-200/70 bg-white/65">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="max-w-xl"><div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink"><ShieldCheck size={17} className="text-emerald-500" /> Built for quick, intentional sharing</div><p className="text-sm leading-6 text-slate-500">Files are public to anyone visiting this page and automatically deleted after 12 hours. Please don’t upload sensitive or confidential documents.</p></div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-semibold text-slate-500 sm:flex sm:gap-6"><span className="flex items-center gap-2"><Eye size={15} className="text-cobalt" /> Public by design</span><span className="flex items-center gap-2"><TimerReset size={15} className="text-amber-500" /> 12h lifetime</span></div>
    </div>
  </section>
);
