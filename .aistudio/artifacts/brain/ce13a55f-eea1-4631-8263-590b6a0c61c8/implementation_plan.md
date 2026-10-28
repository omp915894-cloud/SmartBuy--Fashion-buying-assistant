# ThreadWise — Real-Time Fashion Price Comparison System

ThreadWise is a high-performance fashion price comparison engine built for clothing brands, enabling shoppers to track, analyze, and compare real-time prices across major Indian fashion retailers (Myntra, Ajio, Amazon Fashion, Flipkart, and Tata CLiQ) to instantly pinpoint the best deals and trigger price drop alerts.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following project parameters have been confirmed based on user feedback for the college project demonstration:

- **Confirmed Retailers**: Indian fashion e-commerce leaders: **Myntra, Ajio, Amazon Fashion, Flipkart, and Tata CLiQ**.
- **Confirmed Core Modules**:
  1. **Authentication & Profile Module**: Student/user login, signup, persistent session management, and guest browsing mode.
  2. **Product Catalog & Real-Time Price Comparison Module**: Search (e.g., "t-shirts", "oversized hoodie", "cargo pants"), multi-attribute filtering (brand, category, gender, discount, price ceiling), interactive product detail view with a dedicated cross-platform comparison table located directly below the product, highlight badge for the *Best Deal*, net savings breakdown, coupon suggestions, and outbound redirect links.
  3. **Price Drop Alert & Notification Tracker Module**: Custom price threshold creation, simulated live price fluctuation ticker, in-app notification inbox, and instant toast triggers for demo presentations.
  4. **Wardrobe Wishlist Module**: Save favorite items, monitor dynamic price movements across platforms, view current lowest price badges, and quick-compare.
  5. **Brand Tier Comparison Matrix**: Side-by-side brand positioning tool (e.g., Snitch vs. H&M vs. Zara vs. Levi's vs. Roadster), comparing average t-shirt/denim pricing, dominant retailer availability, and value-for-money index.
- **Real-Time Demonstration Engine**: An integrated real-time engine capable of simulating live pricing shifts and stock status so professors and evaluators can witness price drop alerts trigger live in the UI.

---

### 1. Overview & Core Concept

- **What It Does**: Much like Buyhatke or PriceDekho tailored exclusively to apparel and footwear, ThreadWise aggregates clothing items from multiple retail stores into a unified catalog. When an end user views a product (e.g., a cotton polo t-shirt or relaxed-fit jeans), the system inspects all 5 online retail stores, highlights the platform currently offering the lowest price (with platform-specific coupon/bank discount notes), and supplies direct store links.
- **Target Audience / Persona**: College students and smart fashion shoppers seeking to avoid overpaying on brand apparel across fragmented e-commerce apps.
- **Key Value**: Eliminates manual browser tab switching across Myntra, Ajio, and Amazon, saving time and money while automating price tracking.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Discovery & Search**:
   - The user visits the homepage or catalog, searches "t-shirts", and filters by Brand (*Snitch, H&M, Levi's, Roadster, Zara, Allen Solly*), Gender, Price Range, and Min Discount.
2. **Product Inspection & Price Comparison (Directly Below Product)**:
   - Clicking any item opens the clean, full-width Product Detail View.
   - Above the fold: Product gallery, brand name, item title, verified lowest current price, and "Set Price Alert" CTA.
   - **Directly below the product details**: The **Live Cross-Platform Price Comparison Deck**:
     - 5 structured retailer cards / comparison table rows (Amazon Fashion, Myntra, Ajio, Flipkart, Tata CLiQ).
     - Live platform price, standard MRP, percentage discount, applicable promo coupon code (e.g., `MYNTRA200`, `AJIOMANIA`), delivery speed, and availability status.
     - **"Best Deal!" visual spotlight** on the lowest priced platform with calculated savings (e.g., *"Save ₹450 compared to Amazon"*).
     - Working outbound platform buttons: *"Buy on Ajio ↗"* or *"Buy on Myntra ↗"*.
3. **Price Alert Configuration**:
   - Shopper inputs a desired target price (e.g. *"Notify me when it drops below ₹799"*).
   - Saved alerts appear in the Alerts dashboard with an interactive "Simulate Price Drop" button for instantaneous college viva demonstrations.
4. **Brand Tier Comparison**:
   - Users can select 2 or more brands to compare average category pricing (e.g., average t-shirt price across Zara vs H&M vs Roadster), fabric quality reputation, and which e-commerce platform historically offers the steepest discounts for each brand.

#### Visual Identity & Theme
- **Aesthetic Direction**: Modern, high-contrast fashion editorial with streetwear clarity—inspired by high-end shopping engines (SSENSE, Lyst) paired with the functional utility of Buyhatke.
- **Palette (60-30-10 Rule)**:
  - *Canvas (60%)*: Crisp clean slate/off-white background (`bg-slate-50 / bg-zinc-950`).
  - *Structural Surfaces (30%)*: Bordered clean white cards with hairline dividers (`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800`).
  - *Accent Budget (10%)*: High-intent emerald green for best price savings (`emerald-600 / emerald-500`) and deep ink black (`slate-900 / zinc-100`) for primary interactive CTAs.
- **Zero-Pill Discipline**:
  - Metadata rendered as unboxed editorial text separated by subtle middots (`Snitch · 100% Cotton · 4.4 ★`).
  - Filter controls styled as clean segmented buttons, not pill badge sandwiches.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` (crisp, modern geometric sans).
  - Body & Form Controls: `Inter` / System Sans.
  - Pricing & Telemetry: `tabular-nums font-mono` for all Indian Rupee (`₹`) pricing, percentages, and price differences.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Architecture with Express API + Vite Client**
  - *Chosen Approach*: Unified Node.js full-stack app with Express serving API endpoints (`/api/auth`, `/api/products`, `/api/alerts`, `/api/wishlist`, `/api/brands`) and Vite powering the lightning-fast React 19 frontend.
  - *Why*: Self-contained, zero-dependency external database setup that runs out of the box on port 3000, perfectly fulfilling the user's desire for easy deployment and college project submission.
- **Decision 2: Realistic Real-Time Pricing Engine with Fluctuations**
  - *Chosen Approach*: Real-time price aggregation engine with realistic retailer pricing algorithms, verified platform link generators, coupon codes, and an interactive demo controller to simulate live market price updates.
  - *Why*: Real web scraping in a demo environment often breaks due to Cloudflare/bot captchas on Myntra and Amazon. A robust simulated backend feed guarantees 100% reliable real-time comparisons during a viva/evaluation while matching actual Indian market pricing structures.
- **Decision 3: Dedicated Comparison Deck Placement Below Product**
  - *Chosen Approach*: As specifically requested, the retailer comparison table and best-deal suggestion are positioned prominently right beneath the main product overview, complete with direct external links to each platform.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ThreadWise Client (React 19)                     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Top Bar (Brand Wordmark, 4 Module Links, Auth / User Card)  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│         ┌────────────────────────────┼───────────────────────────┐          │
│         ▼                            ▼                           ▼          │
│  ┌──────────────┐             ┌──────────────┐            ┌──────────────┐  │
│  │ Module 1:    │             │ Module 2:    │            │ Module 3:    │  │
│  │ Auth/Profile │             │ Catalog &    │            │ Price Drop   │  │
│  │ - Sign In    │             │ Real-Time    │            │ Alerts       │  │
│  │ - Sign Up    │             │ Comparison   │            │ - Thresholds │  │
│  │ - Guest Mode │             │ Deck         │            │ - Simulator  │  │
│  └──────────────┘             └──────────────┘            └──────────────┘  │
│         │                            │                           │          │
│         └────────────────────────────┼───────────────────────────┘          │
│                                      │                                      │
│         ┌────────────────────────────┴───────────────────────────┐          │
│         ▼                                                        ▼          │
│  ┌──────────────┐                                         ┌──────────────┐  │
│  │ Module 4:    │                                         │ Module 5:    │  │
│  │ Wardrobe     │                                         │ Brand Tier   │  │
│  │ Wishlist &   │                                         │ Matrix       │  │
│  │ Tracker      │                                         │ Comparison   │  │
│  └──────────────┘                                         └──────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON / Express)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Backend Services (server.ts)                       │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│  │ Product Catalog Store │  │ Real-Time Price Engine│  │ Alert Dispatcher│ │
│  │ & Category Filter     │  │ & Best Deal Analyzer  │  │ & Notifications │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘ │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│  │ User Authentication   │  │ Wishlist Data Store   │  │ Brand Benchmarks│ │
│  │ & Session State       │  │ & Price History       │  │ Analytics Store │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Entities

1. **`Product`**:
   - `id`, `name`, `brand`, `category` (T-Shirts, Shirts, Jeans, Hoodies, Jackets, Trousers), `gender`, `imageUrl`, `description`, `fabric`, `rating`, `reviewCount`, `baseMRP`.
2. **`RetailerPrice`**:
   - `productId`, `retailerId` (`myntra`, `ajio`, `amazon`, `flipkart`, `tatacliq`), `retailerName`, `logo`, `price`, `mrp`, `discountPercent`, `couponCode`, `couponDiscount`, `inStock`, `deliveryDays`, `productUrl`.
3. **`PriceAlert`**:
   - `id`, `userId`, `productId`, `productName`, `targetPrice`, `currentLowestPrice`, `createdAt`, `triggered`, `lastNotifiedAt`.
4. **`WishlistItem`**:
   - `id`, `userId`, `productId`, `savedAt`, `initialPrice`, `lowestPriceSeen`.
5. **`BrandBenchmark`**:
   - `brandName`, `tier` (Budget, Mid-Range, Premium, Fast Fashion), `avgTShirtPrice`, `avgJeansPrice`, `topRetailer`, `materialQualityRating`.

---

### Step-by-Step Implementation Strategy

1. **Backend Server Setup (`server.ts`)**:
   - Implement Express server with `/api/products` (search, category, sorting), `/api/products/:id/compare` (live comparison across 5 stores), `/api/auth` (login/register/me), `/api/alerts` (create, list, delete, simulate drop), `/api/wishlist` (add, remove, list), and `/api/brands` (matrix stats).
   - Package.json script updates for unified full-stack startup.
2. **Catalog & High-Quality Visual Assets**:
   - Curated dataset of realistic clothing items spanning top categories (Oversized Cotton T-Shirts, Slim-fit Oxford Shirts, Relaxed Denim Jeans, Fleece Hoodies, Linen Trousers).
   - High-fidelity fashion product visuals generated for catalog fidelity.
3. **Frontend Components**:
   - **Navbar**: Wordmark, navigation tabs (Catalog, Alerts, Wishlist, Brand Matrix), live notification badge, and Auth user trigger.
   - **Catalog & Search Filter View**: Real-time debounce search, multi-select brand checkboxes, price sliders, category chips.
   - **Product Detail & Live Comparison Section**:
     - Main product display with fabric specs, rating, size selection.
     - **Directly below the product**: Complete comparison table detailing prices for Myntra, Ajio, Amazon, Flipkart, Tata CLiQ.
     - Calculated Best Deal callout badge with savings difference and valid promotional discount codes.
     - Working direct store buttons (`target="_blank"`).
   - **Price Alert Modal & Management Screen**: Set desired price, view active alerts, and single-click demo trigger to simulate an instant price drop.
   - **Wardrobe Wishlist**: Grid view of bookmarked items with live lowest-price monitoring and price delta indicators.
   - **Brand Tier Comparison Matrix**: Interactive table and visual cards comparing brands on price ranges, average pricing, and platform discounts.
   - **Authentication Modal / Module**: Clean student login/register modal with quick demo accounts ("Demo Shopper", "Admin").
4. **Verification & Polish**:
   - Run type checks and compilation check (`compile_applet`).
   - Validate responsive layouts and ensure no broken links or missing handlers.
