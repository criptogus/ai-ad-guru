
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Nav: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  // Try to get auth context, but handle the case when it's not available
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.log("Auth context not available, assuming not authenticated");
    isAuthenticated = false;
  }

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold">
              ZD
            </div>
            <span className="ml-2 text-xl font-bold">Zero Digital Agency</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center text-gray-600 hover:text-brand-600">
                <Globe className="h-4 w-4 mr-1" />
                <span className="uppercase">{currentLanguage}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg py-1 z-50 hidden group-hover:block">
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${currentLanguage === 'en' ? 'font-bold text-brand-600' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${currentLanguage === 'pt' ? 'font-bold text-brand-600' : ''}`}
                  onClick={() => changeLanguage('pt')}
                >
                  Português
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${currentLanguage === 'es' ? 'font-bold text-brand-600' : ''}`}
                  onClick={() => changeLanguage('es')}
                >
                  Español
                </button>
              </div>
            </div>
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")}>{t('nav.dashboard')}</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                  {t('nav.signin')}
                </Button>
                <Button onClick={() => navigate("/auth/register")}>
                  {t('nav.getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
