
export type TrafficDensity = 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';

export interface TrafficZone {
  id: string;
  name: string;
  density: TrafficDensity;
  score: number; // 0 to 100
  trend: 'improving' | 'worsening' | 'stable';
}

/**
 * Simulates a real-time traffic data provider (e.g. Google Maps/TomTom API).
 */
export const trafficService = {
  getCityTrafficData: async (city: string): Promise<TrafficZone[]> => {
    // Simulate API latency
    await new Promise(r => setTimeout(r, 600));
    
    const zones = ['Central Business District', 'Airport Road', 'Suburban North', 'Tech Corridor', 'Old City'];
    const densities: TrafficDensity[] = ['Low', 'Moderate', 'Heavy', 'Gridlock'];
    const trends: TrafficZone['trend'][] = ['improving', 'worsening', 'stable'];

    return zones.map(zone => ({
      id: Math.random().toString(36).substr(2, 9),
      name: zone,
      density: densities[Math.floor(Math.random() * densities.length)],
      score: Math.floor(Math.random() * 100),
      trend: trends[Math.floor(Math.random() * trends.length)]
    }));
  },

  getDensityColor: (density: TrafficDensity): string => {
    switch (density) {
      case 'Low': return '#fde047'; // Yellow (Light)
      case 'Moderate': return '#fb923c'; // Orange/Amber (Moderate)
      case 'Heavy': return '#ef4444'; // Red (Heavy)
      case 'Gridlock': return '#991b1b'; // Deep Red (Gridlock)
      default: return '#334155'; // Dark Gray (Clear)
    }
  }
};
