import { ArrowUpRight, Cloud, Radio } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";

export const Navbar = () => (
  <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
    <a href="/" className="flex items-center gap-2.5" aria-label="VanishDrop home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ink via-[#253b61] to-cobalt text-white shadow-lg shadow-indigo-100"><Cloud size={18} strokeWidth={2.2} /></span>
      <span className="text-lg font-extrabold tracking-[-0.04em] text-ink">VanishDrop<span className="text-cobalt">.</span></span>
    </a>
    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 sm:gap-7">
      <a target='_blank' href="https://github.com/PrithwiKumarSingh/Vanishdrop">
      <span className="hidden items-center gap-2 rounded-full border border-gray-500 text-black bg-black/10 px-4 py-1 text-lg sm:flex">
      <FaGithub size={24} className='text-black' />
       Star
       <PiStarFill size={18} className="text-[#FFFF00]" />
       </span>
      </a>
      <a href="#how-it-works" className="flex items-center gap-1 text-ink transition hover:text-cobalt text-lg">How it works <ArrowUpRight size={14} />
      </a>
      </div>
  </header>
);
