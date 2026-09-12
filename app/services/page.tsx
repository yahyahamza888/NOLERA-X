"use client";

import {
  Megaphone,
  Users,
  Building2,
  Truck,
  ShoppingBag,
  Sparkles,
  WalletCards,
  Globe2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

const hubs = [
  {
    title: "Social Hub",
    description: "اجمع منصات التواصل والحسابات الرقمية في مكان واحد.",
    icon: Users,
    href: "#social",
  },
  {
    title: "NOLERA ADS",
    description: "الإعلانات والترويج والوصول إلى العملاء.",
    icon: Megaphone,
    href: "/ads",
  },
  {
    title: "Business Directory",
    description: "ابحث عن الشركات والخدمات حول العالم.",
    icon: Building2,
    href: "#directory",
  },
  {
    title: "NOLERA Logistics",
    description: "الشحن والعقارات والخدمات اللوجستية العالمية.",
    icon: Truck,
    href: "/logistics",
  },
  {
    title: "NOLERA Paradise",
    description: "مساحة المجتمع والمحتوى والتواصل.",
    icon: Globe2,
    href: "/paradise",
  },
  {
    title: "NOLERA Store",
    description: "المنتجات والخدمات الرقمية.",
    icon: ShoppingBag,
    href: "/store",
  },
  {
    title: "NOLERA AI",
    description: "أدوات الذكاء الاصطناعي والإبداع الرقمي.",
    icon: Sparkles,
    href: "/ai",
  },
  {
    title: "Wallet & Payments",
    description: "المحفظة والتحويلات والخدمات المالية.",
    icon: WalletCards,
    href: "/wallet",
  },
];

const socialPlatforms = [
  "Facebook",
  "Instagram",
  "X",
  "TikTok",
  "YouTube",
  "LinkedIn",
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 px-4 py-6 pb-28">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 rounded-3xl bg-gradient-to-r from-purple-700 to-fuchsia-600 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-semibold opacity-80">NOLERA X</p>
          <h1 className="text-3xl font-black">NOLERA HUB</h1>
          <p className="mt-2 text-sm leading-6 opacity-90">
            مركز واحد للوصول إلى منصات NOLERA والخدمات الرقمية والاجتماعية.
          </p>
        </header>

        <section
          id="social"
          className="mb-6 rounded-3xl border border-purple-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black">Social Hub</h2>
              <p className="text-xs text-slate-500">
                منصات التواصل في مكان واحد
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {socialPlatforms.map((platform) => (
              <button
                key={platform}
                type="button"
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-purple-50"
                onClick={() =>
                  alert(
                    `${platform} — سيتم ربط المنصة عبر API عندما تتوفر صلاحيات الربط.`
                  )
                }
              >
                <span>{platform}</span>
                <ExternalLink size={15} />
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            هذه الواجهة تجهز مركز الربط. لا يتم تسجيل الدخول إلى أي منصة خارجية
            أو تخزين كلمات المرور داخل NOLERA X.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {hubs.slice(1).map((hub) => {
            const Icon = hub.icon;

            return (
              <button
                key={hub.title}
                type="button"
                onClick={() => {
                  if (hub.href.startsWith("/")) router.push(hub.href);
                  else {
                    const element = document.querySelector(hub.href);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="rounded-3xl border border-purple-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
                    <Icon size={22} />
                  </div>
                  <ExternalLink size={17} className="text-slate-400" />
                </div>

                <h2 className="font-black text-slate-900">{hub.title}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {hub.description}
                </p>
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
}
