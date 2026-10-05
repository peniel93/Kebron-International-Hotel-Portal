import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  initialRooms,
  initialBankAccounts,
  initialMenuCategories,
  initialMenuItems,
  initialVacancies,
  initialUsers,
  initialStoreAssets,
  initialApplications,
  initialAnnouncements,
  initialStoreCategories,
  initialShiftRosters,
  initialOnlineOrders
} from './mockData';

// Storage Helper
const getStorageItem = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultVal;
  }
};

const setStorageItem = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const dataService = {
  // 1. AUTHENTICATION & USERS
  loginUser: async (username, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      if (!error && data) {
        if (data.password_hash === password || (!data.is_password_changed && data.default_password === password)) {
          return data;
        }
      }
    }

    const users = getStorageItem('kebron_users', initialUsers);
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Primary lookup by exact/trimmed username
    let user = users.find(u => {
      const uName = (u.username || '').trim().toLowerCase();
      return uName === cleanUser;
    });

    // 2. Secondary lookup by role alias (e.g. "MAIN REGISTRAR", "MAIN_REGISTRAR", "JANITOR", "MANAGER", "HR", "STORE MANAGER")
    if (!user) {
      user = users.find(u => {
        const uRole = (u.role || '').trim().toLowerCase();
        const uRoleSpaced = uRole.replace(/_/g, ' ');
        return uRole === cleanUser || uRoleSpaced === cleanUser || cleanUser.includes(uRole);
      });
    }

    if (user) {
      const matchPassHash = user.password_hash && user.password_hash.trim() === cleanPass;
      const matchDefaultPass = user.default_password && user.default_password.trim() === cleanPass;
      const isDefaultFallback = cleanPass === '1234';

      if (user.is_password_changed) {
        // Password was changed -> MUST match new password_hash
        if (matchPassHash) {
          return user;
        }
      } else {
        // Password not changed yet -> allow password_hash, default_password, or fallback 1234
        if (matchPassHash || matchDefaultPass || isDefaultFallback) {
          return user;
        }
      }
    }
    return null;
  },

  changeUserPassword: async (userId, newPassword) => {
    const users = getStorageItem('kebron_users', initialUsers);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].password_hash = newPassword;
      users[idx].is_password_changed = true;
      users[idx].default_password = null; // Default password disabled!
      setStorageItem('kebron_users', users);
      return users[idx];
    }
    return null;
  },

  getUsers: async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('users').select('*');
      if (!error) return data;
    }
    return getStorageItem('kebron_users', initialUsers);
  },

  createUser: async (userData) => {
    const year = new Date().getFullYear();
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    let prefix = "EMP";
    if (userData.role === "MAIN_REGISTRAR") prefix = "MR";
    else if (userData.role === "GUARDIAN") prefix = "GD";
    else if (userData.role === "JANITOR") prefix = "JN";
    else if (userData.role === "COOK" || userData.role === "CHEF") prefix = "CK";
    else if (userData.role === "HR") prefix = "HR";
    else if (userData.role === "ACCOUNTANT") prefix = "AC";
    else if (userData.role === "FINANCE") prefix = "FN";
    else if (userData.role === "STORE_MANAGER") prefix = "SM";
    else if (userData.role === "MANAGER") prefix = "MG";

    const generatedUsername = `${prefix}/${randomPin}/${year}`;
    const newUser = {
      id: "user-" + Date.now(),
      username: generatedUsername,
      full_name: userData.full_name,
      email: userData.email || `${generatedUsername.replace(/\//g, '').toLowerCase()}@kebronhotel.com`,
      phone: userData.phone || "+251900000000",
      role: userData.role || "EMPLOYEE",
      gender: userData.gender || "Female",
      address: userData.address || "Ethiopia",
      profile_image: userData.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      password_hash: randomPin,
      default_password: randomPin,
      status: "ACTIVE",
      is_admin: userData.role === "MAIN_REGISTRAR" || userData.role === "MANAGER",
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('users').insert([newUser]).select().single();
      if (!error && data) return data;
    }

    const users = getStorageItem('kebron_users', initialUsers);
    users.push(newUser);
    setStorageItem('kebron_users', users);
    return newUser;
  },

  updateUser: async (id, updatedFields) => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('users').update(updatedFields).eq('id', id).select().single();
      if (data) return data;
    }
    const users = getStorageItem('kebron_users', initialUsers);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedFields };
      setStorageItem('kebron_users', users);
      return users[index];
    }
    return null;
  },

  deleteUser: async (id) => {
    if (isSupabaseConfigured()) {
      await supabase.from('users').delete().eq('id', id);
    }
    const users = getStorageItem('kebron_users', initialUsers);
    const filtered = users.filter(u => u.id !== id);
    setStorageItem('kebron_users', filtered);
    return true;
  },

  resetUserPassword: async (id) => {
    const users = getStorageItem('kebron_users', initialUsers);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      const defaultPass = "1234";
      users[index].password_hash = defaultPass;
      users[index].default_password = defaultPass;
      users[index].is_password_changed = false; // Forces user to change password on next login
      setStorageItem('kebron_users', users);
      return defaultPass;
    }
    return "1234";
  },

  // 2. ROOMS & RESERVATIONS
  getRooms: async () => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('rooms').select('*');
      if (data) return data;
    }
    return getStorageItem('kebron_rooms', initialRooms);
  },

  saveRoom: async (roomData) => {
    const rooms = getStorageItem('kebron_rooms', initialRooms);
    let updated;
    const price = parseFloat(roomData.price_per_night) || 2000;
    const discount = parseFloat(roomData.discount_percentage) || 0;
    const features = Array.isArray(roomData.features) 
      ? roomData.features 
      : (typeof roomData.features === 'string' ? roomData.features.split(',').map(f => f.trim()).filter(Boolean) : ["WiFi", "TV"]);

    if (roomData.id) {
      const idx = rooms.findIndex(r => r.id === roomData.id);
      if (idx !== -1) {
        rooms[idx] = { 
          ...rooms[idx], 
          ...roomData,
          price_per_night: price,
          discount_percentage: discount,
          features,
          special_highlights: roomData.special_highlights || rooms[idx].special_highlights || ""
        };
        updated = rooms[idx];
      }
    } else {
      updated = {
        id: "room-" + Date.now(),
        room_number: roomData.room_number,
        block_name: roomData.block_name || "Block A",
        floor_number: parseInt(roomData.floor_number) || 1,
        room_type: roomData.room_type || "Solo Room",
        price_per_night: price,
        discount_percentage: discount,
        is_reserved: false,
        description: roomData.description || "",
        features,
        special_highlights: roomData.special_highlights || "",
        image_url: roomData.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
      };
      rooms.push(updated);
    }
    setStorageItem('kebron_rooms', rooms);
    return updated;
  },

  toggleRoomReservation: async (id, isReserved) => {
    const rooms = getStorageItem('kebron_rooms', initialRooms);
    const idx = rooms.findIndex(r => r.id === id);
    if (idx !== -1) {
      rooms[idx].is_reserved = isReserved;
      setStorageItem('kebron_rooms', rooms);
      return rooms[idx];
    }
    return null;
  },

  deleteRoom: async (id) => {
    const rooms = getStorageItem('kebron_rooms', initialRooms);
    const filtered = rooms.filter(r => r.id !== id);
    setStorageItem('kebron_rooms', filtered);
    return true;
  },

  getReservations: async () => {
    return getStorageItem('kebron_reservations', []);
  },

  createReservation: async (bookingData) => {
    const reservations = getStorageItem('kebron_reservations', []);
    const newBooking = {
      id: "res-" + Date.now(),
      booking_code: "KBR-" + Math.floor(100000 + Math.random() * 900000),
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      room_id: bookingData.room_id,
      room_type: bookingData.room_type,
      room_number: bookingData.room_number,
      check_in_date: bookingData.check_in_date,
      check_out_date: bookingData.check_out_date,
      days_count: bookingData.days_count || 1,
      total_amount: bookingData.total_amount,
      payment_bank: bookingData.payment_bank || "CBE Commercial Bank of Ethiopia",
      payment_receipt_url: bookingData.payment_receipt_url || "receipt_screenshot.png",
      status: "PENDING",
      created_at: new Date().toISOString()
    };
    reservations.push(newBooking);
    setStorageItem('kebron_reservations', reservations);

    if (bookingData.room_id) {
      dataService.toggleRoomReservation(bookingData.room_id, true);
    }

    return newBooking;
  },

  updateReservationStatus: async (id, status) => {
    const reservations = getStorageItem('kebron_reservations', []);
    const idx = reservations.findIndex(r => r.id === id);
    if (idx !== -1) {
      reservations[idx].status = status;
      setStorageItem('kebron_reservations', reservations);
      return reservations[idx];
    }
    return null;
  },

  // 3. MENU ITEMS (WITH EDITING & DISCOUNT PERCENTAGE SUPPORT)
  getMenuItems: async () => {
    return getStorageItem('kebron_menu', initialMenuItems);
  },

  getMenuCategories: async () => {
    return getStorageItem('kebron_menu_categories', initialMenuCategories);
  },

  saveMenuCategory: async (categoryData) => {
    const categories = getStorageItem('kebron_menu_categories', initialMenuCategories);
    let updated;
    if (categoryData.id) {
      const idx = categories.findIndex(c => c.id === categoryData.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...categoryData };
        updated = categories[idx];
      }
    } else {
      updated = {
        id: "cat-" + Date.now(),
        name: categoryData.name,
        description: categoryData.description || ""
      };
      categories.push(updated);
    }
    setStorageItem('kebron_menu_categories', categories);
    return updated;
  },

  deleteMenuCategory: async (id) => {
    const categories = getStorageItem('kebron_menu_categories', initialMenuCategories);
    const filtered = categories.filter(c => c.id !== id);
    setStorageItem('kebron_menu_categories', filtered);
    return true;
  },

  saveMenuItem: async (itemData) => {
    const menu = getStorageItem('kebron_menu', initialMenuItems);
    let updated;
    const price = parseFloat(itemData.price) || 0;
    const discountPercent = parseFloat(itemData.discount_percentage) || 0;
    const discountPrice = discountPercent > 0 ? (price * (1 - discountPercent / 100)) : (itemData.discount_price ? parseFloat(itemData.discount_price) : null);

    if (itemData.id) {
      const idx = menu.findIndex(m => m.id === itemData.id);
      if (idx !== -1) {
        menu[idx] = { 
          ...menu[idx], 
          ...itemData,
          price,
          discount_percentage: discountPercent,
          discount_price: discountPrice
        };
        updated = menu[idx];
      }
    } else {
      updated = {
        id: "menu-" + Date.now(),
        title: itemData.title,
        category: itemData.category || "Meal",
        price,
        discount_percentage: discountPercent,
        discount_price: discountPrice,
        description: itemData.description || "",
        is_available: true,
        image_url: itemData.image_url || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      };
      menu.push(updated);
    }
    setStorageItem('kebron_menu', menu);
    return updated;
  },

  deleteMenuItem: async (id) => {
    const menu = getStorageItem('kebron_menu', initialMenuItems);
    const filtered = menu.filter(m => m.id !== id);
    setStorageItem('kebron_menu', filtered);
    return true;
  },

  // 3B. ONLINE FOOD & ITEM ORDERS
  getOnlineOrders: async () => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('online_orders').select('*');
      if (data) return data;
    }
    return getStorageItem('kebron_online_orders', initialOnlineOrders);
  },

  createOnlineOrder: async (orderData) => {
    const orders = getStorageItem('kebron_online_orders', initialOnlineOrders);
    const newOrder = {
      id: "ord-" + Date.now(),
      order_code: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email || orderData.email,
      customer_phone: orderData.customer_phone || orderData.phone,
      item_id: orderData.item_id,
      item_title: orderData.item_title,
      item_category: orderData.item_category || "Meal",
      unit_price: parseFloat(orderData.unit_price) || 0,
      quantity: parseInt(orderData.quantity) || 1,
      total_amount: parseFloat(orderData.total_amount) || 0,
      payment_bank: orderData.payment_bank || "CBE Commercial Bank of Ethiopia",
      payment_receipt_url: orderData.payment_receipt_url || "receipt_screenshot.png",
      delivery_location: orderData.delivery_location || "Hotel Restaurant / Room Delivery",
      order_notes: orderData.order_notes || "",
      status: "PENDING",
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('online_orders').insert([newOrder]).select().single();
      if (data) return data;
    }

    orders.unshift(newOrder);
    setStorageItem('kebron_online_orders', orders);
    return newOrder;
  },

  updateOnlineOrderStatus: async (id, status) => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('online_orders').update({ status }).eq('id', id).select().single();
      if (data) return data;
    }
    const orders = getStorageItem('kebron_online_orders', initialOnlineOrders);
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      setStorageItem('kebron_online_orders', orders);
      return orders[idx];
    }
    return null;
  },

  // 4. VACANCIES & APPLICANTS
  getVacancies: async () => {
    return getStorageItem('kebron_vacancies', initialVacancies);
  },

  saveVacancy: async (vacData) => {
    const vacancies = getStorageItem('kebron_vacancies', initialVacancies);
    let updated;
    if (vacData.id) {
      const idx = vacancies.findIndex(v => v.id === vacData.id);
      if (idx !== -1) {
        vacancies[idx] = { ...vacancies[idx], ...vacData };
        updated = vacancies[idx];
      }
    } else {
      updated = {
        id: "vac-" + Date.now(),
        title: vacData.title,
        department: vacData.department || "General",
        description: vacData.description,
        requirements: vacData.requirements,
        criteria: vacData.criteria || "",
        application_deadline: vacData.application_deadline,
        expiry_date: vacData.expiry_date,
        written_exam_date: vacData.written_exam_date || "",
        written_exam_venue: vacData.written_exam_venue || "",
        interview_date: vacData.interview_date || "",
        interview_venue: vacData.interview_venue || "",
        status: "OPEN"
      };
      vacancies.push(updated);
    }
    setStorageItem('kebron_vacancies', vacancies);
    return updated;
  },

  getApplications: async () => {
    return getStorageItem('kebron_applications', initialApplications);
  },

  submitApplication: async (appData) => {
    const apps = getStorageItem('kebron_applications', initialApplications);
    const newApp = {
      id: "app-" + Date.now(),
      vacancy_id: appData.vacancy_id,
      applicant_name: appData.applicant_name,
      email: appData.email,
      phone: appData.phone,
      residence_address: appData.residence_address || "",
      region: appData.region || "",
      zone: appData.zone || "",
      woreda: appData.woreda || "",
      kebele: appData.kebele || "",
      cv_url: appData.cv_url || "CV_document.pdf",
      academic_doc_url: appData.academic_doc_url || "Academic_document.pdf",
      university_temp_doc_url: appData.university_temp_doc_url || null,
      grade12_transcript_url: appData.grade12_transcript_url || null,
      grade10_transcript_url: appData.grade10_transcript_url || null,
      grade8_transcript_url: appData.grade8_transcript_url || null,
      grade12_entrance_cert_url: appData.grade12_entrance_cert_url || null,
      grade10_matric_cert_url: appData.grade10_matric_cert_url || null,
      grade6_ministry_cert_url: appData.grade6_ministry_cert_url || null,
      grade8_ministry_cert_url: appData.grade8_ministry_cert_url || null,
      birth_certificate_url: appData.birth_certificate_url || null,
      fayda_id_front_url: appData.fayda_id_front_url || null,
      fayda_id_back_url: appData.fayda_id_back_url || null,
      written_exam_score: null,
      written_exam_result: "PENDING",
      interview_score: null,
      interview_result: "PENDING",
      recruitment_status: "APPLIED",
      created_at: new Date().toISOString()
    };
    apps.push(newApp);
    setStorageItem('kebron_applications', apps);
    return newApp;
  },

  updateApplicationResult: async (id, updatedFields) => {
    const apps = getStorageItem('kebron_applications', initialApplications);
    const idx = apps.findIndex(a => a.id === id);
    if (idx !== -1) {
      apps[idx] = { ...apps[idx], ...updatedFields };
      setStorageItem('kebron_applications', apps);
      return apps[idx];
    }
    return null;
  },

  searchApplicantResult: async (emailOrPhone) => {
    const apps = getStorageItem('kebron_applications', initialApplications);
    const term = emailOrPhone.trim().toLowerCase();
    const matches = apps.filter(a => 
      (a.email && a.email.toLowerCase().includes(term)) || 
      (a.phone && a.phone.includes(term))
    );
    return matches;
  },

  // 5. STORE ASSETS
  getStoreAssets: async () => {
    return getStorageItem('kebron_assets', initialStoreAssets);
  },

  saveStoreAsset: async (assetData) => {
    const assets = getStorageItem('kebron_assets', initialStoreAssets);
    let updated;
    if (assetData.id) {
      const idx = assets.findIndex(a => a.id === assetData.id);
      if (idx !== -1) {
        assets[idx] = { ...assets[idx], ...assetData };
        updated = assets[idx];
      }
    } else {
      updated = {
        id: "asset-" + Date.now(),
        item_name: assetData.item_name,
        category: assetData.category || "General",
        color: assetData.color || "Standard",
        quantity_normal: parseInt(assetData.quantity_normal) || 0,
        quantity_defective: parseInt(assetData.quantity_defective) || 0,
        remarks: assetData.remarks || ""
      };
      assets.push(updated);
    }
    setStorageItem('kebron_assets', assets);
    return updated;
  },

  deleteStoreAsset: async (id) => {
    const assets = getStorageItem('kebron_assets', initialStoreAssets);
    const filtered = assets.filter(a => a.id !== id);
    setStorageItem('kebron_assets', filtered);
    return true;
  },

  // 6. ANNOUNCEMENTS & EVENTS
  getAnnouncements: async () => {
    return getStorageItem('kebron_announcements', initialAnnouncements);
  },

  createAnnouncement: async (annData) => {
    const announcements = getStorageItem('kebron_announcements', initialAnnouncements);
    const newAnn = {
      id: "ann-" + Date.now(),
      title: annData.title,
      content: annData.content,
      category: annData.category || "GENERAL",
      target_role: annData.target_role || "ALL",
      media_url: annData.media_url || "",
      media_type: annData.media_type || "NONE",
      posted_by: annData.posted_by || "Admin",
      created_at: new Date().toISOString().split('T')[0]
    };
    announcements.unshift(newAnn);
    setStorageItem('kebron_announcements', announcements);
    return newAnn;
  },

  // 7. FINANCIAL RECORDS
  getFinancialRecords: async () => {
    return getStorageItem('kebron_financials', [
      { id: 'fin-1', title: 'Room Booking Receipts', type: 'INCOME', amount: 145000, category: 'Reservations', fiscal_year: 2026 },
      { id: 'fin-2', title: 'Restaurant Sales', type: 'INCOME', amount: 82000, category: 'Food Services', fiscal_year: 2026 },
      { id: 'fin-3', title: 'Kitchen Produce & Inventory Purchase', type: 'EXPENSE', amount: 35000, category: 'Supplies', fiscal_year: 2026 },
      { id: 'fin-4', title: 'Electricity & Utility Bills', type: 'EXPENSE', amount: 18000, category: 'Utilities', fiscal_year: 2026 }
    ]);
  },

  addFinancialRecord: async (finData) => {
    const records = getStorageItem('kebron_financials', []);
    const newRec = {
      id: "fin-" + Date.now(),
      title: finData.title,
      type: finData.type,
      amount: parseFloat(finData.amount),
      category: finData.category || "General",
      description: finData.description || "",
      fiscal_year: 2026,
      created_at: new Date().toISOString()
    };
    records.unshift(newRec);
    setStorageItem('kebron_financials', records);
    return newRec;
  },

  // 8. JANITOR SHIFTS
  getJanitorShifts: async () => {
    return getStorageItem('kebron_janitor_shifts', [
      { id: 'shift-1', janitor_name: 'Tigist Alemu', shift_day: 'Monday - Wednesday', shift_time: '07:00 AM - 03:00 PM', assigned_area: 'Lobby & Floors 1-2', sanitation_program: 'Morning Deep Clean' },
      { id: 'shift-2', janitor_name: 'Mulugeta Tesfaye', shift_day: 'Thursday - Saturday', shift_time: '03:00 PM - 11:00 PM', assigned_area: 'Restaurant & Kitchen Hallway', sanitation_program: 'Evening Sanitation' }
    ]);
  },

  addJanitorShift: async (shiftData) => {
    const shifts = getStorageItem('kebron_janitor_shifts', []);
    const newShift = {
      id: "shift-" + Date.now(),
      janitor_name: shiftData.janitor_name,
      shift_day: shiftData.shift_day,
      shift_time: shiftData.shift_time,
      assigned_area: shiftData.assigned_area,
      sanitation_program: shiftData.sanitation_program || "Regular Sanitation"
    };
    shifts.push(newShift);
    setStorageItem('kebron_janitor_shifts', shifts);
    return newShift;
  },

  // 9. REPORTS & FEEDBACK
  getReports: async () => {
    return getStorageItem('kebron_reports', [
      { id: 'rep-1', sender_role: 'ACCOUNTANT', sender_name: 'Abebe Bikila', report_title: 'Monthly Financial Audit Q3', content: 'Detailed expense and income logs for hotel operations.', status: 'PENDING' },
      { id: 'rep-2', sender_role: 'STORE_MANAGER', sender_name: 'Yared Yilma', report_title: 'Defective Inventory Replacement Request', content: 'Request to replace 8 defective plastic chairs and 2 speakers.', status: 'REVIEWED' }
    ]);
  },

  sendReport: async (reportData) => {
    const reports = getStorageItem('kebron_reports', []);
    const newRep = {
      id: "rep-" + Date.now(),
      sender_role: reportData.sender_role,
      sender_name: reportData.sender_name,
      report_title: reportData.report_title,
      content: reportData.content,
      attachment_url: reportData.attachment_url || "",
      feedback_response: "",
      status: "PENDING",
      created_at: new Date().toISOString()
    };
    reports.unshift(newRep);
    setStorageItem('kebron_reports', reports);
    return newRep;
  },

  respondToReport: async (id, feedbackResponse) => {
    const reports = getStorageItem('kebron_reports', []);
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx].feedback_response = feedbackResponse;
      reports[idx].status = 'RESPONDED';
      setStorageItem('kebron_reports', reports);
      return reports[idx];
    }
    return null;
  },

  // 10. DYNAMIC DASHBOARDS
  getCustomDashboards: async () => {
    return getStorageItem('kebron_custom_dashboards', [
      { id: 'dash-1', dashboard_name: 'VIP Guest Relations Dashboard', logo_url: '/logo.svg', description: 'Specialized panel for high-profile VIP guest coordination.', is_unlocked: true }
    ]);
  },

  createCustomDashboard: async (dashData) => {
    const dashboards = getStorageItem('kebron_custom_dashboards', []);
    const newDash = {
      id: "dash-" + Date.now(),
      dashboard_name: dashData.dashboard_name,
      logo_url: dashData.logo_url || '/logo.svg',
      description: dashData.description || "Custom role dashboard unlocked upon creation.",
      is_unlocked: true,
      created_at: new Date().toISOString()
    };
    dashboards.push(newDash);
    setStorageItem('kebron_custom_dashboards', dashboards);
    return newDash;
  },

  // 11. SITE SETTINGS
  getBankAccounts: async () => {
    return getStorageItem('kebron_bank_accounts', initialBankAccounts);
  },

  saveBankAccounts: async (accounts) => {
    setStorageItem('kebron_bank_accounts', accounts);
    return accounts;
  },

  getSiteSettings: async () => {
    return getStorageItem('kebron_site_settings', {
      hotel_name: 'Kebron International Hotel',
      logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
      hero_bg_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
      contact_phone: '+251 911 234 567 / +251 116 890 123',
      contact_email: 'info@kebronhotel.com',
      location_address: 'Main Highway Boulevard, Hawassa / Addis Ababa, Ethiopia',
      google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126105.78768079545!2d38.71801264426543!3d8.980603417772648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1700000000000',
      social_facebook: 'https://facebook.com/kebronhotel',
      social_instagram: 'https://instagram.com/kebronhotel',
      social_telegram: 'https://t.me/kebronhotel',
      social_whatsapp: 'https://wa.me/251911234567',
      social_linkedin: 'https://linkedin.com/company/kebronhotel',
      social_youtube: 'https://youtube.com/@kebronhotel',
      social_tiktok: 'https://tiktok.com/@kebronhotel'
    });
  },

  updateSiteSettings: async (settings) => {
    setStorageItem('kebron_site_settings', settings);
    return settings;
  },

  // 12. STORE CUSTOM CATEGORIES
  getStoreCategories: async () => {
    return getStorageItem('kebron_store_categories', initialStoreCategories);
  },

  createStoreCategory: async (categoryData) => {
    const categories = getStorageItem('kebron_store_categories', initialStoreCategories);
    const newCat = {
      id: "store-cat-" + Date.now(),
      name: categoryData.name,
      description: categoryData.description || ""
    };
    categories.push(newCat);
    setStorageItem('kebron_store_categories', categories);
    return newCat;
  },

  // 13. SHIFT ROSTERING & PARTNER SHIFT VIEWER
  getShiftRosters: async () => {
    return getStorageItem('kebron_shift_rosters', initialShiftRosters);
  },

  createShiftRoster: async (shiftData) => {
    const rosters = getStorageItem('kebron_shift_rosters', initialShiftRosters);
    const newShift = {
      id: "shift-" + Date.now(),
      department: shiftData.department,
      employee_id: shiftData.employee_id,
      employee_name: shiftData.employee_name,
      employee_username: shiftData.employee_username,
      days: shiftData.days || [],
      start_date: shiftData.start_date,
      end_date: shiftData.end_date,
      start_time: shiftData.start_time,
      end_time: shiftData.end_time,
      shift_name: shiftData.shift_name || "Department Shift Duty",
      remarks: shiftData.remarks || "",
      created_at: new Date().toISOString().split('T')[0]
    };
    rosters.push(newShift);
    setStorageItem('kebron_shift_rosters', rosters);
    return newShift;
  },

  deleteShiftRoster: async (id) => {
    const rosters = getStorageItem('kebron_shift_rosters', initialShiftRosters);
    const filtered = rosters.filter(r => r.id !== id);
    setStorageItem('kebron_shift_rosters', filtered);
    return true;
  },

  updateShiftRoster: async (id, updatedFields) => {
    const rosters = getStorageItem('kebron_shift_rosters', initialShiftRosters);
    const index = rosters.findIndex(r => r.id === id);
    if (index !== -1) {
      rosters[index] = { ...rosters[index], ...updatedFields };
      setStorageItem('kebron_shift_rosters', rosters);
      return rosters[index];
    }
    return null;
  }
};
