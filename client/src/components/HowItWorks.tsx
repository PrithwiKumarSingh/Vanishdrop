import { ArrowRight, Download, Smartphone, Upload } from 'lucide-react';

const steps = [
  { number: '01', icon: Upload, title: 'Upload here', body: 'Choose a supported document from your computer or phone.' },
  { number: '02', icon: Smartphone, title: 'Open on another device', body: 'Visit VanishDrop anywhere. No account or handoff code needed.' },
  { number: '03', icon: Download, title: 'Download & go', body: 'Tap download when you see your file. It expires automatically.' },
];

export const HowItWorks = () => (
  <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cobalt">How it works</p><h2 className="text-3xl font-bold tracking-[-0.045em] text-ink sm:text-4xl">A tiny bridge between devices.</h2></div>
      <p className="max-w-xs text-sm leading-6 text-slate-500 sm:text-right">Built for those “I just need this file on my phone” moments.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map(({ number, icon: Icon, title, body }, index) => (
        <div key={number} className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-7">
          <div className="mb-10 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-cobalt"><Icon size={21} /></div><span className="text-xs font-extrabold tracking-[0.2em] text-slate-300">{number}</span></div>
          <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3><p className="text-sm leading-6 text-slate-500">{body}</p>
          {index < steps.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden rounded-full bg-mist p-1 text-slate-300 md:block" size={28} />}
        </div>
      ))}
    </div>
  </section>
);
