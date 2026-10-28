import React, { useState } from 'react';
import { X, TrendingDown, Bell, CheckCircle2 } from 'lucide-react';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PriceAlertModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmitAlert: (productId: string, targetPrice: number) => Promise<void>;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  product,
  onClose,
  onSubmitAlert,
}) => {
  if (!product) return null;

  const currentPrice = product.bestDeal.lowestEffectivePrice;
  const suggestedTarget = Math.round(currentPrice * 0.85); // 15% discount recommendation
  const [targetPrice, setTargetPrice] = useState<number>(suggestedTarget);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmitAlert(product.id, targetPrice);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Set Real-Time Price Drop Alert
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-in zoom-in" />
              <h4 className="text-base font-bold text-slate-900">Alert Activated!</h4>
              <p className="text-xs text-slate-600">
                We will instantly alert you when this drops to {formatCurrency(targetPrice)} on any of the 5 stores.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-xs font-mono text-slate-600">
                    Current Lowest: <strong className="text-emerald-700">{formatCurrency(currentPrice)}</strong> on {product.bestDeal.bestRetailerName}
                  </div>
                </div>
              </div>

              {/* Target Price Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Notification Price (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-sm font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={100}
                    max={currentPrice}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-slate-950"
                    placeholder="Enter target price"
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Current: {formatCurrency(currentPrice)}</span>
                  <span className="text-emerald-700 font-medium">
                    {currentPrice > targetPrice
                      ? `Alerts if drops by ${formatCurrency(currentPrice - targetPrice)} (${Math.round(((currentPrice - targetPrice) / currentPrice) * 100)}%)`
                      : 'Target must be lower than current price'}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Quick Discounts:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[0.9, 0.85, 0.75].map((factor) => {
                    const price = Math.round(currentPrice * factor);
                    const pct = Math.round((1 - factor) * 100);
                    return (
                      <button
                        type="button"
                        key={factor}
                        onClick={() => setTargetPrice(price)}
                        className={`py-1.5 px-2 text-xs font-mono rounded-lg border text-center transition-colors cursor-pointer ${
                          targetPrice === price
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {formatCurrency(price)} (-{pct}%)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || targetPrice >= currentPrice}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap mt-2"
              >
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>{isSubmitting ? 'Activating...' : 'Activate Price Alert'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
