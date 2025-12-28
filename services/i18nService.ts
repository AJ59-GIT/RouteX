
import { Language } from '../types';

const translations: Record<Language, Record<string, string>> = {
  en: {
    'explore': 'Explore',
    'community': 'Community',
    'trips': 'Trips',
    'impact': 'Impact',
    'profile': 'Profile',
    'search_placeholder': 'Where to?',
    'book_now': 'Book Now',
    'best_routes': 'Best Routes',
    'carbon_saved': 'Carbon Saved',
    'business_mode': 'Business Mode',
    'biometric_auth': 'Secure Access',
  },
  hi: {
    'explore': 'खोजें',
    'community': 'समुदाय',
    'trips': 'यात्राएं',
    'impact': 'प्रभाव',
    'profile': 'प्रोफ़ाइल',
    'search_placeholder': 'कहाँ जाना है?',
    'book_now': 'अभी बुक करें',
    'best_routes': 'सबसे अच्छे रास्ते',
    'carbon_saved': 'बचाया गया कार्बन',
    'business_mode': 'बिज़नेस मोड',
    'biometric_auth': 'सुरक्षित पहुंच',
  },
  kn: {
    'explore': 'ಶೋಧಿಸು',
    'community': 'ಸಮುದಾಯ',
    'trips': 'ಪ್ರಯಾಣಗಳು',
    'impact': 'ಪರಿಣಾಮ',
    'profile': 'ಪ್ರೊಫೈಲ್',
    'search_placeholder': 'ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?',
    'book_now': 'ಈಗ ಕಾದಿರಿಸಿ',
    'best_routes': 'ಅತ್ಯುತ್ತಮ ಮಾರ್ಗಗಳು',
    'carbon_saved': 'ಉಳಿಸಿದ ಇಂಗಾಲ',
    'business_mode': 'ಬಿಸಿನೆಸ್ ಮೋಡ್',
    'biometric_auth': 'ಸುರಕ್ಷಿತ ಪ್ರವೇಶ',
  },
  ta: {
    'explore': 'ஆராய்ந்து பாருங்கள்',
    'community': 'சமூகம்',
    'trips': 'பயணங்கள்',
    'impact': 'தாக்கம்',
    'profile': 'சுயவிவரம்',
    'search_placeholder': 'எங்கே போக வேண்டும்?',
    'book_now': 'இப்போது பதிவு செய்யவும்',
    'best_routes': 'சிறந்த பாதைகள்',
    'carbon_saved': 'சேமிக்கப்பட்ட கார்பன்',
    'business_mode': 'வணிக முறை',
    'biometric_auth': 'பாதுகாப்பான அணுகல்',
  }
};

export const t = (key: string, lang: Language = 'en'): string => {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};
