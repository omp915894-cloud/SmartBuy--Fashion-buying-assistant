import React, { useState } from 'react';
import { Bookmark, ExternalLink, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import type { Product } from '../types';
import { formatCurrency, getRetailerBrandInfo } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onOpenAlertModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onToggleWishlist,
  isInWishlist,
  onOpenAlertModal,
}) => {
  const [imageError, setImageError] = useState(false);
  const bestRetailer = getRetailerBrandInfo(product.bestDeal.bestRetailerId);

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Image Container */}
      <div 
        onClick={() => onSelect(product)}
        className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="font-display font-semibold text-sm text-slate-600 mb-1">{product.brand}</span>
            <span className="text-xs text-slate-500">{product.name}</span>
          </div>
        )}

        {/* Wishlist Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isInWishlist
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white/80 hover:bg-white text-slate-700 shadow-xs'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Best Deal Badge (Prominent Deal Callout) */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-950/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Best: {formatCurrency(product.bestDeal.lowestEffectivePrice)} on {product.bestDeal.bestRetailerName}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata with middots - Zero Pill Rule */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-800 tracking-wide uppercase text-[11px]">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-slate-700 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelect(product)}
            className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-slate-700 cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Price Metrics & Savings */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-slate-950 font-mono tabular-nums">
              {formatCurrency(product.bestDeal.lowestEffectivePrice)}
            </span>
            <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
              {formatCurrency(product.baseMRP)}
            </span>
            {product.bestDeal.maxSavings > 0 && (
              <span className="text-xs font-semibold text-emerald-700 font-mono tabular-nums">
                Save {formatCurrency(product.bestDeal.maxSavings)}
              </span>
            )}
          </div>

          {/* Platform Mini Strip */}
          <div className="text-[11px] text-slate-500 mb-4 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Compared across:</span>
            <span className="font-medium text-slate-700">5 stores (Myntra, Ajio, Amazon...)</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => onSelect(product)}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>Compare Prices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAlertModal(product);
            }}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>Set Price Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
