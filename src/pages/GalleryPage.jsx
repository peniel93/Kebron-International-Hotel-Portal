import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Image, Video, Sparkles, Calendar, Bell } from 'lucide-react';

export const GalleryPage = () => {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // 4. Filter public announcements only (target_role === 'ALL' or 'PUBLIC')
    dataService.getAnnouncements().then(res => {
      const publicOnly = res.filter(a => !a.target_role || a.target_role === 'ALL' || a.target_role === 'PUBLIC');
      setAnnouncements(publicOnly);
    });
  }, []);

  const galleryItems = [
    {
      title: "Kebron Hotel Grand Entrance & Lobby",
      type: "IMAGE",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      category: "Hotel Exterior"
    },
    {
      title: "Executive Luxury VIP Suite Balcony View",
      type: "IMAGE",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      category: "Rooms & Suites"
    },
    {
      title: "Cultural Ethiopian Coffee & Dining Festival",
      type: "IMAGE",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      category: "Dining & Events"
    },
    {
      title: "Main Conference & Wedding Event Hall",
      type: "IMAGE",
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
      category: "Halls & Events"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('gallery')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Explore photo galleries, video moments, public hotel events, training announcements, and memorable highlights from Kebron International Hotel.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryItems.map((item, idx) => (
          <div key={idx} className="glass-card overflow-hidden group">
            <div className="relative h-56 overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-600 text-white font-bold text-xs shadow">
                {item.category}
              </span>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Public Announcements & Notices Only */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" />
          <span>Public Hotel Announcements & News</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="glass-card p-5 border-l-4 border-blue-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400">{ann.created_at}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {ann.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {ann.content}
              </p>
              <p className="text-[11px] text-amber-600 font-semibold pt-1">
                Posted by: {ann.posted_by}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
