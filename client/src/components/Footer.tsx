import { Cloud, Heart } from 'lucide-react';

export const Footer = () => (
  <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div className="flex items-center gap-2"><Cloud size={15} className="text-cobalt" /> <span>VanishDrop<span className="text-cobalt">.</span> — temporary file sharing</span></div><p className="flex items-center gap-1">Made for the quick handoff <Heart size={13} className="fill-rose-400 text-rose-400" /></p></footer>
);
