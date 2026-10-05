-- ===================================================================
-- KEBRON INTERNATIONAL HOTEL PORTAL SYSTEM - COMPLETE SQL SCHEMA & SEEDS
-- Compatible with PostgreSQL & Supabase Database Manager
-- ===================================================================

-- 1. USERS & STAFF ROLES TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'JANITOR',
    gender VARCHAR(20) DEFAULT 'Female',
    address TEXT,
    profile_image TEXT,
    password_hash VARCHAR(255) NOT NULL DEFAULT '1234',
    default_password VARCHAR(255) DEFAULT '1234',
    is_password_changed BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GUEST ROOMS INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id VARCHAR(100) PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    block_name VARCHAR(100) DEFAULT 'Block A',
    floor_number INT DEFAULT 1,
    room_type VARCHAR(50) NOT NULL DEFAULT 'Solo Room',
    price_per_night NUMERIC(12, 2) NOT NULL DEFAULT 2500.00,
    discount_percentage NUMERIC(5, 2) DEFAULT 0.00,
    special_highlights TEXT,
    is_reserved BOOLEAN DEFAULT FALSE,
    description TEXT,
    features TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOM MENU CATEGORIES TABLE (MANAGED BY MAIN REGISTRAR ADMIN)
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FOOD & DRINK MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Meal',
    price NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
    discount_percentage NUMERIC(5, 2) DEFAULT 0.00,
    discount_price NUMERIC(12, 2),
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STORE CUSTOM CATEGORIES TABLE (MANAGED BY STORE MANAGER)
CREATE TABLE IF NOT EXISTS public.store_categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. STORE ASSETS & FURNITURE INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.store_assets (
    id VARCHAR(100) PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) DEFAULT 'Plastic Chairs',
    color VARCHAR(50) DEFAULT 'White',
    quantity_normal INT DEFAULT 0,
    quantity_defective INT DEFAULT 0,
    remarks TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MULTI-DAY STAFF SHIFT ROSTERS & PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.shift_rosters (
    id VARCHAR(100) PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    employee_id VARCHAR(100) NOT NULL,
    employee_name VARCHAR(150) NOT NULL,
    employee_username VARCHAR(100) NOT NULL,
    days TEXT[] NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    shift_name VARCHAR(150) DEFAULT 'Department Shift Duty',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ACTIVE HOTEL BANK ACCOUNTS TABLE (MANAGED BY MAIN REGISTRAR)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id VARCHAR(100) PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    account_holder VARCHAR(150) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FINANCIAL LEDGERS TABLE
CREATE TABLE IF NOT EXISTS public.financial_records (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. JOB VACANCIES TABLE
CREATE TABLE IF NOT EXISTS public.vacancies (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    criteria TEXT,
    application_deadline DATE,
    expiry_date DATE,
    written_exam_date DATE,
    written_exam_venue VARCHAR(200),
    interview_date DATE,
    interview_venue VARCHAR(200),
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. APPLICANTS & RECRUITMENT RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id VARCHAR(100) PRIMARY KEY,
    vacancy_id VARCHAR(100) REFERENCES public.vacancies(id) ON DELETE SET NULL,
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    residence_address TEXT,
    region VARCHAR(100),
    zone VARCHAR(100),
    woreda VARCHAR(100),
    kebele VARCHAR(100),
    cv_url TEXT,
    academic_doc_url TEXT,
    written_exam_score NUMERIC(5, 2),
    written_exam_result VARCHAR(50) DEFAULT 'PENDING',
    interview_score NUMERIC(5, 2),
    interview_result VARCHAR(50) DEFAULT 'PENDING',
    recruitment_status VARCHAR(50) DEFAULT 'APPLIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ROOM RESERVATIONS & INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id VARCHAR(100) PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    room_id VARCHAR(100) REFERENCES public.rooms(id) ON DELETE CASCADE,
    room_type VARCHAR(50),
    room_number VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_bank VARCHAR(100),
    payment_transaction_ref VARCHAR(100),
    status VARCHAR(30) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. ANNOUNCEMENTS & MEDIA GALLERY EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL',
    target_role VARCHAR(50) DEFAULT 'ALL',
    media_url TEXT,
    media_type VARCHAR(20) DEFAULT 'NONE',
    posted_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. WEBSITE & SOCIAL MEDIA BRAND SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    hotel_name VARCHAR(150) NOT NULL DEFAULT 'Kebron International Hotel',
    logo_url TEXT,
    hero_bg_url TEXT,
    contact_phone VARCHAR(100),
    contact_email VARCHAR(150),
    location_address TEXT,
    google_maps_url TEXT,
    social_facebook TEXT,
    social_instagram TEXT,
    social_telegram TEXT,
    social_whatsapp TEXT,
    social_linkedin TEXT,
    social_youtube TEXT,
    social_tiktok TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. ONLINE FOOD & ITEM ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.online_orders (
    id VARCHAR(100) PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_title VARCHAR(150) NOT NULL,
    item_category VARCHAR(100),
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT DEFAULT 1,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_bank VARCHAR(100),
    payment_transaction_ref VARCHAR(100),
    payment_receipt_url TEXT,
    delivery_location TEXT,
    order_notes TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- SEED INITIAL DATA
-- ===================================================================

-- Initial Staff Accounts
INSERT INTO public.users (id, username, full_name, email, phone, role, gender, password_hash, default_password, is_password_changed, is_admin)
VALUES 
('user-mr', 'MR/1001/2026', 'Menen Tadesse', 'registrar@kebronhotel.com', '+251 911 000 001', 'MAIN_REGISTRAR', 'Female', '1234', '1234', FALSE, TRUE),
('user-ac', 'ACCOUNTANT', 'Abebe Bikila', 'accountant@kebronhotel.com', '+251 911 222 333', 'ACCOUNTANT', 'Male', '1234', '1234', FALSE, FALSE),
('user-fn', 'FINANCE', 'Bethlehem Haile', 'finance@kebronhotel.com', '+251 911 444 555', 'FINANCE', 'Female', '1234', '1234', FALSE, FALSE),
('user-sm', 'STORE', 'Yared Yilma', 'store@kebronhotel.com', '+251 911 666 777', 'STORE_MANAGER', 'Male', '1234', '1234', FALSE, FALSE),
('user-jn', 'JN/4012/2026', 'Tigist Alemu', 'janitor@kebronhotel.com', '+251 911 888 999', 'JANITOR', 'Female', '1234', '1234', FALSE, FALSE),
('user-mg', 'MANAGER', 'Dawit Worku', 'manager@kebronhotel.com', '+251 911 111 222', 'MANAGER', 'Male', '1234', '1234', FALSE, TRUE),
('user-hr', 'HR', 'Selamawit Kebede', 'hr@kebronhotel.com', '+251 911 333 444', 'HR', 'Female', '1234', '1234', FALSE, FALSE)
ON CONFLICT (username) DO NOTHING;

-- Initial Bank Accounts
INSERT INTO public.bank_accounts (id, bank_name, account_number, account_holder, status)
VALUES
('bank-1', 'Commercial Bank of Ethiopia (CBE)', '1000123456789', 'Kebron International Hotel', 'ACTIVE'),
('bank-2', 'Bank of Abyssinia', '8899221100', 'Kebron International Hotel', 'ACTIVE'),
('bank-3', 'Awash Bank', '01320987654321', 'Kebron International Hotel', 'ACTIVE'),
('bank-4', 'Dashen Bank', '55443322110', 'Kebron International Hotel', 'ACTIVE'),
('bank-5', 'Telebirr SuperApp Pay', '251911000000', 'Kebron Hotel Official', 'ACTIVE'),
('bank-6', 'Cooperative Bank of Oromia (COOP)', '443322110099', 'Kebron Hotel', 'INACTIVE'),
('bank-7', 'Hibret Bank', '778899001122', 'Kebron International Hotel', 'INACTIVE'),
('bank-8', 'Nib International Bank', '334455667788', 'Kebron Hotel', 'INACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Initial Store Categories
INSERT INTO public.store_categories (id, name, description)
VALUES 
('store-cat-1', 'Plastic Chairs', 'Event & Garden Plastic Seating'),
('store-cat-2', 'Wooden Desks', 'Office & Guest Work Desks'),
('store-cat-3', 'Sound Speakers', 'Audio & PA Systems'),
('store-cat-4', 'Kitchen Electronics', 'Ovens, Grills & Blenders'),
('store-cat-5', 'Beddings & Towels', 'Linens & Bath Supplies')
ON CONFLICT (name) DO NOTHING;

-- Initial Menu Categories
INSERT INTO public.menu_categories (id, name, description)
VALUES 
('cat-1', 'Meal', 'Traditional Ethiopian main dishes and cultural platters'),
('cat-2', 'Drink', 'Fresh natural juices, macchiatos, and beverages'),
('cat-3', 'Special', 'Sizzling grilled steaks and international specialties'),
('cat-4', 'Chef Special', 'Signature gourmet creations by Executive Chefs'),
('cat-5', 'Ethiopian Cultural', 'Authentic cultural teff injera & stews'),
('cat-6', 'Desserts', 'Sweet pastries, cakes, and ice cream')
ON CONFLICT (name) DO NOTHING;

-- Initial Site Settings
INSERT INTO public.site_settings (id, hotel_name, contact_phone, contact_email, location_address)
VALUES (1, 'Kebron International Hotel', '+251 911 000 000 / +251 462 200 000', 'info@kebronhotel.com', 'Hawassa Main Street, Ethiopia')
ON CONFLICT (id) DO NOTHING;

-- Initial Shift Rosters
INSERT INTO public.shift_rosters (id, department, employee_id, employee_name, employee_username, days, start_date, end_date, start_time, end_time, shift_name, remarks)
VALUES
('shift-1', 'Front Desk & Reception', 'user-mr', 'Kebron Registrar Admin', 'MR/1001/2026', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '2026-08-15', '2026-08-20', '08:00 AM', '04:00 PM', 'Day Reception Duty', 'Morning Shift Front Desk Supervisor'),
('shift-2', 'Front Desk & Reception', 'user-mg', 'Dawit Worku (Manager)', 'MANAGER', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '2026-08-15', '2026-08-20', '08:00 AM', '04:00 PM', 'Day Reception Duty', 'Joint Morning Duty Partner')
ON CONFLICT (id) DO NOTHING;
