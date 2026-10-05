import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { FeaturedDiscountSlider } from '../components/FeaturedDiscountSlider';
import { Calendar, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export const RoomsPage = () => {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [alert, setAlert] = useState(null);

  // 2. PAGINATION STATE (EXACTLY 8 ROOMS PER PAGE)
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Bank Accounts state for active bank selection
  const [activeBankAccounts, setActiveBankAccounts] = useState([]);

  // Booking Modal State
  const [bookingModalRoom, setBookingModalRoom] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-08-20');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-22');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [paymentBank, setPaymentBank] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRooms();
    loadActiveBanks();
  }, []);

  const loadRooms = async () => {
    const res = await dataService.getRooms();
    setRooms(res);
  };

  const loadActiveBanks = async () => {
    const banks = await dataService.getBankAccounts();
    const activeOnly = banks.filter(b => b.status === 'ACTIVE');
    setActiveBankAccounts(activeOnly);
    if (activeOnly.length > 0) {
      setPaymentBank(activeOnly[0].bank_name);
    }
  };

  const roomTypes = ['ALL', 'Solo Room', 'Family Room', 'Business Class', 'Economy Class', 'VIP Room', 'Private Room'];

  const filteredRooms = filterType === 'ALL'
    ? rooms
    : rooms.filter(r => (r.room_type || '').toLowerCase() === filterType.toLowerCase());

  // 2. Calculate 8 Rooms per page Pagination
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE) || 1;
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (room) => {
    setBookingModalRoom(room);
    setSelectedRoomNumber(room.room_number);
    setAlert(null);
  };

  const calculateDays = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return isNaN(diff) ? 1 : diff;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingModalRoom) return;

    setSubmitting(true);
    const days = calculateDays();
    const effectivePrice = bookingModalRoom.discount_percentage > 0
      ? (bookingModalRoom.price_per_night * (1 - bookingModalRoom.discount_percentage / 100))
      : bookingModalRoom.price_per_night;

    const total = effectivePrice * days;

    const res = await dataService.createReservation({
      customer_name: customerName,
      email: customerEmail,
      phone: customerPhone,
      room_id: bookingModalRoom.id,
      room_type: bookingModalRoom.room_type,
      room_number: selectedRoomNumber || bookingModalRoom.room_number,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      total_amount: total,
      payment_bank: paymentBank,
      payment_transaction_ref: `REF-${Math.floor(100000 + Math.random() * 900000)}`
    });

    setSubmitting(false);
    setBookingModalRoom(null);
    setAlert({
      type: 'success',
      message: `Reservation Confirmed! Booking Reference Code: ${res.booking_code}. An official receipt has been issued.`
    });

    loadRooms();
  };

  const selectedBankDetails = activeBankAccounts.find(b => b.bank_name === paymentBank) || activeBankAccounts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('roomsTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {t('roomsSubtitle')}
        </p>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* 1. Featured & Discounted Deals Carousel Slider */}
      <FeaturedDiscountSlider onBookRoomClick={handleOpenBooking} />

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {roomTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? 'bg-amber-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 2. Room Cards Grid (Paginated to 8 Rooms per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedRooms.map((room) => {
          const hasDiscount = room.discount_percentage > 0;
          const discountedPrice = hasDiscount 
            ? (room.price_per_night * (1 - room.discount_percentage / 100))
            : room.price_per_night;

          return (
            <div key={room.id} className="glass-card overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all">
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image_url}
                    alt={room.room_type}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md">
                    {room.room_type}
                  </span>
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs shadow-md">
                      {room.discount_percentage}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Room #{room.room_number}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Floor {room.floor_number}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {room.description}
                  </p>

                  {room.special_highlights && (
                    <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{room.special_highlights}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
                <div>
                  <span className="text-base font-black text-amber-600 block">
                    {discountedPrice.toLocaleString()} ETB
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] text-slate-400 line-through">
                      {room.price_per_night.toLocaleString()} ETB
                    </span>
                  )}
                </div>

                <button
                  disabled={room.is_reserved}
                  onClick={() => handleOpenBooking(room)}
                  className={`btn-pattern-gold px-3 py-1.5 text-xs ${
                    room.is_reserved ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {room.is_reserved ? 'Booked' : t('bookNow')}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 2. PAGINATION CONTROLS (8 Rooms Per Page) */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500">
            Showing Page {currentPage} of {totalPages} ({filteredRooms.length} Total Rooms)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold disabled:opacity-40 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ROOM RESERVATION MODAL */}
      {bookingModalRoom && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>{t('bookRoomModalTitle')} ({bookingModalRoom.room_type})</span>
              </h3>
              <button onClick={() => setBookingModalRoom(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 my-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">{t('guestName')} *</label>
                  <input type="text" required placeholder="Full Guest Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{t('phone')} *</label>
                  <input type="tel" required placeholder="+251 9..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="form-input" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('email')} *</label>
                <input type="email" required placeholder="guest@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="form-input" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">{t('checkIn')}</label>
                  <input type="date" required value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{t('checkOut')}</label>
                  <input type="date" required value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="form-input" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('selectRoomNumber')} *</label>
                <select value={selectedRoomNumber} onChange={(e) => setSelectedRoomNumber(e.target.value)} className="form-input font-bold">
                  <option value={bookingModalRoom.room_number}>
                    Room #{bookingModalRoom.room_number} - {bookingModalRoom.room_type} (Floor {bookingModalRoom.floor_number})
                  </option>
                  {rooms.filter(r => !r.is_reserved && r.room_type === bookingModalRoom.room_type && r.id !== bookingModalRoom.id).map(r => (
                    <option key={r.id} value={r.room_number}>
                      Room #{r.room_number} - Floor {r.floor_number} ({r.block_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Hotel Bank Accounts Dropdown */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  Select Active Payment Bank *
                </label>
                <select value={paymentBank} onChange={(e) => setPaymentBank(e.target.value)} className="form-input font-bold text-xs">
                  {activeBankAccounts.map((bank) => (
                    <option key={bank.id || bank.bank_name} value={bank.bank_name}>
                      {bank.bank_name} — Acc: {bank.account_number}
                    </option>
                  ))}
                </select>

                {selectedBankDetails && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-200">Selected Bank:</span>
                      <span className="font-extrabold text-amber-600">{selectedBankDetails.bank_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-200">Account Number:</span>
                      <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">{selectedBankDetails.account_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-200">Account Holder:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedBankDetails.account_holder}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t('uploadReceipt')} *</label>
                <input type="file" accept="image/*,.pdf" required onChange={(e) => setPaymentProofFile(e.target.files[0])} className="form-input text-xs" />
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Duration:</span>
                  <span className="font-bold">{calculateDays()} Days</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-amber-600 border-t pt-1 mt-1">
                  <span>Total Amount Due:</span>
                  <span>
                    {((bookingModalRoom.discount_percentage > 0
                      ? (bookingModalRoom.price_per_night * (1 - bookingModalRoom.discount_percentage / 100))
                      : bookingModalRoom.price_per_night) * calculateDays()).toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setBookingModalRoom(null)} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={submitting} className="btn-pattern-gold px-6 py-2 text-xs font-bold shadow-lg">
                  {submitting ? "Submitting..." : t('confirmBooking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
