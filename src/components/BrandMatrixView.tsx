import React, { useState } from 'react';
import { Layers, Check, Sparkles, Scale, TrendingUp, Award, ExternalLink } from 'lucide-react';
import type { BrandBenchmark } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BrandMatrixViewProps {
  brands: BrandBenchmark[];
  onFilterByBrand: (brandName: string) => void;
}

export const BrandMatrixView: React.FC<BrandMatrixViewProps> = ({
  brands,
  onFilterByBrand,
}) => {
  // Allow user to select brands for head-to-head comparison
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([
    'brand-snitch',
    'brand-hm',
    'brand-levis'
  ]);

  const toggleBrandSelection = (id: string) => {
    if (selectedBrandIds.includes(id)) {
      if (selectedBrandIds.length > 1) {
        setSelectedBrandIds(selectedBrandIds.filter(b => b !== id));
      }
    } else {
      if (selectedBrandIds.length < 4) {
        setSelectedBrandIds([...selectedBrandIds, id]);
      }
    }
  };

  const comparedBrands = brands.filter(b => selectedBrandIds.includes(b.id));

  return (
    <div className="space-y-8">
      {/* Module Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-950 font-display flex items-center gap-2">
          <Layers className="w-6 h-6 text-slate-900" />
          Brand Comparison Matrix & Pricing Tiers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compare apparel pricing benchmarks, quality indices, and platform discount behaviors across top Indian clothing labels.
        </p>
      </div>

      {/* Brand Selection Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold text-slate-700 block">
          Select Brands to Compare (Choose 2 to 4):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {brands.map((brand) => {
            const isSelected = selectedBrandIds.includes(brand.id);
            return (
              <button
                key={brand.id}
                onClick={() => toggleBrandSelection(brand.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{brand.brandName}</span>
                <span className="text-[10px] opacity-75 font-normal">({brand.tier})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparedBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Brand Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {brand.tier}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    ~{brand.avgDiscountPercent}% Avg Discount
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-950 font-display tracking-tight">
                  {brand.brandName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{brand.tagline}</p>
              </div>

              {/* Benchmark Pricing Specs */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Average Category Pricing Benchmarks
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-600">T-Shirts Average</span>
                      <strong className="font-mono tabular-nums text-slate-900">
                        {formatCurrency(brand.avgTShirtPrice)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-600">Casual Shirts Average</span>
                      <strong className="font-mono tabular-nums text-slate-900">
                        {formatCurrency(brand.avgShirtPrice)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-600">Denim Jeans Average</span>
                      <strong className="font-mono tabular-nums text-slate-900">
                        {formatCurrency(brand.avgJeansPrice)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Platform & Quality Insights */}
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Best Platform for this Brand:</span>
                    <strong className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {brand.topPlatform} (Deepest Price Cuts)
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Fabric Quality & Durability:</span>
                    <div className="flex items-center gap-3 mt-1 font-mono text-xs">
                      <span>Quality: <strong>{brand.qualityRating} / 5.0</strong></span>
                      <span>Durability: <strong>{brand.durabilityRating} / 5.0</strong></span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Recommended For:</span>
                    <p className="text-slate-700 font-medium mt-0.5 leading-snug">
                      {brand.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Filter Shortcut */}
            <div className="p-5 pt-0">
              <button
                onClick={() => onFilterByBrand(brand.brandName)}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>View {brand.brandName} Catalog Deals</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
