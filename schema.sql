-- ==========================================================
-- Kebron International Hotel Database Schema & Seed Data
-- Database Engine: PostgreSQL / Supabase
-- ==========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'GUEST',
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    address TEXT,
    profile_image TEXT,
    password_hash TEXT NOT NULL,
    default_password TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    block_name VARCHAR(50) NOT NULL,
    floor_number INT NOT NULL DEFAULT 1,
    room_type VARCHAR(50) NOT NULL, -- Solo Room, Family Room, Business Class, Economy Class, VIP Room, Private Room
    price_per_night NUMERIC(10,2) NOT NULL,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    is_reserved BOOLEAN DEFAULT FALSE,
    description TEXT,
    features TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RESERVATIONS / BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    room_type VARCHAR(50) NOT NULL,
    room_number VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    days_count INT NOT NULL DEFAULT 1,
    total_amount NUMERIC(10,2) NOT NULL,
    discount_applied NUMERIC(10,2) DEFAULT 0,
    payment_bank VARCHAR(100),
    payment_receipt_url TEXT, -- Uploaded PDF or Screenshot
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'CANCELLED', 'CHECKED_OUT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FOOD & DRINK MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Meal, Food, Drink, Dessert, Special
    price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2),
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VACANCIES TABLE
CREATE TABLE IF NOT EXISTS vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    criteria TEXT,
    application_deadline DATE NOT NULL,
    expiry_date DATE NOT NULL,
    written_exam_date DATE,
    written_exam_venue TEXT,
    interview_date DATE,
    interview_venue TEXT,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'EXPIRED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. APPLICANTS & RECRUITMENT TABLE
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE CASCADE,
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    residence_address TEXT,
    region VARCHAR(100),
    zone VARCHAR(100),
    woreda VARCHAR(100),
    kebele VARCHAR(100),
    -- Documents
    cv_url TEXT,
    academic_doc_url TEXT,
    university_temp_doc_url TEXT,
    grade12_transcript_url TEXT,
    grade10_transcript_url TEXT,
    grade8_transcript_url TEXT,
    grade12_entrance_cert_url TEXT,
    grade10_matric_cert_url TEXT,
    grade6_ministry_cert_url TEXT,
    grade8_ministry_cert_url TEXT,
    birth_certificate_url TEXT,
    fayda_id_front_url TEXT,
    fayda_id_back_url TEXT,
    -- Exam & Interview Status
    written_exam_score NUMERIC(5,2),
    written_exam_result VARCHAR(20) DEFAULT 'PENDING' CHECK (written_exam_result IN ('PENDING', 'PASSED', 'FAILED')),
    interview_score NUMERIC(5,2),
    interview_result VARCHAR(20) DEFAULT 'PENDING' CHECK (interview_result IN ('PENDING', 'PASSED', 'FAILED')),
    recruitment_status VARCHAR(30) DEFAULT 'APPLIED' CHECK (recruitment_status IN ('APPLIED', 'SHORTLISTED', 'EXAM_SCHEDULED', 'INTERVIEW_SCHEDULED', 'HIRED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS, EVENTS & GALLERY
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL' CHECK (category IN ('GENERAL', 'URGENT_MEETING', 'TRAINING', 'SHIFT', 'NEWS', 'SANITATION')),
    target_role VARCHAR(50) DEFAULT 'ALL',
    media_url TEXT, -- Image or Video URL
    media_type VARCHAR(20) CHECK (media_type IN ('IMAGE', 'VIDEO', 'DOCUMENT', 'NONE')),
    posted_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. STORE ASSETS TABLE (Store Manager Dashboard)
CREATE TABLE IF NOT EXISTS store_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Plastic Chairs, Wooden Chairs, Desks, Tables, Beds, Blankets, Pillows, Cups, Glasses, Vacuum Flasks, Bottles, Keyboards, Guitars, Speakers, Bikes, Cars, Jars, Jugs, Wood, Electronics, Other
    color VARCHAR(50),
    quantity_normal INT DEFAULT 0,
    quantity_defective INT DEFAULT 0,
    total_quantity INT GENERATED ALWAYS AS (quantity_normal + quantity_defective) STORED,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. FINANCIAL RECORDS TABLE (Accountant & Finance Dashboards)
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('INCOME', 'EXPENSE', 'BUDGET')),
    amount NUMERIC(12,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    fiscal_year INT DEFAULT 2026,
    recorded_by VARCHAR(100),
    receipt_doc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. JANITOR SHIFTS & SANITATION TABLE
CREATE TABLE IF NOT EXISTS janitor_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    janitor_name VARCHAR(150) NOT NULL,
    shift_day VARCHAR(50) NOT NULL, -- Monday, Tuesday, etc.
    shift_time VARCHAR(100) NOT NULL, -- e.g., 08:00 AM - 04:00 PM
    assigned_area TEXT NOT NULL,
    sanitation_program VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. REPORTS & FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS department_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_role VARCHAR(50) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    report_title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    attachment_url TEXT,
    feedback_response TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESPONDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. DYNAMIC DASHBOARDS REGISTRY
CREATE TABLE IF NOT EXISTS custom_dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_name VARCHAR(150) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    is_unlocked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. SITE CONFIGURATION SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    hotel_name VARCHAR(150) DEFAULT 'Kebron International Hotel',
    logo_url TEXT DEFAULT '/logo.svg',
    hero_bg_url TEXT DEFAULT '/hero-bg.jpg',
    contact_phone VARCHAR(50) DEFAULT '+251 911 234 567 / +251 116 890 123',
    contact_email VARCHAR(100) DEFAULT 'info@kebronhotel.com',
    location_address VARCHAR(200) DEFAULT 'Main Highway Blvd, Hawassa / Addis Ababa, Ethiopia',
    google_maps_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126105.78768079545!2d38.71801264426543!3d8.980603417772648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1700000000000',
    social_facebook TEXT DEFAULT 'https://facebook.com/kebronhotel',
    social_telegram TEXT DEFAULT 'https://t.me/kebronhotel',
    social_instagram TEXT DEFAULT 'https://instagram.com/kebronhotel',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. ONLINE ORDERS TABLE
CREATE TABLE IF NOT EXISTS online_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_title VARCHAR(150) NOT NULL,
    item_category VARCHAR(50),
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_bank VARCHAR(100),
    payment_receipt_url TEXT,
    delivery_location TEXT,
    order_notes TEXT,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INITIAL SEED DATA
INSERT INTO site_settings (id, hotel_name) VALUES (1, 'Kebron International Hotel') ON CONFLICT (id) DO NOTHING;

-- Seed Super Admin User (Main Registrar)
INSERT INTO users (username, full_name, email, phone, role, gender, address, password_hash, default_password, is_admin)
VALUES 
('MR/1001/2026', 'Main Registrar Admin', 'registrar@kebronhotel.com', '+251911000001', 'MAIN_REGISTRAR', 'Female', 'Kebron Hotel HQ', '1234', '1234', TRUE)
ON CONFLICT (username) DO NOTHING;
