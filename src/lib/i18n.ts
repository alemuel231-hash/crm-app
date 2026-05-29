// ============================================================
// Orbit Fleet Systems — Trilingual Localization Dictionary
// Languages: English (EN), French (FR), Arabic (AR)
// ============================================================
export type LangType = 'EN' | 'FR' | 'AR';

export const translations = {
  EN: {
    // ── Navigation
    dashboard: "Dashboard",
    orbit: "Orbit Fleet",
    main: "Main",
    trip_management: "Trip Management",
    user_management: "User Management",
    finance: "Finance",
    platform_settings: "Platform Settings",
    analytics: "Analytics & Reports",
    administration: "Administration",

    // ── Stats Cards
    total_drivers: "Total Drivers",
    total_riders: "Total Riders",
    todays_earning: "Today's Earning",
    total_earning: "Total Earning",
    daily_console: "DAILY CONSOLE",
    down: "Down",
    up: "Up",
    active_drivers: "Active Drivers",
    pending_verif: "Pending Verification",

    // ── Charts & Overview
    rides_overview: "Rides Overview",
    current_year: "Current Year",
    all_rides: "All Rides",
    active_rides: "Active Rides",
    cancelled_rides: "Cancelled Rides",
    completed_rides: "Completed Rides",
    refresh_data: "Refresh Data",
    revenue_source: "Revenue Source",
    total: "Total",
    cash: "Cash",
    cashless: "Cashless",
    live: "LIVE",

    // ── Table
    ride_status: "Ride Status",
    dispatch_trip: "Dispatch A Trip",
    filter_by: "Filter By:",
    search_rides: "Search rides...",
    showing_rides: "Showing {start} to {end} of {total} rides",

    // ── Table Columns
    ride_id: "RIDE ID",
    rider_name: "RIDER NAME",
    pickup: "PICKUP",
    dropoff: "DROPOFF",
    driver: "DRIVER",
    cost: "COST",
    payment: "PAYMENT",
    date: "DATE",
    status: "STATUS",
    action: "ACTION",

    // ── Bottom Panels
    top_performing: "Top Performing Drivers",
    location_session: "Live GPS Overview",
    recent_activity: "Recent Activity",
    country: "Country",
    sessions: "Sessions",
    perc: "Perc.",
    showing_drivers: "Showing 1 to 4 of 4 drivers",

    // ── Common Actions
    search: "Search",
    filter: "Filter",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    close: "Close",
    view: "View",
    loading: "Loading...",
    no_data: "No Data Found",
    refresh: "Refresh",
    export: "Export",
    all: "All",

    // ── Pages
    trips_title: "Dispatch & Bookings History",
    trips_subtitle: "Review operational ride requests, routes, pricing telemetry, and payment clearances",
    drivers_title: "Drivers Fleet Directory",
    drivers_subtitle: "Manage profiles, statuses, and block parameters for all onboarded operators",
    pending_title: "Document Verification Queue",
    pending_subtitle: "Review driver profiles, vehicle certificates, and approve operational licenses",
    contacts_title: "Riders Directory",
    contacts_subtitle: "View and manage all registered passenger accounts",
    deals_title: "Transactions Ledger",
    deals_subtitle: "Review payment records, trip costs, and financial clearances",
    reports_title: "Analytics & Earnings",
    reports_subtitle: "Comprehensive fleet performance metrics and revenue analysis",
    settings_title: "App Settings",
    settings_subtitle: "Configure platform parameters and system options",
    pricing_title: "Fare Matrix",
    pricing_subtitle: "Manage distance-based pricing and fare structures",
    payout_title: "Payout Control",
    payout_subtitle: "Manage driver earnings and payout schedules",
    admin_title: "Manager Directory",
    admin_subtitle: "Manage administrator accounts and permissions",

    // ── Driver statuses
    verified: "Verified Active",
    unverified: "Unverified",
    blocked: "Blocked",
    onboard: "Onboard New Driver",
    block_driver: "Block Driver",
    unblock_driver: "Unblock Driver",

    // ── Trips status
    paid: "Paid",
    unpaid: "Unpaid",
    completed: "Completed",
    cancelled: "Cancelled",
    active: "Active",

    // ── Document Audit
    verify_approve: "Verify & Approve",
    reject_block: "Reject & Block",
    license: "Driving License",
    insurance: "Vehicle Insurance",
    registration: "Registration",
    awaiting_audit: "Awaiting Document Verification",
    queue_clear: "Queue is Clear!",

    // ── Dispatch Modal
    dispatch_new: "Create New Live Dispatch",
    passenger_name: "Passenger Name",
    passenger_phone: "Passenger Phone",
    pickup_loc: "Pickup Location Address",
    destination_loc: "Destination Drop-Off Address",
    select_driver: "Select Available Driver",
    estimated_fare: "Estimated Fare (GHS)",
    payment_method: "Payment Method",
    confirm_dispatch: "Confirm Dispatch",

    // ── Map
    map_live: "Live Fleet Map",
    map_drivers: "Available Drivers",
    available: "Available",
    no_drivers_online: "No drivers currently online",
  },

  FR: {
    // ── Navigation
    dashboard: "Tableau de Bord",
    orbit: "Orbite Flotte",
    main: "Principal",
    trip_management: "Gestion des Trajets",
    user_management: "Gestion des Utilisateurs",
    finance: "Finances",
    platform_settings: "Paramètres de la Plateforme",
    analytics: "Analyses & Rapports",
    administration: "Administration",

    // ── Stats Cards
    total_drivers: "Total Chauffeurs",
    total_riders: "Total Passagers",
    todays_earning: "Revenus du Jour",
    total_earning: "Revenus Totaux",
    daily_console: "CONSOLE JOURNALIÈRE",
    down: "En baisse",
    up: "En hausse",
    active_drivers: "Chauffeurs Actifs",
    pending_verif: "Vérification en Attente",

    // ── Charts
    rides_overview: "Aperçu des Trajets",
    current_year: "Année En Cours",
    all_rides: "Tous les Trajets",
    active_rides: "Trajets Actifs",
    cancelled_rides: "Trajets Annulés",
    completed_rides: "Trajets Terminés",
    refresh_data: "Actualiser",
    revenue_source: "Source de Revenus",
    total: "Total",
    cash: "Espèces",
    cashless: "Sans Espèces",
    live: "EN DIRECT",

    // ── Table
    ride_status: "Statut des Trajets",
    dispatch_trip: "Dépêcher un Trajet",
    filter_by: "Filtrer Par:",
    search_rides: "Rechercher des trajets...",
    showing_rides: "Affichage de {start} à {end} sur {total} trajets",

    // ── Columns
    ride_id: "ID TRAJET",
    rider_name: "NOM PASSAGER",
    pickup: "RAMASSAGE",
    dropoff: "DESTINATION",
    driver: "CHAUFFEUR",
    cost: "COÛT",
    payment: "PAIEMENT",
    date: "DATE",
    status: "STATUT",
    action: "ACTION",

    // ── Panels
    top_performing: "Meilleurs Chauffeurs",
    location_session: "Aperçu GPS en Direct",
    recent_activity: "Activité Récente",
    country: "Pays",
    sessions: "Sessions",
    perc: "Pourcent.",
    showing_drivers: "Affichage de 1 à 4 sur 4 chauffeurs",

    // ── Common
    search: "Rechercher",
    filter: "Filtrer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    close: "Fermer",
    view: "Voir",
    loading: "Chargement...",
    no_data: "Aucune Donnée",
    refresh: "Actualiser",
    export: "Exporter",
    all: "Tout",

    // ── Pages
    trips_title: "Historique des Départs & Réservations",
    trips_subtitle: "Examinez les demandes de trajet, les itinéraires, la télémétrie des tarifs",
    drivers_title: "Annuaire des Chauffeurs",
    drivers_subtitle: "Gérez les profils, statuts et paramètres de blocage pour tous les opérateurs",
    pending_title: "File d'attente de Vérification",
    pending_subtitle: "Examinez les profils et approuvez les licences opérationnelles",
    contacts_title: "Annuaire des Passagers",
    contacts_subtitle: "Voir et gérer tous les comptes passagers enregistrés",
    deals_title: "Grand Livre des Transactions",
    deals_subtitle: "Examinez les paiements, coûts et validations financières",
    reports_title: "Analyses & Revenus",
    reports_subtitle: "Métriques complètes de performance de la flotte",
    settings_title: "Paramètres de l'App",
    settings_subtitle: "Configurer les paramètres de la plateforme",
    pricing_title: "Grille Tarifaire",
    pricing_subtitle: "Gérer la tarification basée sur la distance",
    payout_title: "Contrôle des Paiements",
    payout_subtitle: "Gérer les revenus des chauffeurs et les calendriers de paiement",
    admin_title: "Annuaire des Managers",
    admin_subtitle: "Gérer les comptes administrateurs et les permissions",

    // ── Statuses
    verified: "Actif Vérifié",
    unverified: "Non Vérifié",
    blocked: "Bloqué",
    onboard: "Embarquer un Chauffeur",
    block_driver: "Bloquer le Chauffeur",
    unblock_driver: "Débloquer le Chauffeur",

    // ── Trips status
    paid: "Payé",
    unpaid: "Non Payé",
    completed: "Terminé",
    cancelled: "Annulé",
    active: "Actif",

    // ── Documents
    verify_approve: "Vérifier & Approuver",
    reject_block: "Rejeter & Bloquer",
    license: "Permis de Conduire",
    insurance: "Assurance Véhicule",
    registration: "Immatriculation",
    awaiting_audit: "En Attente de Vérification",
    queue_clear: "La File est Vide!",

    // ── Modal
    dispatch_new: "Créer un Nouveau Départ",
    passenger_name: "Nom du Passager",
    passenger_phone: "Téléphone Passager",
    pickup_loc: "Adresse de Ramassage",
    destination_loc: "Adresse de Destination",
    select_driver: "Sélectionner un Chauffeur",
    estimated_fare: "Tarif Estimé (GHS)",
    payment_method: "Mode de Paiement",
    confirm_dispatch: "Confirmer le Départ",

    // ── Map
    map_live: "Carte Flotte en Direct",
    map_drivers: "Chauffeurs Disponibles",
    available: "Disponible",
    no_drivers_online: "Aucun chauffeur en ligne actuellement",
  },

  AR: {
    // ── التنقل
    dashboard: "لوحة التحكم",
    orbit: "أوربيت فليت",
    main: "الرئيسية",
    trip_management: "إدارة الرحلات",
    user_management: "إدارة المستخدمين",
    finance: "المالية",
    platform_settings: "إعدادات المنصة",
    analytics: "التحليلات والتقارير",
    administration: "الإدارة",

    // ── بطاقات الإحصاء
    total_drivers: "إجمالي السائقين",
    total_riders: "إجمالي الركاب",
    todays_earning: "أرباح اليوم",
    total_earning: "إجمالي الأرباح",
    daily_console: "لوحة اليومية",
    down: "انخفاض",
    up: "ارتفاع",
    active_drivers: "السائقون النشطون",
    pending_verif: "قيد التحقق",

    // ── الرسوم البيانية
    rides_overview: "نظرة عامة على الرحلات",
    current_year: "السنة الحالية",
    all_rides: "جميع الرحلات",
    active_rides: "الرحلات النشطة",
    cancelled_rides: "الرحلات الملغاة",
    completed_rides: "الرحلات المكتملة",
    refresh_data: "تحديث البيانات",
    revenue_source: "مصدر الإيرادات",
    total: "الإجمالي",
    cash: "نقداً",
    cashless: "بدون نقد",
    live: "مباشر",

    // ── الجدول
    ride_status: "حالة الرحلة",
    dispatch_trip: "إرسال رحلة",
    filter_by: "تصفية حسب:",
    search_rides: "البحث في الرحلات...",
    showing_rides: "عرض {start} إلى {end} من {total} رحلة",

    // ── أعمدة الجدول
    ride_id: "رقم الرحلة",
    rider_name: "اسم الراكب",
    pickup: "نقطة الالتقاط",
    dropoff: "نقطة الإنزال",
    driver: "السائق",
    cost: "التكلفة",
    payment: "الدفع",
    date: "التاريخ",
    status: "الحالة",
    action: "الإجراء",

    // ── اللوحات السفلية
    top_performing: "أفضل السائقين أداءً",
    location_session: "نظرة GPS المباشرة",
    recent_activity: "النشاط الأخير",
    country: "الدولة",
    sessions: "الجلسات",
    perc: "النسبة",
    showing_drivers: "عرض 1 إلى 4 من 4 سائقين",

    // ── الإجراءات المشتركة
    search: "بحث",
    filter: "تصفية",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    close: "إغلاق",
    view: "عرض",
    loading: "جار التحميل...",
    no_data: "لا توجد بيانات",
    refresh: "تحديث",
    export: "تصدير",
    all: "الكل",

    // ── الصفحات
    trips_title: "سجل الرحلات والحجوزات",
    trips_subtitle: "مراجعة طلبات الرحلات والمسارات وتكاليف النقل",
    drivers_title: "دليل سائقي الأسطول",
    drivers_subtitle: "إدارة الملفات الشخصية وحالات التشغيل لجميع السائقين",
    pending_title: "طابور التحقق من الوثائق",
    pending_subtitle: "مراجعة الملفات وإقرار رخص التشغيل",
    contacts_title: "دليل الركاب",
    contacts_subtitle: "عرض وإدارة جميع حسابات الركاب المسجلة",
    deals_title: "سجل المعاملات",
    deals_subtitle: "مراجعة سجلات الدفع وتكاليف الرحلات",
    reports_title: "التحليلات والأرباح",
    reports_subtitle: "مقاييس أداء الأسطول الشامل وتحليل الإيرادات",
    settings_title: "إعدادات التطبيق",
    settings_subtitle: "ضبط معلمات المنصة وخيارات النظام",
    pricing_title: "مصفوفة الأسعار",
    pricing_subtitle: "إدارة أسعار المسافة وهياكل الأجور",
    payout_title: "التحكم في المدفوعات",
    payout_subtitle: "إدارة أرباح السائقين وجداول الدفع",
    admin_title: "دليل المديرين",
    admin_subtitle: "إدارة حسابات المسؤولين والصلاحيات",

    // ── حالات السائق
    verified: "نشط ومتحقق",
    unverified: "غير متحقق",
    blocked: "محظور",
    onboard: "تسجيل سائق جديد",
    block_driver: "حظر السائق",
    unblock_driver: "رفع الحظر",

    // ── حالات الرحلة
    paid: "مدفوع",
    unpaid: "غير مدفوع",
    completed: "مكتملة",
    cancelled: "ملغاة",
    active: "نشطة",

    // ── الوثائق
    verify_approve: "تحقق وموافقة",
    reject_block: "رفض وحجب",
    license: "رخصة القيادة",
    insurance: "تأمين المركبة",
    registration: "تسجيل المركبة",
    awaiting_audit: "في انتظار التحقق من الوثائق",
    queue_clear: "الطابور فارغ!",

    // ── نافذة الإرسال
    dispatch_new: "إنشاء إرسال مباشر جديد",
    passenger_name: "اسم الراكب",
    passenger_phone: "هاتف الراكب",
    pickup_loc: "عنوان نقطة الالتقاط",
    destination_loc: "عنوان وجهة الإنزال",
    select_driver: "اختر السائق المتاح",
    estimated_fare: "الأجرة المقدرة (GHS)",
    payment_method: "طريقة الدفع",
    confirm_dispatch: "تأكيد الإرسال",

    // ── الخريطة
    map_live: "خريطة الأسطول المباشرة",
    map_drivers: "السائقون المتاحون",
    available: "متاح",
    no_drivers_online: "لا يوجد سائقون متاحون حالياً",
  }
};

export function getTranslation(lang: LangType, key: keyof typeof translations['EN']): string {
  const dictionary = translations[lang] || translations['EN'];
  return (dictionary as any)[key] || (translations['EN'] as any)[key] || String(key);
}

// RTL languages
export const RTL_LANGUAGES: LangType[] = ['AR'];

export function isRTL(lang: LangType): boolean {
  return RTL_LANGUAGES.includes(lang);
}

export function getDir(lang: LangType): 'ltr' | 'rtl' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}
