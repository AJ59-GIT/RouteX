
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TravelOption, TransportMode, Coordinate } from '../types';
import { Navigation, Info, LocateFixed, WifiOff, Circle, Activity, ShieldCheck, Zap, Layers, Map as MapIcon } from 'lucide-react';
import { getModeConfig } from '../constants';
import { offlineService } from '../services/offlineService';
import { useGeolocation } from '../hooks/useGeolocation';
import { trafficService, TrafficZone } from '../services/trafficService';

interface InteractiveMapProps {
  selectedOption: TravelOption | null;
  allOptions: TravelOption[];
  onStationSelect?: (name: string) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedOption, allOptions }) => {
  const [liveVehicles, setLiveVehicles] = useState<{ id: string; x: number; y: number; mode: TransportMode }[]>([]);
  const [isOnline, setIsOnline] = useState(offlineService.isOnline());
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [trafficZones, setTrafficZones] = useState<TrafficZone[]>([]);
  const { coords, getPosition, loading: geoLoading } = useGeolocation();
  
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleStatus = () => setIsOnline(offlineService.isOnline());
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    const refreshTraffic = async () => {
      if (offlineService.isOnline()) {
        const data = await trafficService.getCityTrafficData('current');
        setTrafficZones(data);
      }
    };

    refreshTraffic();
    const trafficInterval = setInterval(refreshTraffic, 30000);

    const vehicleInterval = setInterval(() => {
      if (offlineService.isOnline()) {
        setLiveVehicles(prev => prev.map(v => ({
          ...v,
          x: v.x + (Math.random() - 0.5) * 6,
          y: v.y + (Math.random() - 0.5) * 6
        })));
      }
    }, 2000);

    setLiveVehicles([
      { id: 'v1', x: 120, y: 150, mode: TransportMode.METRO },
      { id: 'v2', x: 250, y: 300, mode: TransportMode.BUS },
      { id: 'v3', x: 80, y: 400, mode: TransportMode.AUTO },
    ]);

    getPosition();

    return () => {
      clearInterval(vehicleInterval);
      clearInterval(trafficInterval);
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, [getPosition]);

  useEffect(() => {
    if (coords) {
      const mockCenter = { lat: 12.97, lng: 77.59 };
      const dx = (coords.lng - mockCenter.lng) * 5000;
      const dy = (coords.lat - mockCenter.lat) * 5000;
      setMapOffset({ x: dx, y: -dy });
    }
  }, [coords]);

  const userSvgPos = useMemo(() => ({
    x: 200 + mapOffset.x,
    y: 300 + mapOffset.y
  }), [mapOffset]);

  const trafficColors = useMemo(() => {
    if (!showTrafficLayer) return ['#334155', '#334155', '#334155', '#334155']; 
    return trafficZones.map(z => trafficService.getDensityColor(z.density));
  }, [trafficZones, showTrafficLayer]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-[#1a1f2e] rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl group transition-all duration-700">
      {/* Map Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* Realistic Street Map Layers */}
      <motion.svg 
        animate={{ x: -mapOffset.x * 0.15, y: -mapOffset.y * 0.15 }}
        className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-1000`} 
        viewBox="0 0 400 600"
      >
        {/* Urban Blocks / Buildings */}
        <g opacity="0.4">
          <rect x="20" y="20" width="60" height="120" rx="4" fill="#2d3748" />
          <rect x="100" y="40" width="100" height="100" rx="4" fill="#2d3748" />
          <rect x="220" y="10" width="80" height="140" rx="4" fill="#2d3748" />
          <rect x="320" y="30" width="60" height="110" rx="4" fill="#2d3748" />
          
          <rect x="20" y="220" width="120" height="120" rx="4" fill="#2d3748" />
          <rect x="160" y="220" width="120" height="120" rx="4" fill="#2d3748" />
          <rect x="300" y="220" width="80" height="120" rx="4" fill="#2d3748" />

          <rect x="20" y="420" width="60" height="160" rx="4" fill="#2d3748" />
          <rect x="100" y="450" width="140" height="130" rx="4" fill="#2d3748" />
          <rect x="260" y="420" width="120" height="160" rx="4" fill="#2d3748" />
        </g>

        {/* Major Road Base */}
        <path d="M50,0 L50,600" fill="none" stroke="#111827" strokeWidth="24" strokeLinecap="round" />
        <path d="M350,0 L350,600" fill="none" stroke="#111827" strokeWidth="24" strokeLinecap="round" />
        <path d="M0,180 L400,180" fill="none" stroke="#111827" strokeWidth="24" strokeLinecap="round" />
        <path d="M0,400 L400,400" fill="none" stroke="#111827" strokeWidth="24" strokeLinecap="round" />

        {/* Traffic Flow Layers */}
        <AnimatePresence>
          {showTrafficLayer && (
            <g opacity="0.8">
              {/* North-South Corridors */}
              <motion.path
                d="M50,0 L50,600"
                fill="none"
                stroke={trafficColors[0] || '#334155'}
                strokeWidth="8"
                strokeDasharray="10, 20"
                animate={{ strokeDashoffset: [0, -60] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
              <motion.path
                d="M350,0 L350,600"
                fill="none"
                stroke={trafficColors[1] || '#334155'}
                strokeWidth="8"
                strokeDasharray="10, 20"
                animate={{ strokeDashoffset: [0, 60] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              {/* East-West Corridors */}
              <motion.path
                d="M0,180 L400,180"
                fill="none"
                stroke={trafficColors[2] || '#334155'}
                strokeWidth="8"
                strokeDasharray="10, 20"
                animate={{ strokeDashoffset: [0, -60] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
              <motion.path
                d="M0,400 L400,400"
                fill="none"
                stroke={trafficColors[3] || '#334155'}
                strokeWidth="8"
                strokeDasharray="10, 20"
                animate={{ strokeDashoffset: [0, 60] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
            </g>
          )}
        </AnimatePresence>

        {/* Secondary Streets */}
        <path d="M50,100 L350,100" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="4,4" />
        <path d="M50,300 L350,300" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="4,4" />
        <path d="M50,500 L350,500" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="4,4" />
        <path d="M200,180 L200,400" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="4,4" />

        {/* Labels */}
        <text x="65" y="170" fill="#94a3b8" fontSize="8" fontWeight="bold" className="uppercase tracking-widest opacity-60">Westside Pkwy</text>
        <text x="210" y="390" fill="#94a3b8" fontSize="8" fontWeight="bold" className="uppercase tracking-widest opacity-60">Indiranagar Ext</text>
      </motion.svg>

      {/* Selected Route Path - High Visibility Neon */}
      <AnimatePresence>
        {selectedOption && (
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 400 600">
            <defs>
              <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              d="M 80 520 C 120 400, 280 400, 320 80"
              fill="none"
              stroke="#fb923c"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#neon-glow)"
              className="opacity-90"
            />
            
            <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="80" cy="520" r="12" fill="#ef4444" className="shadow-lg border-2 border-white" />
            <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="320" cy="80" r="12" fill="#fb923c" className="shadow-lg border-2 border-white" />
          </svg>
        )}
      </AnimatePresence>

      {/* User Location Marker - Pulsating Blue */}
      <AnimatePresence>
        {coords && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: userSvgPos.x,
              y: userSvgPos.y
            }}
            className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: 0, top: 0 }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-[3px] border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
              <div className="absolute inset-0 w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-60 scale-150"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Vehicle Markers - Dark Mode Themed */}
      {isOnline && liveVehicles.map(vehicle => {
        const config = getModeConfig(vehicle.mode);
        const Icon = config.icon;
        return (
          <motion.div
            key={`vehicle-${vehicle.id}`}
            animate={{ x: vehicle.x, y: vehicle.y }}
            className={`absolute z-20 p-2 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-slate-700 bg-[#1e293b] text-[#fb923c]`}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        );
      })}

      {/* UI Overlays */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3">
           <div className="pointer-events-auto bg-[#1a1f2e]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-2">
            {isOnline ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Traffic Feed</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Local Cache View</span>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTrafficLayer(!showTrafficLayer)}
              className={`pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest shadow-xl ${
                showTrafficLayer ? 'bg-[#fb923c] text-white border-[#fb923c]' : 'bg-[#1e293b] text-slate-400 border-slate-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {showTrafficLayer ? 'Traffic Active' : 'Traffic Hidden'}
            </button>
            <button className="pointer-events-auto p-2 bg-[#1e293b] border border-slate-700 rounded-xl text-slate-400 shadow-xl">
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => getPosition()}
          className={`pointer-events-auto w-12 h-12 bg-[#1a1f2e] dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl border border-slate-700 active:scale-90 transition-all hover:bg-slate-800 ${geoLoading ? 'animate-spin' : ''}`}
        >
          <LocateFixed className={`w-6 h-6 ${coords ? 'text-[#fb923c]' : 'text-slate-500'}`} />
        </button>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
        {selectedOption?.trafficStatus === 'Gridlock' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pointer-events-auto bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-500"
          >
            <Zap className="w-4 h-4 fill-current animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Traffic Alert</span>
              <span className="text-[9px] font-bold opacity-90">Severe congestion on primary route</span>
            </div>
          </motion.div>
        )}
        <div className="pointer-events-auto p-3 bg-[#1e293b]/90 backdrop-blur-sm rounded-2xl border border-slate-700 flex flex-col gap-1 items-end">
           <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-[#fde047]"></div>
             <div className="w-2 h-2 rounded-full bg-[#fb923c]"></div>
             <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
           </div>
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Flow Index</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
