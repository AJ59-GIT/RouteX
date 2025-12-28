
import { Booking, TravelOption } from '../types';
import { storageService } from './storageService';

const QUEUE_KEY = 'pending_bookings';
const ROUTE_CACHE_KEY = 'offline_routes';

export const offlineService = {
  isOnline: (): boolean => navigator.onLine,

  queueBooking: (booking: Booking) => {
    const queue = storageService.get<Booking[]>(QUEUE_KEY) || [];
    storageService.set(QUEUE_KEY, [...queue, { ...booking, status: 'pending' }]);
    
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        // @ts-ignore
        registration.sync.register('sync-bookings');
      });
    }
  },

  getPendingBookings: (): Booking[] => {
    return storageService.get<Booking[]>(QUEUE_KEY) || [];
  },

  clearQueue: () => {
    storageService.remove(QUEUE_KEY);
  },

  cacheRouteForOffline: (route: TravelOption) => {
    const cached = storageService.get<TravelOption[]>(ROUTE_CACHE_KEY) || [];
    // Keep last 10 routes offline
    const updated = [route, ...cached.filter(r => r.id !== route.id)].slice(0, 10);
    storageService.set(ROUTE_CACHE_KEY, updated);
  },

  getCachedRoutes: (): TravelOption[] => {
    return storageService.get<TravelOption[]>(ROUTE_CACHE_KEY) || [];
  },

  getSMSBookingURI: (booking: Booking): string => {
    const body = `OmniRoute Booking Request:\nID: ${booking.id}\nRoute: ${booking.routeTitle}\nTotal: ₹${booking.totalCost}\nStatus: URGENT`;
    return `sms:+919999999999?body=${encodeURIComponent(body)}`;
  }
};
