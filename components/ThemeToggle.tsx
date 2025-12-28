
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';

const ThemeToggle: React.FC = () => {
  const { profile, updateSetting } = useGlobalState();
  const isDark = profile.settings.darkMode;

  const toggleTheme = () => {
    const nextDark = !isDark;
    updateSetting('darkMode', nextDark);
    if (profile.settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(5);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
    </button>
  );
};

export default ThemeToggle;
