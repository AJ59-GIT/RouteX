
import React from 'react';
import { Footprints, TrainFront, Bus, Car, Bike, Train, HelpCircle, Sun, CloudRain, Cloud, Thermometer, LucideIcon, Users } from 'lucide-react';
import { TransportMode } from './types';

export const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune'] as const;

export interface ModeUIConfig {
  color: string;
  icon: LucideIcon;
  darkColor: string;
}

/**
 * Mapping of transport modes using the warm palette.
 * Primary: Slate Gray, Accent: Coral
 */
export const MODE_CONFIG: Record<TransportMode | 'UNKNOWN', ModeUIConfig> = {
  [TransportMode.WALK]: { color: 'bg-slate-100 text-slate-600', darkColor: 'dark:bg-slate-800 dark:text-slate-400', icon: Footprints },
  [TransportMode.METRO]: { color: 'bg-orange-50 text-orange-600', darkColor: 'dark:bg-orange-900/40 dark:text-orange-400', icon: TrainFront },
  [TransportMode.BUS]: { color: 'bg-orange-100 text-orange-700', darkColor: 'dark:bg-orange-950/50 dark:text-orange-300', icon: Bus },
  [TransportMode.AUTO]: { color: 'bg-amber-100 text-amber-700', darkColor: 'dark:bg-amber-900/40 dark:text-amber-400', icon: Car },
  [TransportMode.CAB]: { color: 'bg-[#334155] text-white', darkColor: 'dark:bg-[#FFFBEB] dark:text-[#334155]', icon: Car },
  [TransportMode.BIKE]: { color: 'bg-amber-50 text-amber-600', darkColor: 'dark:bg-amber-900/20 dark:text-amber-300', icon: Bike },
  [TransportMode.LOCAL_TRAIN]: { color: 'bg-orange-50 text-orange-800', darkColor: 'dark:bg-orange-900/60 dark:text-orange-200', icon: Train },
  [TransportMode.CARPOOL]: { color: 'bg-orange-100 text-orange-600', darkColor: 'dark:bg-orange-900/30 dark:text-orange-400', icon: Users },
  UNKNOWN: { color: 'bg-slate-100 text-slate-400', darkColor: 'dark:bg-slate-800 dark:text-slate-500', icon: HelpCircle }
};

export const getModeConfig = (mode?: TransportMode | string): ModeUIConfig => {
  if (!mode) return MODE_CONFIG.UNKNOWN;
  const upperMode = mode.toUpperCase() as TransportMode;
  return MODE_CONFIG[upperMode] || MODE_CONFIG.UNKNOWN;
};

export const WEATHER_ICONS: Record<string, LucideIcon> = {
  Sunny: Sun,
  Rainy: CloudRain,
  Cloudy: Cloud,
  Humid: Thermometer
};
