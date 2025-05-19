import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Update state when language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);
  
  // Change language and save to localStorage
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('citizenVoice_language', lng);
    setCurrentLanguage(lng);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-block">
            {currentLanguage === 'en' ? 'English' : 'Kinyarwanda'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className={`flex items-center gap-2 ${currentLanguage === 'en' ? 'bg-accent' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          <span className="mr-1">🇬🇧</span> {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`flex items-center gap-2 ${currentLanguage === 'rw' ? 'bg-accent' : ''}`}
          onClick={() => changeLanguage('rw')}
        >
          <span className="mr-1">🇷🇼</span> {t('language.kinyarwanda')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
