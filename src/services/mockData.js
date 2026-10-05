export const initialRooms = [
  {
    id: "room-101",
    room_number: "101",
    block_name: "Block A - East Wing",
    floor_number: 1,
    room_type: "Solo Room",
    price_per_night: 2200,
    discount_percentage: 10,
    is_reserved: false,
    description: "Cozy single room with queen bed, high-speed WiFi, smart TV, and city view.",
    features: ["High-Speed WiFi", "4K Smart TV", "Air Conditioner", "Work Desk", "En-suite Bathroom"],
    special_highlights: "Complimentary Traditional Ethiopian Breakfast & City Skyline View",
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "room-102",
    room_number: "102",
    block_name: "Block A - East Wing",
    floor_number: 1,
    room_type: "Solo Room",
    price_per_night: 2200,
    discount_percentage: 0,
    is_reserved: true,
    description: "Quiet solo room equipped with ergonomic workspace and coffee bar.",
    features: ["WiFi", "Smart TV", "Coffee Bar", "Ergonomic Desk"],
    special_highlights: "Quiet Garden Side View & Express Laundry Service",
    image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "room-201",
    room_number: "201",
    block_name: "Block B - Main Tower",
    floor_number: 2,
    room_type: "Family Room",
    price_per_night: 4500,
    discount_percentage: 15,
    is_reserved: false,
    description: "Spacious family suite with 2 king beds, living room, balcony, and mini fridge.",
    features: ["Private Balcony", "2 King Beds", "Mini Bar", "WiFi", "Bathtub"],
    special_highlights: "Free Airport Shuttle, Connecting Lounge & Kids Play Kit",
    image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "room-202",
    room_number: "202",
    block_name: "Block B - Main Tower",
    floor_number: 2,
    room_type: "Business Class",
    price_per_night: 3800,
    discount_percentage: 10,
    is_reserved: false,
    description: "Premium executive room tailored for business travelers with desk and lounge access.",
    features: ["Executive Lounge Access", "High Speed WiFi", "Printer & Fax Access", "King Bed"],
    special_highlights: "24/7 Business Center Pass & Express Check-In",
    image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "room-301",
    room_number: "301",
    block_name: "Block B - Main Tower",
    floor_number: 3,
    room_type: "VIP Room",
    price_per_night: 7500,
    discount_percentage: 20,
    is_reserved: false,
    description: "Ultra-luxury VIP suite with Jacuzzi, panoramic mountain views, and private butler service.",
    features: ["Private Jacuzzi", "Panoramic View", "Butler Service", "Living Room", "King Bed"],
    special_highlights: "VIP Lounge Pass, Private Jacuzzi & Personal Butler Assistance",
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "room-103",
    room_number: "103",
    block_name: "Block A - East Wing",
    floor_number: 1,
    room_type: "Economy Class",
    price_per_night: 1600,
    discount_percentage: 0,
    is_reserved: false,
    description: "Budget-friendly clean and comfortable standard room for solo travelers.",
    features: ["Single Bed", "WiFi", "Hot Shower", "Cable TV"],
    special_highlights: "Affordable Comfort & Free Parking",
    image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "room-302",
    room_number: "302",
    block_name: "Block C - Royal Pavilion",
    floor_number: 3,
    room_type: "Private Room",
    price_per_night: 5200,
    discount_percentage: 10,
    is_reserved: true,
    description: "Secluded private sanctuary with dedicated dining room and garden view.",
    features: ["Private Entrance", "Garden View", "Dining Table", "King Bed"],
    special_highlights: "Secluded Private Entrance & In-Room Dining Service",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  }
];

export const initialBankAccounts = [
  { id: "bank-1", bank_name: "Commercial Bank of Ethiopia (CBE)", account_number: "1000 1122 3344 5", account_holder: "Kebron International Hotel Plc", status: "ACTIVE" },
  { id: "bank-2", bank_name: "Bank of Abyssinia", account_number: "8899 0011 2233 4", account_holder: "Kebron International Hotel Plc", status: "ACTIVE" },
  { id: "bank-3", bank_name: "Awash Bank", account_number: "01320 9988 7766 0", account_holder: "Kebron International Hotel Plc", status: "ACTIVE" },
  { id: "bank-4", bank_name: "Dashen Bank", account_number: "5544 3322 1100 9", account_holder: "Kebron International Hotel Plc", status: "ACTIVE" },
  { id: "bank-5", bank_name: "Telebirr / CBE Birr", account_number: "+251 911 000 000", account_holder: "Kebron Hotel Merchant", status: "ACTIVE" },
  { id: "bank-6", bank_name: "Cooperative Bank of Oromia (COOP)", account_number: "4455 6677 8899 0", account_holder: "Kebron International Hotel Plc", status: "ACTIVE" },
  { id: "bank-7", bank_name: "Hibret Bank", account_number: "3322 1100 9988 7", account_holder: "Kebron International Hotel Plc", status: "INACTIVE" },
  { id: "bank-8", bank_name: "Nib International Bank", account_number: "7788 9900 1122 3", account_holder: "Kebron International Hotel Plc", status: "INACTIVE" }
];

export const initialMenuCategories = [
  { id: "cat-1", name: "Meal", description: "Traditional Ethiopian main dishes and cultural platters" },
  { id: "cat-2", name: "Drink", description: "Fresh natural juices, macchiatos, and beverages" },
  { id: "cat-3", name: "Special", description: "Sizzling grilled steaks and international specialties" },
  { id: "cat-4", name: "Chef Special", description: "Signature gourmet creations by Executive Chefs" },
  { id: "cat-5", name: "Ethiopian Cultural", description: "Authentic cultural teff injera & stews" },
  { id: "cat-6", name: "Desserts", description: "Sweet pastries, cakes, and ice cream" }
];

export const initialMenuItems = [
  {
    id: "menu-1",
    title: "Special Kebron Platter (የቄብሮን ልዩ ማዕድ)",
    category: "Meal",
    price: 950,
    discount_percentage: 15,
    discount_price: 807.5,
    description: "Assorted meat and vegetable platter with fresh teff injera.",
    is_available: true,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "menu-2",
    title: "Doro Wot with Egg (ዶሮ ወጥ)",
    category: "Meal",
    price: 800,
    discount_percentage: 10,
    discount_price: 720,
    description: "Traditional spicy chicken stew served with hard-boiled eggs and cottage cheese.",
    is_available: true,
    image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "menu-3",
    title: "Grilled Ribeye Steak",
    category: "Special",
    price: 1200,
    discount_percentage: 10,
    discount_price: 1080,
    description: "Prime beef cut cooked to perfection with mushroom sauce and roasted potatoes.",
    is_available: true,
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "menu-4",
    title: "Ethiopian Macchiato & Pastry",
    category: "Drink",
    price: 90,
    discount_percentage: 10,
    discount_price: 81,
    description: "Rich layered espresso coffee topped with velvety steamed milk.",
    is_available: true,
    image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "menu-5",
    title: "Fresh Mango & Avocado Mixed Juice",
    category: "Drink",
    price: 140,
    discount_percentage: 15,
    discount_price: 119,
    description: "100% natural layered fresh fruit smoothie.",
    is_available: true,
    image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80"
  }
];

export const initialVacancies = [
  {
    id: "vac-1",
    title: "Senior Hotel Accountant",
    department: "Finance & Accounting",
    description: "We are seeking a detail-oriented Senior Accountant to manage hotel ledgers, tax filings, and income-expense reporting.",
    requirements: "BA Degree in Accounting/Finance, minimum 3 years experience in hotel PMS software.",
    criteria: "Minimum Cumulative GPA 3.2, fluent in English and Amharic.",
    application_deadline: "2026-09-15",
    expiry_date: "2026-09-20",
    written_exam_date: "2026-09-25",
    written_exam_venue: "Kebron Hotel Conference Hall B",
    interview_date: "2026-09-28",
    interview_venue: "Main Executive Office Floor 4",
    status: "OPEN"
  },
  {
    id: "vac-2",
    title: "Front Desk Receptionist",
    department: "Customer Service",
    description: "Friendly customer service representative responsible for guest check-ins, reservations, and general assistance.",
    requirements: "Diploma or BA in Hotel Management, Customer Service certification.",
    criteria: "Excellent verbal communication skills, pleasing personality.",
    application_deadline: "2026-09-10",
    expiry_date: "2026-09-15",
    written_exam_date: "2026-09-18",
    written_exam_venue: "Kebron Hotel Training Center Room 1",
    interview_date: "2026-09-22",
    interview_venue: "HR Department Office",
    status: "OPEN"
  },
  {
    id: "vac-3",
    title: "Executive Head Chef",
    department: "Kitchen & Food Services",
    description: "Lead chef to oversee food preparation, menu curation, and kitchen staff coordination.",
    requirements: "Culinary Arts Degree/Diploma with 5+ years experience in star-rated hotel kitchens.",
    criteria: "Expertise in both Ethiopian cultural dishes and international cuisine.",
    application_deadline: "2026-08-30",
    expiry_date: "2026-09-05",
    written_exam_date: "2026-09-08",
    written_exam_venue: "Kebron Main Kitchen & Testing Lab",
    interview_date: "2026-09-11",
    interview_venue: "General Manager Suite",
    status: "OPEN"
  }
];

export const initialUsers = [
  {
    id: "user-mr",
    username: "MR/1001/2026",
    full_name: "Menen Tadesse",
    email: "registrar@kebronhotel.com",
    phone: "+251 911 000 001",
    role: "MAIN_REGISTRAR",
    gender: "Female",
    address: "Hawassa Main Street",
    profile_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: true
  },
  {
    id: "user-ac",
    username: "ACCOUNTANT",
    full_name: "Abebe Bikila",
    email: "accountant@kebronhotel.com",
    phone: "+251 911 222 333",
    role: "ACCOUNTANT",
    gender: "Male",
    address: "Addis Ababa",
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: false
  },
  {
    id: "user-fn",
    username: "FINANCE",
    full_name: "Bethlehem Haile",
    email: "finance@kebronhotel.com",
    phone: "+251 911 444 555",
    role: "FINANCE",
    gender: "Female",
    address: "Hawassa",
    profile_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: false
  },
  {
    id: "user-sm",
    username: "STORE",
    full_name: "Yared Yilma",
    email: "store@kebronhotel.com",
    phone: "+251 911 666 777",
    role: "STORE_MANAGER",
    gender: "Male",
    address: "Hawassa",
    profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: false
  },
  {
    id: "user-jn",
    username: "JN/4012/2026",
    full_name: "Tigist Alemu",
    email: "janitor@kebronhotel.com",
    phone: "+251 911 888 999",
    role: "JANITOR",
    gender: "Female",
    address: "Hawassa",
    profile_image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: false
  },
  {
    id: "user-mg",
    username: "MANAGER",
    full_name: "Dawit Worku",
    email: "manager@kebronhotel.com",
    phone: "+251 911 111 222",
    role: "MANAGER",
    gender: "Male",
    address: "Hawassa",
    profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: true
  },
  {
    id: "user-hr",
    username: "HR",
    full_name: "Selamawit Kebede",
    email: "hr@kebronhotel.com",
    phone: "+251 911 333 444",
    role: "HR",
    gender: "Female",
    address: "Hawassa",
    profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    password_hash: "1234",
    default_password: "1234",
    status: "ACTIVE",
    is_admin: false
  }
];

export const initialStoreAssets = [
  {
    id: "asset-1",
    item_name: "Plastic Chairs",
    category: "Plastic Chairs",
    color: "White",
    quantity_normal: 120,
    quantity_defective: 8,
    remarks: "Located in Main Event Garden Hall"
  },
  {
    id: "asset-2",
    item_name: "Plastic Chairs",
    category: "Plastic Chairs",
    color: "Red",
    quantity_normal: 85,
    quantity_defective: 3,
    remarks: "Used for outdoor dining extension"
  },
  {
    id: "asset-3",
    item_name: "Wooden Executive Desks",
    category: "Desks",
    color: "Mahogany Brown",
    quantity_normal: 15,
    quantity_defective: 1,
    remarks: "Office & Executive Rooms"
  },
  {
    id: "asset-4",
    item_name: "Electric Ovens & Stoves",
    category: "Electronics",
    color: "Silver Stainless",
    quantity_normal: 6,
    quantity_defective: 0,
    remarks: "Main Hotel Kitchen"
  },
  {
    id: "asset-5",
    item_name: "Acoustic Guitars & Sound Speakers",
    category: "Speakers",
    color: "Black",
    quantity_normal: 8,
    quantity_defective: 2,
    remarks: "Live Lounge & Acoustic Stage"
  }
];

export const initialApplications = [
  {
    id: "app-1",
    vacancy_id: "vac-1",
    applicant_name: "Kassahun Fekadu",
    email: "kassahun@gmail.com",
    phone: "+251 922 111 222",
    residence_address: "Bole Subcity",
    region: "Addis Ababa",
    zone: "Zone 3",
    woreda: "Woreda 04",
    kebele: "Kebele 08",
    cv_url: "kassahun_resume.pdf",
    academic_doc_url: "degree_certificate.pdf",
    written_exam_score: 85.5,
    written_exam_result: "PASSED",
    interview_score: 91.0,
    interview_result: "PASSED",
    recruitment_status: "HIRED"
  },
  {
    id: "app-2",
    vacancy_id: "vac-2",
    applicant_name: "Birtukan Desalegn",
    email: "birtukan@gmail.com",
    phone: "+251 933 444 555",
    residence_address: "Tabor Subcity",
    region: "Sidama",
    zone: "Hawassa City",
    woreda: "Woreda 02",
    kebele: "Kebele 05",
    cv_url: "birtukan_cv.pdf",
    academic_doc_url: "diploma_hotel.pdf",
    written_exam_score: 72.0,
    written_exam_result: "PASSED",
    interview_score: 68.0,
    interview_result: "PENDING",
    recruitment_status: "INTERVIEW_SCHEDULED"
  }
];

export const initialAnnouncements = [
  {
    id: "ann-1",
    title: "Public Cultural Grand Opening Festival",
    content: "Kebron International Hotel invites all guests to our upcoming cultural cuisine and musical showcase weekend.",
    category: "GENERAL",
    target_role: "ALL",
    media_url: "",
    media_type: "NONE",
    posted_by: "Main Registrar Admin",
    created_at: "2026-08-10"
  },
  {
    id: "ann-2",
    title: "Urgent Staff All-Hands Meeting",
    content: "All department managers, receptionists, waitstaff, and supervisors are requested to attend the monthly quality review meeting.",
    category: "URGENT_MEETING",
    target_role: "RECEPTIONISTS",
    media_url: "",
    media_type: "NONE",
    posted_by: "Main Registrar Admin",
    created_at: "2026-08-11"
  },
  {
    id: "ann-3",
    title: "Youth Sanitation Program Schedule",
    content: "Joint hotel and community sanitation program scheduled for this Saturday morning from 7:00 AM - 10:00 AM.",
    category: "SANITATION",
    target_role: "JANITOR",
    media_url: "",
    media_type: "NONE",
    posted_by: "Youth Leaders & Registrar",
    created_at: "2026-08-12"
  }
];

export const initialStoreCategories = [
  { id: "store-cat-1", name: "Plastic Chairs", description: "Event & Garden Plastic Seating" },
  { id: "store-cat-2", name: "Wooden Desks", description: "Office & Guest Work Desks" },
  { id: "store-cat-3", name: "Sound Speakers", description: "Audio & PA Systems" },
  { id: "store-cat-4", name: "Kitchen Electronics", description: "Ovens, Grills & Blenders" },
  { id: "store-cat-5", name: "Beddings & Towels", description: "Linens & Bath Supplies" }
];

export const initialShiftRosters = [
  {
    id: "shift-1",
    department: "Front Desk & Reception",
    employee_id: "user-mr1001",
    employee_name: "Kebron Registrar Admin",
    employee_username: "MR/1001/2026",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    start_date: "2026-08-15",
    end_date: "2026-08-20",
    start_time: "08:00 AM",
    end_time: "04:00 PM",
    shift_name: "Day Reception Duty",
    remarks: "Morning Shift Front Desk Supervisor",
    created_at: "2026-08-12"
  },
  {
    id: "shift-2",
    department: "Front Desk & Reception",
    employee_id: "user-mg1001",
    employee_name: "Yonas Alemu (Manager)",
    employee_username: "MG/1001/2026",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    start_date: "2026-08-15",
    end_date: "2026-08-20",
    start_time: "08:00 AM",
    end_time: "04:00 PM",
    shift_name: "Day Reception Duty",
    remarks: "Joint Morning Duty Partner",
    created_at: "2026-08-12"
  }
];

export const initialOnlineOrders = [
  {
    id: "ord-101",
    order_code: "ORD-982314",
    customer_name: "Henok Tilahun",
    customer_email: "henok@example.com",
    customer_phone: "+251 911 345 678",
    item_id: "menu-1",
    item_title: "Special Kebron Doro Wot",
    item_category: "Meal",
    unit_price: 650,
    quantity: 2,
    total_amount: 1300,
    payment_bank: "Commercial Bank of Ethiopia (CBE)",
    payment_receipt_url: "receipt_screenshot.png",
    delivery_location: "Room #201",
    order_notes: "Extra boiled egg, medium spicy",
    status: "PENDING",
    created_at: "2026-08-13T10:30:00.000Z"
  },
  {
    id: "ord-102",
    order_code: "ORD-554109",
    customer_name: "Bethlehem Assefa",
    customer_email: "beth@example.com",
    customer_phone: "+251 922 456 789",
    item_id: "menu-2",
    item_title: "Traditional Ethiopian Spris Juice",
    item_category: "Drink",
    unit_price: 180,
    quantity: 3,
    total_amount: 540,
    payment_bank: "Bank of Abyssinia",
    payment_receipt_url: "receipt_screenshot_2.png",
    delivery_location: "Table #12 (Outdoor Garden)",
    order_notes: "No added sugar, extra lime on the side",
    status: "CONFIRMED",
    created_at: "2026-08-13T11:15:00.000Z"
  }
];

