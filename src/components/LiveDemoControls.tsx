import React, { useState } from 'react';
import { Zap, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiveDemoControlsProps {
  onSimulatePriceDrop: () => Promise<void>;
  onRandomizeMarket: () => Promise<void>;
}

export const LiveDemoControls: React.FC<LiveDemoControlsProps> = ({
  onSimulatePriceDrop,
  onRandomizeMarket
}) => {
  const [isSimulatingDrop, setIsSimulatingDrop] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSimulateDrop = async () => {
    setIsSimulatingDrop(true);
    setLastAction(null);
    try {
      await onSimulatePriceDrop();
      setLastAction('Flash sale triggered! Alert sent to inbox.');
    } finally {
      setIsSimulatingDrop(false);
      setTimeout(() => setLastAction(null), 4000);
    }
  };

  const handleRandomize = async () => {
    setIsRandomizing(true);
    setLastAction(null);
    try {
      await onRandomizeMarket();
      setLastAction('Retailer market prices updated live.');
    } finally {
      setIsRandomizing(false);
      setTimeout(() => setLastAction(null), 4000);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Demo Engine:
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Tracking real-time pricing across Myntra, Ajio, Amazon, Flipkart & Tata CLiQ
          </span>
          {lastAction && (
            <span className="text-emerald-400 font-medium flex items-center gap-1 ml-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {lastAction}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDrop}
            disabled={isSimulatingDrop}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            title="Forces a sudden price drop to trigger alerts"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingDrop ? 'animate-bounce' : ''}`} />
            {isSimulatingDrop ? 'Dropping Price...' : 'Trigger Flash Drop (-₹250)'}
          </button>

          <button
            onClick={handleRandomize}
            disabled={isRandomizing}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            title="Randomizes live retailer prices slightly"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRandomizing ? 'animate-spin' : ''}`} />
            {isRandomizing ? 'Updating...' : 'Live Price Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};
