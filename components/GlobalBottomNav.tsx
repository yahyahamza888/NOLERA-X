"use client";

import { usePathname, useRouter } from "next/navigation";
import { useNoleraAuth } from "@/lib/use-nolera-auth";
import { Home, Wallet, ArrowLeftRight, LayoutGrid, UserRound } from "lucide-react";

const items = [
  { label: "الرئيسية", href: "/", icon: Home },
  { label: "المحفظة", href: "/wallet", icon: Wallet },
  { label: "تحويل", href: "/transfers", icon: ArrowLeftRight },
  { label: "خدمات", href: "/services", icon: LayoutGrid },
  { label: "حسابي", href: "/account", icon: UserRound },
];

export default function GlobalBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, loading } = useNoleraAuth();

  // لا يظهر في شاشات الدخول والترحيب
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/guest"
  ) {
    return null;
  }

  if (pathname === "/" && (loading || !isLoggedIn)) {
    return null;
  }

  return (
    <nav
      aria-label="NOLERA X navigation"
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-purple-200/30 bg-white/95 px-2 py-2 shadow-[0_-5px_25px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:bg-[#17101d]/95"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-around">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}/`));

          return (
            <button
              key={href}
              type="button"
              onClick={() => router.push(href)}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold transition ${
                active
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
                  : "text-slate-500 hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
