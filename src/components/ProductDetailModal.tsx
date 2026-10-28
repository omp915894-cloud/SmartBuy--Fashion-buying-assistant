import React, { useState } from 'react';
import { 
  X, Bookmark, TrendingDown, ExternalLink, ShieldCheck, 
  Truck, Tag, Sparkles, CheckCircle2, ArrowUpRight, Clock, Info 
} from 'lucide-react';
import type { Product, RetailerOffer } from '../types';
import { formatCurrency, getRetailerBrandInfo } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onOpenAlertModal: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onToggleWishlist,
  isInWishlist,
  onOpenAlertModal,
}) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  if (!product) return null;

  const handleCopyCoupon = (coupon: string) => {
    navigator.clipboard.writeText(coupon);
    setCopiedCoupon(coupon);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  const bestOffer = product.offers.find(o => o.retailerId === product.bestDeal.bestRetailerId) || product.offers[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Sticky Header with Close button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900 uppercase tracking-wider">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Live 5-Platform Price Check</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* SECTION 1: MAIN PRODUCT DETAILS (TOP) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Product Image */}
            <div className="md:col-span-5 relative bg-slate-100 rounded-xl overflow-hidden aspect-4/3 md:aspect-square border border-slate-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-xs">
                {product.gender}
              </div>
            </div>

            {/* Product Meta & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ★ {product.rating} ({product.reviewCount} customer reviews)
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-display leading-tight mb-2">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Fabric & Fit specs - Clean unboxed metadata */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Fabric Composition:</span>
                    <span className="font-semibold text-slate-800">{product.fabric}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tailored Fit:</span>
                    <span className="font-semibold text-slate-800">{product.fit}</span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Select Size:</span>
                  <div className="flex items-center gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-9 h-9 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Lowest Price Callout */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wide block">
                      Lowest Current Price Across All Sites:
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-950 font-mono tabular-nums">
                        {formatCurrency(product.bestDeal.lowestEffectivePrice)}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                        MRP {formatCurrency(product.baseMRP)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block">
                      {product.bestDeal.bestRetailerName}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Save up to {formatCurrency(product.bestDeal.maxSavings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Quick Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onOpenAlertModal(product)}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>Set Price Drop Alert</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`py-2.5 px-4 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                    isInWishlist
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  <span>{isInWishlist ? 'Saved in Wardrobe' : 'Save to Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* SECTION 2: THE COMPARISON THING BELOW THE PRODUCT (SPECIFICALLY REQUESTED!) */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950 font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Live Multi-Platform Price Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Real-time price intelligence across 5 major apparel stores. Best deal and coupon savings are calculated below.
              </p>
            </div>

            {/* 1. Best Deal Recommendation Banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded">
                    ★ Best Deal Recommendation
                  </span>
                  <span className="text-xs text-emerald-200 font-medium">
                    Verified lowest price
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-white">
                  {product.bestDeal.recommendationNote}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                  <span>Direct retailer: <strong className="text-white">{product.bestDeal.bestRetailerName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Effective price: <strong className="text-emerald-300 font-mono tabular-nums">{formatCurrency(product.bestDeal.lowestEffectivePrice)}</strong></span>
                  {product.bestDeal.couponApplicable && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-300 font-mono">Code: {product.bestDeal.couponApplicable}</span>
                    </>
                  )}
                </div>
              </div>

              <a
                href={product.bestDeal.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span>Buy on {product.bestDeal.bestRetailerName}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* 2. Detailed Platform Comparison Table / Grid */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Retail Platform</th>
                      <th className="py-3 px-4">Listed Price</th>
                      <th className="py-3 px-4">Coupon / Offer</th>
                      <th className="py-3 px-4">Final Effective Price</th>
                      <th className="py-3 px-4">Delivery & Stock</th>
                      <th className="py-3 px-4 text-right">Direct Store Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {product.offers.map((offer) => {
                      const isWinner = offer.retailerId === product.bestDeal.bestRetailerId;
                      const retailer = getRetailerBrandInfo(offer.retailerId);

                      return (
                        <tr 
                          key={offer.retailerId}
                          className={`transition-colors ${
                            isWinner ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* Retailer Name & Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${retailer.badgeBg}`}>
                                {offer.retailerName.charAt(0)}
                              </span>
                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {offer.retailerName}
                                </span>
                                {isWinner && (
                                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                                    ✓ Lowest Price
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Listed Price & MRP */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono tabular-nums">
                              <span className="font-bold text-slate-900">{formatCurrency(offer.price)}</span>
                              <span className="text-slate-400 text-[11px] line-through ml-1.5">
                                {formatCurrency(offer.mrp)}
                              </span>
                              <span className="text-emerald-700 text-[11px] ml-1 font-semibold">
                                ({offer.discountPercent}% off)
                              </span>
                            </div>
                          </td>

                          {/* Coupon Code & Instant Savings */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {offer.couponCode ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleCopyCoupon(offer.couponCode!)}
                                  title="Click to copy coupon"
                                  className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[11px] font-bold rounded cursor-pointer hover:bg-amber-100 transition-colors flex items-center gap-1"
                                >
                                  <Tag className="w-3 h-3 text-amber-600" />
                                  {offer.couponCode}
                                </button>
                                <span className="text-slate-500 text-[11px]">
                                  -₹{offer.couponDiscount}
                                </span>
                                {copiedCoupon === offer.couponCode && (
                                  <span className="text-emerald-600 text-[10px] font-bold">Copied!</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">No coupon</span>
                            )}
                          </td>

                          {/* Final Effective Price */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`text-sm font-mono tabular-nums font-extrabold ${
                              isWinner ? 'text-emerald-700' : 'text-slate-900'
                            }`}>
                              {formatCurrency(offer.effectivePrice)}
                            </span>
                          </td>

                          {/* Stock & Delivery */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {offer.inStock ? (
                              <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                                <Truck className="w-3.5 h-3.5 text-slate-400" />
                                <span>{offer.deliveryDays === 1 ? 'Next Day Prime' : `${offer.deliveryDays} Days`}</span>
                              </div>
                            ) : (
                              <span className="text-rose-600 font-semibold text-[11px]">Out of Stock</span>
                            )}
                          </td>

                          {/* Direct Platform Link */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <a
                              href={offer.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                isWinner
                                  ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              <span>Buy on {offer.retailerName}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Price History Sparkline & Trends */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  10-Day Historical Price Movement
                </span>
                <span className="text-[11px] text-slate-500">
                  Lowest recorded price: <strong className="text-slate-900 font-mono">{formatCurrency(product.bestDeal.lowestEffectivePrice)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {product.priceHistory.map((history, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">{history.date}</span>
                    <span className="text-xs font-bold text-slate-900 font-mono tabular-nums block">
                      {formatCurrency(history.lowestPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      High: {formatCurrency(history.highestPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
