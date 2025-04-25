
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'pt', label: 'PT' }
  ];

  return (
    <div className="flex items-center justify-center gap-1 p-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => changeLanguage(lang.code as 'en' | 'es' | 'pt')}
          className={cn(
            "h-8 w-8 p-0 rounded-md",
            currentLanguage === lang.code 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground"
          )}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
