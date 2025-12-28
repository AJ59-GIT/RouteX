
import { TransportMode } from '../types';

/**
 * Calculates carbon footprint based on transport mode and distance.
 * Based on average kg CO2 per km for Indian urban transport.
 */
export const calculateCarbonFootprint = (mode: TransportMode, distanceKm: number): number => {
  const emissionFactors: Record<TransportMode, number> = {
    [TransportMode.WALK]: 0,
    [TransportMode.BIKE]: 0.005, // Maintenance/production factor
    [TransportMode.METRO]: 0.015,
    [TransportMode.LOCAL_TRAIN]: 0.018,
    [TransportMode.BUS]: 0.035,
    [TransportMode.AUTO]: 0.075,
    [TransportMode.CAB]: 0.180,
    // Fix: Added missing CARPOOL emission factor to resolve Record type error
    [TransportMode.CARPOOL]: 0.045
  };
  return parseFloat((distanceKm * (emissionFactors[mode] || 0.1)).toFixed(2));
};

/**
 * Weights route options based on user preferences.
 */
export const calculateRouteScore = (
  timeMin: number, 
  costInr: number, 
  carbonKg: number,
  preference: 'FASTEST' | 'CHEAPEST' | 'ECO_FRIENDLY'
): number => {
  let score = 100;
  
  if (preference === 'FASTEST') score -= (timeMin * 0.5);
  else if (preference === 'CHEAPEST') score -= (costInr * 0.1);
  else if (preference === 'ECO_FRIENDLY') score -= (carbonKg * 10);
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Formats duration into human readable string.
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
