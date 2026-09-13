"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/nolera-auth";

type Theme = Record<string, string>;
type Sections = Record<string, boolean>;
type Navigation = {
  bottomNav?: boolean;
  sidebar?: boolean;
  showSearch?: boolean;
};

const routeSectionMap: Record<string, string> = {
  "/wallet": "wallet",
  "/transfers": "transfers",
  "/services": "services",
  "/store": "store",
  "/ads": "ads",
  "/paradise": "paradise",
  "/logistics": "logistics",
  "/ai": "ai",
  "/markets": "markets",
};

export default function NoleraPlatformRuntime() {
  const pathname = usePathname();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const supabase = getSupabaseClient();

      const { data } = await supabase
        .from("nolera_platform_settings")
        .select("setting_key, setting_value");

      if (!mounted) return;

      const settings: Record<string, any> = {};

      for (const row of data ?? []) {
        settings[row.setting_key] = row.setting_value;
      }

      const theme: Theme = settings.theme ?? {};
      const sections: Sections = settings.sections ?? {};
      const navigation: Navigation = settings.navigation ?? {};

      const root = document.documentElement;

      const cssMap: Record<string, string> = {
        primary: "--nolera-primary",
        secondary: "--nolera-secondary",
        background: "--nolera-background",
        surface: "--nolera-surface",
        card: "--nolera-card",
        text: "--nolera-text",
        mutedText: "--nolera-muted-text",
        border: "--nolera-border",
        button: "--nolera-button",
        buttonText: "--nolera-button-text",
        success: "--nolera-success",
        warning: "--nolera-warning",
        error: "--nolera-error",
        link: "--nolera-link",
        sidebar: "--nolera-sidebar",
        navbar: "--nolera-navbar",
        bottomNav: "--nolera-bottom-nav",
      };

      Object.entries(cssMap).forEach(([key, variable]) => {
        if (theme[key]) {
          root.style.setProperty(variable, theme[key]);
        }
      });

      root.dataset.noleraPlatform = "ready";
      root.dataset.noleraBottomNav =
        navigation.bottomNav === false ? "hidden" : "visible";

      const section = routeSectionMap[pathname];

      if (
        section &&
        sections[section] === false &&
        pathname !== "/"
      ) {
        router.replace("/");
        return;
      }

      if (mounted) setLoaded(true);
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  return null;
}
