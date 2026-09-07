export const languages = { ar: "العربية", en: "English", fr: "Français", es: "Español", de: "Deutsch", tr: "Türkçe", pt: "Português", zh: "中文", hi: "हिन्दी", sw: "Kiswahili" } as const;

export type Language = keyof typeof languages;

export const translations = {
  ar: {
    welcome: "مرحباً بك في NOLERA X",
    goodMorning: "صباح الخير",
    balance: "الرصيد الإجمالي",
    send: "إرسال الأموال",
    receive: "استلام الأموال",
    addMoney: "إضافة أموال",
    withdraw: "سحب الأموال",
    cards: "البطاقات",
    bills: "الفواتير",
    transactions: "المعاملات",
    noleraId: "NOLERA ID",
    security: "الأمان",
    notifications: "الإشعارات",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    language: "اللغة",
    currency: "العملة",
    privacy: "الخصوصية",
    terms: "الشروط والأحكام",
    logout: "تسجيل الخروج"
  },
  en: {
    welcome: "Welcome to NOLERA X",
    goodMorning: "Good morning",
    balance: "Total Balance",
    send: "Send Money",
    receive: "Receive Money",
    addMoney: "Add Money",
    withdraw: "Withdraw Money",
    cards: "Cards",
    bills: "Bills",
    transactions: "Transactions",
    noleraId: "NOLERA ID",
    security: "Security",
    notifications: "Notifications",
    settings: "Settings",
    profile: "Profile",
    language: "Language",
    currency: "Currency",
    privacy: "Privacy",
    terms: "Terms & Conditions",
    logout: "Log out"
  }
} as const;
