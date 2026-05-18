import React, { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiCheck, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';

const languages: { code: Language; name: string; shortCode: string }[] = [
  { code: 'en', name: 'English',   shortCode: 'EN' },
  { code: 'zh', name: '中文',      shortCode: 'ZH' },
  { code: 'ar', name: 'العربية',   shortCode: 'AR' },
  { code: 'fr', name: 'Français',  shortCode: 'FR' },
];

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language)?.shortCode ?? 'EN';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code); // LanguageContext owns localStorage + document dir/lang sync
    setIsOpen(false);
  };

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Selector Pill */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`group flex h-9 items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
          isDark
            ? 'bg-gray-800 active:bg-gray-700 border border-gray-700'
            : 'bg-gray-100 hover:bg-gray-200 border border-transparent dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <FiGlobe className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`} />
        <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {currentLang}
        </span>
        <FiChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[200]"
        >
          {languages.map(lang => {
            const isSelected = language === lang.code;
            return (
              <li key={lang.code} role="option" aria-selected={isSelected}>
                <button
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#135bec]/5 text-[#135bec] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{lang.name}</span>
                  {isSelected && <FiCheck className="w-4 h-4 text-[#135bec]" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
