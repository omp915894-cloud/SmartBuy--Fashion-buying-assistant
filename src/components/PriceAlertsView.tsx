import React from 'react';
import { TrendingDown, Trash2, Zap, CheckCircle2, ArrowRight, BellRing } from 'lucide-react';
import type { PriceAlert, Product } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PriceAlertsViewProps {
  alerts: PriceAlert[];
  products: Product[];
  onDeleteAlert: (id: string) => Promise<void>;
  onSimulateDropForProduct: (productId: string) => Promise<void>;
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const PriceAlertsView: React.FC<PriceAlertsViewProps> = ({
  alerts,
  products,
  onDeleteAlert,
  onSimulateDropForProduct,
  onSelectProduct,
  onExploreCatalog,
}) => {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 font-display flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-emerald-600" />
            Active Price Drop Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We continuously monitor Myntra, Ajio, Amazon, Flipkart, and Tata CLiQ for price dips below your targets.
          </p>
        </div>

        <button
          onClick={onExploreCatalog}
          className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Explore Catalog to Add Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BellRing className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">No Price Alerts Configured</h3>
          <p className="text-xs text-slate-500">
            Search t-shirts, jeans, or shirts and tap "Set Price Alert" to track automatic discounts across all 5 stores.
          </p>
          <button
            onClick={onExploreCatalog}
            className="px-4 py-2 bg-slate-950 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Browse Clothing Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const product = products.find(p => p.id === alert.productId);
            const isTargetMet = alert.currentLowestPrice <= alert.targetPrice;
            const priceDifference = alert.currentLowestPrice - alert.targetPrice;

            return (
              <div
                key={alert.id}
                className={`relative bg-white border rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isTargetMet
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar of Alert Card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={alert.productImage}
                        alt={alert.productName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {alert.brand}
                        </span>
                        <h4 
                          onClick={() => product && onSelectProduct(product)}
                          className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-slate-700 cursor-pointer"
                        >
                          {alert.productName}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Created {new Date(alert.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      aria-label="Delete alert"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Target vs Live Price Status */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Your Target Price</span>
                      <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(alert.targetPrice)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Live Lowest Price</span>
                      <span className={`text-sm font-extrabold font-mono tabular-nums ${
                        isTargetMet ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {formatCurrency(alert.currentLowestPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Alert Trigger Status Banner */}
                  {isTargetMet ? (
                    <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-950 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Target Price Met! Best Deal on {alert.winningRetailer || 'Ajio'} at {formatCurrency(alert.currentLowestPrice)}.
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 mb-3 flex items-center justify-between">
                      <span>₹{priceDifference} drop needed to trigger</span>
                      <span className="text-slate-400">Monitoring 5 platforms...</span>
                    </div>
                  )}
                </div>

                {/* Interactive Action Strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Presentation Demo Trigger Button */}
                  <button
                    onClick={() => onSimulateDropForProduct(alert.productId)}
                    className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Simulate a price drop for this item right now in the demo"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Demo Drop (-₹250)</span>
                  </button>

                  {product && (
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Compare 5 Stores</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
