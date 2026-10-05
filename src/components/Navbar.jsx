import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { EditProfileModal } from './EditProfileModal';
import { 
  Home, 
  BedDouble, 
  UtensilsCrossed, 
  Briefcase, 
  Search, 
  Image as ImageIcon, 
  PhoneCall,
  Globe, 
  Moon, 
  Sun, 
  UserCheck, 
  LogOut, 
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  User
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    dataService.getSiteSettings().then(setSiteSettings);
  }, []);

  const navLinks = [
    { id: 'home', label: t('home'), icon: <Home className="w-4 h-4 shrink-0" /> },
    { id: 'rooms', label: t('rooms'), icon: <BedDouble className="w-4 h-4 shrink-0" /> },
    { id: 'menu', label: t('menu'), icon: <UtensilsCrossed className="w-4 h-4 shrink-0" /> },
    { id: 'vacancies', label: t('vacancies'), icon: <Briefcase className="w-4 h-4 shrink-0" /> },
    { id: 'results', label: t('checkResults'), icon: <Search className="w-4 h-4 shrink-0" /> },
    { id: 'gallery', label: t('gallery'), icon: <ImageIcon className="w-4 h-4 shrink-0" /> },
    { id: 'contact', label: t('contact'), icon: <PhoneCall className="w-4 h-4 shrink-0" /> }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-xl w-full max-w-full overflow-x-hidden">
      {/* 
        REPEATING COLOR PATTERN BAR (BLUE, WHITE, BROWN) ABOVE NAVIGATION BAR
      */}
      <div className="repeating-pattern-bar" title="Repeating Blue, White, Brown Pattern Bar (Top)"></div>

      {/* Main Pattern Navigation Bar */}
      <nav className="pattern-nav px-2 sm:px-4 lg:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Logo & Hotel Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => setActiveTab('home')}
          >
            {siteSettings?.logo_url ? (
              <img 
                src={siteSettings.logo_url} 
                alt="Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white shadow-md shrink-0 text-xs sm:text-sm">
                K
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base lg:text-xl font-extrabold tracking-tight text-white leading-tight truncate">
                {siteSettings?.hotel_name || t('hotelName')}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-medium tracking-wide truncate hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto py-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200 ${
                  activeTab === link.id
                    ? 'bg-white/20 text-white shadow-inner border-b-2 border-amber-400'
                    : 'text-slate-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          {/* Right Utilities (Lang, Theme, Auth, Edit Profile) for Desktop */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20 whitespace-nowrap shrink-0"
              title="Translate Page Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{t('toggleLanguage')}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/20 shrink-0"
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-200 shrink-0" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {/* User Profile Edit Trigger Button */}
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
                  title="Edit Staff Profile & Database Credentials"
                >
                  <img
                    src={currentUser.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={currentUser.full_name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-300"
                  />
                  <span className="truncate max-w-[100px]">{currentUser.full_name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('dashboard')}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors shrink-0"
                  title={t('logout')}
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-700 hover:to-amber-800 text-white text-xs font-bold shadow-lg transition-all whitespace-nowrap shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('login')}</span>
              </button>
            )}
          </div>

          {/* 3. Mobile Hamburger Menu Button - Visible on small screen sizes */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-full bg-white/20 text-white text-[10px] sm:text-[11px] font-bold"
            >
              {t('toggleLanguage')}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1 sm:p-1.5 rounded-full bg-white/20 text-white"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg bg-amber-600 text-white shadow-md"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <MenuIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Links Drawer (Responsive Dropdown on screens < 1000px down to 100px) */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 border-t border-white/20 space-y-1 pb-3 max-w-full">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === link.id
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}

            {currentUser ? (
              <div className="pt-2 border-t border-white/20 space-y-2">
                <div className="flex items-center justify-between px-3 text-xs text-amber-300 font-bold">
                  <span>Logged in as: {currentUser.full_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 text-white">{currentUser.role}</span>
                </div>

                <button
                  onClick={() => {
                    setEditProfileOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/15 text-white text-xs font-bold"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile & Credentials</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('dashboard')}</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-amber-700 text-white text-xs font-bold shadow mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </header>
  );
};
