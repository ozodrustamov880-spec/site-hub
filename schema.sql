-- ====================================================================
-- SITEHUB MARKETPLACE - SUPABASE DATABASE SCHEMA (15 TABLES)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'developer', 'admin')),
    card_number TEXT,
    card_holder TEXT,
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    role_selected BOOLEAN DEFAULT TRUE,
    is_blocked BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. CATEGORIES TABLE (12 categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    translations JSONB NOT NULL DEFAULT '{"uz": "", "ru": "", "en": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SITES TABLE
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(15, 2) NOT NULL CHECK (price >= 0),
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE,
    developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    screenshots TEXT[] DEFAULT '{}',
    demo_url TEXT,
    netlify_url TEXT NOT NULL,
    tech TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    sales_count INTEGER DEFAULT 0 CHECK (sales_count >= 0),
    is_new BOOLEAN DEFAULT TRUE,
    domain_price NUMERIC(15, 2) DEFAULT 120000 CHECK (domain_price >= 0),
    domain_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_site_favorite UNIQUE (user_id, site_id)
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE RESTRICT,
    developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    base_price NUMERIC(15, 2) NOT NULL,
    extras_price NUMERIC(15, 2) DEFAULT 0,
    total NUMERIC(15, 2) NOT NULL,
    commission_amount NUMERIC(15, 2) NOT NULL,
    developer_amount NUMERIC(15, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('payme', 'click', 'card')),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    note TEXT,
    domain_agreed BOOLEAN DEFAULT FALSE,
    domain_name TEXT NOT NULL,
    domain_price NUMERIC(15, 2) DEFAULT 120000,
    domain_status TEXT NOT NULL DEFAULT 'NONE' CHECK (domain_status IN ('NONE', 'AGREED', 'CONFIGURED', 'COMPLETED')),
    domain_registrar TEXT,
    domain_expiry_date DATE,
    domain_notes TEXT,
    receipt_last4 TEXT,
    is_paid_out BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. CONVERSATIONS TABLE (Direct chats between customer & developer)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_pair UNIQUE (user1_id, user2_id)
);

-- 8. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. GROUP CHATS TABLE
CREATE TABLE IF NOT EXISTS public.group_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('general', 'developers', 'customers')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. GROUP MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_group_user UNIQUE (group_id, user_id)
);

-- 11. GROUP MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.group_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. ORDER REQUESTS (Custom orders/client proposals)
CREATE TABLE IF NOT EXISTS public.order_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC(15, 2) NOT NULL,
    category_slug TEXT REFERENCES public.categories(slug) ON UPDATE CASCADE,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. CHAT REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.chat_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. PAGES TABLE (Static info & legal)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title JSONB NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, phone, role, role_selected)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'phone',
        COALESCE(new.raw_user_meta_data->>'role', 'customer'),
        TRUE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles, users can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Public read, Admin write
CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories manageable by admin" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sites: Approved sites viewable by all; developers can see and edit their own sites; admins full access
CREATE POLICY "Approved sites are viewable by all" ON public.sites FOR SELECT USING (
    status = 'APPROVED' OR developer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Developers can insert own sites" ON public.sites FOR INSERT WITH CHECK (
    auth.uid() = developer_id AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('developer', 'admin'))
);
CREATE POLICY "Developers can update own sites" ON public.sites FOR UPDATE USING (
    developer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Developers can delete own sites" ON public.sites FOR DELETE USING (
    developer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Orders: Customer, Developer of the site, or Admin can view
CREATE POLICY "Orders viewable by parties" ON public.orders FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = developer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Parties can update orders" ON public.orders FOR UPDATE USING (
    auth.uid() = customer_id OR auth.uid() = developer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews: Viewable by all, insertable by customer who purchased
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can write reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Conversations & Messages
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT USING (
    auth.uid() = user1_id OR auth.uid() = user2_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
    auth.uid() = user1_id OR auth.uid() = user2_id
);

CREATE POLICY "Messages viewable by conversation participants" ON public.messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can send messages to own conversations" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
);

-- Group chats RLS
CREATE POLICY "Group chats viewable according to role" ON public.group_chats FOR SELECT USING (
    category = 'general'
    OR (category = 'developers' AND EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
        AND (
            EXISTS (SELECT 1 FROM public.sites s WHERE s.developer_id = auth.uid()) 
            OR p.role = 'admin'
        )
    ))
    OR (category = 'customers' AND EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('customer', 'admin')
    ))
);

CREATE POLICY "Group messages viewable by eligible users" ON public.group_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.group_chats g 
        WHERE g.id = group_messages.group_id AND (
            g.category = 'general'
            OR (g.category = 'developers' AND EXISTS (
                SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
                AND (EXISTS (SELECT 1 FROM public.sites s WHERE s.developer_id = auth.uid()) OR p.role = 'admin')
            ))
            OR (g.category = 'customers' AND EXISTS (
                SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('customer', 'admin')
            ))
        )
    )
);

CREATE POLICY "Group messages insertable by eligible users" ON public.group_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
        SELECT 1 FROM public.group_chats g 
        WHERE g.id = group_messages.group_id AND (
            g.category = 'general'
            OR (g.category = 'developers' AND EXISTS (
                SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
                AND (EXISTS (SELECT 1 FROM public.sites s WHERE s.developer_id = auth.uid()) OR p.role = 'admin')
            ))
            OR (g.category = 'customers' AND EXISTS (
                SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('customer', 'admin')
            ))
        )
    )
);

-- Platform settings: Viewable by all, editable by admin
CREATE POLICY "Platform settings viewable by all" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Platform settings editable by admin" ON public.platform_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages: Viewable by all, editable by admin
CREATE POLICY "Pages viewable by all" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Pages editable by admin" ON public.pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ====================================================================
-- SEED DATA (12 CATEGORIES, PLATFORM SETTINGS, GROUPS, PAGES)
-- ====================================================================

-- 12 Categories
INSERT INTO public.categories (slug, icon, translations) VALUES
('landing', '🚀', '{"uz": "Landing Page", "ru": "Лендинги", "en": "Landing Pages"}'::jsonb),
('shop', '🛍️', '{"uz": "Internet Do''kon", "ru": "Интернет-магазины", "en": "E-Commerce"}'::jsonb),
('restaurant', '🍽️', '{"uz": "Restoran & Kafe", "ru": "Рестораны и Кафе", "en": "Restaurants & Cafes"}'::jsonb),
('hotel', '🏨', '{"uz": "Mehmonxona & Turizm", "ru": "Отели и Туризм", "en": "Hotels & Tourism"}'::jsonb),
('portfolio', '🎨', '{"uz": "Portfolio & Rezyume", "ru": "Портфолио и Резюме", "en": "Portfolio & Resume"}'::jsonb),
('blog', '📰', '{"uz": "Yangiliklar & Blog", "ru": "Новости и Блог", "en": "News & Blog"}'::jsonb),
('education', '🎓', '{"uz": "Ta''lim & Kurslar", "ru": "Образование и Курсы", "en": "Education & Courses"}'::jsonb),
('corporate', '🏢', '{"uz": "Korporativ Saytlar", "ru": "Корпоративные сайты", "en": "Corporate Websites"}'::jsonb),
('crm', '📊', '{"uz": "CRM & Dashboard", "ru": "CRM и Панели", "en": "CRM & Dashboards"}'::jsonb),
('webapp', '⚡', '{"uz": "Web Ilovalar (SaaS)", "ru": "Веб-приложения (SaaS)", "en": "Web Apps (SaaS)"}'::jsonb),
('telegram', '🤖', '{"uz": "Telegram WebApp", "ru": "Telegram WebApp", "en": "Telegram WebApps"}'::jsonb),
('other', '✨', '{"uz": "Boshqa Saytlar", "ru": "Другие сайты", "en": "Other Sites"}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Platform Settings (Service Fee / Platform Card)
INSERT INTO public.platform_settings (key, value) VALUES
('commission', '{"type": "fixed", "amount": 10000}'::jsonb),
('platform_card', '{"card_number": "8600 4501 2289 7712", "card_holder": "SITEHUB MARKETPLACE MCHJ", "bank_name": "Kapitalbank ATB"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Group chats
INSERT INTO public.group_chats (slug, title, category, description) VALUES
('general', '🌍 Umumiy Hamjamiyat', 'general', 'SiteHub platformasining barcha foydalanuvchilari uchun ochiq muhokama guruhi'),
('developers', '💻 Dasturchilar Markazi', 'developers', 'Faqatgina sayt joylagan dasturchilar uchun yopiq professional hamjamiyat'),
('customers', '🛒 Mijozlar Klubi', 'customers', 'Mijozlar uchun sayt tanlash, domen va biznes bo''yicha yordam guruhi')
ON CONFLICT (slug) DO NOTHING;

-- Static Pages Seed
INSERT INTO public.pages (slug, title, content) VALUES
('about', '{"uz": "SiteHub Haqida", "ru": "О SiteHub", "en": "About SiteHub"}'::jsonb, '{"uz": "SiteHub — O''zbekistondagi birinchi va yagona tayyor web-saytlar marketplace''i.", "ru": "SiteHub — первый в Узбекистане маркетплейс готовых веб-сайтов.", "en": "SiteHub is the first ready-made website marketplace in Uzbekistan."}'::jsonb),
('terms', '{"uz": "Foydalanish Qoidalari", "ru": "Условия сервиса", "en": "Terms of Service"}'::jsonb, '{"uz": "Escrow tizimi orqali to''liq xavfsiz bitimlar kafolatlanadi.", "ru": "Безопасные сделки через систему Escrow гарантированы.", "en": "Safe transactions guaranteed via Escrow system."}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
