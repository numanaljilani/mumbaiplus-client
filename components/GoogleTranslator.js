'use client';
import { useState, useEffect } from 'react';

export default function GoogleTranslator() {
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.google && window.google.translate) {
      setIsScriptLoaded(true);
      return;
    }

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    window.googleTranslateElementInit = () => {
      setIsScriptLoaded(true);
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN,ar,hi,pt,ru,ja,ko,it',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇦🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
  ];

  const changeLanguage = (languageCode) => {
    if (isScriptLoaded) {
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        selectField.value = languageCode;
        selectField.dispatchEvent(new Event('change'));
      }
    } else {
      alert('Translation service is loading. Please try again in a moment.');
    }
    setIsTranslatorOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors border"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>Translate</span>
      </button>

      {isTranslatorOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-500 px-2 py-1">Select Language</div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-3"
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
}