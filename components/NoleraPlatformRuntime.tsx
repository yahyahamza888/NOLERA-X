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
  "/design": "design",
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

      const defaultSectionOrder = [
        "home",
        "wallet",
        "transfers",
        "services",
        "store",
        "ads",
        "paradise",
        "directory",
        "logistics",
        "ai",
        "markets",
      ];

      const savedSectionOrder = Array.isArray(settings.section_order)
        ? settings.section_order.filter(
            (key: unknown): key is string => typeof key === "string"
          )
        : [];

      const sectionOrder = [
        ...savedSectionOrder,
        ...defaultSectionOrder.filter(
          (key) => !savedSectionOrder.includes(key)
        ),
      ];

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

      // Expose section availability to the live navigation/UI.
      Object.entries(sections).forEach(([key, enabled]) => {
        root.dataset[`noleraSection${key}`] =
          enabled === false ? "hidden" : "visible";
      });

      root.dataset.noleraSectionOrder = JSON.stringify(sectionOrder);

      // Apply the selected theme to the real interface.
      if (theme.background) {
        document.body.style.backgroundColor = theme.background;
      }

      if (theme.text) {
        document.body.style.color = theme.text;
      }

      root.style.setProperty(
        "--nolera-theme-primary",
        theme.primary || "#512d68"
      );

      root.style.setProperty(
        "--nolera-theme-secondary",
        theme.secondary || "#3c2549"
      );

      root.style.setProperty(
        "--nolera-theme-background",
        theme.background || "#f8fafc"
      );

      root.style.setProperty(
        "--nolera-theme-surface",
        theme.surface || "#ffffff"
      );

      root.style.setProperty(
        "--nolera-theme-card",
        theme.card || "#ffffff"
      );

      root.style.setProperty(
        "--nolera-theme-text",
        theme.text || "#111827"
      );

      root.style.setProperty(
        "--nolera-theme-muted",
        theme.mutedText || "#64748b"
      );

      root.style.setProperty(
        "--nolera-theme-border",
        theme.border || "#e2e8f0"
      );

      root.style.setProperty(
        "--nolera-theme-button",
        theme.button || theme.primary || "#512d68"
      );

      root.style.setProperty(
        "--nolera-theme-button-text",
        theme.buttonText || "#ffffff"
      );

      root.style.setProperty(
        "--nolera-theme-success",
        theme.success || "#16a34a"
      );

      root.style.setProperty(
        "--nolera-theme-warning",
        theme.warning || "#f59e0b"
      );

      root.style.setProperty(
        "--nolera-theme-error",
        theme.error || "#dc2626"
      );

      root.style.setProperty(
        "--nolera-theme-link",
        theme.link || theme.primary || "#512d68"
      );

      root.style.setProperty(
        "--nolera-theme-sidebar",
        theme.sidebar || theme.surface || "#ffffff"
      );

      root.style.setProperty(
        "--nolera-theme-navbar",
        theme.navbar || theme.surface || "#ffffff"
      );

      root.style.setProperty(
        "--nolera-theme-bottom-nav",
        theme.bottomNav || theme.surface || "#ffffff"
      );

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
