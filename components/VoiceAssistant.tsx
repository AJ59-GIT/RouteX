
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X, Command } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';
import { parseNaturalQuery } from '../services/geminiService';
import { RouteRequest, Preference } from '../types';

interface VoiceAssistantProps {
  onSearch: (req: RouteRequest) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSearch }) => {
  const { profile } = useGlobalState();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showUI, setShowUI] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);
        
        if (event.results[current].isFinal) {
          handleVoiceCommand(resultTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    synth.speak(utterance);
    setResponse(text);
  };

  const handleVoiceCommand = async (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('take me home')) {
      const home = profile.savedLocations.find(l => l.type === 'home');
      if (home) {
        speak("Finding routes to your home in Indiranagar.");
        onSearch({
          source: 'Current Location',
          destination: home.address,
          city: 'Bengaluru',
          preference: Preference.FASTEST,
          groupSize: 1,
          requireAccessibility: false
        });
      } else {
        speak("You haven't set a home location yet.");
      }
    } else if (cmd.includes('take me to work')) {
      const work = profile.savedLocations.find(l => l.type === 'work');
      if (work) {
        speak("Searching routes to your office.");
        onSearch({
          source: 'Current Location',
          destination: work.address,
          city: 'Bengaluru',
          preference: Preference.FASTEST,
          groupSize: 1,
          requireAccessibility: false
        });
      }
    } else {
      speak("Got it. Searching for " + cmd);
      try {
        const parsed = await parseNaturalQuery(cmd);
        onSearch({
          source: parsed.source || 'Current Location',
          destination: parsed.destination || '',
          city: parsed.city || 'Mumbai',
          preference: parsed.preference || Preference.FASTEST,
          groupSize: 1,
          requireAccessibility: false
        });
      } catch (e) {
        speak("I couldn't quite understand that. Please try again.");
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      setShowUI(true);
      recognitionRef.current?.start();
      if (profile.settings.hapticFeedback && 'vibrate' in navigator) navigator.vibrate(50);
    }
  };

  if (!profile.settings.voiceAssistanceEnabled) return null;

  return (
    <>
      <button 
        onClick={toggleListening}
        className={`fixed bottom-32 right-6 z-[80] p-4 rounded-full shadow-2xl transition-all duration-500 scale-100 active:scale-90 flex items-center justify-center ${
          isListening ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/20' : 'bg-blue-600 text-white'
        }`}
        aria-label={isListening ? "Stop voice assistant" : "Activate voice assistant"}
      >
        <Mic className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-6 bottom-32 z-[70] bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-blue-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Omni Voice</span>
              </div>
              <button onClick={() => setShowUI(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="min-h-[1.5rem] font-bold text-slate-800 dark:text-slate-100">
                {transcript || (isListening ? "Listening..." : "How can I help you?")}
              </div>
              {response && (
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl flex items-center gap-2">
                  <Volume2 className="w-4 h-4 shrink-0" />
                  {response}
                </div>
              )}
            </div>
            
            <div className="mt-4 flex gap-2">
               {['Take me home', 'Best way to BKC', 'Stop'].map(hint => (
                 <button 
                  key={hint} 
                  onClick={() => handleVoiceCommand(hint)}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                 >
                   {hint}
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
