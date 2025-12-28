
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Language } from '../types';
import { t } from '../services/i18nService';
import { 
  Settings as SettingsIcon, Bell, Shield, ChevronRight, LogOut, Smartphone, Moon, Zap, 
  IndianRupee, FlaskConical, X, Share2, Users, Gift, Eye, Type, Volume2, Vibrate, 
  Lock, Languages, Briefcase, FileText, Download, Trash2, Info, ShieldAlert
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdateSetting: (key: string, value: any) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdateSetting }) => {
  const { exportData, deleteAccount, setRole } = useGlobalState();
  const [showLegal, setShowLegal] = useState<'privacy' | 'terms' | null>(null);

  const lang = profile.settings.language;

  return (
    <div className="space-y-8 pb-12">
      {/* User Card */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
         <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/40 overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
         </div>
         <div className="flex-1">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">{profile.name}</h2>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.email}</div>
         </div>
      </section>

      {/* Admin Quick Switch (For Demo Purposes) */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-500" />
          Developer Access
        </h3>
        <button 
          onClick={() => setRole('admin')}
          className="w-full p-5 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-between shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black">Admin Command Center</div>
              <div className="text-[10px] opacity-80 uppercase font-bold">System monitoring & audits</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Appearance Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
          <Eye className="w-4 h-4 text-violet-500" />
          Appearance
        </h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800 shadow-sm">
          {/* Dark Mode */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-950 rounded-xl flex items-center justify-center text-violet-600">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black">Dark Mode</div>
                <div className="text-[10px] text-slate-400 uppercase">Adaptive UI theme</div>
              </div>
            </div>
            <button 
              onClick={() => onUpdateSetting('darkMode', !profile.settings.darkMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${ profile.settings.darkMode ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-800' }`}
            >
              <motion.div animate={{ x: profile.settings.darkMode ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black">High Contrast</div>
                <div className="text-[10px] text-slate-400 uppercase">Enhance legibility</div>
              </div>
            </div>
            <button 
              onClick={() => onUpdateSetting('highContrastMode', !profile.settings.highContrastMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${ profile.settings.highContrastMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800' }`}
            >
              <motion.div animate={{ x: profile.settings.highContrastMode ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
          <Languages className="w-4 h-4 text-blue-500" />
          {lang === 'hi' ? 'भाषा' : 'Language'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(['en', 'hi', 'kn', 'ta'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => onUpdateSetting('language', l)}
              className={`p-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                profile.settings.language === l 
                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:border-blue-200'
              }`}
            >
              {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : l === 'kn' ? 'ಕನ್ನಡ' : 'தமிழ்'}
            </button>
          ))}
        </div>
      </section>

      {/* Business Features */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-500" />
          {t('business_mode', lang)}
        </h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800 shadow-sm">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black">Corporate Account</div>
                <div className="text-[10px] text-slate-400 uppercase">Link employer for billing</div>
              </div>
            </div>
            <button 
              onClick={() => onUpdateSetting('isCorporateAccount', !profile.settings.isCorporateAccount)}
              className={`w-12 h-6 rounded-full transition-all relative ${ profile.settings.isCorporateAccount ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800' }`}
            >
              <motion.div animate={{ x: profile.settings.isCorporateAccount ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-500" />
          Security & Privacy
        </h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-50 dark:divide-slate-800">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-black">Biometric Unlock</div>
                <div className="text-[10px] text-slate-400 uppercase">Fingerprint / Face ID</div>
              </div>
            </div>
            <button 
              onClick={() => onUpdateSetting('biometricsEnabled', !profile.settings.biometricsEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${ profile.settings.biometricsEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800' }`}
            >
              <motion.div animate={{ x: profile.settings.biometricsEnabled ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          <button onClick={exportData} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black">Export My Data</div>
                <div className="text-[10px] text-slate-400 uppercase">GDPR Download</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>

          <button onClick={deleteAccount} className="w-full p-5 flex items-center justify-between text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/40 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black">Delete Account</div>
                <div className="text-[10px] text-rose-400 uppercase">Permanent action</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Legal Footer */}
      <section className="flex justify-center gap-6 py-4">
        <button onClick={() => setShowLegal('privacy')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Privacy Policy</button>
        <div className="w-1 h-1 bg-slate-300 rounded-full my-auto" />
        <button onClick={() => setShowLegal('terms')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Terms of Use</button>
      </section>

      {/* Legal Modals */}
      <AnimatePresence>
        {showLegal && (
          <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black capitalize">{showLegal} Information</h3>
                <button onClick={() => setShowLegal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="prose prose-sm dark:prose-invert text-slate-500 dark:text-slate-400 space-y-4">
                <p><strong>GDPR & Privacy Compliance:</strong> OmniRoute India takes your data security seriously. We use end-to-end encryption for all booking transactions.</p>
                <p>Your travel history is stored locally and encrypted on our servers. You have the right to request access to, or deletion of, your personal information at any time via the Settings menu.</p>
                <p><strong>Terms:</strong> By using OmniRoute, you agree to allow us to process multimodal transport options through our proprietary AI engine.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSettings;
