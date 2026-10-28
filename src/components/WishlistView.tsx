import React from 'react';
import { Bookmark, Trash2, ArrowRight, TrendingDown, ExternalLink } from 'lucide-react';
import type { WishlistItem, Product } from '../types';
import { formatCurrency, getRetailerBrandInfo } from '../utils/formatters';

interface WishlistViewProps {
  wishlist: WishlistItem[];
  onRemoveFromWishlist: (productId: string) => Promise<void>;
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  onRemoveFromWishlist,
  onSelectProduct,
  onExploreCatalog,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 font-display flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-slate-900 fill-slate-900" />
            Wardrobe Wishlist & Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track multi-store price shifts for your curated clothing pieces and purchase when the discount peaks.
          </p>
        </div>

        <button
          onClick={onExploreCatalog}
          className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Find More Clothing Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">Your Wardrobe Wishlist is Empty</h3>
          <p className="text-xs text-slate-500">
            Click the bookmark icon on any t-shirt, jeans, or hoodie to monitor price changes over time.
          </p>
          <button
            onClick={onExploreCatalog}
            className="px-4 py-2 bg-slate-950 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            const priceDrop = item.initialLowestPrice - item.currentLowestPrice;
            const bestRetailer = getRetailerBrandInfo(product.bestDeal.bestRetailerId);

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Best on {product.bestDeal.bestRetailerName}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {product.brand} · {product.category}
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-semibold text-slate-900 line-clamp-1 hover:text-slate-700 cursor-pointer mb-2"
                    >
                      {product.name}
                    </h3>

                    {/* Price and Delta */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-bold text-slate-950 font-mono tabular-nums">
                        {formatCurrency(product.bestDeal.lowestEffectivePrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                        {formatCurrency(product.baseMRP)}
                      </span>
                    </div>

                    {priceDrop > 0 ? (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mb-2">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Dropped {formatCurrency(priceDrop)} since saved!</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 mb-2">
                        Initial saved price: {formatCurrency(item.initialLowestPrice)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Compare (5)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <a
                    href={product.bestDeal.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Buy Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
