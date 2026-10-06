// ====================================================================
// SITEHUB MARKETPLACE - APP.JS (CORE LOGIC & UTILITIES)
// Vanilla JS with i18n, Dark Mode, Audio Chime, State & Supabase Sync
// ====================================================================

// --- 1. LOCAL STORAGE KEYS ---
const STORAGE_KEYS = {
    LANG: 'sitehub_lang',
    THEME: 'sitehub_theme',
    USER: 'sitehub_current_user',
    FAVORITES: 'sitehub_favorites',
    SITES: 'sitehub_sites_data',
    ORDERS: 'sitehub_orders_data',
    SETTINGS: 'sitehub_platform_settings',
    MESSAGES: 'sitehub_chat_messages'
};

// --- 2. MULTILINGUAL DICTIONARY (i18n) ---
const TRANSLATIONS = {
    uz: {
        nav_marketplace: "Marketplace",
        nav_categories: "Kategoriyalar",
        nav_developers: "Dasturchilar",
        nav_about: "Ma'lumotlar",
        nav_support: "Yordam",
        nav_login: "Kirish",
        nav_dashboard: "Kabinet",
        nav_logout: "Chiqish",
        hero_tag: "O'zbekistonda №1 Tayyor Web-Saytlar Bozori",
        hero_title_1: "Kerakli saytingizni",
        hero_title_2: "tayyor holda toping",
        hero_subtitle: "Professional dasturchilardan sinovdan o'tgan, moslashuvchan va to'liq tayyor web-saytlarni 1 kunda sotib oling va biznesingizni boshlang.",
        btn_explore: "Saytlarni Ko'rish",
        btn_sell: "Sayt Sotish",
        search_placeholder: "Masalan: Restoran sayti, Internet do'kon, Portfolio...",
        section_popular: "Mashhur Web-Saytlar",
        section_categories: "Sayt Kategoriyalari",
        section_why: "Nima uchun SiteHub?",
        footer_rights: "Barcha huquqlar himoyalangan.",
        service_fee_title: "Platforma xizmat haqi",
        currency: "so'm",
        new_badge: "YANGI",
        btn_details: "Batafsil",
        btn_demo: "Demo",
        btn_buy: "Sotib olish",
        domain_required_alert: "Domen sotib olish va ulash majburiy!",
        agree_domain: "Men domen sotib olishga roziman"
    },
    ru: {
        nav_marketplace: "Маркетплейс",
        nav_categories: "Категории",
        nav_developers: "Разработчики",
        nav_about: "О сервисе",
        nav_support: "Поддержка",
        nav_login: "Вход",
        nav_dashboard: "Кабинет",
        nav_logout: "Выход",
        hero_tag: "№1 Маркетплейс готовых веб-сайтов в Узбекистане",
        hero_title_1: "Найдите идеальный",
        hero_title_2: "готовый сайт",
        hero_subtitle: "Покупайте проверенные, адаптивные и готовые решения от лучших разработчиков и запускайте бизнес за 1 день.",
        btn_explore: "Смотреть сайты",
        btn_sell: "Продать сайт",
        search_placeholder: "Например: Сайт ресторана, Интернет-магазин...",
        section_popular: "Популярные сайты",
        section_categories: "Категории сайтов",
        section_why: "Почему SiteHub?",
        footer_rights: "Все права защищены.",
        service_fee_title: "Плата за услуги платформы",
        currency: "сум",
        new_badge: "НОВЫЙ",
        btn_details: "Подробнее",
        btn_demo: "Демо",
        btn_buy: "Купить сайт",
        domain_required_alert: "Покупка и привязка домена обязательна!",
        agree_domain: "Я согласен на покупку и регистрацию домена"
    },
    en: {
        nav_marketplace: "Marketplace",
        nav_categories: "Categories",
        nav_developers: "Developers",
        nav_about: "About",
        nav_support: "Support",
        nav_login: "Sign In",
        nav_dashboard: "Dashboard",
        nav_logout: "Log Out",
        hero_tag: "#1 Ready-Made Website Marketplace in Uzbekistan",
        hero_title_1: "Find your perfect",
        hero_title_2: "ready-made website",
        hero_subtitle: "Buy verified, responsive, production-ready websites crafted by top developers and launch your business in 24 hours.",
        btn_explore: "Explore Websites",
        btn_sell: "Sell a Website",
        search_placeholder: "E.g. Restaurant website, E-commerce, Portfolio...",
        section_popular: "Popular Websites",
        section_categories: "Site Categories",
        section_why: "Why SiteHub?",
        footer_rights: "All rights reserved.",
        service_fee_title: "Platform service fee",
        currency: "UZS",
        new_badge: "NEW",
        btn_details: "View Details",
        btn_demo: "Live Demo",
        btn_buy: "Purchase",
        domain_required_alert: "Domain registration & linking is mandatory!",
        agree_domain: "I agree to purchase and register the domain"
    }
};

// --- 3. SEED DATA GENERATOR (For instant interactive demo & fallback) ---
const INITIAL_CATEGORIES = [
    { slug: 'landing', icon: '🚀', uz: 'Landing Page', ru: 'Лендинг', en: 'Landing Page' },
    { slug: 'shop', icon: '🛍️', uz: 'Internet Do\'kon', ru: 'Интернет-магазин', en: 'E-Commerce' },
    { slug: 'restaurant', icon: '🍽️', uz: 'Restoran & Kafe', ru: 'Рестораны и Кафе', en: 'Restaurants' },
    { slug: 'hotel', icon: '🏨', uz: 'Mehmonxona & Turizm', ru: 'Отели и Туризм', en: 'Hotels' },
    { slug: 'portfolio', icon: '🎨', uz: 'Portfolio & Rezyume', ru: 'Портфолио', en: 'Portfolio' },
    { slug: 'blog', icon: '📰', uz: 'Yangiliklar & Blog', ru: 'Новости & Блог', en: 'Blog & News' },
    { slug: 'education', icon: '🎓', uz: 'Ta\'lim & Kurslar', ru: 'Образование', en: 'Education' },
    { slug: 'corporate', icon: '🏢', uz: 'Korporativ Sayt', ru: 'Корпоративные', en: 'Corporate' },
    { slug: 'crm', icon: '📊', uz: 'CRM & Dashboard', ru: 'CRM и Панели', en: 'CRM & Dashboard' },
    { slug: 'webapp', icon: '⚡', uz: 'Web Ilova (SaaS)', ru: 'Веб-приложения', en: 'Web Apps' },
    { slug: 'telegram', icon: '🤖', uz: 'Telegram WebApp', ru: 'Telegram WebApp', en: 'Telegram WebApp' },
    { slug: 'other', icon: '✨', uz: 'Boshqa Saytlar', ru: 'Другие сайты', en: 'Other Sites' }
];

const INITIAL_SITES = [
    {
        id: "site-001",
        slug: "solis-restaurant-pro",
        title: "Solis — Premium Restoran va Kafe Sayti + Online Buyurtma",
        description: "Zamonaviy restoranlar uchun to'liq moslashuvchan, menyu, bron qilish va online buyurtma funksiyasiga ega veb-sayt. Tez yuklanadi va SEO tayyor.",
        price: 1850000,
        category_slug: "restaurant",
        developer_id: "dev-001",
        developer_name: "Azizbek Rahimov",
        developer_avatar: "A",
        developer_rating: 4.95,
        developer_sales: 38,
        screenshots: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://solis-restaurant-demo.netlify.app",
        netlify_url: "https://solis-restaurant-demo.netlify.app",
        tech: ["HTML5", "CSS3", "JavaScript", "Supabase"],
        status: "APPROVED",
        rating: 4.9,
        sales_count: 24,
        is_new: true,
        domain_price: 120000,
        created_at: "2026-02-15"
    },
    {
        id: "site-002",
        slug: "aura-fashion-ecommerce",
        title: "Aura Store — Kiyim-kechak va Aksessuarlar Do'koni",
        description: "Zamonaviy internet-do'kon. Savatcha, saralash, qidiruv va to'lov tizimlari (Click/Payme) integratsiyasi uchun qulay tuzilma.",
        price: 2400000,
        category_slug: "shop",
        developer_id: "dev-002",
        developer_name: "Malika Sobirova",
        developer_avatar: "M",
        developer_rating: 4.88,
        developer_sales: 42,
        screenshots: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://aura-fashion-shop.netlify.app",
        netlify_url: "https://aura-fashion-shop.netlify.app",
        tech: ["Vanilla JS", "Tailwind CSS", "LocalCart"],
        status: "APPROVED",
        rating: 4.8,
        sales_count: 31,
        is_new: false,
        domain_price: 120000,
        created_at: "2026-01-20"
    },
    {
        id: "site-003",
        slug: "nexus-crm-saas-dashboard",
        title: "Nexus — Savdo va Mijozlarni Boshqarish CRM Paneli",
        description: "Boshqaruv paneli, savdo grafigi, mijozlar bazasi va hisobotlar moduli. Dark mode va to'liq responsiv.",
        price: 3200000,
        category_slug: "crm",
        developer_id: "dev-001",
        developer_name: "Azizbek Rahimov",
        developer_avatar: "A",
        developer_rating: 4.95,
        developer_sales: 38,
        screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://nexus-crm-dashboard.netlify.app",
        netlify_url: "https://nexus-crm-dashboard.netlify.app",
        tech: ["HTML5", "CSS Grid", "Chart.js", "Vanilla JS"],
        status: "APPROVED",
        rating: 5.0,
        sales_count: 19,
        is_new: true,
        domain_price: 120000,
        created_at: "2026-03-01"
    },
    {
        id: "site-004",
        slug: "oasis-hotel-resort",
        title: "Oasis Resort & Spa — Mehmonxona va Xonalar Bron Qilish",
        description: "Mehmonxona, dam olish maskani va sanatoriylar uchun bron qilish kalendari bilan ta'minlangan dizayn.",
        price: 2100000,
        category_slug: "hotel",
        developer_id: "dev-003",
        developer_name: "Jasur Qodirov",
        developer_avatar: "J",
        developer_rating: 4.75,
        developer_sales: 17,
        screenshots: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://oasis-hotel-demo.netlify.app",
        netlify_url: "https://oasis-hotel-demo.netlify.app",
        tech: ["HTML5", "CSS3", "JavaScript"],
        status: "APPROVED",
        rating: 4.7,
        sales_count: 12,
        is_new: false,
        domain_price: 120000,
        created_at: "2025-12-10"
    },
    {
        id: "site-005",
        slug: "vertex-saas-landing",
        title: "Vertex — Startap va Mobil Ilova Uchun Konversion Landing",
        description: "Yuqori konversiyali landing sahifasi. FAQ, narxlar jadvali, interaktiv animatsiyalar va lead yig'ish formasi mavjud.",
        price: 950000,
        category_slug: "landing",
        developer_id: "dev-002",
        developer_name: "Malika Sobirova",
        developer_avatar: "M",
        developer_rating: 4.88,
        developer_sales: 42,
        screenshots: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://vertex-landing-page.netlify.app",
        netlify_url: "https://vertex-landing-page.netlify.app",
        tech: ["HTML5", "CSS Animation", "JS"],
        status: "APPROVED",
        rating: 4.9,
        sales_count: 48,
        is_new: true,
        domain_price: 120000,
        created_at: "2026-02-28"
    },
    {
        id: "site-006",
        slug: "creator-minimal-portfolio",
        title: "Creator — Dasturchi va Dizaynerlar Uchun Minimal Portfolio",
        description: "Ishlaringizni eng yaxshi darajada namoyish qilish uchun toza, estetik va tez yuklanuvchi portfolio sayti.",
        price: 750000,
        category_slug: "portfolio",
        developer_id: "dev-003",
        developer_name: "Jasur Qodirov",
        developer_avatar: "J",
        developer_rating: 4.75,
        developer_sales: 17,
        screenshots: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://creator-portfolio-pro.netlify.app",
        netlify_url: "https://creator-portfolio-pro.netlify.app",
        tech: ["HTML5", "Pure CSS", "Vanilla JS"],
        status: "APPROVED",
        rating: 4.8,
        sales_count: 22,
        is_new: false,
        domain_price: 120000,
        created_at: "2026-01-14"
    },
    {
        id: "site-007",
        slug: "edulearn-academy",
        title: "EduLearn — O'quv Markazlari va Online Kurslar Sayti",
        description: "Kurslar ro'yxati, ustozlar, video darslar bloki va ro'yxatdan o'tish arizalari qabul qiluvchi to'liq tizim.",
        price: 1650000,
        category_slug: "education",
        developer_id: "dev-001",
        developer_name: "Azizbek Rahimov",
        developer_avatar: "A",
        developer_rating: 4.95,
        developer_sales: 38,
        screenshots: ["https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://edulearn-academy.netlify.app",
        netlify_url: "https://edulearn-academy.netlify.app",
        tech: ["HTML5", "CSS3", "JavaScript"],
        status: "APPROVED",
        rating: 4.9,
        sales_count: 15,
        is_new: true,
        domain_price: 120000,
        created_at: "2026-03-02"
    },
    {
        id: "site-008",
        slug: "tg-fastfood-delivery-webapp",
        title: "FastBite — Telegram WebApp Buyurtma va Yetkazish",
        description: "Telegram bot ichida ochiluvchi qulay va tezkor menyu hamda lokatsiya orqali yetkazish tizimi.",
        price: 2100000,
        category_slug: "telegram",
        developer_id: "dev-002",
        developer_name: "Malika Sobirova",
        developer_avatar: "M",
        developer_rating: 4.88,
        developer_sales: 42,
        screenshots: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60"],
        demo_url: "https://tg-fastfood-webapp.netlify.app",
        netlify_url: "https://tg-fastfood-webapp.netlify.app",
        tech: ["Telegram WebApp API", "JS", "CSS"],
        status: "APPROVED",
        rating: 5.0,
        sales_count: 27,
        is_new: false,
        domain_price: 120000,
        created_at: "2026-01-30"
    }
];

const INITIAL_SETTINGS = {
    commission_type: "fixed",
    commission_amount: 10000, // 10,000 UZS platform service fee
    platform_card: "8600 4501 2289 7712",
    platform_holder: "SITEHUB MARKETPLACE MCHJ",
    platform_bank: "Kapitalbank ATB"
};

// --- 4. APP STATE INITIALIZATION ---
class SiteHubApp {
    constructor() {
        this.currentLang = localStorage.getItem(STORAGE_KEYS.LANG) || 'uz';
        this.currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null;
        this.favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        
        // Majburiy tizimga kirish (Login First) himoyasi
        if (!this.enforceAuthProtection()) {
            return;
        }

        this.initDataStores();
        this.applyTheme(this.currentTheme);
        this.initAudio();
    }

    getCurrentPageName() {
        const path = window.location.pathname.replace(/\\/g, '/');
        const lastPart = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return lastPart.toLowerCase();
    }

    enforceAuthProtection() {
        const page = this.getCurrentPageName();
        const isLoginPage = page === 'login.html';

        if (!this.currentUser) {
            // Tizimga kirmagan bo'lsa va login sahifasida bo'lmasa -> login.html ga yo'naltirish
            if (!isLoginPage) {
                const searchAndHash = window.location.search + window.location.hash;
                const redirectTarget = (page && page !== 'index.html') ? (page + searchAndHash) : '';
                const query = redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : '';
                window.location.replace(`login.html${query}`);
                return false;
            }
        } else {
            // Foydalanuvchi tizimga kirgan bo'lsa va login.html ga tashrif buyursa
            if (isLoginPage) {
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect');
                if (redirect && !redirect.includes('login.html')) {
                    window.location.replace(decodeURIComponent(redirect));
                    return false;
                }
                if (this.currentUser.role === 'admin') {
                    window.location.replace('admin.html');
                } else if (this.currentUser.role === 'developer') {
                    window.location.replace('developer.html');
                } else {
                    window.location.replace('index.html');
                }
                return false;
            }

            // Rol bo'yicha maxsus sahifalarni himoyalash
            if (page === 'admin.html' && this.currentUser.role !== 'admin') {
                alert("Ushbu bo'lim faqat administratorlar uchun mo'ljallangan!");
                window.location.replace('index.html');
                return false;
            }
            if (page === 'developer.html' && this.currentUser.role !== 'developer' && this.currentUser.role !== 'admin') {
                alert("Ushbu bo'lim faqat dasturchilar uchun mo'ljallangan!");
                window.location.replace('index.html');
                return false;
            }
        }
        return true;
    }

    initDataStores() {
        if (!localStorage.getItem(STORAGE_KEYS.SITES)) {
            localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(INITIAL_SITES));
        }
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
            const demoOrders = [
                {
                    id: "ord-101",
                    order_number: "SH-9082",
                    customer_id: "user-cust-1",
                    customer_name: "Otabek Umarov",
                    site_id: "site-001",
                    site_title: "Solis — Premium Restoran va Kafe Sayti",
                    developer_id: "dev-001",
                    developer_name: "Azizbek Rahimov",
                    base_price: 1850000,
                    extras_price: 250000,
                    domain_price: 120000,
                    total: 2220000,
                    commission_amount: 10000,
                    developer_amount: 2210000,
                    status: "PROCESSING",
                    payment_method: "click",
                    payment_status: "PAID",
                    domain_name: "solisrestaurant.uz",
                    domain_status: "CONFIGURED", // Ready for customer to confirm
                    domain_registrar: "UZINFOCOM",
                    is_paid_out: false,
                    created_at: "2026-03-01"
                }
            ];
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
        }
    }

    // --- THEME SYSTEM ---
    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        
        const togglers = document.querySelectorAll('.theme-toggle-btn');
        togglers.forEach(btn => {
            btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            btn.title = theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim';
        });
    }

    toggleTheme() {
        const next = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        this.showToast(next === 'dark' ? 'Tungi rejim yoqildi' : 'Kunduzgi rejim yoqildi', 'info');
    }

    // --- AUDIO NOTIFICATION (Pure Web Audio API chime) ---
    initAudio() {
        this.audioCtx = null;
    }

    playNotificationSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!this.audioCtx) this.audioCtx = new AudioContext();
            
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {
            console.log('Audio playback unsupported or blocked');
        }
    }

    // --- TOAST NOTIFICATIONS ---
    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '⚠️';
        if (type === 'warning') icon = '🔔';

        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- i18n TRANSLATIONS ---
    setLanguage(lang) {
        if (!['uz', 'ru', 'en'].includes(lang)) return;
        this.currentLang = lang;
        localStorage.setItem(STORAGE_KEYS.LANG, lang);
        this.applyLanguage();
        this.showToast(`Til o'zgartirildi: ${lang.toUpperCase()}`, 'success');
    }

    t(key) {
        return (TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) 
            || (TRANSLATIONS['uz'] && TRANSLATIONS['uz'][key]) 
            || key;
    }

    applyLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) el.textContent = translation;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) el.placeholder = translation;
        });

        // Update active language button state
        document.querySelectorAll('.current-lang-code').forEach(el => {
            el.textContent = this.currentLang.toUpperCase();
        });
    }

    // --- FAVORITES MANAGEMENT ---
    toggleFavorite(siteId) {
        const index = this.favorites.indexOf(siteId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast("Sevimlilardan o'chirildi", "info");
        } else {
            this.favorites.push(siteId);
            this.showToast("Sevimlilarga qo'shildi! ❤️", "success");
        }
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites));
        this.updateFavoriteBadges();
        
        // Dispatch event for UI reactivity
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: this.favorites }));
    }

    isFavorite(siteId) {
        return this.favorites.includes(siteId);
    }

    updateFavoriteBadges() {
        const count = this.favorites.length;
        document.querySelectorAll('.fav-count-badge').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // --- DATA ACCESS & REPOSITORIES ---
    getSites(filter = {}) {
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEYS.SITES)) || INITIAL_SITES;
        return sites.filter(s => {
            if (filter.status && s.status !== filter.status) return false;
            if (filter.category && filter.category !== 'all' && s.category_slug !== filter.category) return false;
            if (filter.developer_id && s.developer_id !== filter.developer_id) return false;
            if (filter.maxPrice && s.price > filter.maxPrice) return false;
            if (filter.minRating && s.rating < filter.minRating) return false;
            if (filter.search) {
                const q = filter.search.toLowerCase();
                const matchTitle = s.title.toLowerCase().includes(q);
                const matchDesc = s.description.toLowerCase().includes(q);
                const matchTech = (s.tech || []).some(t => t.toLowerCase().includes(q));
                if (!matchTitle && !matchDesc && !matchTech) return false;
            }
            return true;
        });
    }

    getSiteById(id) {
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEYS.SITES)) || INITIAL_SITES;
        return sites.find(s => s.id === id || s.slug === id);
    }

    saveSite(siteData) {
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEYS.SITES)) || INITIAL_SITES;
        const index = sites.findIndex(s => s.id === siteData.id);
        if (index > -1) {
            sites[index] = { ...sites[index], ...siteData };
        } else {
            sites.unshift(siteData);
        }
        localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(sites));
        return siteData;
    }

    deleteSite(id) {
        let sites = JSON.parse(localStorage.getItem(STORAGE_KEYS.SITES)) || INITIAL_SITES;
        sites = sites.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(sites));
    }

    getOrders(filter = {}) {
        const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
        return orders.filter(o => {
            if (filter.customer_id && o.customer_id !== filter.customer_id) return false;
            if (filter.developer_id && o.developer_id !== filter.developer_id) return false;
            if (filter.status && o.status !== filter.status) return false;
            return true;
        });
    }

    saveOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
        const index = orders.findIndex(o => o.id === orderData.id);
        if (index > -1) {
            orders[index] = { ...orders[index], ...orderData };
        } else {
            orders.unshift(orderData);
        }
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return orderData;
    }

    getSettings() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || INITIAL_SETTINGS;
    }

    updateSettings(newSettings) {
        const settings = { ...this.getSettings(), ...newSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return settings;
    }

    // --- COMMISSION / SERVICE FEE CALCULATION ---
    calculateCommission(total) {
        const settings = this.getSettings();
        let commission = 0;
        if (settings.commission_type === 'percent') {
            commission = Math.round((total * (settings.commission_amount || 5)) / 100);
        } else {
            commission = Number(settings.commission_amount || 10000);
        }
        const developer_amount = Math.max(0, total - commission);
        return {
            commission,
            developer_amount,
            total
        };
    }

    // --- FORMATTING HELPERS ---
    formatPrice(amount) {
        return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // --- AUTH HELPERS ---
    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
        this.renderUserHeaderState();
    }

    logout() {
        this.setCurrentUser(null);
        this.showToast("Hisobdan muvaffaqiyatli chiqildi", "info");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }

    // Render User Header button / Profile link
    renderUserHeaderState() {
        const authContainer = document.getElementById('header-auth-section');
        if (!authContainer) return;

        if (this.currentUser) {
            let roleBadge = 'Mijoz';
            let targetDash = 'customer.html';
            if (this.currentUser.role === 'developer') {
                roleBadge = 'Dasturchi';
                targetDash = 'developer.html';
            } else if (this.currentUser.role === 'admin') {
                roleBadge = 'Admin';
                targetDash = 'admin.html';
            }

            const initial = (this.currentUser.name || 'U').charAt(0).toUpperCase();

            authContainer.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <a href="${targetDash}" class="user-menu-btn" title="Kabinetga o'tish">
                        <div class="user-avatar">${initial}</div>
                        <span style="font-weight: 600; font-size: 0.9rem;">${this.currentUser.name || 'Profil'}</span>
                        <span class="badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.7rem;">${roleBadge}</span>
                    </a>
                </div>
                <button onclick="siteHub.logout()" class="btn btn-secondary btn-sm" title="Chiqish">🚪</button>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="login.html" class="btn btn-primary btn-sm">
                    <span>Kirish</span>
                </a>
            `;
        }
    }

    // --- MODAL UTILITIES ---
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // --- DOM BOOTSTRAPPER ---
    initPage() {
        this.renderUserHeaderState();
        this.updateFavoriteBadges();
        this.applyLanguage();

        // Language Dropdown toggler
        const langBtn = document.querySelector('.lang-btn');
        const langDropdown = document.querySelector('.lang-dropdown');
        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('show');
            });
            document.addEventListener('click', () => {
                langDropdown.classList.remove('show');
            });
        }

        // Close modals on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }
}

// Global Singleton Instance
window.siteHub = new SiteHubApp();
window.siteHubCategories = INITIAL_CATEGORIES;

// Run initial binding on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.siteHub.initPage();
});
