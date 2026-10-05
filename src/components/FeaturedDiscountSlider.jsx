import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { ChevronLeft, ChevronRight, Sparkles, Tag, Calendar, Utensils } from 'lucide-react';

export const FeaturedDiscountSlider = ({ onBookRoomClick, onExploreMenuClick }) => {
  const { t } = useLanguage();
  const [discountDeals, setDiscountDeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadDiscountDeals();
  }, []);

  const loadDiscountDeals = async () => {
    const rooms = await dataService.getRooms();
    const menuItems = await dataService.getMenuItems();

    const discountedRooms = rooms
      .filter(r => (r.discount_percentage || 0) > 0)
      .map(r => ({ ...r, deal_type: 'ROOM' }));

    const discountedMenuItems = menuItems
      .filter(m => (m.discount_percentage || 0) > 0 || m.discount_price)
      .map(m => ({ ...m, deal_type: 'MENU' }));

    const combined = [...discountedRooms, ...discountedMenuItems];
    setDiscountDeals(combined);
  };

  // Auto-play timer
  useEffect(() => {
    if (discountDeals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % discountDeals.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [discountDeals.length]);

  if (discountDeals.length === 0) return null;

  const currentDeal = discountDeals[currentIndex];
  const isRoom = currentDeal.deal_type === 'ROOM';

  const regularPrice = isRoom ? currentDeal.price_per_night : currentDeal.price;
  const discountPercent = currentDeal.discount_percentage || 10;
  const offerPrice = isRoom 
    ? (regularPrice * (1 - discountPercent / 100))
    : (currentDeal.discount_price || regularPrice * (1 - discountPercent / 100));

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + discountDeals.length) % discountDeals.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % discountDeals.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 w-full">
      <div className="relative glass-card overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-amber-950 text-white rounded-3xl border border-amber-500/40 shadow-2xl">
        
        {/* Top Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 backdrop-blur-md px-4 sm:px-6 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
            <span className="truncate">Featured Deals & Discount Offers</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-100 shrink-0">
            {currentIndex + 1} / {discountDeals.length} Offers
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px] sm:min-h-[360px]">
          
          {/* Image Side */}
          <div className="relative h-48 sm:h-64 lg:h-auto overflow-hidden">
            <img
              src={currentDeal.image_url}
              alt={isRoom ? currentDeal.room_type : currentDeal.title}
              className="w-full h-full object-cover filter brightness-95 transition-all duration-700 hover:scale-105"
            />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-[10px] sm:text-xs shadow-xl flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>{discountPercent}% OFF</span>
            </span>
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] sm:text-xs shadow-md truncate max-w-[80%]">
              {isRoom ? `Room #${currentDeal.room_number} (${currentDeal.room_type})` : `Category: ${currentDeal.category}`}
            </span>
          </div>

          {/* Details Side */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold uppercase max-w-full">
                {isRoom ? <Calendar className="w-3 h-3 shrink-0" /> : <Utensils className="w-3 h-3 shrink-0" />}
                <span className="truncate">{isRoom ? 'Luxury Suite Special' : 'Culinary Discount'}</span>
              </div>

              <h3 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight break-words">
                {isRoom ? `${currentDeal.room_type} — Room #${currentDeal.room_number}` : currentDeal.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 break-words">
                {currentDeal.description}
              </p>

              {currentDeal.special_highlights && (
                <p className="text-[11px] sm:text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{currentDeal.special_highlights}</span>
                </p>
              )}
            </div>

            {/* Pricing & CTA */}
            <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
              <div>
                <span className="text-xl sm:text-3xl font-black text-amber-400 block">
                  {offerPrice.toLocaleString()} ETB <span className="text-[10px] sm:text-xs text-slate-300 font-normal">{isRoom ? '/ night' : ''}</span>
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 line-through block">
                  Reg: {regularPrice.toLocaleString()} ETB
                </span>
              </div>

              <button
                onClick={() => {
                  if (isRoom && onBookRoomClick) onBookRoomClick(currentDeal);
                  else if (!isRoom && onExploreMenuClick) onExploreMenuClick();
                }}
                className="btn-pattern-gold px-4 sm:px-6 py-2.5 sm:py-3 text-xs font-bold shadow-xl hover:scale-105 transition-transform shrink-0 rounded-xl"
              >
                {isRoom ? 'Book Deal' : 'Order Deal'}
              </button>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white shadow-xl hover:bg-amber-600 transition-colors z-20 border border-white/20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white shadow-xl hover:bg-amber-600 transition-colors z-20 border border-white/20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {discountDeals.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
