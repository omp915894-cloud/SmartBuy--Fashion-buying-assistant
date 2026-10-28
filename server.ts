import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Product, RetailerOffer, BestDealSummary, PriceAlert, WishlistItem, User, BrandBenchmark, NotificationItem } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Helper to compute best deal from retailer offers
function calculateBestDeal(offers: RetailerOffer[], productName: string): BestDealSummary {
  const inStockOffers = offers.filter(o => o.inStock);
  const eligibleOffers = inStockOffers.length > 0 ? inStockOffers : offers;

  const sorted = [...eligibleOffers].sort((a, b) => a.effectivePrice - b.effectivePrice);
  const best = sorted[0];
  const highest = sorted[sorted.length - 1];
  const maxSavings = Math.max(0, highest.effectivePrice - best.effectivePrice);

  return {
    bestRetailerId: best.retailerId,
    bestRetailerName: best.retailerName,
    lowestEffectivePrice: best.effectivePrice,
    highestPrice: highest.effectivePrice,
    maxSavings,
    couponApplicable: best.couponCode,
    couponSavings: best.couponDiscount,
    recommendationNote: maxSavings > 0 
      ? `Buy on ${best.retailerName} to save ₹${maxSavings} compared to ${highest.retailerName}${best.couponCode ? ` using coupon '${best.couponCode}'` : ''}.`
      : `Best current price available directly on ${best.retailerName}.`,
    affiliateUrl: best.affiliateUrl
  };
}

// Initial clothing products catalog with the verified generated images
let products: Product[] = [
  {
    id: 'prod-101',
    name: 'Washed Charcoal Heavyweight Oversized Cotton T-Shirt',
    brand: 'Snitch',
    category: 'T-Shirts',
    gender: 'Men',
    imageUrl: '/src/assets/images/fashion_tshirt_cotton_1793215692221.jpg',
    description: 'Crafted from 240 GSM luxury combed single-jersey cotton. Features dropped shoulders, ribbed crewneck collar, and a modern boxy relaxed silhouette suited for everyday streetwear layering.',
    fabric: '100% Combed Heavy Cotton (240 GSM)',
    fit: 'Oversized Boxy Fit',
    rating: 4.6,
    reviewCount: 1420,
    baseMRP: 1499,
    trending: true,
    offers: [
      {
        retailerId: 'ajio',
        retailerName: 'Ajio',
        price: 799,
        mrp: 1499,
        discountPercent: 47,
        couponCode: 'AJIOMANIA',
        couponDiscount: 150,
        effectivePrice: 649,
        inStock: true,
        deliveryDays: 3,
        rating: 4.5,
        affiliateUrl: 'https://www.ajio.com/s/fashion-tshirts',
        badge: 'Best Deal Today',
        isBestDeal: true
      },
      {
        retailerId: 'myntra',
        retailerName: 'Myntra',
        price: 899,
        mrp: 1499,
        discountPercent: 40,
        couponCode: 'MYNTRA100',
        couponDiscount: 100,
        effectivePrice: 799,
        inStock: true,
        deliveryDays: 2,
        rating: 4.7,
        affiliateUrl: 'https://www.myntra.com/snitch-tshirts'
      },
      {
        retailerId: 'amazon',
        retailerName: 'Amazon Fashion',
        price: 949,
        mrp: 1499,
        discountPercent: 37,
        effectivePrice: 949,
        inStock: true,
        deliveryDays: 1,
        rating: 4.4,
        affiliateUrl: 'https://www.amazon.in/s?k=snitch+oversized+tshirt'
      },
      {
        retailerId: 'flipkart',
        retailerName: 'Flipkart',
        price: 929,
        mrp: 1499,
        discountPercent: 38,
        effectivePrice: 929,
        inStock: true,
        deliveryDays: 3,
        rating: 4.3,
        affiliateUrl: 'https://www.flipkart.com/search?q=snitch+tshirt'
      },
      {
        retailerId: 'tatacliq',
        retailerName: 'Tata CLiQ',
        price: 999,
        mrp: 1499,
        discountPercent: 33,
        couponCode: 'CLIQLUXE',
        couponDiscount: 50,
        effectivePrice: 949,
        inStock: true,
        deliveryDays: 4,
        rating: 4.2,
        affiliateUrl: 'https://www.tatacliq.com/search/?searchCategory=all&text=snitch+tshirt'
      }
    ],
    bestDeal: {
      bestRetailerId: 'ajio',
      bestRetailerName: 'Ajio',
      lowestEffectivePrice: 649,
      highestPrice: 949,
      maxSavings: 300,
      couponApplicable: 'AJIOMANIA',
      couponSavings: 150,
      recommendationNote: "Buy on Ajio to save ₹300 compared to Amazon Fashion using coupon 'AJIOMANIA'.",
      affiliateUrl: 'https://www.ajio.com/s/fashion-tshirts'
    },
    priceHistory: [
      { date: '10 Days Ago', lowestPrice: 799, highestPrice: 1199 },
      { date: '7 Days Ago', lowestPrice: 749, highestPrice: 1049 },
      { date: '3 Days Ago', lowestPrice: 699, highestPrice: 999 },
      { date: 'Today', lowestPrice: 649, highestPrice: 949 }
    ]
  },
  {
    id: 'prod-102',
    name: 'Raw Indigo Selvedge Straight-Leg Denim Jeans',
    brand: "Levi's",
    category: 'Jeans',
    gender: 'Men',
    imageUrl: '/src/assets/images/fashion_denim_jeans_1793215693771.jpg',
    description: 'Authentic 13.5 oz heavy-duty selvedge denim woven on traditional shuttle looms. Features genuine copper button fly, reinforced chain-stitched hems, and a clean straight leg that molds naturally to your body over time.',
    fabric: '100% Selvedge Indigo Denim (13.5 oz)',
    fit: 'Classic Straight Fit',
    rating: 4.8,
    reviewCount: 3108,
    baseMRP: 3999,
    trending: true,
    offers: [
      {
        retailerId: 'myntra',
        retailerName: 'Myntra',
        price: 2199,
        mrp: 3999,
        discountPercent: 45,
        couponCode: 'LEVIS300',
        couponDiscount: 300,
        effectivePrice: 1899,
        inStock: true,
        deliveryDays: 2,
        rating: 4.8,
        affiliateUrl: 'https://www.myntra.com/levis-jeans',
        badge: 'Lowest in 30 Days',
        isBestDeal: true
      },
      {
        retailerId: 'amazon',
        retailerName: 'Amazon Fashion',
        price: 2499,
        mrp: 3999,
        discountPercent: 38,
        couponCode: 'PRIME150',
        couponDiscount: 150,
        effectivePrice: 2349,
        inStock: true,
        deliveryDays: 1,
        rating: 4.7,
        affiliateUrl: 'https://www.amazon.in/s?k=levis+501+jeans'
      },
      {
        retailerId: 'ajio',
        retailerName: 'Ajio',
        price: 2399,
        mrp: 3999,
        discountPercent: 40,
        effectivePrice: 2399,
        inStock: true,
        deliveryDays: 3,
        rating: 4.6,
        affiliateUrl: 'https://www.ajio.com/s/levis-men-jeans'
      },
      {
        retailerId: 'flipkart',
        retailerName: 'Flipkart',
        price: 2449,
        mrp: 3999,
        discountPercent: 39,
        effectivePrice: 2449,
        inStock: true,
        deliveryDays: 3,
        rating: 4.4,
        affiliateUrl: 'https://www.flipkart.com/search?q=levis+jeans'
      },
      {
        retailerId: 'tatacliq',
        retailerName: 'Tata CLiQ',
        price: 2799,
        mrp: 3999,
        discountPercent: 30,
        couponCode: 'CLIQLUXE',
        couponDiscount: 200,
        effectivePrice: 2599,
        inStock: true,
        deliveryDays: 4,
        rating: 4.6,
        affiliateUrl: 'https://www.tatacliq.com/search/?searchCategory=all&text=levis+jeans'
      }
    ],
    bestDeal: {
      bestRetailerId: 'myntra',
      bestRetailerName: 'Myntra',
      lowestEffectivePrice: 1899,
      highestPrice: 2599,
      maxSavings: 700,
      couponApplicable: 'LEVIS300',
      couponSavings: 300,
      recommendationNote: "Buy on Myntra to save ₹700 compared to Tata CLiQ using coupon 'LEVIS300'.",
      affiliateUrl: 'https://www.myntra.com/levis-jeans'
    },
    priceHistory: [
      { date: '10 Days Ago', lowestPrice: 2499, highestPrice: 3299 },
      { date: '7 Days Ago', lowestPrice: 2299, highestPrice: 2999 },
      { date: '3 Days Ago', lowestPrice: 2099, highestPrice: 2799 },
      { date: 'Today', lowestPrice: 1899, highestPrice: 2599 }
    ]
  },
  {
    id: 'prod-103',
    name: 'Minimalist Oatmeal Heather Fleece Pullover Hoodie',
    brand: 'H&M',
    category: 'Hoodies',
    gender: 'Unisex',
    imageUrl: '/src/assets/images/fashion_fleece_hoodie_1793215693673.jpg',
    description: 'Heavyweight brushed-back fleece pullover with a double-layered drawstring hood and spacious kangaroo pocket. Finished with snug ribbed trims for enduring warmth and minimalist casual wear.',
    fabric: '80% Organic Cotton, 20% Recycled Polyester (320 GSM)',
    fit: 'Relaxed Fit',
    rating: 4.5,
    reviewCount: 940,
    baseMRP: 2299,
    trending: false,
    offers: [
      {
        retailerId: 'myntra',
        retailerName: 'Myntra',
        price: 1399,
        mrp: 2299,
        discountPercent: 39,
        couponCode: 'WINTER150',
        couponDiscount: 150,
        effectivePrice: 1249,
        inStock: true,
        deliveryDays: 2,
        rating: 4.6,
        affiliateUrl: 'https://www.myntra.com/hm-hoodies',
        badge: 'Best Deal',
        isBestDeal: true
      },
      {
        retailerId: 'amazon',
        retailerName: 'Amazon Fashion',
        price: 1599,
        mrp: 2299,
        discountPercent: 30,
        effectivePrice: 1599,
        inStock: true,
        deliveryDays: 1,
        rating: 4.3,
        affiliateUrl: 'https://www.amazon.in/s?k=hm+hoodie'
      },
      {
        retailerId: 'ajio',
        retailerName: 'Ajio',
        price: 1499,
        mrp: 2299,
        discountPercent: 35,
        couponCode: 'AJIO100',
        couponDiscount: 100,
        effectivePrice: 1399,
        inStock: true,
        deliveryDays: 3,
        rating: 4.4,
        affiliateUrl: 'https://www.ajio.com/s/hoodies-sweatshirts'
      },
      {
        retailerId: 'flipkart',
        retailerName: 'Flipkart',
        price: 1649,
        mrp: 2299,
        discountPercent: 28,
        effectivePrice: 1649,
        inStock: false,
        deliveryDays: 4,
        rating: 4.1,
        affiliateUrl: 'https://www.flipkart.com/search?q=hm+hoodie'
      },
      {
        retailerId: 'tatacliq',
        retailerName: 'Tata CLiQ',
        price: 1549,
        mrp: 2299,
        discountPercent: 33,
        effectivePrice: 1549,
        inStock: true,
        deliveryDays: 4,
        rating: 4.2,
        affiliateUrl: 'https://www.tatacliq.com/search/?text=hm+hoodie'
      }
    ],
    bestDeal: {
      bestRetailerId: 'myntra',
      bestRetailerName: 'Myntra',
      lowestEffectivePrice: 1249,
      highestPrice: 1599,
      maxSavings: 350,
      couponApplicable: 'WINTER150',
      couponSavings: 150,
      recommendationNote: "Buy on Myntra to save ₹350 compared to Amazon Fashion using coupon 'WINTER150'.",
      affiliateUrl: 'https://www.myntra.com/hm-hoodies'
    },
    priceHistory: [
      { date: '10 Days Ago', lowestPrice: 1499, highestPrice: 1899 },
      { date: '7 Days Ago', lowestPrice: 1399, highestPrice: 1799 },
      { date: '3 Days Ago', lowestPrice: 1299, highestPrice: 1699 },
      { date: 'Today', lowestPrice: 1249, highestPrice: 1599 }
    ]
  },
  {
    id: 'prod-104',
    name: 'Tailored Sky Blue Oxford Cotton Button-Down Shirt',
    brand: 'Allen Solly',
    category: 'Shirts',
    gender: 'Men',
    imageUrl: '/src/assets/images/fashion_oxford_shirt_1793215695248.jpg',
    description: 'Precision-tailored button-down collar shirt woven from pinpoint oxford cotton with mother-of-pearl buttons. Ideal for formal college presentations, internships, and smart-casual weekends.',
    fabric: '100% Premium Pinpoint Oxford Cotton',
    fit: 'Slim / Modern Fit',
    rating: 4.7,
    reviewCount: 2240,
    baseMRP: 2499,
    trending: true,
    offers: [
      {
        retailerId: 'amazon',
        retailerName: 'Amazon Fashion',
        price: 1099,
        mrp: 2499,
        discountPercent: 56,
        couponCode: 'AMZFORMAL100',
        couponDiscount: 100,
        effectivePrice: 999,
        inStock: true,
        deliveryDays: 1,
        rating: 4.7,
        affiliateUrl: 'https://www.amazon.in/s?k=allen+solly+oxford+shirt',
        badge: 'Best Deal',
        isBestDeal: true
      },
      {
        retailerId: 'myntra',
        retailerName: 'Myntra',
        price: 1249,
        mrp: 2499,
        discountPercent: 50,
        couponCode: 'OFFICE100',
        couponDiscount: 100,
        effectivePrice: 1149,
        inStock: true,
        deliveryDays: 2,
        rating: 4.6,
        affiliateUrl: 'https://www.myntra.com/allen-solly-shirts'
      },
      {
        retailerId: 'flipkart',
        retailerName: 'Flipkart',
        price: 1199,
        mrp: 2499,
        discountPercent: 52,
        effectivePrice: 1199,
        inStock: true,
        deliveryDays: 3,
        rating: 4.5,
        affiliateUrl: 'https://www.flipkart.com/search?q=allen+solly+shirt'
      },
      {
        retailerId: 'ajio',
        retailerName: 'Ajio',
        price: 1299,
        mrp: 2499,
        discountPercent: 48,
        effectivePrice: 1299,
        inStock: true,
        deliveryDays: 3,
        rating: 4.4,
        affiliateUrl: 'https://www.ajio.com/s/allen-solly-shirts'
      },
      {
        retailerId: 'tatacliq',
        retailerName: 'Tata CLiQ',
        price: 1399,
        mrp: 2499,
        discountPercent: 44,
        couponCode: 'CLIQLUXE',
        couponDiscount: 100,
        effectivePrice: 1299,
        inStock: true,
        deliveryDays: 4,
        rating: 4.3,
        affiliateUrl: 'https://www.tatacliq.com/search/?text=allen+solly+shirt'
      }
    ],
    bestDeal: {
      bestRetailerId: 'amazon',
      bestRetailerName: 'Amazon Fashion',
      lowestEffectivePrice: 999,
      highestPrice: 1299,
      maxSavings: 300,
      couponApplicable: 'AMZFORMAL100',
      couponSavings: 100,
      recommendationNote: "Buy on Amazon Fashion to save ₹300 compared to Tata CLiQ using coupon 'AMZFORMAL100'.",
      affiliateUrl: 'https://www.amazon.in/s?k=allen+solly+oxford+shirt'
    },
    priceHistory: [
      { date: '10 Days Ago', lowestPrice: 1399, highestPrice: 1799 },
      { date: '7 Days Ago', lowestPrice: 1249, highestPrice: 1599 },
      { date: '3 Days Ago', lowestPrice: 1099, highestPrice: 1399 },
      { date: 'Today', lowestPrice: 999, highestPrice: 1299 }
    ]
  },
  {
    id: 'prod-105',
    name: 'Utility Olive Drab Relaxed Streetwear Cargo Trousers',
    brand: 'Roadster',
    category: 'Trousers',
    gender: 'Men',
    imageUrl: '/src/assets/images/fashion_cargo_pants_1793215694637.jpg',
    description: 'Rugged cotton twill cargo pants featuring ergonomic darted knees, gusseted deep cargo pockets with snap flap closures, and adjustable cinch cords at the ankle hem.',
    fabric: '100% Heavy Cotton Twill',
    fit: 'Relaxed Tapered Fit',
    rating: 4.4,
    reviewCount: 1670,
    baseMRP: 2199,
    trending: false,
    offers: [
      {
        retailerId: 'myntra',
        retailerName: 'Myntra',
        price: 799,
        mrp: 2199,
        discountPercent: 64,
        couponCode: 'MYNTRA75',
        couponDiscount: 75,
        effectivePrice: 724,
        inStock: true,
        deliveryDays: 2,
        rating: 4.5,
        affiliateUrl: 'https://www.myntra.com/roadster-cargos',
        badge: 'Best Deal',
        isBestDeal: true
      },
      {
        retailerId: 'flipkart',
        retailerName: 'Flipkart',
        price: 849,
        mrp: 2199,
        discountPercent: 61,
        effectivePrice: 849,
        inStock: true,
        deliveryDays: 2,
        rating: 4.3,
        affiliateUrl: 'https://www.flipkart.com/search?q=roadster+cargo'
      },
      {
        retailerId: 'ajio',
        retailerName: 'Ajio',
        price: 899,
        mrp: 2199,
        discountPercent: 59,
        effectivePrice: 899,
        inStock: true,
        deliveryDays: 4,
        rating: 4.2,
        affiliateUrl: 'https://www.ajio.com/s/cargo-pants'
      },
      {
        retailerId: 'amazon',
        retailerName: 'Amazon Fashion',
        price: 999,
        mrp: 2199,
        discountPercent: 55,
        effectivePrice: 999,
        inStock: true,
        deliveryDays: 1,
        rating: 4.1,
        affiliateUrl: 'https://www.amazon.in/s?k=roadster+cargos'
      },
      {
        retailerId: 'tatacliq',
        retailerName: 'Tata CLiQ',
        price: 1049,
        mrp: 2199,
        discountPercent: 52,
        effectivePrice: 1049,
        inStock: false,
        deliveryDays: 5,
        rating: 4.0,
        affiliateUrl: 'https://www.tatacliq.com/search/?text=roadster+trousers'
      }
    ],
    bestDeal: {
      bestRetailerId: 'myntra',
      bestRetailerName: 'Myntra',
      lowestEffectivePrice: 724,
      highestPrice: 999,
      maxSavings: 275,
      couponApplicable: 'MYNTRA75',
      couponSavings: 75,
      recommendationNote: "Buy on Myntra to save ₹275 compared to Amazon Fashion using coupon 'MYNTRA75'.",
      affiliateUrl: 'https://www.myntra.com/roadster-cargos'
    },
    priceHistory: [
      { date: '10 Days Ago', lowestPrice: 999, highestPrice: 1399 },
      { date: '7 Days Ago', lowestPrice: 899, highestPrice: 1249 },
      { date: '3 Days Ago', lowestPrice: 799, highestPrice: 1099 },
      { date: 'Today', lowestPrice: 724, highestPrice: 999 }
    ]
  },
  {
    id: 'prod-106',
    name: 'Vintage Wash Graphic Streetwear Cotton Tee',
    brand: 'Zara',
    category: 'T-Shirts',
    gender: 'Unisex',
    imageUrl: '/src/assets/images/fashion_tshirt_cotton_1793215692221.jpg',
    description: 'Acid-washed loose fit tee featuring subtle distress abrasions and vintage typography print on the back. Premium 220 GSM single-jersey fabric for a streetwear finish.',
    fabric: '100% Acid-Wash Cotton',
    fit: 'Loose / Street Fit',
    rating: 4.7,
    reviewCount: 880,
    baseMRP: 1990,
    trending: true,
    offers: [
      {
        retailerId: 'ajio',
        retailerName: 'Ajio',
        price: 1290,
        mrp: 1990,
        discountPercent: 35,
        couponCode: 'AJIOMANIA',
        couponDiscount: 150,
        effectivePrice: 1140,
        inStock: true,
        deliveryDays: 3,
        rating: 4.6,
        affiliateUrl: 'https://www.ajio.com/s/zara-tshirts',
        badge: 'Best Deal',
        isBestDeal: true
      },
      {
        retailerId: 'myntra',
        retailerName: 'Myntra',
        price: 1490,
        mrp: 1990,
        discountPercent: 25,
        couponCode: 'MYNTRA100',
        couponDiscount: 100,
        effectivePrice: 1390,
        inStock: true,
        deliveryDays: 2,
        rating: 4.7,
        affiliateUrl: 'https://www.myntra.com/zara-tshirts'
      },
      {
        retailerId: 'tatacliq',
        retailerName: 'Tata CLiQ',
        price: 1590,
        mrp: 1990,
        discountPercent: 20,
        couponCode: 'CLIQLUXE',
        couponDiscount: 100,
        effectivePrice: 1490,
        inStock: true,
        deliveryDays: 4,
        rating: 4.5,
        affiliateUrl: 'https://www.tatacliq.com/search/?text=zara+tshirt'
      },
      {
        retailerId: 'amazon',
        retailerName: 'Amazon Fashion',
        price: 1690,
        mrp: 1990,
        discountPercent: 15,
        effectivePrice: 1690,
        inStock: true,
        deliveryDays: 1,
        rating: 4.3,
        affiliateUrl: 'https://www.amazon.in/s?k=graphic+tshirt'
      },
      {
        retailerId: 'flipkart',
        retailerName: 'Flipkart',
        price: 1650,
        mrp: 1990,
        discountPercent: 17,
        effectivePrice: 1650,
        inStock: true,
        deliveryDays: 3,
        rating: 4.2,
        affiliateUrl: 'https://www.flipkart.com/search?q=graphic+tshirt'
      }
    ],
    bestDeal: {
      bestRetailerId: 'ajio',
      bestRetailerName: 'Ajio',
      lowestEffectivePrice: 1140,
      highestPrice: 1690,
      maxSavings: 550,
      couponApplicable: 'AJIOMANIA',
      couponSavings: 150,
      recommendationNote: "Buy on Ajio to save ₹550 compared to Amazon Fashion using coupon 'AJIOMANIA'.",
      affiliateUrl: 'https://www.ajio.com/s/zara-tshirts'
    },
    priceHistory: [
      { date: '10 Days Ago', lowestPrice: 1590, highestPrice: 1990 },
      { date: '7 Days Ago', lowestPrice: 1390, highestPrice: 1790 },
      { date: '3 Days Ago', lowestPrice: 1240, highestPrice: 1690 },
      { date: 'Today', lowestPrice: 1140, highestPrice: 1690 }
    ]
  }
];

// Brand Tier Benchmarks for Module 5
const brandBenchmarks: BrandBenchmark[] = [
  {
    id: 'brand-snitch',
    brandName: 'Snitch',
    tier: 'Value Streetwear',
    logoText: 'SNITCH',
    tagline: 'Modern, fast-fashion urban menswear',
    avgTShirtPrice: 799,
    avgShirtPrice: 1199,
    avgJeansPrice: 1699,
    topPlatform: 'Ajio',
    avgDiscountPercent: 42,
    qualityRating: 4.3,
    durabilityRating: 4.1,
    bestFor: 'Trendy oversized streetwear and party shirts'
  },
  {
    id: 'brand-levis',
    brandName: "Levi's",
    tier: 'Casual Heritage',
    logoText: "LEVI'S",
    tagline: 'Global pioneer in authentic denim workwear',
    avgTShirtPrice: 1199,
    avgShirtPrice: 2299,
    avgJeansPrice: 2499,
    topPlatform: 'Myntra',
    avgDiscountPercent: 38,
    qualityRating: 4.8,
    durabilityRating: 4.9,
    bestFor: 'Enduring 501/511 selvedge denim jeans & denim jackets'
  },
  {
    id: 'brand-hm',
    brandName: 'H&M',
    tier: 'Fast Fashion',
    logoText: 'H&M',
    tagline: 'Scandinavian affordable contemporary basics',
    avgTShirtPrice: 699,
    avgShirtPrice: 1499,
    avgJeansPrice: 1999,
    topPlatform: 'Myntra',
    avgDiscountPercent: 35,
    qualityRating: 4.1,
    durabilityRating: 3.9,
    bestFor: 'Oatmeal hoodies, solid crewnecks, and minimalist essentials'
  },
  {
    id: 'brand-zara',
    brandName: 'Zara',
    tier: 'Premium High-Street',
    logoText: 'ZARA',
    tagline: 'Runway trends brought directly to ready-to-wear',
    avgTShirtPrice: 1490,
    avgShirtPrice: 2790,
    avgJeansPrice: 3590,
    topPlatform: 'Ajio',
    avgDiscountPercent: 28,
    qualityRating: 4.4,
    durabilityRating: 4.0,
    bestFor: 'High-fashion tailored blazers, textured knits & partywear'
  },
  {
    id: 'brand-allensolly',
    brandName: 'Allen Solly',
    tier: 'Casual Heritage',
    logoText: 'ALLEN SOLLY',
    tagline: 'Friday dressing, crisp formals and polos',
    avgTShirtPrice: 899,
    avgShirtPrice: 1299,
    avgJeansPrice: 1899,
    topPlatform: 'Amazon Fashion',
    avgDiscountPercent: 50,
    qualityRating: 4.5,
    durabilityRating: 4.4,
    bestFor: 'Oxford shirts, office casuals & polo t-shirts'
  },
  {
    id: 'brand-roadster',
    brandName: 'Roadster',
    tier: 'Value Streetwear',
    logoText: 'ROADSTER',
    tagline: 'Rugged outdoor college lifestyle apparel',
    avgTShirtPrice: 499,
    avgShirtPrice: 899,
    avgJeansPrice: 1199,
    topPlatform: 'Myntra',
    avgDiscountPercent: 62,
    qualityRating: 4.0,
    durabilityRating: 3.9,
    bestFor: 'Budget cargo trousers, flannel shirts & graphic tees'
  }
];

// Pre-seeded Users
let users: User[] = [
  {
    id: 'user-demo-1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    role: 'student',
    budgetPreference: 1500
  },
  {
    id: 'user-demo-2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    role: 'shopper',
    budgetPreference: 2500
  }
];

let currentUser: User | null = users[0]; // Active session defaults to Aarav Sharma for instant college demo

// User Price Alerts
let priceAlerts: PriceAlert[] = [
  {
    id: 'alert-1',
    userId: 'user-demo-1',
    productId: 'prod-101',
    productName: 'Washed Charcoal Heavyweight Oversized Cotton T-Shirt',
    brand: 'Snitch',
    productImage: '/src/assets/images/fashion_tshirt_cotton_1793215692221.jpg',
    targetPrice: 699,
    currentLowestPrice: 649,
    initialPrice: 799,
    triggered: true,
    createdAt: '2026-10-25T10:00:00Z',
    triggeredAt: '2026-10-28T09:15:00Z',
    winningRetailer: 'Ajio'
  },
  {
    id: 'alert-2',
    userId: 'user-demo-1',
    productId: 'prod-102',
    productName: 'Raw Indigo Selvedge Straight-Leg Denim Jeans',
    brand: "Levi's",
    productImage: '/src/assets/images/fashion_denim_jeans_1793215693771.jpg',
    targetPrice: 1800,
    currentLowestPrice: 1899,
    initialPrice: 2199,
    triggered: false,
    createdAt: '2026-10-27T14:30:00Z'
  }
];

// User Wishlist
let wishlist: WishlistItem[] = [
  {
    id: 'wish-1',
    userId: 'user-demo-1',
    productId: 'prod-101',
    product: products[0],
    addedAt: '2026-10-26T11:00:00Z',
    initialLowestPrice: 799,
    currentLowestPrice: 649
  },
  {
    id: 'wish-2',
    userId: 'user-demo-1',
    productId: 'prod-104',
    product: products[3],
    addedAt: '2026-10-27T16:20:00Z',
    initialLowestPrice: 1199,
    currentLowestPrice: 999
  }
];

// In-app Notifications
let notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Price Drop Alert Triggered!',
    message: 'Snitch Oversized Cotton T-Shirt dropped to ₹649 on Ajio (below your ₹699 target)!',
    timestamp: '15 mins ago',
    type: 'price_drop',
    productId: 'prod-101',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Best Deal Discovered',
    message: 'Amazon Fashion dropped Allen Solly Oxford Shirt to ₹999 with code AMZFORMAL100.',
    timestamp: '2 hours ago',
    type: 'deal_alert',
    productId: 'prod-104',
    read: false
  }
];

// ================= API ROUTES =================

// 1. PRODUCTS & REAL-TIME SEARCH / COMPARE
app.get('/api/products', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const category = req.query.category as string || 'All';
  const brand = req.query.brand as string || 'All';
  const gender = req.query.gender as string || 'All';
  const maxPrice = Number(req.query.maxPrice) || Infinity;
  const sortBy = req.query.sortBy as string || 'relevance';

  let filtered = products.filter(p => {
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.fabric.toLowerCase().includes(query);

    const matchesCategory = category === 'All' || p.category.toLowerCase() === category.toLowerCase();
    const matchesBrand = brand === 'All' || p.brand.toLowerCase() === brand.toLowerCase();
    const matchesGender = gender === 'All' || p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex';
    const matchesPrice = p.bestDeal.lowestEffectivePrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesGender && matchesPrice;
  });

  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.bestDeal.lowestEffectivePrice - b.bestDeal.lowestEffectivePrice);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.bestDeal.lowestEffectivePrice - a.bestDeal.lowestEffectivePrice);
  } else if (sortBy === 'savings_desc') {
    filtered.sort((a, b) => b.bestDeal.maxSavings - a.bestDeal.maxSavings);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    success: true,
    total: filtered.length,
    products: filtered
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// Compare specific product across retailers
app.get('/api/products/:id/compare', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const bestDeal = calculateBestDeal(product.offers, product.name);
  res.json({
    success: true,
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    offers: product.offers,
    bestDeal
  });
});

// 2. LIVE PRICE DROP SIMULATOR (Essential for College Demo!)
app.post('/api/alerts/simulate-drop', (req: Request, res: Response) => {
  const { productId, targetRetailerId = 'ajio', dropAmount = 250 } = req.body;
  
  const product = products.find(p => p.id === (productId || 'prod-102'));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Drop price on the target retailer
  const offer = product.offers.find(o => o.retailerId === targetRetailerId) || product.offers[0];
  const previousPrice = offer.effectivePrice;
  const newPrice = Math.max(299, previousPrice - dropAmount);

  offer.price = newPrice + (offer.couponDiscount || 0);
  offer.effectivePrice = newPrice;
  offer.badge = 'FLASH SALE LIVE';

  // Recalculate best deal
  product.bestDeal = calculateBestDeal(product.offers, product.name);
  
  // Update price history
  product.priceHistory.push({
    date: 'Just Now',
    lowestPrice: product.bestDeal.lowestEffectivePrice,
    highestPrice: product.bestDeal.highestPrice
  });

  // Check and trigger matching alerts
  const matchingAlerts = priceAlerts.filter(a => a.productId === product.id);
  let triggeredCount = 0;

  matchingAlerts.forEach(alert => {
    alert.currentLowestPrice = product.bestDeal.lowestEffectivePrice;
    if (product.bestDeal.lowestEffectivePrice <= alert.targetPrice) {
      alert.triggered = true;
      alert.triggeredAt = new Date().toISOString();
      alert.winningRetailer = offer.retailerName;
      triggeredCount++;

      // Create notification
      notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `Flash Price Drop on ${offer.retailerName}!`,
        message: `${product.name} is now down to ₹${newPrice} on ${offer.retailerName} (Saving ₹${dropAmount})!`,
        timestamp: 'Just now',
        type: 'price_drop',
        productId: product.id,
        read: false
      });
    }
  });

  // Also update wishlist items
  wishlist.forEach(item => {
    if (item.productId === product.id) {
      item.currentLowestPrice = product.bestDeal.lowestEffectivePrice;
      item.product = product;
    }
  });

  res.json({
    success: true,
    message: `Price drop triggered! ${product.name} on ${offer.retailerName} reduced from ₹${previousPrice} to ₹${newPrice}.`,
    product,
    triggeredAlerts: triggeredCount,
    bestDeal: product.bestDeal
  });
});

// Randomize market prices slightly for real-time demo ticker
app.post('/api/products/randomize-market', (_req: Request, res: Response) => {
  products.forEach(product => {
    product.offers.forEach(offer => {
      // Small +/- 2% to 4% shift
      const deltaPercent = (Math.random() * 0.08 - 0.04);
      const newPrice = Math.round(offer.price * (1 + deltaPercent));
      offer.price = Math.max(399, newPrice);
      offer.effectivePrice = Math.max(299, offer.price - (offer.couponDiscount || 0));
    });
    product.bestDeal = calculateBestDeal(product.offers, product.name);
  });

  res.json({
    success: true,
    message: 'Live market prices updated across all 5 fashion retailers.'
  });
});

// 3. AUTH & USER PROFILE MODULE
app.get('/api/auth/me', (_req: Request, res: Response) => {
  res.json({
    success: true,
    user: currentUser
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    currentUser = existingUser;
    return res.json({ success: true, user: currentUser, message: `Welcome back, ${currentUser.name}!` });
  }

  // Create account on the fly if not exists (smoother college demo experience)
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    email,
    role: 'shopper',
    budgetPreference: 2000
  };
  users.push(newUser);
  currentUser = newUser;

  res.json({
    success: true,
    user: currentUser,
    message: `Account created for ${currentUser.name}!`
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  currentUser = null;
  res.json({ success: true, message: 'Logged out successfully' });
});

// Switch to a demo preset user
app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (user) {
    currentUser = user;
    return res.json({ success: true, user: currentUser });
  }
  res.status(404).json({ success: false, message: 'Demo user not found' });
});

// 4. PRICE ALERTS MODULE
app.get('/api/alerts', (_req: Request, res: Response) => {
  const userAlerts = currentUser ? priceAlerts.filter(a => a.userId === currentUser?.id) : priceAlerts;
  res.json({ success: true, alerts: userAlerts });
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const { productId, targetPrice } = req.body;
  if (!productId || !targetPrice) {
    return res.status(400).json({ success: false, message: 'Product ID and Target Price are required' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const newAlert: PriceAlert = {
    id: `alert-${Date.now()}`,
    userId: currentUser?.id || 'guest-user',
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    productImage: product.imageUrl,
    targetPrice: Number(targetPrice),
    currentLowestPrice: product.bestDeal.lowestEffectivePrice,
    initialPrice: product.bestDeal.lowestEffectivePrice,
    triggered: product.bestDeal.lowestEffectivePrice <= Number(targetPrice),
    createdAt: new Date().toISOString(),
    winningRetailer: product.bestDeal.lowestEffectivePrice <= Number(targetPrice) ? product.bestDeal.bestRetailerName : undefined
  };

  priceAlerts.unshift(newAlert);

  res.json({
    success: true,
    message: `Price drop alert activated for ${product.name} at ₹${targetPrice}!`,
    alert: newAlert
  });
});

app.delete('/api/alerts/:id', (req: Request, res: Response) => {
  priceAlerts = priceAlerts.filter(a => a.id !== req.params.id);
  res.json({ success: true, message: 'Alert deleted successfully' });
});

// 5. WISHLIST MODULE
app.get('/api/wishlist', (_req: Request, res: Response) => {
  const userWishlist = currentUser ? wishlist.filter(w => w.userId === currentUser?.id) : wishlist;
  res.json({ success: true, wishlist: userWishlist });
});

app.post('/api/wishlist', (req: Request, res: Response) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existing = wishlist.find(w => w.productId === productId && (!currentUser || w.userId === currentUser.id));
  if (existing) {
    return res.json({ success: true, message: 'Already in your saved wardrobe', wishlistItem: existing });
  }

  const item: WishlistItem = {
    id: `wish-${Date.now()}`,
    userId: currentUser?.id || 'guest-user',
    productId: product.id,
    product,
    addedAt: new Date().toISOString(),
    initialLowestPrice: product.bestDeal.lowestEffectivePrice,
    currentLowestPrice: product.bestDeal.lowestEffectivePrice
  };

  wishlist.unshift(item);
  res.json({ success: true, message: `Added ${product.name} to wishlist!`, wishlistItem: item });
});

app.delete('/api/wishlist/:id', (req: Request, res: Response) => {
  wishlist = wishlist.filter(w => w.id !== req.params.id && w.productId !== req.params.id);
  res.json({ success: true, message: 'Removed from wishlist' });
});

// 6. BRAND BENCHMARK MATRIX MODULE
app.get('/api/brands', (_req: Request, res: Response) => {
  res.json({
    success: true,
    brands: brandBenchmarks
  });
});

// 7. NOTIFICATIONS
app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json({
    success: true,
    notifications
  });
});

app.post('/api/notifications/read', (_req: Request, res: Response) => {
  notifications.forEach(n => n.read = true);
  res.json({ success: true });
});

// ================= VITE DEV MIDDLEWARE & PRODUCTION STATIC =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SmartBuy Fashion Buying Assistant server running at http://localhost:${PORT}`);
  });
}

startServer();
