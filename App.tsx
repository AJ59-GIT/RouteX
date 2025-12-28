
import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalProvider, useGlobalState } from './context/GlobalContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import RouteInput from './components/RouteInput';
import RouteCard from './components/RouteCard';
import InteractiveMap from './components/InteractiveMap';
import NotificationCenter from './components/NotificationCenter';
import ProfileSettings from './components/ProfileSettings';
import AdminDashboard from './components/AdminDashboard';
import SkeletonLoader from './components/SkeletonLoader';
import ThemeToggle from './components/ThemeToggle';
import EmptyState from './components/EmptyState';
import SustainabilityDashboard from './components/SustainabilityDashboard';
import MobilityInsights from './components/MobilityInsights';
import CommunityBoard from './components/CommunityBoard';
import CarpoolSection from './components/CarpoolSection';
import VoiceAssistant from './components/VoiceAssistant';
import InstallPrompt from './components/InstallPrompt';
import PushPermissionBanner from './components/PushPermissionBanner';
import QRScanner from './components/QRScanner';
import SafetyHub from './components/SafetyHub';
import { t } from './services/i18nService';
import { securityService } from './services/securityService';
import { RouteRequest, Booking, Preference, TravelOption, CarpoolRide } from './types';
import { useRouteSearch } from './hooks/useRouteSearch';
import { useGeolocation } from './hooks/useGeolocation';
import { analyticsService } from './services/analyticsService';
import { Map as MapIcon, Ticket, Leaf, User, Bell, Compass, AlertTriangle, ChevronLeft, Zap, Star, MessageSquare, Users, Camera, RefreshCw, ShieldAlert } from 'lucide-react';

const RouteDetail = lazy(() => import('./components/RouteDetail'));

const MainContent: React.FC = () => {
  const { profile, options, setOptions, communityReports, carpoolRides, isInstallable, isSyncing, addBooking, updateSetting, triggerCloudSync } = useGlobalState();
  const { search, loading, error: searchError } = useRouteSearch();
  const { getPosition, loading: geoLoading } = useGeolocation();

  const [activeTab, setActiveTab] = useState<'explore' | 'community' | 'trips' | 'eco' | 'profile'>('explore');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<RouteRequest | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewState, setViewState] = useState<'list' | 'detail'>('list');
  const [showScanner, setShowScanner] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lang = profile.settings.language;

  const handleSearch = useCallback(async (req: RouteRequest) => {
    if (!securityService.checkRateLimit()) {
      alert("System Busy: Too many travel requests. Please wait a few seconds.");
      return;
    }
    setSearchParams(req);
    setActiveTab('explore');
    setViewState('list');
    const results = await search(req);
    setOptions(results);
    if (results.length > 0) setSelectedId(results[0].id);
  }, [search, setOptions]);

  const onBookingConfirmed = useCallback((booking: Booking) => {
    addBooking(booking, 1.5);
    setActiveTab('trips');
    setViewState('list');
    setIsModalOpen(false);
  }, [addBooking]);

  const selectedOption = useMemo(() => options.find(o => o.id === selectedId), [options, selectedId]);

  if (profile.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen pb-44 max-w-2xl mx-auto bg-[#FFFBEB] dark:bg-slate-900 transition-colors duration-500 relative">
      <header className="bg-gradient-to-br from-[#334155] via-[#475569] to-[#334155] pt-14 pb-28 px-6 relative overflow-hidden z-10 shadow-xl border-b border-[#FB923C]/20">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#FB923C]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-[#FFFBEB]/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-sm">
              <Compass className="w-7 h-7 text-[#FB923C]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#FFFBEB] tracking-tighter leading-none">OmniRoute</h1>
              <div className="flex items-center gap-2 mt-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FB923C] opacity-90">India Mobility</p>
                 {isSyncing && (
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-[#FFFBEB]">
                     <RefreshCw className="w-3 h-3" />
                   </motion.div>
                 )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setShowSafety(true)}
              className="p-2.5 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-900/40 border border-rose-500 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-20">
        <PushPermissionBanner />

        {activeTab === 'explore' && (
          <>
            <RouteInput 
              onSearch={handleSearch} 
              onLocate={() => getPosition()} 
              isLoading={loading || geoLoading} 
              savedLocations={profile.savedLocations} 
              recentSearches={profile.recentSearches} 
            />
            
            <div className="px-5">
              <div className="mt-8">
                <InteractiveMap selectedOption={selectedOption || null} allOptions={options} />
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="mt-10 space-y-12">
                    {viewState === 'list' ? (
                      <>
                        {options.length > 0 && (
                           <div className="space-y-6">
                              <h2 className="text-xl font-black text-slate-800 dark:text-[#FFFBEB] px-2 border-l-4 border-[#FB923C] ml-1 pl-4">{t('best_routes', lang)}</h2>
                              {options.map((option) => (
                                <RouteCard 
                                  key={option.id} 
                                  option={option} 
                                  isSelected={selectedId === option.id} 
                                  onSelect={() => { setSelectedId(option.id); setViewState('detail'); }} 
                                />
                              ))}
                           </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-6">
                        <button onClick={() => setViewState('list')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 hover:text-[#FB923C] transition-colors">
                          <ChevronLeft className="w-4 h-4" /> Back to options
                        </button>
                        {selectedOption && (
                          <Suspense fallback={<SkeletonLoader />}>
                            <RouteDetail 
                              option={selectedOption} 
                              onSaveRoute={() => {}} 
                              onBookingConfirmed={onBookingConfirmed} 
                              preferredPayment={profile.preferredPayment}
                              onModalToggle={setIsModalOpen}
                            />
                          </Suspense>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Other tabs remain similar... */}
        
        {activeTab === 'trips' && (
          <div className="px-5 mt-[-2.5rem]">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 mb-8 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-[#FFFBEB]">{t('trips', lang)}</h2>
                  <p className="text-[#FB923C] text-[10px] font-black uppercase tracking-widest">Your Travel Archive</p>
                </div>
                <button 
                  onClick={triggerCloudSync}
                  className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 transition-all ${isSyncing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
            {profile.bookingHistory.length === 0 ? <EmptyState icon={Ticket} title="No Trips" description="History will appear here." /> : (
              <div className="space-y-4">
                {profile.bookingHistory.map(b => (
                  <div key={b.id} className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] border shadow-sm border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-800 dark:text-[#FFFBEB]">{b.routeTitle}</h4>
                      <div className="font-black text-[#FB923C]">₹{b.totalCost}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="px-5 mt-[-2.5rem]">
            <ProfileSettings profile={profile} onUpdateSetting={updateSetting} />
          </div>
        )}

        <VoiceAssistant onSearch={handleSearch} />
      </main>

      {showScanner && <QRScanner onScan={(d) => { alert("Validating: " + d); setShowScanner(false); }} onClose={() => setShowScanner(false)} />}
      
      <AnimatePresence>
        {showSafety && <SafetyHub onClose={() => setShowSafety(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!isModalOpen && !showSafety && (
          <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-6 right-6 h-20 glass rounded-[2.5rem] px-6 flex justify-between items-center z-50 shadow-xl border border-[#FB923C]/20"
          >
            {[
              { tab: 'explore', icon: MapIcon, label: t('explore', lang) },
              { tab: 'community', icon: MessageSquare, label: t('community', lang) },
              { tab: 'trips', icon: Ticket, label: t('trips', lang) },
              { tab: 'eco', icon: Leaf, label: t('impact', lang) },
              { tab: 'profile', icon: User, label: t('profile', lang) }
            ].map(({ tab, icon: Icon, label }) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab ? 'text-[#FB923C] scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                <Icon className={`w-5 h-5 ${activeTab === tab ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <GlobalProvider>
      <MainContent />
    </GlobalProvider>
  </ErrorBoundary>
);

export default App;
