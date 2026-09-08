"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Wallet,
  ArrowLeftRight,
  LayoutGrid,
  UserRound,
  Menu,
  X,
  Globe2,
  Moon,
  Sun,
  Bell,
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  CreditCard,
  ShoppingBag,
  Bot,
  Map,
  MessageCircle,
  ShieldCheck,
  Settings,
  ReceiptText,
  Store,
  Sparkles,
  Eye,
  EyeOff,
  LockKeyhole,
  Landmark,
  Plane,
  Building2,
  BookOpen,
  Coins,
  Search,
  QrCode,
  MoreHorizontal,
  Zap,
  CircleDollarSign,
} from "lucide-react";

import { financeState, getTransactions } from "../lib/finance";

type Language = "ar" | "en";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ar");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(financeState.balance);
  const [activeHero, setActiveHero] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>(
    getTransactions().slice(0, 4)
  );

  const isArabic = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [isArabic, language]);

  useEffect(() => {
    setBalance(financeState.balance);
    setRecentTransactions(getTransactions().slice(0, 4));
  }, []);

  const text = useMemo(
    () =>
      isArabic
        ? {
            welcome: "مرحباً، يحيى",
            account: "حسابي",
            balance: "الرصيد المتاح",
            currency: "جنيه سوداني",
            quick: "إجراءات سريعة",
            services: "الخدمات",
            recent: "آخر العمليات",
            viewAll: "عرض الكل",
            market: "NOLERA X MARKET",
            marketSub: "متجرك الرقمي العالمي",
            abu: "أبو حنين AI",
            abuSub: "مساعدك الذكي في كل خطوة",
            world: "WORLD MAP",
            worldSub: "اكتشف العالم من مكان واحد",
            social: "NOLERA X SOCIAL",
            socialSub: "تواصل، شارك، وابنِ مجتمعك",
            send: "تحويل",
            receive: "استلام",
            add: "إضافة أموال",
            withdraw: "سحب",
            wallet: "محفظتي",
            card: "بطاقة NOLERA X",
            cardSub: "بطاقتك الرقمية",
            security: "مركز الأمان",
            identity: "NOLERA ID",
            identitySub: "هويتك الرقمية",
            payments: "المدفوعات",
            cards: "البطاقات",
            transactions: "المعاملات",
            store: "المتجر",
            markets: "الأسواق",
            ai: "أبو حنين AI",
            verification: "التحقق",
            settings: "الإعدادات",
            securityMenu: "الأمان",
            overview: "الرئيسية",
            digital: "Digital Ecosystem",
            coming: "قريباً",
            scan: "مسح QR",
            more: "المزيد",
            points: "نقاط NOLERA",
            logistics: "اللوجستيات",
            properties: "العقارات",
            books: "الكتب الرقمية",
            activity: "النشاط",
          }
        : {
            welcome: "Welcome, Yahya",
            account: "My Account",
            balance: "Available Balance",
            currency: "Sudanese Pound",
            quick: "Quick Actions",
            services: "Services",
            recent: "Recent Activity",
            viewAll: "View All",
            market: "NOLERA X MARKET",
            marketSub: "Your global digital marketplace",
            abu: "ABU HANIN AI",
            abuSub: "Your intelligent assistant",
            world: "WORLD MAP",
            worldSub: "Explore the world from one place",
            social: "NOLERA X SOCIAL",
            socialSub: "Connect, share and build",
            send: "Transfer",
            receive: "Receive",
            add: "Add Money",
            withdraw: "Withdraw",
            wallet: "My Wallet",
            card: "NOLERA X CARD",
            cardSub: "Your digital card",
            security: "Security Center",
            identity: "NOLERA ID",
            identitySub: "Your digital identity",
            payments: "Payments",
            cards: "Cards",
            transactions: "Transactions",
            store: "Store",
            markets: "Markets",
            ai: "Abu Hanin AI",
            verification: "Verification",
            settings: "Settings",
            securityMenu: "Security",
            overview: "Home",
            digital: "Digital Ecosystem",
            coming: "Soon",
            scan: "Scan QR",
            more: "More",
            points: "NOLERA Points",
            logistics: "Logistics",
            properties: "Properties",
            books: "Digital Books",
            activity: "Activity",
          },
    [isArabic]
  );

  const navItems = [
    {
      href: "/",
      label: text.overview,
      icon: Home,
    },
    {
      href: "/wallet",
      label: text.wallet,
      icon: Wallet,
    },
    {
      href: "/transfers",
      label: text.send,
      icon: ArrowLeftRight,
    },
    {
      href: "/store",
      label: text.store,
      icon: ShoppingBag,
    },
    {
      href: "/profile",
      label: text.account,
      icon: UserRound,
    },
  ];

  const sideItems = [
    { href: "/", label: text.overview, icon: Home },
    { href: "/wallet", label: text.wallet, icon: Wallet },
    { href: "/add-money", label: text.add, icon: Plus },
    { href: "/withdraw", label: text.withdraw, icon: ArrowUpFromLine },
    { href: "/transfers", label: text.payments, icon: Send },
    { href: "/cards", label: text.cards, icon: CreditCard },
    { href: "/transactions", label: text.transactions, icon: ReceiptText },
    { href: "/store", label: text.store, icon: Store },
    { href: "/markets", label: text.markets, icon: CircleDollarSign },
    { href: "/ai", label: text.ai, icon: Bot },
    { href: "/id", label: text.identity, icon: ShieldCheck },
    { href: "/verification", label: text.verification, icon: LockKeyhole },
    { href: "/security", label: text.securityMenu, icon: ShieldCheck },
    { href: "/settings", label: text.settings, icon: Settings },
  ];

  const heroCards = [
    {
      href: "/store",
      title: text.market,
      subtitle: text.marketSub,
      icon: ShoppingBag,
      badge: "MARKET",
      description: isArabic
        ? "منتجات رقمية وخدمات وفرص بيع وشراء من مكان واحد"
        : "Digital products, services and global commerce in one place",
    },
    {
      href: "/ai",
      title: text.abu,
      subtitle: text.abuSub,
      icon: Bot,
      badge: "AI",
      description: isArabic
        ? "أنشئ منتجاتك، محتواك، تصاميمك وتسويقك بمساعدة أبو حنين"
        : "Create products, content, designs and marketing with Abu Hanin",
    },
    {
      href: "#world",
      title: text.world,
      subtitle: text.worldSub,
      icon: Map,
      badge: "WORLD",
      description: isArabic
        ? "متاجر وشركات وخدمات وعقارات ولوجستيات حول العالم"
        : "Stores, companies, services, properties and logistics worldwide",
    },
    {
      href: "#social",
      title: text.social,
      subtitle: text.socialSub,
      icon: MessageCircle,
      badge: "SOCIAL",
      description: isArabic
        ? "تواصل ومشاركة وقنوات ومجتمعات داخل منظومة NOLERA X"
        : "Connect, share, channels and communities inside NOLERA X",
    },
  ];

  const services = [
    {
      href: "/store",
      icon: ShoppingBag,
      title: text.market,
      small: isArabic ? "شراء وبيع رقمي" : "Digital commerce",
    },
    {
      href: "/ai",
      icon: Bot,
      title: text.abu,
      small: isArabic ? "ذكاء اصطناعي" : "Artificial intelligence",
    },
    {
      href: "/markets",
      icon: CircleDollarSign,
      title: text.markets,
      small: isArabic ? "أسواق" : "Markets",
    },
    {
      href: "/wallet",
      icon: Wallet,
      title: text.wallet,
      small: isArabic ? "الأموال والمحفظة" : "Wallet",
    },
    {
      href: "/transfers",
      icon: ArrowLeftRight,
      title: text.send,
      small: isArabic ? "إرسال واستلام" : "Send & receive",
    },
    {
      href: "#world",
      icon: Map,
      title: text.world,
      small: text.coming,
    },
    {
      href: "#social",
      icon: MessageCircle,
      title: text.social,
      small: text.coming,
    },
    {
      href: "#logistics",
      icon: Plane,
      title: text.logistics,
      small: text.coming,
    },
    {
      href: "#properties",
      icon: Building2,
      title: text.properties,
      small: text.coming,
    },
    {
      href: "#books",
      icon: BookOpen,
      title: text.books,
      small: text.coming,
    },
  ];

  const quickActions = [
    {
      href: "/transfers",
      icon: Send,
      title: text.send,
    },
    {
      href: "/transfers",
      icon: ArrowDownToLine,
      title: text.receive,
    },
    {
      href: "/add-money",
      icon: Plus,
      title: text.add,
    },
    {
      href: "/withdraw",
      icon: ArrowUpFromLine,
      title: text.withdraw,
    },
  ];

  const formattedBalance =
    typeof balance === "number"
      ? balance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : String(balance);

  const getTransactionTitle = (tx: any) =>
    tx?.title ||
    tx?.description ||
    tx?.name ||
    (isArabic ? "عملية مالية" : "Financial transaction");

  const getTransactionAmount = (tx: any) => {
    const amount = tx?.amount ?? tx?.value ?? "";
    return amount !== "" ? String(amount) : "—";
  };

  const getTransactionDate = (tx: any) =>
    tx?.date || tx?.createdAt || tx?.time || "";

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#0b0810] text-white"
          : "bg-[#f7f5fb] text-[#17131d]"
      }`}
    >
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 z-50 hidden w-[275px] border-l lg:block ${
          isArabic ? "right-0" : "left-0"
        } ${
          darkMode
            ? "border-white/10 bg-[#110d18]"
            : "border-[#e9e1f2] bg-white"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[90px] items-center px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e5bd9] to-[#c28cff] shadow-lg shadow-purple-300/30">
                <Zap className="h-5 w-5 text-white" />
              </div>

              <div>
                <div className="text-xl font-black tracking-tight">
                  NOLERA <span className="text-[#9561dc]">X</span>
                </div>
                <div
                  className={`text-[10px] font-medium ${
                    darkMode ? "text-white/55" : "text-black/55"
                  }`}
                >
                  {text.digital}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1.5">
              {sideItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href + index}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                      index === 0
                        ? "bg-gradient-to-r from-[#eee2ff] to-[#f7efff] text-[#7543b4]"
                        : darkMode
                        ? "text-white/65 hover:bg-white/5 hover:text-white"
                        : "text-[#696171] hover:bg-[#f6f0fc] hover:text-[#7042a8]"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-[19px] w-[19px]" />
                    <span>{item.label}</span>
                    {index === 0 && (
                      <span
                        className={`${
                          isArabic ? "mr-auto" : "ml-auto"
                        } h-1.5 w-1.5 rounded-full bg-[#965ed8]`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar bottom */}
          <div className="p-4">
            <div
              className={`rounded-3xl p-4 ${
                darkMode
                  ? "bg-white/5"
                  : "bg-gradient-to-br from-[#f4ecff] to-[#fbf8ff]"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#925bd4]" />
                <span className="text-sm font-bold">{text.security}</span>
              </div>

              <p
                className={`text-xs leading-5 ${
                  darkMode ? "text-white/60" : "text-black/60"
                }`}
              >
                {isArabic
                  ? "تحكم في إعدادات الأمان والخصوصية من مكان واحد."
                  : "Manage your security and privacy settings in one place."}
              </p>

              <Link
                href="/security"
                className="mt-3 flex items-center justify-center rounded-xl bg-[#925bd4] py-2.5 text-xs font-bold text-white"
              >
                {text.security}
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <>
          <button
            aria-label="close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm lg:hidden"
          />

          <aside
            className={`fixed bottom-0 top-0 z-[70] w-[88%] max-w-[340px] overflow-y-auto p-5 shadow-2xl lg:hidden ${
              isArabic ? "right-0" : "left-0"
            } ${darkMode ? "bg-[#110d18]" : "bg-white"}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e5bd9] to-[#c28cff]">
                  <Zap className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="text-lg font-black">
                    NOLERA <span className="text-[#9561dc]">X</span>
                  </div>
                  <div className="text-[10px] opacity-60">
                    {text.digital}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  darkMode ? "bg-white/5" : "bg-black/5"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {sideItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href + "-mobile-" + index}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold ${
                      index === 0
                        ? "bg-[#f0e5ff] text-[#7543b4]"
                        : darkMode
                        ? "text-white/65 hover:bg-white/5"
                        : "text-[#655d6e] hover:bg-[#f7f1fc]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </aside>
        </>
      )}

      {/* MAIN AREA */}
      <section
        className={`min-h-screen lg:${
          isArabic ? "mr-[275px]" : "ml-[275px]"
        }`}
      >
        {/* HEADER */}
        <header
          className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
            darkMode
              ? "border-white/10 bg-[#0b0810]/85"
              : "border-[#eee8f4] bg-[#f7f5fb]/85"
          }`}
        >
          <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e5bd9] to-[#c28cff]">
                <Zap className="h-4 w-4 text-white" />
              </div>

              <div>
                <div className="text-lg font-black">
                  NOLERA <span className="text-[#9561dc]">X</span>
                </div>
                <div className="text-[9px] opacity-55">
                  {text.digital}
                </div>
              </div>
            </div>

            {/* Desktop title */}
            <div className="hidden lg:block">
              <div className="text-sm font-bold opacity-50">
                {isArabic ? "منظومتك الرقمية" : "Your digital ecosystem"}
              </div>
              <div className="text-xl font-black">{text.overview}</div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode((v) => !v)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  darkMode
                    ? "bg-white/10 text-yellow-300"
                    : "bg-white text-[#6e6477] shadow-sm"
                }`}
                title="Theme"
              >
                {darkMode ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </button>

              <button
                onClick={() =>
                  setLanguage((v) => (v === "ar" ? "en" : "ar"))
                }
                className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold ${
                  darkMode
                    ? "bg-white/10 text-white"
                    : "bg-white text-[#625a6a] shadow-sm"
                }`}
              >
                <Globe2 className="h-[17px] w-[17px]" />
                {language === "ar" ? "EN" : "AR"}
              </button>

              <button
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${
                  darkMode
                    ? "bg-white/10"
                    : "bg-white text-[#625a6a] shadow-sm"
                }`}
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a35bdf]" />
              </button>

              <button
                onClick={() => setMenuOpen(true)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl lg:hidden ${
                  darkMode
                    ? "bg-white/10"
                    : "bg-white text-[#625a6a] shadow-sm"
                }`}
              >
                <Menu className="h-[19px] w-[19px]" />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="mx-auto max-w-[1500px] px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
          {/* ACCOUNT STRIP */}
          <section className="mb-6 flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d8c0f7] to-[#8f5bd0] text-lg font-black text-white shadow-md">
                ي
              </div>

              <div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-white/60" : "text-black/60"
                  }`}
                >
                  {isArabic ? "مرحباً بك" : "Welcome"}
                </div>
                <div className="text-base font-black">{text.welcome}</div>
              </div>
            </Link>

            <Link
              href="/profile"
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold ${
                darkMode
                  ? "bg-white/5 text-white/70"
                  : "bg-white text-[#7145a2] shadow-sm"
              }`}
            >
              {text.account}
              {isArabic ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
          </section>

          {/* HERO CAROUSEL */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xl font-black">
                  {isArabic ? "اكتشف NOLERA X" : "Explore NOLERA X"}
                </div>
                <div
                  className={`mt-0.5 text-xs ${
                    darkMode ? "text-white/55" : "text-black/55"
                  }`}
                >
                  {isArabic
                    ? "كل أدواتك الرقمية في تجربة واحدة"
                    : "Your digital tools in one experience"}
                </div>
              </div>

              <div className="hidden items-center gap-1 sm:flex">
                {heroCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveHero(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeHero === index
                        ? "w-6 bg-[#925bd4]"
                        : "w-1.5 bg-[#d8cce3]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {heroCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    onClick={() => setActiveHero(index)}
                    className={`group relative min-w-[84%] snap-start overflow-hidden rounded-[28px] p-5 shadow-sm transition-all sm:min-w-[48%] lg:min-w-[32%] xl:min-w-[24%] ${
                      index === 0
                        ? "bg-gradient-to-br from-[#7142aa] via-[#9360cb] to-[#c38bef] text-white"
                        : darkMode
                        ? "border border-white/10 bg-white/[0.045]"
                        : "border border-[#eee5f6] bg-white"
                    }`}
                  >
                    <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-10 -right-5 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative">
                      <div className="mb-7 flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                            index === 0
                              ? "bg-white/15"
                              : darkMode
                              ? "bg-white/10"
                              : "bg-[#f1e8fa]"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              index === 0
                                ? "text-white"
                                : "text-[#8955c7]"
                            }`}
                          />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-black tracking-widest ${
                            index === 0
                              ? "bg-white/15 text-white"
                              : "bg-[#f1e8fa] text-[#8955c7]"
                          }`}
                        >
                          {card.badge}
                        </span>
                      </div>

                      <div className="mb-1 text-lg font-black">
                        {card.title}
                      </div>

                      <div
                        className={`text-xs font-bold ${
                          index === 0
                            ? "text-white/75"
                            : darkMode
                            ? "text-white/50"
                            : "text-black/60"
                        }`}
                      >
                        {card.subtitle}
                      </div>

                      <p
                        className={`mt-3 max-w-[290px] text-xs leading-5 ${
                          index === 0
                            ? "text-white/70"
                            : darkMode
                            ? "text-white/55"
                            : "text-black/55"
                        }`}
                      >
                        {card.description}
                      </p>

                      <div
                        className={`mt-5 flex items-center gap-1 text-xs font-black ${
                          index === 0
                            ? "text-white"
                            : "text-[#8955c7]"
                        }`}
                      >
                        {isArabic ? "اكتشف الآن" : "Explore now"}
                        {isArabic ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* BALANCE */}
          <section
            className={`mb-6 overflow-hidden rounded-[30px] p-5 shadow-sm sm:p-6 ${
              darkMode
                ? "border border-white/10 bg-gradient-to-br from-[#21152c] to-[#130e19]"
                : "bg-gradient-to-br from-[#ffffff] to-[#f5edfc]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className={`mb-2 text-xs font-semibold ${
                    darkMode ? "text-white/60" : "text-black/60"
                  }`}
                >
                  {text.balance}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-3xl font-black tracking-tight sm:text-4xl">
                    {showBalance ? formattedBalance : "••••••"}
                  </div>

                  <button
                    onClick={() => setShowBalance((v) => !v)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      darkMode ? "bg-white/10" : "bg-white"
                    }`}
                  >
                    {showBalance ? (
                      <EyeOff className="h-4 w-4 opacity-50" />
                    ) : (
                      <Eye className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                </div>

                <div
                  className={`mt-1 text-[11px] ${
                    darkMode ? "text-white/55" : "text-black/55"
                  }`}
                >
                  {text.currency}
                </div>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#925bd4] text-white shadow-lg shadow-purple-300/20">
                <Wallet className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    href={action.href}
                    key={action.title}
                    className={`flex flex-col items-center justify-center rounded-2xl py-3 transition ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-white hover:bg-[#f8f1ff]"
                    }`}
                  >
                    <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e4fc] text-[#8955c7]">
                      <Icon className="h-[17px] w-[17px]" />
                    </div>
                    <span className="text-[10px] font-bold">
                      {action.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* QUICK UTILITY ROW */}
          <section className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <Link
                href="/wallet"
                className={`flex min-w-[150px] items-center gap-3 rounded-2xl p-3 ${
                  darkMode
                    ? "bg-white/5"
                    : "bg-white shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee2ff] text-[#8955c7]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black">{text.wallet}</div>
                  <div className="mt-0.5 text-[9px] opacity-55">
                    {isArabic ? "إدارة الأموال" : "Manage money"}
                  </div>
                </div>
              </Link>

              <Link
                href="/cards"
                className={`flex min-w-[150px] items-center gap-3 rounded-2xl p-3 ${
                  darkMode
                    ? "bg-white/5"
                    : "bg-white shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e5fb] text-[#9b56c8]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black">{text.card}</div>
                  <div className="mt-0.5 text-[9px] opacity-55">
                    {isArabic ? "بطاقتك الرقمية" : "Digital card"}
                  </div>
                </div>
              </Link>

              <Link
                href="/verification"
                className={`flex min-w-[150px] items-center gap-3 rounded-2xl p-3 ${
                  darkMode
                    ? "bg-white/5"
                    : "bg-white shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9e4ff] text-[#6951bc]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black">
                    {text.verification}
                  </div>
                  <div className="mt-0.5 text-[9px] opacity-55">
                    {isArabic ? "تحقق من هويتك" : "Verify identity"}
                  </div>
                </div>
              </Link>

              <Link
                href="/settings"
                className={`flex min-w-[150px] items-center gap-3 rounded-2xl p-3 ${
                  darkMode
                    ? "bg-white/5"
                    : "bg-white shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee8f7] text-[#776b83]">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black">
                    {text.settings}
                  </div>
                  <div className="mt-0.5 text-[9px] opacity-55">
                    {isArabic ? "تخصيص التطبيق" : "Customize app"}
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* SERVICES */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">{text.services}</h2>

              <button
                className={`flex items-center gap-1 text-xs font-bold ${
                  darkMode ? "text-white/60" : "text-black/55"
                }`}
              >
                {text.more}
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <Link
                    href={service.href}
                    key={service.title}
                    className={`min-w-[142px] rounded-[22px] p-4 transition-all sm:min-w-[160px] ${
                      darkMode
                        ? "border border-white/10 bg-white/[0.04]"
                        : "border border-[#eee7f5] bg-white shadow-sm"
                    }`}
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e5fc] text-[#8955c7]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="line-clamp-1 text-xs font-black">
                      {service.title}
                    </div>

                    <div
                      className={`mt-1 text-[9px] ${
                        service.small === text.coming
                          ? "font-bold text-[#a05dd6]"
                          : darkMode
                          ? "text-white/55"
                          : "text-black/55"
                      }`}
                    >
                      {service.small}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CREDIT CARD */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">{text.card}</h2>
                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-white/55" : "text-black/55"
                  }`}
                >
                  {text.cardSub}
                </p>
              </div>

              <Link
                href="/cards"
                className="text-xs font-bold text-[#8955c7]"
              >
                {text.more}
              </Link>
            </div>

            {/* LANDSCAPE CREDIT CARD */}
            <Link
              href="/cards"
              className="relative block w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#22172d] via-[#563379] to-[#a76bda] p-5 text-white shadow-xl shadow-purple-300/20 sm:rounded-[28px] sm:p-7"
              style={{
                aspectRatio: "1.78 / 1",
                maxHeight: "230px",
              }}
            >
              {/* decorative circles */}
              <div className="absolute -right-14 -top-20 h-48 w-48 rounded-full border border-white/10" />
              <div className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-white/10" />
              <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-white/5 blur-xl" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.28em] text-white/50">
                      NOLERA X
                    </div>
                    <div className="mt-1 text-xs font-black">
                      {isArabic ? "بطاقة رقمية" : "DIGITAL CARD"}
                    </div>
                  </div>

                  <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                    <CreditCard className="h-5 w-5 text-white/85" />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm tracking-[0.16em] sm:text-lg">
                    <span>••••</span>
                    <span>••••</span>
                    <span>••••</span>
                    <span className="font-bold">4821</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[7px] uppercase tracking-widest text-white/45">
                        {isArabic ? "اسم حامل البطاقة" : "CARD HOLDER"}
                      </div>
                      <div className="mt-0.5 text-[11px] font-bold tracking-widest">
                        YAHYA
                      </div>
                    </div>

                    <div>
                      <div className="text-[7px] uppercase tracking-widest text-white/45">
                        VALID THRU
                      </div>
                      <div className="mt-0.5 text-[11px] font-bold">
                        09/30
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="text-[7px] uppercase tracking-widest text-white/45">
                        TYPE
                      </div>
                      <div className="mt-0.5 text-[11px] font-bold">
                        NOLERA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* RECENT TRANSACTIONS */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">{text.recent}</h2>

              <Link
                href="/transactions"
                className="text-xs font-bold text-[#8955c7]"
              >
                {text.viewAll}
              </Link>
            </div>

            <div
              className={`overflow-hidden rounded-[26px] ${
                darkMode
                  ? "border border-white/10 bg-white/[0.035]"
                  : "border border-[#eee7f5] bg-white"
              }`}
            >
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx, index) => (
                  <div
                    key={tx?.id ?? index}
                    className={`flex items-center justify-between gap-3 p-4 ${
                      index !== recentTransactions.length - 1
                        ? darkMode
                          ? "border-b border-white/5"
                          : "border-b border-[#f0ebf4]"
                        : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          index % 2 === 0
                            ? "bg-[#efe4fc] text-[#8955c7]"
                            : "bg-[#eeeaf6] text-[#746b7e]"
                        }`}
                      >
                        {index % 2 === 0 ? (
                          <ArrowLeftRight className="h-5 w-5" />
                        ) : (
                          <CircleDollarSign className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-xs font-black">
                          {getTransactionTitle(tx)}
                        </div>
                        <div
                          className={`mt-1 truncate text-[9px] ${
                            darkMode ? "text-white/55" : "text-black/55"
                          }`}
                        >
                          {getTransactionDate(tx) || text.activity}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-end">
                      <div className="text-xs font-black">
                        {getTransactionAmount(tx)}
                      </div>
                      <div className="mt-1 text-[9px] text-[#8d5bc8]">
                        {isArabic ? "تمت" : "Completed"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <ReceiptText className="mx-auto mb-3 h-8 w-8 opacity-20" />
                  <div className="text-sm font-bold opacity-50">
                    {isArabic
                      ? "لا توجد عمليات حديثة"
                      : "No recent activity"}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ID + SECURITY */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/id"
              className={`group rounded-[26px] p-5 ${
                darkMode
                  ? "border border-white/10 bg-white/[0.04]"
                  : "border border-[#eee7f5] bg-white"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ece4ff] text-[#7651c0]">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <ChevronLeft
                  className={`h-5 w-5 opacity-30 ${
                    isArabic ? "" : "rotate-180"
                  }`}
                />
              </div>

              <div className="text-base font-black">{text.identity}</div>
              <div
                className={`mt-1 text-xs ${
                  darkMode ? "text-white/55" : "text-black/55"
                }`}
              >
                {text.identitySub}
              </div>
            </Link>

            <Link
              href="/security"
              className={`group rounded-[26px] p-5 ${
                darkMode
                  ? "border border-white/10 bg-white/[0.04]"
                  : "border border-[#eee7f5] bg-white"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e5fa] text-[#a15fc8]">
                  <LockKeyhole className="h-6 w-6" />
                </div>

                <ChevronLeft
                  className={`h-5 w-5 opacity-30 ${
                    isArabic ? "" : "rotate-180"
                  }`}
                />
              </div>

              <div className="text-base font-black">{text.security}</div>
              <div
                className={`mt-1 text-xs ${
                  darkMode ? "text-white/55" : "text-black/55"
                }`}
              >
                {isArabic
                  ? "حماية الحساب والخصوصية"
                  : "Account & privacy protection"}
              </div>
            </Link>
          </section>

          {/* EXTRA ECOSYSTEM */}
          <section className="mb-6">
            <div className="mb-3 text-xl font-black">
              {isArabic ? "منظومة NOLERA X" : "NOLERA X Ecosystem"}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                id="world"
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-white/[0.04]" : "bg-white"
                }`}
              >
                <Map className="mb-3 h-5 w-5 text-[#8955c7]" />
                <div className="text-xs font-black">{text.world}</div>
                <div className="mt-1 text-[9px] text-[#a05dd6]">
                  {text.coming}
                </div>
              </div>

              <div
                id="social"
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-white/[0.04]" : "bg-white"
                }`}
              >
                <MessageCircle className="mb-3 h-5 w-5 text-[#8955c7]" />
                <div className="text-xs font-black">{text.social}</div>
                <div className="mt-1 text-[9px] text-[#a05dd6]">
                  {text.coming}
                </div>
              </div>

              <div
                id="logistics"
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-white/[0.04]" : "bg-white"
                }`}
              >
                <Plane className="mb-3 h-5 w-5 text-[#8955c7]" />
                <div className="text-xs font-black">{text.logistics}</div>
                <div className="mt-1 text-[9px] text-[#a05dd6]">
                  {text.coming}
                </div>
              </div>

              <div
                id="properties"
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-white/[0.04]" : "bg-white"
                }`}
              >
                <Building2 className="mb-3 h-5 w-5 text-[#8955c7]" />
                <div className="text-xs font-black">{text.properties}</div>
                <div className="mt-1 text-[9px] text-[#a05dd6]">
                  {text.coming}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer
            className={`border-t pt-6 text-center ${
              darkMode ? "border-white/10" : "border-[#eae3f0]"
            }`}
          >
            <div className="mb-1 text-lg font-black">
              NOLERA <span className="text-[#925bd4]">X</span>
            </div>

            <div
              className={`text-[10px] ${
                darkMode ? "text-white/30" : "text-black/55"
              }`}
            >
              {isArabic
                ? "منظومة رقمية للتجارة والخدمات والمدفوعات والذكاء الاصطناعي"
                : "A digital ecosystem for commerce, services, payments and AI"}
            </div>
          </footer>
        </div>
      </section>

      {/* MOBILE BOTTOM NAV */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 border-t px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden ${
          darkMode
            ? "border-white/10 bg-[#100c16]/90"
            : "border-[#e8e0ef] bg-white/92"
        }`}
      >
        <div className="mx-auto grid max-w-[560px] grid-cols-5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = index === 0;

            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-1.5 ${
                  active
                    ? "text-[#8955c7]"
                    : darkMode
                    ? "text-white/55"
                    : "text-[#8a8191]"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    active
                      ? "bg-[#eee2fc]"
                      : ""
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>

                <span className="text-[9px] font-bold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
