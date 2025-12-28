
export enum TransportMode {
  WALK = 'WALK',
  METRO = 'METRO',
  BUS = 'BUS',
  AUTO = 'AUTO',
  CAB = 'CAB',
  BIKE = 'BIKE',
  LOCAL_TRAIN = 'LOCAL_TRAIN',
  CARPOOL = 'CARPOOL'
}

export enum Preference {
  CHEAPEST = 'CHEAPEST',
  FASTEST = 'FASTEST',
  ECO_FRIENDLY = 'ECO_FRIENDLY',
  COMFORTABLE = 'COMFORTABLE'
}

export type Language = 'en' | 'hi' | 'kn' | 'ta';
export type UserRole = 'customer' | 'admin';

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PriceBreakdown {
  base: number;
  tax: number;
  toll?: number;
  surgeMultiplier?: number;
}

export interface RouteLeg {
  mode: TransportMode;
  provider?: string;
  duration: number;
  distance: number;
  cost: number;
  instructions: string;
  delayMinutes?: number;
  isSurgePricing?: boolean;
  deepLink?: string;
  isRideShare?: boolean;
  path?: Coordinate[];
  crowdLevel?: 'Quiet' | 'Busy' | 'Crowded' | 'Standing Room Only';
  priceBreakdown?: PriceBreakdown;
}

export interface WeatherInfo {
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Humid';
  temp: number;
  alert?: string;
}

export interface RouteInsight {
  type: 'price' | 'crowd' | 'weather' | 'time';
  message: string;
  trend: 'up' | 'down' | 'stable';
  value?: string;
}

export interface TravelOption {
  id: string;
  title: string;
  totalDuration: number;
  totalCost: number;
  totalDistance: number;
  carbonFootprint: number;
  score: number;
  legs: RouteLeg[];
  tags: string[];
  weather?: WeatherInfo;
  isWheelchairFriendly: boolean;
  trafficStatus: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  insights?: RouteInsight[];
  bestTimeToLeave?: string;
}

export interface RouteRequest {
  source: string;
  destination: string;
  preference: Preference;
  city: string;
  groupSize: number;
  requireAccessibility: boolean;
  departureTime?: string;
  isScheduled?: boolean;
  naturalQuery?: string;
  isBusinessTrip?: boolean;
}

export interface SafetyContact {
  id: string;
  name: string;
  phone: string;
}

export interface SavedLocation {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'custom';
}

export interface FavoriteRoute {
  id: string;
  title: string;
  source: string;
  destination: string;
  city: string;
  preference: Preference;
  frequency?: number;
}

export interface Booking {
  id: string;
  date: string;
  routeTitle: string;
  totalCost: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  ticketQrData?: string;
  legs: RouteLeg[];
  carbonSaved?: number;
  isSplitPayment?: boolean;
  splitWith?: string[];
  isBusiness?: boolean;
  expenseCategory?: string;
}

export interface Notification {
  id: string;
  type: 'delay' | 'price_drop' | 'reminder' | 'offer' | 'community';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  method: string;
  description: string;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface CommunityReport {
  id: string;
  userName: string;
  mode: TransportMode;
  location: string;
  issue: string;
  timestamp: string;
  upvotes: number;
}

export interface CarpoolRide {
  id: string;
  driverName: string;
  source: string;
  destination: string;
  departureTime: string;
  seatsAvailable: number;
  cost: number;
  rating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo?: string;
  isAuthenticated: boolean;
  role: UserRole;
  savedLocations: SavedLocation[];
  safetyContacts: SafetyContact[];
  favoriteRoutes: FavoriteRoute[];
  recentSearches: string[];
  preferredPayment: string;
  bookingHistory: Booking[];
  totalCarbonSaved: number;
  currentStreak: number;
  lastActiveDate: string;
  badges: Badge[];
  walletBalance: number;
  transactionHistory: Transaction[];
  notifications: Notification[];
  settings: {
    notificationsEnabled: boolean;
    locationEnabled: boolean;
    autoBookCommute: boolean;
    darkMode: boolean;
    highContrastMode: boolean;
    voiceAssistanceEnabled: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
    hapticFeedback: boolean;
    biometricsEnabled: boolean;
    language: Language;
    isCorporateAccount: boolean;
    autoExpenseReporting: boolean;
  };
  referralCode: string;
  friends: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  carbonSaved: number;
  isUser?: boolean;
}
