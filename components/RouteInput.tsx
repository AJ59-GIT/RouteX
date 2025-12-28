
import React, { memo, useState, useEffect } from 'react';
import { Preference, RouteRequest, SavedLocation } from '../types';
import { CITIES } from '../constants';
import { MapPin, Flag, Search, Wand2, AlertCircle, Calendar, Clock, ChevronDown } from 'lucide-react';
import { parseNaturalQuery } from '../services/geminiService';
import { useDebounce } from '../hooks/useDebounce';

interface RouteInputProps {
  onSearch: (req: RouteRequest) => void;
  onLocate: (target: 'source' | 'destination') => void;
  isLoading: boolean;
  isSticky?: boolean;
  savedLocations: SavedLocation[];
  recentSearches: string[];
}

const RouteInput: React.FC<RouteInputProps> = memo(({ 
  onSearch, 
  onLocate, 
  isLoading, 
  isSticky, 
  savedLocations,
  recentSearches 
}) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [city, setCity] = useState<string>(CITIES[0]);
  const [preference, setPreference] = useState<Preference>(Preference.FASTEST);
  const [groupSize, setGroupSize] = useState(1);
  const [requireAccessibility, setRequireAccessibility] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [naturalQuery, setNaturalQuery] = useState('');
  const [showMagic, setShowMagic] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const debouncedQuery = useDebounce(naturalQuery, 1000);

  useEffect(() => {
    if (isSticky) setIsExpanded(false);
    else setIsExpanded(true);
  }, [isSticky]);

  const sanitizeInput = (val: string) => val.trim().replace(/[<>]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const sSource = sanitizeInput(source);
    const sDest = sanitizeInput(destination);
    const sQuery = sanitizeInput(naturalQuery);

    if (showMagic) {
      if (!sQuery) {
        setValidationError('Please enter your travel request.');
        return;
      }
    } else {
      if (!sSource || !sDest) {
        setValidationError('Please enter both source and destination.');
        return;
      }
    }

    onSearch({ 
      source: sSource, 
      destination: sDest, 
      city, 
      preference, 
      groupSize, 
      requireAccessibility, 
      naturalQuery: showMagic ? sQuery : undefined,
      isScheduled,
      departureTime: isScheduled ? scheduledTime : undefined
    });
    
    if (isSticky) setIsExpanded(false);
  };

  const handleMagicParse = async () => {
    const sQuery = sanitizeInput(naturalQuery);
    if (!sQuery) {
      setValidationError('Enter text for Magic parse.');
      return;
    }
    
    try {
      const parsed = await parseNaturalQuery(sQuery);
      if (parsed.source) setSource(parsed.source);
      if (parsed.destination) setDestination(parsed.destination);
      if (parsed.city) setCity(parsed.city);
      if (parsed.preference) setPreference(parsed.preference as Preference);
      setValidationError(null);
    } catch (err) {
      setValidationError('Failed to parse natural query.');
    }
  };

  return (
    <div className={`transition-all duration-500 ease-in-out ${isSticky ? 'sticky top-0 z-[60] p-4 glass border-b border-[#FB923C]/20' : 'bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl -mt-16 mx-4 relative z-40 border-2 border-transparent'}`}>
      <div className="flex items-center justify-between mb-4">
        <button 
          type="button"
          onClick={() => {
            setShowMagic(!showMagic);
            setValidationError(null);
          }} 
          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors ${showMagic ? 'bg-[#FB923C] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
        >
          <Wand2 className="w-3.5 h-3.5" /> {showMagic ? 'Manual Entry' : 'Magic Mode'}
        </button>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setIsScheduled(!isScheduled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isScheduled ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
          >
            <Calendar className="w-3 h-3" /> {isScheduled ? 'Scheduled' : 'Depart Now'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isScheduled && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
              <input 
                type="datetime-local" 
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
            </div>
          </div>
        )}

        {showMagic ? (
          <div className="space-y-3">
             <textarea 
               value={naturalQuery} 
               onChange={(e) => setNaturalQuery(e.target.value)} 
               placeholder="e.g. Bandra to Colaba by fastest route..." 
               className="w-full h-24 p-4 bg-[#FFFBEB] dark:bg-slate-900 rounded-2xl outline-none text-sm font-medium resize-none focus:ring-2 focus:ring-[#FB923C]/30 transition-all border border-slate-100 dark:border-slate-700" 
             />
             <button type="button" onClick={handleMagicParse} className="w-full py-2 bg-[#FB923C]/10 text-[#FB923C] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FB923C]/20 transition-colors">Auto-fill manual fields</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FB923C]" />
              <input 
                type="text" 
                placeholder="Where from?" 
                value={source} 
                onChange={(e) => setSource(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-[#FFFBEB] dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#FB923C]/30 outline-none" 
              />
            </div>
            <div className="relative">
              <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FB923C]" />
              <input 
                type="text" 
                placeholder="Where to?" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-[#FFFBEB] dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#FB923C]/30 outline-none" 
              />
            </div>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-[#FB923C] hover:bg-[#EA580C] active:scale-[0.98] transition-all text-white rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
          {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
          <span>{isLoading ? 'Aggregating...' : isScheduled ? 'Schedule Best Routes' : 'Get Best Routes'}</span>
        </button>
      </form>
    </div>
  );
});

export default RouteInput;
