import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceAdvisoryButtonProps {
  textToSpeak: string;
}

export const VoiceAdvisoryButton: React.FC<VoiceAdvisoryButtonProps> = ({ textToSpeak }) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Set regional language voice if available
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'pa') utterance.lang = 'pa-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95; // slightly slower, clear farmer pacing
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeech}
      className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 border ${
        isPlaying
          ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
          : 'bg-emerald-50 dark:bg-emerald-950/60 text-brand-700 dark:text-brand-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
      }`}
      title="Listen to crop advisory (Text to Speech)"
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-brand-600" />
          <span>Listen to Advice 🔊</span>
        </>
      )}
    </button>
  );
};
