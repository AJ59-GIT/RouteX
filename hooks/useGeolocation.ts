
import { useState, useCallback } from 'react';
import { Coordinate } from '../types';
import { locationService, LocationError } from '../services/locationService';

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosition = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await locationService.getCurrentPosition();
      setCoords(pos);
      return pos;
    } catch (err) {
      const msg = err instanceof LocationError ? err.message : "Failed to get location";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { coords, loading, error, getPosition };
};
