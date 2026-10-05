import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { dataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';

// Pages
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { MenuPage } from './pages/MenuPage';
import { VacanciesPage } from './pages/VacanciesPage';
import { ResultCheckPage } from './pages/ResultCheckPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

// Dashboards
import { MainRegistrarDashboard } from './dashboards/MainRegistrarDashboard';
import { AccountantDashboard } from './dashboards/AccountantDashboard';
import { FinanceDashboard } from './dashboards/FinanceDashboard';
import { StoreManagerDashboard } from './dashboards/StoreManagerDashboard';
import { JanitorDashboard } from './dashboards/JanitorDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { HRDashboard } from './dashboards/HRDashboard';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();

  // Dynamically set favicon & document title based on site logo settings
  useEffect(() => {
    dataService.getSiteSettings().then(settings => {
      if (settings?.hotel_name) {
        document.title = `${settings.hotel_name} | Luxury Portal System`;
      }
      if (settings?.logo_url) {
        const favicon = document.getElementById('favicon');
        if (favicon) favicon.href = settings.logo_url;
      }
    });
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDashboard = () => {
    if (!currentUser) return <HomePage setActiveTab={handleSelectTab} />;
    
    switch (currentUser.role) {
      case 'MAIN_REGISTRAR':
        return <MainRegistrarDashboard />;
      case 'ACCOUNTANT':
        return <AccountantDashboard />;
      case 'FINANCE':
        return <FinanceDashboard />;
      case 'STORE_MANAGER':
        return <StoreManagerDashboard />;
      case 'JANITOR':
        return <JanitorDashboard />;
      case 'MANAGER':
      case 'COOK':
      case 'CHEF':
      case 'GUARDIAN':
        return <ManagerDashboard />;
      case 'HR':
        return <HRDashboard />;
      default:
        return <MainRegistrarDashboard />;
    }
  };

  const renderPageContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={handleSelectTab} />;
      case 'rooms':
        return <RoomsPage />;
      case 'menu':
        return <MenuPage />;
      case 'vacancies':
        return <VacanciesPage onCheckResultClick={() => handleSelectTab('results')} />;
      case 'results':
        return <ResultCheckPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'dashboard':
        return renderDashboard();
      default:
        return <HomePage setActiveTab={handleSelectTab} />;
    }
  };

  return (
    <div key={`${theme}-${language}`} className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-white">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleSelectTab} 
        onOpenLogin={() => setLoginModalOpen(true)} 
      />

      <main className="flex-grow">
        {renderPageContent()}
      </main>

      {/* Footer renders ONLY on public pages, hidden completely when accessing admin dashboards */}
      {activeTab !== 'dashboard' && <Footer setActiveTab={handleSelectTab} />}

      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
