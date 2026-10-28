import React, { useState, useEffect } from 'react';
import type { Product, PriceAlert, WishlistItem, BrandBenchmark, User, NotificationItem } from './types';
import { Navbar } from './components/Navbar';
import { LiveDemoControls } from './components/LiveDemoControls';
import { HeroBanner } from './components/HeroBanner';
import { CatalogFilterBar } from './components/CatalogFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { PriceAlertsView } from './components/PriceAlertsView';
import { WishlistView } from './components/WishlistView';
import { BrandMatrixView } from './components/BrandMatrixView';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Zap, CheckCircle2, TrendingDown } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'catalog' | 'alerts' | 'wishlist' | 'brands'>('catalog');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [brands, setBrands] = useState<BrandBenchmark[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [alertModalProduct, setAlertModalProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Live in-app toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Catalog Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [maxPrice, setMaxPrice] = useState(4500);
  const [sortBy, setSortBy] = useState('relevance');

  // Load Initial Data
  const loadInitialData = async () => {
    try {
      const [prodRes, alertRes, wishRes, brandRes, notifRes, userRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/wishlist').then(r => r.json()),
        fetch('/api/brands').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json()),
        fetch('/api/auth/me').then(r => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (alertRes.success) setAlerts(alertRes.alerts);
      if (wishRes.success) setWishlist(wishRes.wishlist);
      if (brandRes.success) setBrands(brandRes.brands);
      if (notifRes.success) setNotifications(notifRes.notifications);
      if (userRes.success) setCurrentUser(userRes.user);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter & Search Products dynamically
  const fetchFilteredProducts = async () => {
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: selectedCategory,
        brand: selectedBrand,
        gender: selectedGender,
        maxPrice: maxPrice.toString(),
        sortBy: sortBy,
      });

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        // If a product is currently selected, update its reference with latest prices
        if (selectedProduct) {
          const updated = data.products.find((p: Product) => p.id === selectedProduct.id);
          if (updated) setSelectedProduct(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching filtered products:', err);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchQuery, selectedCategory, selectedBrand, selectedGender, maxPrice, sortBy]);

  // Wishlist Action
  const handleToggleWishlist = async (product: Product) => {
    const isCurrentlySaved = wishlist.some(w => w.productId === product.id);
    if (isCurrentlySaved) {
      // Remove
      await fetch(`/api/wishlist/${product.id}`, { method: 'DELETE' });
      setWishlist(prev => prev.filter(w => w.productId !== product.id));
      showToast(`Removed ${product.name} from saved wardrobe`);
    } else {
      // Add
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(prev => [data.wishlistItem, ...prev]);
        showToast(`Saved ${product.name} to your wardrobe wishlist!`);
      }
    }
  };

  // Price Alert Activation
  const handleCreateAlert = async (productId: string, targetPrice: number) => {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, targetPrice }),
    });
    const data = await res.json();
    if (data.success) {
      setAlerts(prev => [data.alert, ...prev]);
      showToast(data.message);
    }
  };

  // Delete Alert
  const handleDeleteAlert = async (id: string) => {
    await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Price alert deleted');
  };

  // Interactive Live Price Drop Simulation
  const handleSimulatePriceDrop = async (specificProductId?: string) => {
    const targetProdId = specificProductId || (products[0] ? products[0].id : 'prod-101');
    const res = await fetch('/api/alerts/simulate-drop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: targetProdId, dropAmount: 250 }),
    });
    const data = await res.json();
    if (data.success) {
      // Refresh local products & alerts & notifications
      await Promise.all([
        fetchFilteredProducts(),
        fetch('/api/alerts').then(r => r.json()).then(d => d.success && setAlerts(d.alerts)),
        fetch('/api/notifications').then(r => r.json()).then(d => d.success && setNotifications(d.notifications)),
      ]);
      showToast(data.message);
    }
  };

  // Market Randomizer
  const handleRandomizeMarket = async () => {
    const res = await fetch('/api/products/randomize-market', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      await fetchFilteredProducts();
      showToast('Live prices updated across Myntra, Ajio, Amazon, Flipkart & Tata CLiQ');
    }
  };

  // Auth actions
  const handleLogin = async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      setCurrentUser(data.user);
      showToast(data.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    showToast('Signed out successfully');
  };

  const handleSwitchDemo = async (userId: string) => {
    const res = await fetch('/api/auth/switch-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success) {
      setCurrentUser(data.user);
      showToast(`Switched persona to ${data.user.name}`);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    await fetch('/api/notifications/read', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedGender('All');
    setMaxPrice(4500);
    setSortBy('relevance');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 1. Live Demo Simulation Banner */}
      <LiveDemoControls
        onSimulatePriceDrop={() => handleSimulatePriceDrop()}
        onRandomizeMarket={handleRandomizeMarket}
      />

      {/* 2. Top Bar Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        wishlistCount={wishlist.length}
        alertsCount={alerts.length}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs flex items-center gap-2.5 max-w-sm animate-in slide-in-from-bottom duration-200">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* VIEW 1: CATALOG & PRICE COMPARISON */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <HeroBanner onQuickSearch={(term) => setSearchQuery(term)} />

            {/* Filter and Search Bar */}
            <CatalogFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
              sortBy={sortBy}
              onSortChange={setSortBy}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              totalResults={products.length}
              onResetFilters={resetFilters}
            />

            {/* Product Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-slate-200 rounded-xl aspect-4/3" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  No Clothing Items Found
                </h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your search query, brand filter, or price limit to see matching fashion items.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlist.some(w => w.productId === product.id)}
                    onOpenAlertModal={(p) => setAlertModalProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PRICE DROP ALERTS MODULE */}
        {activeTab === 'alerts' && (
          <PriceAlertsView
            alerts={alerts}
            products={products}
            onDeleteAlert={handleDeleteAlert}
            onSimulateDropForProduct={(prodId) => handleSimulatePriceDrop(prodId)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onExploreCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* VIEW 3: WISH LIST MODULE */}
        {activeTab === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            onRemoveFromWishlist={async (prodId) => {
              await fetch(`/api/wishlist/${prodId}`, { method: 'DELETE' });
              setWishlist(prev => prev.filter(w => w.productId !== prodId));
              showToast('Removed from wishlist');
            }}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onExploreCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* VIEW 4: BRAND TIER COMPARISON MATRIX */}
        {activeTab === 'brands' && (
          <BrandMatrixView
            brands={brands}
            onFilterByBrand={(brandName) => {
              setSelectedBrand(brandName);
              setActiveTab('catalog');
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-display">SmartBuy</span>
            <span>·</span>
            <span>Real-Time Fashion Buying Assistant Across 5 Major Platforms</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Myntra · Ajio · Amazon · Flipkart · Tata CLiQ</span>
            <span>·</span>
            <span>College Project Edition</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: PRODUCT DETAIL & 5-PLATFORM COMPARISON DECK (BELOW PRODUCT) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={selectedProduct ? wishlist.some(w => w.productId === selectedProduct.id) : false}
        onOpenAlertModal={(p) => {
          setSelectedProduct(null);
          setAlertModalProduct(p);
        }}
      />

      {/* MODAL 2: PRICE DROP ALERT CONFIGURATION */}
      <PriceAlertModal
        product={alertModalProduct}
        onClose={() => setAlertModalProduct(null)}
        onSubmitAlert={handleCreateAlert}
      />

      {/* MODAL 3: AUTHENTICATION & DEMO PERSONA MODULE */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSwitchDemo={handleSwitchDemo}
      />

      {/* MODAL 4: NOTIFICATION INBOX */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectProductById={(id) => {
          const match = products.find(p => p.id === id);
          if (match) setSelectedProduct(match);
        }}
      />
    </div>
  );
}
