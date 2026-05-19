import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiCheck, FiChevronDown } from 'react-icons/fi';

type LocaleCode = 'en' | 'fr' | 'zh' | 'ar';

const languages: { code: LocaleCode; name: string; shortCode: string }[] = [
  { code: 'en', name: 'English',  shortCode: 'EN' },
  { code: 'zh', name: '中文',     shortCode: 'ZH' },
  { code: 'ar', name: 'العربية',  shortCode: 'AR' },
  { code: 'fr', name: 'Français', shortCode: 'FR' },
];

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen]           = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted]         = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef  = useRef<HTMLButtonElement>(null);
  const optionRefs  = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId      = 'language-switcher-menu';

  // Safely extract base language code (handles region codes like 'en-US', 'zh-CN')
  const baseLangCode   = ((i18n.language || 'en').split('-')[0]) as LocaleCode;
  const currentLangObj = languages.find(l => l.code === baseLangCode) ?? languages[0];
  const currentLang    = currentLangObj.shortCode;
  const currentLangIndex = Math.max(languages.findIndex(l => l.code === baseLangCode), 0);

  // SSR guard — only touch the DOM after mount to prevent hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  // Reactively sync document dir + lang, client-side only
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dir  = baseLangCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = baseLangCode;
  }, [baseLangCode, mounted]);

  const closeDropdown = useCallback((returnFocus = false) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeDropdown]);

  // Focus the active option whenever it changes
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  // Escape key from anywhere inside the dropdown
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (!dropdownRef.current?.contains(document.activeElement)) return;
      e.preventDefault();
      closeDropdown(true);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeDropdown, isOpen]);

  const handleSelect = useCallback((code: LocaleCode) => {
    i18n.changeLanguage(code);
    closeDropdown(true);
  }, [closeDropdown, i18n]);

  const openFromKeyboard = (index: number) => { setIsOpen(true); setActiveIndex(index); };

  const handleTriggerClick = () => {
    if (isOpen) { closeDropdown(); return; }
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ')  { e.preventDefault(); openFromKeyboard(currentLangIndex); return; }
    if (e.key === 'ArrowDown')               { e.preventDefault(); openFromKeyboard(currentLangIndex); return; }
    if (e.key === 'ArrowUp')                 { e.preventDefault(); openFromKeyboard(languages.length - 1); return; }
    if (e.key === 'Escape' && isOpen)        { e.preventDefault(); closeDropdown(true); }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number, code: LocaleCode) => {
    if (e.key === 'Escape')                  { e.preventDefault(); closeDropdown(true); return; }
    if (e.key === 'ArrowDown')               { e.preventDefault(); setActiveIndex((index + 1) % languages.length); return; }
    if (e.key === 'ArrowUp')                 { e.preventDefault(); setActiveIndex((index - 1 + languages.length) % languages.length); return; }
    if (e.key === 'Home')                    { e.preventDefault(); setActiveIndex(0); return; }
    if (e.key === 'End')                     { e.preventDefault(); setActiveIndex(languages.length - 1); return; }
    if (e.key === 'Tab')                     { closeDropdown(); return; }
    if (e.key === 'Enter' || e.key === ' ')  { e.preventDefault(); handleSelect(code); }
  };

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Selector Pill */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className={`group flex h-9 items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
          isDark
            ? 'bg-gray-800 active:bg-gray-700 border border-gray-700'
            : 'bg-gray-100 hover:bg-gray-200 border border-transparent dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? menuId : undefined}
        title={`Change language (${currentLangObj.name})`}
      >
        <FiGlobe className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`} />
        <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {currentLang}
        </span>
        <FiChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          id={menuId}
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-[200]"
        >
          {languages.map((lang, index) => {
            const isSelected = baseLangCode === lang.code;
            return (
              <li key={lang.code} role="option" aria-selected={isSelected}>
                <button
                  ref={node => { optionRefs.current[index] = node; }}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  onKeyDown={e => handleOptionKeyDown(e, index, lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 ${
                    isSelected
                      ? 'bg-[#135bec]/5 text-[#135bec] font-semibold dark:bg-[#135bec]/20 dark:text-[#5b8ef2]'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
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
