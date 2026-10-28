export type RetailerId = 'myntra' | 'ajio' | 'amazon' | 'flipkart' | 'tatacliq';

export interface RetailerOffer {
  retailerId: RetailerId;
  retailerName: string;
  price: number;
  mrp: number;
  discountPercent: number;
  couponCode?: string;
  couponDiscount?: number;
  effectivePrice: number;
  inStock: boolean;
  deliveryDays: number;
  rating: number;
  affiliateUrl: string;
  badge?: string;
  isBestDeal?: boolean;
}

export interface BestDealSummary {
  bestRetailerId: RetailerId;
  bestRetailerName: string;
  lowestEffectivePrice: number;
  highestPrice: number;
  maxSavings: number;
  couponApplicable?: string;
  couponSavings?: number;
  recommendationNote: string;
  affiliateUrl: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'T-Shirts' | 'Shirts' | 'Jeans' | 'Hoodies' | 'Trousers' | 'Jackets';
  gender: 'Men' | 'Women' | 'Unisex';
  imageUrl: string;
  description: string;
  fabric: string;
  fit: string;
  rating: number;
  reviewCount: number;
  baseMRP: number;
  trending?: boolean;
  offers: RetailerOffer[];
  bestDeal: BestDealSummary;
  priceHistory: {
    date: string;
    lowestPrice: number;
    highestPrice: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'shopper' | 'admin';
  budgetPreference?: number;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  brand: string;
  productImage: string;
  targetPrice: number;
  currentLowestPrice: number;
  initialPrice: number;
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
  winningRetailer?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: string;
  initialLowestPrice: number;
  currentLowestPrice: number;
}

export interface BrandBenchmark {
  id: string;
  brandName: string;
  tier: 'Fast Fashion' | 'Value Streetwear' | 'Casual Heritage' | 'Premium High-Street';
  logoText: string;
  tagline: string;
  avgTShirtPrice: number;
  avgShirtPrice: number;
  avgJeansPrice: number;
  topPlatform: string;
  avgDiscountPercent: number;
  qualityRating: number;
  durabilityRating: number;
  bestFor: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'price_drop' | 'stock_alert' | 'deal_alert' | 'system';
  productId?: string;
  read: boolean;
}
