import React from 'react';
import { Sparkles, ShieldCheck, Tag, ArrowRight, Zap } from 'lucide-react';

interface HeroBannerProps {
  onQuickSearch: (query: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onQuickSearch }) => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-slate-800">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            Buyhatke for Fashion
          </span>
          <span className="text-xs text-slate-400">College Capstone Project</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display leading-tight text-white">
          Never overpay for brand clothing again.
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
          Instantly compare real-time apparel prices across <strong className="text-white">Myntra, Ajio, Amazon Fashion, Flipkart, and Tata CLiQ</strong>. Uncover hidden platform coupons and set instant price drop alerts.
        </p>

        {/* Quick Search Suggestions */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Popular searches:</span>
          {['T-Shirts', 'Selvedge Jeans', 'Fleece Hoodie', 'Snitch', 'Oxford Shirt'].map((term) => (
            <button
              key={term}
              onClick={() => onQuickSearch(term)}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors cursor-pointer text-[11px]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
