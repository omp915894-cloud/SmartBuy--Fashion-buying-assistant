import React from 'react';
import { User, Bell, Bookmark, SlidersHorizontal, Layers, TrendingDown } from 'lucide-react';
import type { User as UserType } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'alerts' | 'wishlist' | 'brands';
  onSelectTab: (tab: 'catalog' | 'alerts' | 'wishlist' | 'brands') => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  wishlistCount: number;
  alertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  unreadCount,
  onOpenNotifications,
  wishlistCount,
  alertsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title, single element, no secondary pills or subtitles */}
        <button
          onClick={() => onSelectTab('catalog')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center text-sm font-black">
            SB
          </span>
          SmartBuy
        </button>

        {/* Zone 2: 4 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'border-slate-950 text-slate-950 font-semibold'
                : 'border-transparent hover:text-slate-950'
            }`}
          >
            Price Comparison
          </button>
          <button
            onClick={() => onSelectTab('alerts')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'border-slate-950 text-slate-950 font-semibold'
                : 'border-transparent hover:text-slate-950'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            Price Alerts
            {alertsCount > 0 && (
              <span className="text-xs text-slate-600 tabular-nums">({alertsCount})</span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('wishlist')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'border-slate-950 text-slate-950 font-semibold'
                : 'border-transparent hover:text-slate-950'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Wardrobe Wishlist
            {wishlistCount > 0 && (
              <span className="text-xs text-slate-600 tabular-nums">({wishlistCount})</span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('brands')}
            className={`whitespace-nowrap shrink-0 pb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'brands'
                ? 'border-slate-950 text-slate-950 font-semibold'
                : 'border-transparent hover:text-slate-950'
            }`}
          >
            <Layers className="w-4 h-4" />
            Brand Matrix
          </button>
        </nav>

        {/* Zone 3: 1 primary action / account zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <User className="w-4 h-4" />
            {currentUser ? (
              <span className="truncate max-w-[110px]">{currentUser.name}</span>
            ) : (
              <span>Sign In / Demo</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50/90 px-2 py-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => onSelectTab('catalog')}
          className={`px-2 py-1 rounded ${activeTab === 'catalog' ? 'bg-white shadow-xs text-slate-950 font-semibold' : ''}`}
        >
          Compare
        </button>
        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-2 py-1 rounded ${activeTab === 'alerts' ? 'bg-white shadow-xs text-slate-950 font-semibold' : ''}`}
        >
          Alerts {alertsCount > 0 && `(${alertsCount})`}
        </button>
        <button
          onClick={() => onSelectTab('wishlist')}
          className={`px-2 py-1 rounded ${activeTab === 'wishlist' ? 'bg-white shadow-xs text-slate-950 font-semibold' : ''}`}
        >
          Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
        </button>
        <button
          onClick={() => onSelectTab('brands')}
          className={`px-2 py-1 rounded ${activeTab === 'brands' ? 'bg-white shadow-xs text-slate-950 font-semibold' : ''}`}
        >
          Brands
        </button>
      </div>
    </header>
  );
};
