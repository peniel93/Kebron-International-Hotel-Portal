import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { FeaturedDiscountSlider } from '../components/FeaturedDiscountSlider';
import { ShoppingBag, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';

export const MenuPage = () => {
  const { t } = useLanguage();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [alert, setAlert] = useState(null);
  const scrollContainerRef = useRef(null);

  // Bank Accounts state for active bank selection
  const [activeBankAccounts, setActiveBankAccounts] = useState([]);

  // Order Modal State
  const [orderModalItem, setOrderModalItem] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryLocation, setDeliveryLocation] = useState('Room # / Table # / Delivery Spot');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentBank, setPaymentBank] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 2. PAGINATION STATE (EXACTLY 8 ITEMS PER PAGE)
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
    loadActiveBanks();
  }, []);

  const loadData = async () => {
    const items = await dataService.getMenuItems();
    setMenuItems(items);
    
    // Dynamically load categories from database created by Main Registrar Admin
    const dbCats = await dataService.getMenuCategories();
    setCategories(dbCats);
  };

  const loadActiveBanks = async () => {
    const banks = await dataService.getBankAccounts();
    const activeOnly = banks.filter(b => b.status === 'ACTIVE');
    setActiveBankAccounts(activeOnly);
    if (activeOnly.length > 0) {
      setPaymentBank(activeOnly[0].bank_name);
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredItems = activeCategory === 'ALL'
    ? menuItems
    : menuItems.filter(m => (m.category || '').toLowerCase() === activeCategory.toLowerCase());

  // 2. Calculate 8 Items per page Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (catName) => {
    setActiveCategory(catName);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleOpenOrderModal = (item) => {
    setOrderModalItem(item);
    setQuantity(1);
    setDeliveryLocation('Room # / Table # / Delivery Spot');
    setOrderNotes('');
    setAlert(null);
  };

  const getItemUnitPrice = (item) => {
    if (!item) return 0;
    if (item.discount_percentage > 0) {
      return item.price * (1 - item.discount_percentage / 100);
    }
    return item.discount_price || item.price;
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderModalItem) return;

    setSubmitting(true);
    const unitPrice = getItemUnitPrice(orderModalItem);
    const qty = Math.max(1, parseInt(quantity) || 1);
    const total = unitPrice * qty;

    const res = await dataService.createOnlineOrder({
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      item_id: orderModalItem.id,
      item_title: orderModalItem.title,
      item_category: orderModalItem.category,
      unit_price: unitPrice,
      quantity: qty,
      total_amount: total,
      payment_bank: paymentBank,
      payment_receipt_url: paymentProofFile ? paymentProofFile.name : 'receipt_screenshot.png',
      delivery_location: deliveryLocation,
      order_notes: orderNotes
    });

    setSubmitting(false);
    setOrderModalItem(null);
    setAlert({
      type: 'success',
      message: `Order Confirmed! Reference Code: ${res.order_code}. An official receipt has been issued and transmitted to the Main Registrar.`
    });

    loadData();
  };

  const selectedBankDetails = activeBankAccounts.find(b => b.bank_name === paymentBank) || activeBankAccounts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('foodMenuTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Explore Kebron Hotel's signature traditional Ethiopian dishes, gourmet chef specials, artisan coffees, fresh juices, and custom menu selections.
        </p>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* 1. Featured & Discounted Deals Carousel Slider */}
      <FeaturedDiscountSlider onExploreMenuClick={(dealItem) => handleOpenOrderModal(dealItem)} />

      {/* Scrollable Horizontal Category Bar */}
      <div className="relative max-w-7xl mx-auto">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/80 text-white shadow-lg border border-white/20 hover:bg-amber-600 transition-colors hidden sm:flex"
          aria-label="Scroll Categories Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-2 sm:px-10 max-w-full"
        >
          <button
            onClick={() => handleCategoryChange('ALL')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              activeCategory === 'ALL'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {t('allCategories')}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                activeCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/80 text-white shadow-lg border border-white/20 hover:bg-amber-600 transition-colors hidden sm:flex"
          aria-label="Scroll Categories Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Menu Items Grid (Paginated to 8 Items per page) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedItems.map((item) => {
          const hasDiscount = (item.discount_percentage > 0) || !!item.discount_price;
          const finalOfferPrice = item.discount_percentage > 0 
            ? (item.price * (1 - item.discount_percentage / 100))
            : (item.discount_price || item.price);

          return (
            <div key={item.id} className="glass-card overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md">
                    {item.category}
                  </span>
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs shadow-md">
                      {item.discount_percentage ? `${item.discount_percentage}% OFF` : 'OFFER'}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
                <div>
                  <span className="text-lg font-black text-amber-600 block">
                    {finalOfferPrice.toLocaleString()} ETB
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] text-slate-400 line-through">
                      {item.price.toLocaleString()} ETB
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleOpenOrderModal(item)}
                  className="btn-pattern-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-transform"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('orderOnline')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. PAGINATION CONTROLS (8 Items Per Page) */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500">
            Showing Page {currentPage} of {totalPages} ({filteredItems.length} Total Items)
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
                      ? 'bg-blue-600 text-white shadow'
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

      {/* ONLINE FOOD / ITEM ORDER MODAL */}
      {orderModalItem && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-500" />
                <span>Online Order — {orderModalItem.title}</span>
              </h3>
              <button onClick={() => setOrderModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4 my-4">
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
                  <label className="block text-xs font-bold mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Delivery Spot / Room / Table # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room #204 / Table 12 / Garden"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Special Order Preparation Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Medium spicy, extra boiled egg, no onion..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="form-input text-xs"
                />
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
                  <span>Item:</span>
                  <span className="font-bold">{orderModalItem.title}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Unit Price x Qty:</span>
                  <span className="font-bold">{getItemUnitPrice(orderModalItem).toLocaleString()} ETB x {quantity}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-amber-600 border-t pt-1 mt-1">
                  <span>Total Amount Due:</span>
                  <span>
                    {(getItemUnitPrice(orderModalItem) * quantity).toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOrderModalItem(null)} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={submitting} className="btn-pattern-gold px-6 py-2 text-xs font-bold shadow-lg">
                  {submitting ? "Submitting Order..." : "Confirm & Pay Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

