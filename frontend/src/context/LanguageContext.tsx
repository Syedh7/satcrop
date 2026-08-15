import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'te';

interface Translations {
  [key: string]: {
    [lang in LanguageCode]: string;
  };
}

export const translations: Translations = {
  appName: {
    en: 'SATCROP',
    hi: 'सैटक्रॉप',
    mr: 'सॅटकॉप',
    pa: 'ਸੈਟਕ੍ਰੌਪ',
    te: 'శాట్‌క్రాప్',
  },
  tagline: {
    en: 'Smart Farming. Better Tomorrow.',
    hi: 'स्मार्ट खेती। बेहतर कल।',
    mr: 'स्मार्ट शेती. उत्तम भविष्य.',
    pa: 'ਸਮਾਰਟ ਖੇਤੀ। ਬਿਹਤਰ ਭਵਿੱਖ।',
    te: 'స్మార్ట్ వ్యవసాయం. మెరుగైన రేపు.',
  },
  subtitle: {
    en: 'AI-powered satellite crop monitoring for smarter and more informed farming.',
    hi: 'होशियार और सटीक खेती के लिए एआई-आधारित उपग्रह फसल निगरानी प्रणाली।',
    mr: 'अधिक माहितीपूर्ण शेतीसाठी एआय-चालित उपग्रह पीक निरीक्षण.',
    pa: 'ਸਮਾਰਟ ਅਤੇ ਸੂਚਿਤ ਖੇਤੀ ਲਈ ਏਆਈ-ਸੰਚਾਲਿਤ ਉਪਗ੍ਰਹਿ ਫਸਲ ਨਿਗਰਾਨੀ।',
    te: 'తెలివైన వ్యవసాయం కోసం ఏఐ ఆధారిత ఉపగ్రహ పంట పర్యవేక్షణ.',
  },
  getStarted: {
    en: 'GET STARTED',
    hi: 'शुरू करें',
    mr: 'सुरू करा',
    pa: 'ਸ਼ੁਰੂ ਕਰੋ',
    te: 'ప్రారంభించండి',
  },
  login: {
    en: 'LOGIN',
    hi: 'लॉग इन',
    mr: 'लॉगिन',
    pa: 'ਲਾਗਇਨ',
    te: 'లాగిన్',
  },
  createAccount: {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    mr: 'खाते तयार करा',
    pa: 'ਖਾਤਾ ਬਣਾਓ',
    te: 'ఖాతా సృష్టించండి',
  },
  helloFarmer: {
    en: 'Hello, Farmer 👋',
    hi: 'नमस्ते, किसान भाई 👋',
    mr: 'नमस्कार, शेतकरी मित्र 👋',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ ਵੀਰ 👋',
    te: 'నమస్కారం, రైతు మిత్రమా 👋',
  },
  analyzeField: {
    en: 'Analyze Field',
    hi: 'खेत की जांच करें',
    mr: 'शेताचे विश्लेषण करा',
    pa: 'ਖੇਤ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    te: 'పొలాన్ని విశ్లేషించండి',
  },
  myFields: {
    en: 'My Fields',
    hi: 'मेरे खेत',
    mr: 'माझी शेते',
    pa: 'ਮੇਰੇ ਖੇਤ',
    te: 'నా పొలాలు',
  },
  history: {
    en: 'History',
    hi: 'इतिहास',
    mr: 'इतिहास',
    pa: 'ਇਤਿਹਾਸ',
    te: 'చరిత్ర',
  },
  map: {
    en: 'Map',
    hi: 'मानचित्र (नक्शा)',
    mr: 'नकाशा',
    pa: 'ਨਕਸ਼ਾ',
    te: 'మ్యాప్',
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
    mr: 'प्रोफाइल',
    pa: 'ਪ੍ਰੋਫਾਈਲ',
    te: 'ప్రొఫైల్',
  },
  cropHealthOverview: {
    en: 'Crop Health Overview',
    hi: 'फसल स्वास्थ्य अवलोकन',
    mr: 'पीक आरोग्य आढावा',
    pa: 'ਫਸਲ ਸਿਹਤ ਸੰਖੇਪ',
    te: 'పంట ఆరోగ్య సమాచారం',
  },
  healthy: {
    en: 'Healthy',
    hi: 'स्वस्थ',
    mr: 'निरोगी',
    pa: 'ਤੰਦਰੁਸਤ',
    te: 'ఆరోగ్యకరమైనది',
  },
  moderate: {
    en: 'Moderate',
    hi: 'मध्यम',
    mr: 'मध्यम',
    pa: 'ਦਰਮਿਆਨਾ',
    te: 'మధ్యస్థం',
  },
  poor: {
    en: 'Poor',
    hi: 'कमजोर',
    mr: 'कमकुवत',
    pa: 'ਕਮਜ਼ੋਰ',
    te: 'బలహీనమైనది',
  },
  recentAnalyses: {
    en: 'Recent Analyses',
    hi: 'हालिया विश्लेषण',
    mr: 'अलीकडील विश्लेषणे',
    pa: 'ਹਾਲੀਆ ਵਿਸ਼ਲੇਸ਼ਣ',
    te: 'ఇటీవలి విశ్లేషణలు',
  },
  saveToHistory: {
    en: 'SAVE TO HISTORY',
    hi: 'इतिहास में सुरक्षित करें',
    mr: 'इतिहासात जतन करा',
    pa: 'ਇਤਿਹਾਸ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਕਰੋ',
    te: 'చరిత్రలో భద్రపరచండి',
  },
  downloadReport: {
    en: 'DOWNLOAD REPORT',
    hi: 'रिपोर्ट डाउनलोड करें',
    mr: 'अहवाल डाउनलोड करा',
    pa: 'ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ',
    te: 'నివేదికను డౌన్‌లోడ్ చేయండి',
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('satcrop_language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('satcrop_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
