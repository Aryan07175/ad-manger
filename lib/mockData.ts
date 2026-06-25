// ─── Overview ───────────────────────────────────────────────────────────────
export const overviewStats = {
  totalApps: 10,
  totalRevenue: 28453200,
  revenueGrowth: 12.4,
  dau: 3200000,
  mau: 8400000,
  adFillRate: 94.2,
  crashRate: 0.82,
  averageRating: 4.6,
  retention: { day1: 42, day7: 21, day30: 8 },
};

// ─── Apps ───────────────────────────────────────────────────────────────────
export const appsData = [
  { id: "1", name: "Food Delivery App", category: "Food & Drink", platform: "Both", downloads: 1250000, activeUsers: 450000, revenue: 12400000, adRevenue: 4500000, subscriptions: 7900000, rating: 4.7, status: "Active", lastUpdated: "2d ago", healthScore: 98 },
  { id: "2", name: "Finance Tracker", category: "Finance", platform: "iOS", downloads: 850000, activeUsers: 320000, revenue: 21000000, adRevenue: 1000000, subscriptions: 20000000, rating: 4.9, status: "Active", lastUpdated: "5d ago", healthScore: 95 },
  { id: "3", name: "Music Streaming", category: "Entertainment", platform: "Both", downloads: 5400000, activeUsers: 2100000, revenue: 84000000, adRevenue: 34000000, subscriptions: 50000000, rating: 4.5, status: "Warning", lastUpdated: "1w ago", healthScore: 72 },
  { id: "4", name: "Shopping App", category: "Shopping", platform: "Android", downloads: 3200000, activeUsers: 950000, revenue: 45000000, adRevenue: 15000000, subscriptions: 0, rating: 4.2, status: "Active", lastUpdated: "3d ago", healthScore: 88 },
  { id: "5", name: "Gaming App", category: "Games", platform: "Both", downloads: 8900000, activeUsers: 3400000, revenue: 120000000, adRevenue: 95000000, subscriptions: 5000000, rating: 4.4, status: "Critical", lastUpdated: "2w ago", healthScore: 45 },
  { id: "6", name: "Fitness App", category: "Health & Fitness", platform: "iOS", downloads: 1500000, activeUsers: 600000, revenue: 32000000, adRevenue: 2000000, subscriptions: 30000000, rating: 4.8, status: "Active", lastUpdated: "1d ago", healthScore: 96 },
  { id: "7", name: "News App", category: "News", platform: "Both", downloads: 4100000, activeUsers: 1200000, revenue: 18000000, adRevenue: 15000000, subscriptions: 3000000, rating: 4.1, status: "Active", lastUpdated: "4h ago", healthScore: 91 },
  { id: "8", name: "Education App", category: "Education", platform: "Both", downloads: 2200000, activeUsers: 800000, revenue: 25000000, adRevenue: 5000000, subscriptions: 20000000, rating: 4.6, status: "Warning", lastUpdated: "1mo ago", healthScore: 68 },
  { id: "9", name: "Chat App", category: "Social", platform: "Both", downloads: 12500000, activeUsers: 6200000, revenue: 54000000, adRevenue: 49000000, subscriptions: 5000000, rating: 4.3, status: "Active", lastUpdated: "1d ago", healthScore: 89 },
  { id: "10", name: "Video Editor", category: "Photo & Video", platform: "Both", downloads: 3500000, activeUsers: 1100000, revenue: 42000000, adRevenue: 12000000, subscriptions: 30000000, rating: 4.7, status: "Active", lastUpdated: "1w ago", healthScore: 94 },
];

// ─── Revenue ─────────────────────────────────────────────────────────────────
export const revenueChartData = [
  { name: 'Jan', ads: 4000000, subscriptions: 2400000, iap: 2400000 },
  { name: 'Feb', ads: 3800000, subscriptions: 2600000, iap: 2100000 },
  { name: 'Mar', ads: 5200000, subscriptions: 3800000, iap: 2900000 },
  { name: 'Apr', ads: 4780000, subscriptions: 3908000, iap: 2200000 },
  { name: 'May', ads: 5890000, subscriptions: 4800000, iap: 2581000 },
  { name: 'Jun', ads: 6390000, subscriptions: 5200000, iap: 3100000 },
  { name: 'Jul', ads: 7490000, subscriptions: 5800000, iap: 2800000 },
];

export const dailyRevenueData = [
  { name: 'Mon', revenue: 920000 }, { name: 'Tue', revenue: 1050000 },
  { name: 'Wed', revenue: 980000 }, { name: 'Thu', revenue: 1120000 },
  { name: 'Fri', revenue: 1380000 }, { name: 'Sat', revenue: 1490000 },
  { name: 'Sun', revenue: 1210000 },
];

export const countryRevenueData = [
  { country: "India", code: "IN", revenue: 8200000, users: 1420000, growth: 18.4 },
  { country: "United States", code: "US", revenue: 6800000, users: 890000, growth: 8.1 },
  { country: "Indonesia", code: "ID", revenue: 3400000, users: 640000, growth: 22.3 },
  { country: "Brazil", code: "BR", revenue: 2900000, users: 520000, growth: 14.6 },
  { country: "Germany", code: "DE", revenue: 2100000, users: 310000, growth: 5.2 },
  { country: "United Kingdom", code: "GB", revenue: 1900000, users: 280000, growth: 3.7 },
  { country: "Japan", code: "JP", revenue: 1700000, users: 245000, growth: 6.9 },
  { country: "France", code: "FR", revenue: 1200000, users: 198000, growth: 2.1 },
];

export const platformRevenueData = [
  { name: 'Android', value: 62, revenue: 17640000, color: '#10b981' },
  { name: 'iOS', value: 33, revenue: 9390000, color: '#3b82f6' },
  { name: 'Web', value: 5, revenue: 1423000, color: '#8b5cf6' },
];

export const revenueSources = [
  { name: 'Ads', value: 45, color: '#8b5cf6' },
  { name: 'Subscriptions', value: 40, color: '#3b82f6' },
  { name: 'In-App Purchases', value: 10, color: '#10b981' },
  { name: 'Affiliate', value: 5, color: '#f59e0b' },
];

export const revenueSourceBreakdown = [
  { name: 'Ads', revenue: 12803940, growth: 8.2, color: '#8b5cf6' },
  { name: 'Subscriptions', revenue: 11381280, growth: 15.4, color: '#3b82f6' },
  { name: 'In-App Purchases', revenue: 2845320, growth: -3.1, color: '#10b981' },
  { name: 'Affiliate', revenue: 1422660, growth: 21.8, color: '#f59e0b' },
];

export const platformRevenue = [
  { name: 'iOS', value: 55, color: '#3b82f6' },
  { name: 'Android', value: 40, color: '#10b981' },
  { name: 'Web', value: 5, color: '#6366f1' },
];

export const forecastData = [
  { name: 'Aug', actual: null, forecast: 31200000 },
  { name: 'Sep', actual: null, forecast: 33400000 },
  { name: 'Oct', actual: null, forecast: 35100000 },
  { name: 'Nov', actual: null, forecast: 38600000 },
  { name: 'Dec', actual: null, forecast: 42000000 },
];

// ─── Analytics ───────────────────────────────────────────────────────────────
export const dauTrendData = [
  { name: 'Jun 1', dau: 2900000, wau: 7200000, mau: 7900000 },
  { name: 'Jun 5', dau: 3050000, wau: 7400000, mau: 8000000 },
  { name: 'Jun 10', dau: 2980000, wau: 7300000, mau: 8050000 },
  { name: 'Jun 15', dau: 3120000, wau: 7600000, mau: 8150000 },
  { name: 'Jun 20', dau: 3200000, wau: 7800000, mau: 8300000 },
  { name: 'Jun 25', dau: 3350000, wau: 8000000, mau: 8400000 },
];

export const retentionData = [
  { day: 'Day 1', rate: 42 },
  { day: 'Day 7', rate: 21 },
  { day: 'Day 14', rate: 14 },
  { day: 'Day 30', rate: 8 },
  { day: 'Day 60', rate: 5 },
  { day: 'Day 90', rate: 3 },
];

export const sessionDurationData = [
  { name: '< 1 min', users: 12 },
  { name: '1-3 min', users: 28 },
  { name: '3-5 min', users: 35 },
  { name: '5-10 min', users: 18 },
  { name: '10+ min', users: 7 },
];

export const topScreensData = [
  { screen: 'Home Feed', views: 12400000, avgTime: '2m 34s', bounceRate: 18 },
  { screen: 'Product Detail', views: 8900000, avgTime: '1m 52s', bounceRate: 32 },
  { screen: 'Search Results', views: 7200000, avgTime: '1m 15s', bounceRate: 41 },
  { screen: 'User Profile', views: 5100000, avgTime: '3m 10s', bounceRate: 12 },
  { screen: 'Checkout', views: 3800000, avgTime: '4m 20s', bounceRate: 56 },
  { screen: 'Settings', views: 2100000, avgTime: '0m 48s', bounceRate: 22 },
  { screen: 'Notifications', views: 1900000, avgTime: '1m 05s', bounceRate: 28 },
];

export const funnelData = [
  { name: 'App Open', users: 3200000 },
  { name: 'Home View', users: 2900000 },
  { name: 'Product View', users: 1800000 },
  { name: 'Add to Cart', users: 920000 },
  { name: 'Checkout', users: 380000 },
  { name: 'Purchase', users: 210000 },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const userGrowthData = [
  { name: 'Jan', newUsers: 420000, returningUsers: 1200000 },
  { name: 'Feb', newUsers: 380000, returningUsers: 1350000 },
  { name: 'Mar', newUsers: 510000, returningUsers: 1480000 },
  { name: 'Apr', newUsers: 490000, returningUsers: 1620000 },
  { name: 'May', newUsers: 560000, returningUsers: 1720000 },
  { name: 'Jun', newUsers: 610000, returningUsers: 1810000 },
  { name: 'Jul', newUsers: 680000, returningUsers: 1940000 },
];

export const countryUsersData = [
  { country: "India", users: 1420000, pct: 44.4 },
  { country: "United States", users: 534000, pct: 16.7 },
  { country: "Indonesia", users: 288000, pct: 9.0 },
  { country: "Brazil", users: 224000, pct: 7.0 },
  { country: "Germany", users: 128000, pct: 4.0 },
  { country: "Others", users: 606000, pct: 18.9 },
];

export const genderData = [
  { name: 'Male', value: 58, color: '#3b82f6' },
  { name: 'Female', value: 38, color: '#ec4899' },
  { name: 'Other', value: 4, color: '#8b5cf6' },
];

export const ageData = [
  { name: '13–17', value: 6, color: '#f59e0b' },
  { name: '18–24', value: 28, color: '#8b5cf6' },
  { name: '25–34', value: 35, color: '#3b82f6' },
  { name: '35–44', value: 19, color: '#10b981' },
  { name: '45–54', value: 8, color: '#6366f1' },
  { name: '55+',   value: 4, color: '#ec4899' },
];

export const deviceData = [
  { name: 'Android', value: 62, color: '#10b981' },
  { name: 'iPhone', value: 31, color: '#3b82f6' },
  { name: 'iPad', value: 4, color: '#8b5cf6' },
  { name: 'Web', value: 3, color: '#f59e0b' },
];

export const trafficSourceData = [
  { name: 'Organic', value: 48, users: 1536000, color: '#10b981' },
  { name: 'Paid', value: 22, users: 704000, color: '#8b5cf6' },
  { name: 'Social', value: 16, users: 512000, color: '#3b82f6' },
  { name: 'Referral', value: 9, users: 288000, color: '#f59e0b' },
  { name: 'Direct', value: 5, users: 160000, color: '#ec4899' },
];

export const topPhoneModels = [
  { model: 'Samsung Galaxy S24', users: 284000, pct: 8.9 },
  { model: 'iPhone 15 Pro', users: 212000, pct: 6.6 },
  { model: 'Xiaomi Redmi 12', users: 198000, pct: 6.2 },
  { model: 'OnePlus 12', users: 156000, pct: 4.9 },
  { model: 'iPhone 14', users: 148000, pct: 4.6 },
  { model: 'Vivo V29', users: 124000, pct: 3.9 },
  { model: 'Oppo Reno 11', users: 112000, pct: 3.5 },
];

// ─── Ads ─────────────────────────────────────────────────────────────────────
export const adPerformanceData = {
  banner: { revenue: 14500000, ecpm: 85, ctr: 0.12, fillRate: 98, impressions: 170588235, requests: 174067586 },
  interstitial: { revenue: 42000000, ecpm: 850, ctr: 4.2, fillRate: 85, impressions: 49411765, requests: 58131488 },
  rewarded: { revenue: 58000000, ecpm: 1420, ctr: 12.5, fillRate: 72, impressions: 40845070, requests: 56729264 },
  native: { revenue: 21000000, ecpm: 210, ctr: 1.1, fillRate: 94, impressions: 100000000, requests: 106382979 },
  video: { revenue: 32000000, ecpm: 980, ctr: 6.8, fillRate: 78, impressions: 32653061, requests: 41862899 },
};

export const adNetworkData = [
  { network: 'AdMob', revenue: 82000000, fillRate: 96, ecpm: 620, impressions: 132000000, status: 'Active' },
  { network: 'AppLovin', revenue: 41000000, fillRate: 88, ecpm: 580, impressions: 70600000, status: 'Active' },
  { network: 'Meta AN', revenue: 25000000, fillRate: 79, ecpm: 440, impressions: 56800000, status: 'Active' },
  { network: 'Unity Ads', revenue: 14000000, fillRate: 72, ecpm: 380, impressions: 36800000, status: 'Warning' },
  { network: 'IronSource', revenue: 5500000, fillRate: 61, ecpm: 290, impressions: 18900000, status: 'Warning' },
];

export const ecpmTrendData = [
  { name: 'Jun 1', banner: 72, interstitial: 810, rewarded: 1320 },
  { name: 'Jun 5', banner: 78, interstitial: 830, rewarded: 1360 },
  { name: 'Jun 10', banner: 81, interstitial: 840, rewarded: 1390 },
  { name: 'Jun 15', banner: 79, interstitial: 855, rewarded: 1410 },
  { name: 'Jun 20', banner: 83, interstitial: 845, rewarded: 1400 },
  { name: 'Jun 25', banner: 85, interstitial: 850, rewarded: 1420 },
];

export const topAdUnits = [
  { unit: 'Rewarded – Gaming App', type: 'Rewarded', revenue: 28000000, ecpm: 1820, fillRate: 91 },
  { unit: 'Interstitial – Music App', type: 'Interstitial', revenue: 18000000, ecpm: 1240, fillRate: 87 },
  { unit: 'Rewarded – Chat App', type: 'Rewarded', revenue: 12000000, ecpm: 1420, fillRate: 88 },
  { unit: 'Native – News App', type: 'Native', revenue: 9800000, ecpm: 490, fillRate: 96 },
  { unit: 'Interstitial – Shopping', type: 'Interstitial', revenue: 8200000, ecpm: 920, fillRate: 83 },
];

export const worstAdUnits = [
  { unit: 'Banner – Education App', type: 'Banner', revenue: 820000, ecpm: 42, fillRate: 54 },
  { unit: 'Banner – Fitness App', type: 'Banner', revenue: 1100000, ecpm: 51, fillRate: 61 },
  { unit: 'Interstitial – Education', type: 'Interstitial', revenue: 1400000, ecpm: 310, fillRate: 68 },
  { unit: 'Native – Chat App', type: 'Native', revenue: 1900000, ecpm: 98, fillRate: 71 },
];

// ─── Ratings & Reviews ───────────────────────────────────────────────────────
export const ratingsOverview = {
  average: 4.6,
  total: 284500,
  positive: 82,
  negative: 11,
  neutral: 7,
  responseRate: 68,
  distribution: [
    { stars: 5, count: 162165, pct: 57 },
    { stars: 4, count: 71125, pct: 25 },
    { stars: 3, count: 28450, pct: 10 },
    { stars: 2, count: 11380, pct: 4 },
    { stars: 1, count: 11380, pct: 4 },
  ],
};

export const ratingTrendData = [
  { name: 'Jan', rating: 4.4, reviews: 18200 },
  { name: 'Feb', rating: 4.3, reviews: 16800 },
  { name: 'Mar', rating: 4.5, reviews: 22100 },
  { name: 'Apr', rating: 4.6, reviews: 24500 },
  { name: 'May', rating: 4.5, reviews: 28900 },
  { name: 'Jun', rating: 4.6, reviews: 32100 },
  { name: 'Jul', rating: 4.7, reviews: 35400 },
];

export const topComplaints = [
  { complaint: 'Too many ads', count: 12400, pct: 28, trend: 'up' },
  { complaint: 'App crashes frequently', count: 9800, pct: 22, trend: 'down' },
  { complaint: 'Slow loading time', count: 7200, pct: 16, trend: 'stable' },
  { complaint: 'Payment failure', count: 5400, pct: 12, trend: 'up' },
  { complaint: 'Login issues', count: 4100, pct: 9, trend: 'down' },
  { complaint: 'Battery drain', count: 3200, pct: 7, trend: 'stable' },
  { complaint: 'UI is confusing', count: 2700, pct: 6, trend: 'down' },
];

export const recentReviews = [
  { id: 1, app: 'Gaming App', user: 'Rahul M.', rating: 5, date: '2h ago', text: 'Best gaming experience! Runs super smooth, love the new update.', sentiment: 'positive' },
  { id: 2, app: 'Music Streaming', user: 'Priya S.', rating: 2, date: '4h ago', text: 'Too many ads! They appear every 2 minutes. Very annoying.', sentiment: 'negative' },
  { id: 3, app: 'Finance Tracker', user: 'Amit K.', rating: 5, date: '6h ago', text: 'The best finance app I have used. Simple, clean, and accurate.', sentiment: 'positive' },
  { id: 4, app: 'Shopping App', user: 'Sneha R.', rating: 3, date: '8h ago', text: 'Good app but checkout crashes sometimes. Please fix this.', sentiment: 'neutral' },
  { id: 5, app: 'Education App', user: 'Vijay P.', rating: 1, date: '10h ago', text: 'App crashes every time I try to take a quiz. Totally unusable.', sentiment: 'negative' },
  { id: 6, app: 'Fitness App', user: 'Meera J.', rating: 5, date: '12h ago', text: 'Love the new workout plans! Helped me lose 5kg in a month.', sentiment: 'positive' },
  { id: 7, app: 'Chat App', user: 'Dev L.', rating: 4, date: '1d ago', text: 'Great for daily use. Would love dark mode improvements.', sentiment: 'positive' },
  { id: 8, app: 'News App', user: 'Aisha T.', rating: 3, date: '1d ago', text: 'Content is good but takes too long to load on my phone.', sentiment: 'neutral' },
];

export const aiReviewSummary = {
  topIssues: ['Excessive ad frequency', 'Crash on checkout flow', 'Slow startup on mid-range devices', 'Login API timeouts'],
  suggestions: ['Implement ad frequency capping (max 3/hr)', 'Fix checkout null pointer exception in v2.4.1', 'Lazy-load home feed assets', 'Add OAuth fallback for login'],
};

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const alertsData = [
  { id: 1, type: "critical", message: "Revenue dropped by 22% in Gaming App", time: "10 mins ago", metric: "Revenue" },
  { id: 2, type: "warning", message: "Crash rate exceeded 1.5% in Music Streaming", time: "1 hour ago", metric: "Crash Rate" },
  { id: 3, type: "info", message: "Education App rating dropped below 4★", time: "3 hours ago", metric: "Rating" },
  { id: 4, type: "warning", message: "AdMob fill rate below 80% in APAC region", time: "5 hours ago", metric: "Fill Rate" },
  { id: 5, type: "critical", message: "Payment gateway failure spike detected", time: "1 day ago", metric: "Revenue" },
];

// ─── AI Insights ─────────────────────────────────────────────────────────────
export const aiInsightsData = [
  {
    id: 1,
    title: "Revenue dropped 18% in the last 7 days.",
    reason: "Banner fill rate dropped from 94% to 71% on Android devices in the US.",
    recommendation: "Switch low-performing network to AdMob or AppLovin immediately.",
    impact: "High",
    actionText: "Review Mediation",
    actionUrl: "/ads",
    possibleReasons: ['Lower Ad Fill Rate', 'Ad Network Outage', 'Competitor Campaign'],
  },
  {
    id: 2,
    title: "Daily Active Users dropped by 23% for Gaming App.",
    reason: "Latest update v2.4.1 introduced a memory leak causing ANRs on low-end devices.",
    recommendation: "Rollback to v2.4.0 or release hotfix prioritizing memory optimization.",
    impact: "Critical",
    actionText: "View Crash Logs",
    actionUrl: "/analytics",
    possibleReasons: ['Negative reviews increased', 'App crashes on launch', 'Login issues in v2.4.1', 'Long loading time', 'Play Store rating dropped'],
  },
  {
    id: 3,
    title: "Subscription cancellations increased by 12%.",
    reason: "Recent price increase correlated with a 15% increase in churn for Day-30 users.",
    recommendation: "Offer a 20% promotional discount for users attempting to cancel.",
    impact: "Medium",
    actionText: "Setup Promo",
    actionUrl: "/revenue",
    possibleReasons: ['Recent price increase', 'Better free tier from competitor', 'Reduced perceived value'],
  }
];
