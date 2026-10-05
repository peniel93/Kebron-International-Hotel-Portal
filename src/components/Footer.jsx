import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { 
  FacebookIcon, 
  InstagramIcon, 
  TelegramIcon, 
  WhatsAppIcon, 
  LinkedInIcon, 
  YouTubeIcon, 
  TikTokIcon 
} from './SocialIcons';
import { Hotel, Phone, Mail, MapPin, ShieldCheck, Heart, ChevronRight, ExternalLink } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    dataService.getSiteSettings().then(setSiteSettings);
  }, []);

  const socialPlatforms = [
    { name: 'Instagram', icon: <InstagramIcon className="w-4 h-4" />, key: 'social_instagram', color: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600' },
    { name: 'Facebook', icon: <FacebookIcon className="w-4 h-4" />, key: 'social_facebook', color: 'hover:bg-blue-600' },
    { name: 'TikTok', icon: <TikTokIcon className="w-4 h-4" />, key: 'social_tiktok', color: 'hover:bg-black hover:text-cyan-400 border-cyan-500/30' },
    { name: 'WhatsApp', icon: <WhatsAppIcon className="w-4 h-4" />, key: 'social_whatsapp', color: 'hover:bg-emerald-600' },
    { name: 'LinkedIn', icon: <LinkedInIcon className="w-4 h-4" />, key: 'social_linkedin', color: 'hover:bg-blue-700' },
    { name: 'YouTube', icon: <YouTubeIcon className="w-4 h-4" />, key: 'social_youtube', color: 'hover:bg-red-600' },
    { name: 'Telegram', icon: <TelegramIcon className="w-4 h-4" />, key: 'social_telegram', color: 'hover:bg-sky-500' }
  ];

  const handleFooterLinkClick = (tabId) => {
    setActiveTab(tabId);
    // 2. Smoothly scroll to the beginning of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pattern-footer mt-16">
      {/* 
        REPEATING COLOR PATTERN BAR (BLUE, WHITE, BROWN) ABOVE FOOTER
      */}
      <div className="repeating-pattern-bar" title="Repeating Blue, White, Brown Pattern Bar (Footer Top)"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: Hotel Info & Modern Social Media Brand Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white shadow-md">
              K
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              {siteSettings?.hotel_name || t('hotelName')}
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Social Media Brand Icons */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Follow & Connect With Us
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {socialPlatforms.map((platform) => {
                const url = siteSettings?.[platform.key] || '#';
                return (
                  <a
                    key={platform.name}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-full bg-white/10 ${platform.color} text-white transition-all transform hover:scale-110 shadow-sm border border-white/10`}
                    title={platform.name}
                  >
                    {platform.icon}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: 2. Interactive Navigation Links with Arrow Indicator & Underline on Hover */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-amber-400 border-b border-white/15 pb-2">
            Quick Navigation Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button 
                onClick={() => handleFooterLinkClick('home')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('home')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleFooterLinkClick('rooms')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('rooms')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleFooterLinkClick('menu')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('menu')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleFooterLinkClick('vacancies')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('vacancies')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleFooterLinkClick('results')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('checkResults')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleFooterLinkClick('gallery')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('gallery')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleFooterLinkClick('contact')} 
                className="text-slate-300 hover:text-amber-300 hover:underline underline-offset-4 transition-all duration-200 font-semibold flex items-center gap-1.5 cursor-pointer group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                <span>{t('contact')}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Services & Accommodations */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-amber-400 border-b border-white/15 pb-2">
            Hotel Services
          </h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>VIP & Executive Suites</li>
            <li>Solo & Family Guest Rooms</li>
            <li>Traditional & International Dining</li>
            <li>Conference & Event Halls</li>
            <li>24/7 Security & Room Service</li>
          </ul>
        </div>

        {/* Col 4: Contact & Location */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-amber-400 border-b border-white/15 pb-2">
            {t('contact')}
          </h4>
          <div className="space-y-2.5 text-sm text-slate-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
              <span>{siteSettings?.location_address || "Hawassa / Addis Ababa, Ethiopia"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{siteSettings?.contact_phone || "+251 911 234 567"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{siteSettings?.contact_email || "info@kebronhotel.com"}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} Kebron International Hotel. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Secured Portal System with Supabase Integration</span>
        </div>
      </div>

      {/* REPEATING COLOR PATTERN BAR (BLUE, WHITE, BROWN) UNDER FOOTER */}
      <div className="repeating-pattern-bar" title="Repeating Blue, White, Brown Pattern Bar (Footer Bottom)"></div>
    </footer>
  );
};
