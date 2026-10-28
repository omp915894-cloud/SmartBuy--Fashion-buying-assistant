export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getRetailerBrandInfo(retailerId: string) {
  switch (retailerId.toLowerCase()) {
    case 'myntra':
      return {
        name: 'Myntra',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeBg: 'bg-rose-600 text-white',
        accentColor: '#ff3f6c',
        tagline: "India's largest fashion portal"
      };
    case 'ajio':
      return {
        name: 'Ajio',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeBg: 'bg-amber-600 text-white',
        accentColor: '#2c4152',
        tagline: 'Doubt is out with Reliance Ajio'
      };
    case 'amazon':
      return {
        name: 'Amazon Fashion',
        bg: 'bg-sky-50 text-sky-800 border-sky-200',
        badgeBg: 'bg-sky-700 text-white',
        accentColor: '#ff9900',
        tagline: 'Amazon Prime 1-Day Delivery'
      };
    case 'flipkart':
      return {
        name: 'Flipkart',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        badgeBg: 'bg-blue-600 text-white',
        accentColor: '#2874f0',
        tagline: 'Flipkart Fashion & SuperCoins'
      };
    case 'tatacliq':
      return {
        name: 'Tata CLiQ',
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        badgeBg: 'bg-purple-700 text-white',
        accentColor: '#9c27b0',
        tagline: 'Tata CLiQ Authentic Luxury'
      };
    default:
      return {
        name: retailerId,
        bg: 'bg-slate-50 text-slate-800 border-slate-200',
        badgeBg: 'bg-slate-800 text-white',
        accentColor: '#334155',
        tagline: 'Online Fashion Retailer'
      };
  }
}
