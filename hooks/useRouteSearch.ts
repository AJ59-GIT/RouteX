
import { useState, useCallback } from 'react';
import { RouteRequest, TravelOption } from '../types';
import { getSmartRoutes, TransitAPIError } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { offlineService } from '../services/offlineService';

export const useRouteSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'offline' } | null>(null);

  const search = useCallback(async (req: RouteRequest): Promise<TravelOption[]> => {
    setLoading(true);
    setError(null);
    analyticsService.trackRouteSearch(req.source, req.destination, req.city);

    const cacheKey = `routes_${req.city}_${req.source}_${req.destination}`.replace(/\s/g, '').toLowerCase();
    const cached = storageService.get<TravelOption[]>(cacheKey);

    if (!offlineService.isOnline()) {
      const offlineRoutes = offlineService.getCachedRoutes();
      const matched = offlineRoutes.filter(r => 
        r.title.toLowerCase().includes(req.source.toLowerCase()) || 
        r.title.toLowerCase().includes(req.destination.toLowerCase())
      );
      
      setError({ message: "You are offline. Showing routes cached on this device.", type: 'offline' });
      setLoading(false);
      return matched.length > 0 ? matched : cached || [];
    }

    try {
      const routes = await getSmartRoutes(req);
      if (routes.length > 0) {
        storageService.set(cacheKey, routes, 1000 * 60 * 15); // Cache for 15 mins
        // Also add to global offline cache
        routes.slice(0, 1).forEach(r => offlineService.cacheRouteForOffline(r));
      }
      return routes;
    } catch (err) {
      if (cached) {
        setError({ message: "Network slow. Showing recently cached results.", type: 'warning' });
        return cached;
      }
      const msg = err instanceof TransitAPIError ? err.message : "Failed to compute paths.";
      setError({ message: msg, type: 'error' });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { search, loading, error };
};
