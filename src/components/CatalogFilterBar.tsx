import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface CatalogFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  maxPrice: number;
  onMaxPriceChange: (p: number) => void;
  totalResults: number;
  onResetFilters: () => void;
}

export const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  selectedGender,
  onGenderChange,
  sortBy,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
  totalResults,
  onResetFilters,
}) => {
  const categories = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Hoodies', 'Trousers'];
  const brands = ['All', 'Snitch', "Levi's", 'H&M', 'Zara', 'Allen Solly', 'Roadster'];
  const genders = ['All', 'Men', 'Women', 'Unisex'];

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'All' || 
    selectedBrand !== 'All' || 
    selectedGender !== 'All' || 
    maxPrice < 4500 || 
    sortBy !== 'relevance';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Input & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clothing items, e.g., 't-shirts', 'cotton hoodie', 'denim'..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Lowest Price First</option>
              <option value="savings_desc">Highest Savings Deal</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-950 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Brand & Filter Details Row */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Brands selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-semibold mr-1">Brand:</span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => onBrandChange(b)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                selectedBrand === b
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Max Price Slider & Results Count */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">Max Price:</span>
            <input
              type="range"
              min={600}
              max={4500}
              step={100}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-24 accent-slate-900 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-800 text-xs tabular-nums">
              {formatCurrency(maxPrice)}
            </span>
          </div>

          <div className="text-slate-400 text-xs tabular-nums border-l border-slate-200 pl-3">
            <strong className="text-slate-900">{totalResults}</strong> items found
          </div>
        </div>
      </div>
    </div>
  );
};
