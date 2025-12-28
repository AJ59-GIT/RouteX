
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  UserProfile, 
  TravelOption, 
  Booking, 
  FavoriteRoute, 
  Notification, 
  Transaction, 
  RouteRequest, 
  Preference,
  CommunityReport,
  CarpoolRide,
  TransportMode,
  Language,
  UserRole
} from '../types';
import { securityService } from '../services/securityService';
import { storageService } from '../services/storageService';

interface GlobalContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  options: TravelOption[];
  setOptions: React.Dispatch<React.SetStateAction<TravelOption[]>>;
  communityReports: CommunityReport[];
  carpoolRides: CarpoolRide[];
  isInstallable: boolean;
  isSyncing: boolean;
  updateSetting: (key: keyof UserProfile['settings'], value: any) => void;
  setRole: (role: UserRole) => void;
  addBooking: (booking: Booking, carbonSaved: number) => void;
  toggleFavorite: (route: Partial<FavoriteRoute>, searchParams: RouteRequest | null) => void;
  clearNotifications: () => void;
  markNotificationRead: (id: string) => void;
  addReport: (report: Partial<CommunityReport>) => void;
  upvoteReport: (id: string) => void;
  exportData: () => void;
  deleteAccount: () => void;
  triggerCloudSync: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  id: 'user_123',
  name: 'Rohan Sharma',
  email: 'rohan.s@example.in',
  photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
  isAuthenticated: true,
  role: 'customer',
  savedLocations: [
    { id: '1', label: 'Home', address: 'Indiranagar, 12th Main, Bengaluru', type: 'home' },
    { id: '2', label: 'Work', address: 'Embassy GolfLinks Park, Domlur', type: 'work' }
  ],
  safetyContacts: [
    { id: 'sc1', name: 'Emergency (Police)', phone: '100' },
    { id: 'sc2', name: 'Family (Mom)', phone: '+91 98XXX XXXXX' }
  ],
  favoriteRoutes: [],
  recentSearches: [],
  preferredPayment: 'UPI',
  bookingHistory: [],
  totalCarbonSaved: 42.8,
  currentStreak: 5,
  lastActiveDate: new Date().toISOString(),
  walletBalance: 2450,
  transactionHistory: [],
  notifications: [],
  badges: [],
  settings: {
    notificationsEnabled: true,
    locationEnabled: true,
    autoBookCommute: false,
    darkMode: true,
    highContrastMode: false,
    voiceAssistanceEnabled: false,
    fontSize: 'normal',
    hapticFeedback: true,
    biometricsEnabled: true,
    language: 'en',
    isCorporateAccount: false,
    autoExpenseReporting: false,
  },
  referralCode: 'OMNI-ROHAN-2024',
  friends: []
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = storageService.get<UserProfile>('profile');
      return saved ? saved : INITIAL_PROFILE;
    } catch (e) {
      return INITIAL_PROFILE;
    }
  });
  
  const [options, setOptions] = useState<TravelOption[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);
  const [carpoolRides, setCarpoolRides] = useState<CarpoolRide[]>([]);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    storageService.set('profile', profile);
    document.documentElement.classList.toggle('dark', profile.settings.darkMode);
    document.documentElement.classList.toggle('high-contrast', profile.settings.highContrastMode);
  }, [profile]);

  const triggerCloudSync = useCallback(async () => {
    setIsSyncing(true);
    await storageService.syncFromCloud(profile.id);
    setIsSyncing(false);
  }, [profile.id]);

  const updateSetting = useCallback((key: keyof UserProfile['settings'], value: any) => {
    setProfile(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setProfile(prev => ({ ...prev, role }));
  }, []);

  const addBooking = useCallback((booking: Booking, carbonSaved: number) => {
    setProfile(prev => ({
      ...prev,
      bookingHistory: [booking, ...prev.bookingHistory],
      totalCarbonSaved: prev.totalCarbonSaved + carbonSaved,
      walletBalance: prev.walletBalance - booking.totalCost
    }));
  }, []);

  const exportData = () => securityService.exportUserData(profile);

  const deleteAccount = () => {
    if (confirm("Are you sure? This will delete all your data and travel history.")) {
      storageService.clear();
      window.location.reload();
    }
  };

  const value = useMemo(() => ({
    profile, setProfile, options, setOptions, communityReports, carpoolRides, isInstallable, isSyncing,
    updateSetting, setRole, addBooking, toggleFavorite: () => {}, clearNotifications: () => {}, 
    markNotificationRead: () => {}, addReport: () => {}, upvoteReport: () => {},
    exportData, deleteAccount, triggerCloudSync
  }), [profile, options, communityReports, carpoolRides, isInstallable, isSyncing, updateSetting, setRole, addBooking, triggerCloudSync]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalProvider');
  return context;
};
