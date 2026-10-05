import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { FeaturedDiscountSlider } from '../components/FeaturedDiscountSlider';
import { 
  Calendar, 
  Sparkles, 
  Utensils, 
  ChevronRight, 
  MapPin, 
  Phone, 
  ArrowRight,
  Check
} from 'lucide-react';

export const HomePage = ({ setActiveTab, onBookRoomClick }) => {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    dataService.getSiteSettings().then(setSiteSettings);
    dataService.getRooms().then(res => setRooms(res.slice(0, 4)));
    dataService.getMenuItems().then(res => setMenuItems(res.slice(0, 4)));
    
    // Load custom menu categories from database
    dataService.getMenuCategories().then(setCategories);

    // Filter public announcements only
    dataService.getAnnouncements().then(res => {
      const publicOnly = res.filter(a => !a.target_role || a.target_role === 'ALL' || a.target_role === 'PUBLIC');
      setAnnouncements(publicOnly);
    });
  }, []);

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* HERO BANNER SECTION - 100% Fluid Shrinkable */}
      <section className="relative min-h-[380px] sm:min-h-[500px] lg:min-h-[580px] flex items-center justify-center text-white overflow-hidden rounded-b-3xl shadow-2xl px-3 sm:px-6 py-6 sm:py-8 max-w-full">
        <img
          src={siteSettings?.hero_bg_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"}
          alt="Kebron International Hotel Banner"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45]"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-3 sm:space-y-6 w-full">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Welcome to Premium Ethiopian Hospitality</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md break-words max-w-full">
            {siteSettings?.hotel_name || t('hotelName')}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-200 max-w-3xl mx-auto font-light leading-relaxed px-2 break-words">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-4 max-w-full">
            <button
              onClick={() => setActiveTab('rooms')}
              className="btn-pattern-gold px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-xl hover:scale-105 transition-transform"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{t('bookNow')}</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className="btn-pattern-primary px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-xl hover:scale-105 transition-transform"
            >
              <Utensils className="w-4 h-4 shrink-0" />
              <span>{t('exploreMenu')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED & DISCOUNTED DEALS CAROUSEL SLIDER */}
      <FeaturedDiscountSlider 
        onBookRoomClick={() => setActiveTab('rooms')}
        onExploreMenuClick={() => setActiveTab('menu')}
      />

      {/* PUBLIC ANNOUNCEMENTS & NEWS SLIDER */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-3 max-w-full">
            <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
              <div className="p-2 sm:p-3 rounded-xl bg-amber-600 text-white font-bold shrink-0">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase text-amber-600 dark:text-amber-400 block truncate">Public Hotel News & Notices</span>
                <h4 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {announcements[0]?.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 line-clamp-2 break-words">
                  {announcements[0]?.content}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('gallery')}
              className="px-3 sm:px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-amber-700 transition-colors shrink-0 w-full sm:w-auto justify-center"
            >
              <span>View All Notices</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* FEATURED ROOMS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white break-words">
              Featured Rooms & Luxury Suites
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 break-words">
              Choose from Solo, Family, Business, Economy, and VIP Suites with exclusive special features.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('rooms')}
            className="text-amber-600 hover:text-amber-700 font-bold text-xs sm:text-sm flex items-center gap-1 shrink-0"
          >
            <span>View All Room Types</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full">
          {rooms.map((room) => {
            const hasDiscount = room.discount_percentage > 0;
            const discountedPrice = hasDiscount 
              ? (room.price_per_night * (1 - room.discount_percentage / 100))
              : room.price_per_night;

            return (
              <div key={room.id} className="glass-card overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={room.image_url}
                      alt={room.room_type}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] sm:text-xs shadow-md">
                      {room.room_type}
                    </span>
                    {hasDiscount && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-[10px] sm:text-xs shadow-md">
                        {room.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        Room #{room.room_number}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 break-words">
                      {room.description}
                    </p>

                    {room.special_highlights && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{room.special_highlights}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 gap-2">
                  <div>
                    <span className="text-sm sm:text-base font-black text-amber-600 block">
                      {discountedPrice.toLocaleString()} ETB
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-400 line-through">
                        Reg: {room.price_per_night.toLocaleString()} ETB
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (onBookRoomClick) onBookRoomClick(room);
                      setActiveTab('rooms');
                    }}
                    className="btn-pattern-gold px-2.5 py-1.5 text-[11px] sm:text-xs shrink-0"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED DINING HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white break-words">
              Delicious Ethiopian & International Culinary Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 break-words">
              Fresh ingredients, traditional spices, coffee macchiatos & fresh juices with special discount rates.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-amber-600 hover:text-amber-700 font-bold text-xs sm:text-sm flex items-center gap-1 shrink-0"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Categories Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 max-w-full">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Menu Categories:</span>
          {categories.map((cat) => (
            <span 
              key={cat.id || cat.name}
              onClick={() => setActiveTab('menu')}
              className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer transition-colors"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full">
          {menuItems.map((item) => {
            const hasDiscount = (item.discount_percentage > 0) || !!item.discount_price;
            const finalOfferPrice = item.discount_percentage > 0 
              ? (item.price * (1 - item.discount_percentage / 100))
              : (item.discount_price || item.price);

            return (
              <div key={item.id} className="glass-card overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] sm:text-xs shadow-md">
                    {item.category}
                  </span>
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-[10px] sm:text-xs shadow-md">
                      {item.discount_percentage ? `${item.discount_percentage}% OFF` : 'OFFER'}
                    </span>
                  )}
                </div>
                  <div className="p-3.5 sm:p-4 space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 break-words">
                      {item.description}
                    </p>
                  </div>

                <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 gap-2">
                  <div>
                    <span className="text-base sm:text-lg font-black text-amber-600 block">
                      {finalOfferPrice.toLocaleString()} ETB
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {item.price.toLocaleString()} ETB
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="btn-pattern-primary px-2.5 py-1.5 text-[11px] sm:text-xs shrink-0 font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>{t('orderOnline')}</span>
                  </button>
                </div>
              </div>
            );
          })}</div>
      </section>

      {/* LOCATION & GOOGLE MAPS EMBED */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-3 max-w-full">
          <div className="p-5 sm:p-8 space-y-3 sm:space-y-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Location & Contact</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold leading-tight break-words">
              Visit Kebron International Hotel
            </h3>
            <p className="text-xs text-slate-300 break-words">
              Conveniently located along the main boulevard with 24/7 guest services, secure parking, and shuttle service.
            </p>
            <div className="space-y-1.5 text-xs pt-1 text-slate-300 break-words">
              <p><span className="font-bold text-white">Address:</span> {siteSettings?.location_address}</p>
              <p><span className="font-bold text-white">Phone:</span> {siteSettings?.contact_phone}</p>
              <p><span className="font-bold text-white">Email:</span> {siteSettings?.contact_email}</p>
            </div>
            <button
              onClick={() => setActiveTab('contact')}
              className="btn-pattern-gold px-4 py-2 text-xs font-bold self-start mt-2"
            >
              Get Directions & Contact
            </button>
          </div>

          <div className="lg:col-span-2 h-56 sm:h-80 lg:h-auto min-h-[220px]">
            <iframe
              title="Kebron Hotel Google Map Location"
              src={siteSettings?.google_maps_url}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};
