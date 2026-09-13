"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../../lib/nolera-auth";

type Theme = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  mutedText: string;
  border: string;
  button: string;
  buttonText: string;
  success: string;
  warning: string;
  error: string;
  link: string;
  sidebar: string;
  navbar: string;
  bottomNav: string;
};

type Sections = Record<string, boolean>;

type Navigation = {
  bottomNav: boolean;
  sidebar: boolean;
  showSearch: boolean;
};

const defaultTheme: Theme = {
  primary: "#512d68",
  secondary: "#e86f32",
  background: "#f7f7fb",
  surface: "#ffffff",
  card: "#ffffff",
  text: "#17151a",
  mutedText: "#6b6670",
  border: "#e7e2ea",
  button: "#512d68",
  buttonText: "#ffffff",
  success: "#16a34a",
  warning: "#d97706",
  error: "#dc2626",
  link: "#512d68",
  sidebar: "#ffffff",
  navbar: "#ffffff",
  bottomNav: "#ffffff",
};

const defaultSections: Sections = {
  home: true,
  wallet: true,
  transfers: true,
  services: true,
  store: true,
  ads: true,
  paradise: true,
  directory: true,
  logistics: true,
  ai: true,
  markets: true,
};

const defaultNavigation: Navigation = {
  bottomNav: true,
  sidebar: true,
  showSearch: true,
};

const colorLabels: Record<keyof Theme, string> = {
  primary: "اللون الرئيسي",
  secondary: "اللون الثانوي",
  background: "خلفية المنصة",
  surface: "سطح الواجهة",
  card: "البطاقات",
  text: "النص الرئيسي",
  mutedText: "النص الثانوي",
  border: "الحدود",
  button: "الأزرار",
  buttonText: "نص الأزرار",
  success: "نجاح",
  warning: "تحذير",
  error: "خطأ",
  link: "الروابط",
  sidebar: "القائمة الجانبية",
  navbar: "الشريط العلوي",
  bottomNav: "الشريط السفلي",
};

const sectionLabels: Record<string, string> = {
  home: "الرئيسية",
  wallet: "المحفظة",
  transfers: "التحويلات",
  services: "الخدمات",
  store: "المتجر",
  ads: "NOLERA ADS",
  paradise: "NOLERA PARADISE",
  directory: "دليل الشركات",
  logistics: "الخدمات اللوجستية",
  ai: "NOLERA AI",
  markets: "الأسواق",
};

export default function PlatformBuilderPage() {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState("");

  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [sections, setSections] = useState<Sections>(defaultSections);
  const [navigation, setNavigation] =
    useState<Navigation>(defaultNavigation);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("يجب تسجيل الدخول أولاً.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = String(profile?.role ?? "");

    if (role !== "admin" && role !== "super_admin") {
      setMessage("ليس لديك صلاحية الوصول إلى Platform Builder.");
      setLoading(false);
      return;
    }

    setAllowed(true);

    const { data, error } = await supabase
      .from("nolera_platform_settings")
      .select("setting_key, setting_value");

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    for (const item of data ?? []) {
      if (item.setting_key === "theme") {
        setTheme({
          ...defaultTheme,
          ...(item.setting_value ?? {}),
        });
      }

      if (item.setting_key === "sections") {
        setSections({
          ...defaultSections,
          ...(item.setting_value ?? {}),
        });
      }

      if (item.setting_key === "navigation") {
        setNavigation({
          ...defaultNavigation,
          ...(item.setting_value ?? {}),
        });
      }
    }

    setLoading(false);
  }

  async function saveSetting(
    settingKey: string,
    settingValue: object
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("انتهت جلسة الدخول.");
      return false;
    }

    const { error } = await supabase
      .from("nolera_platform_settings")
      .upsert(
        {
          setting_key: settingKey,
          setting_value: settingValue,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "setting_key",
        }
      );

    if (error) {
      setMessage(error.message);
      return false;
    }

    return true;
  }

  async function saveAll() {
    setSaving(true);
    setMessage("");

    const themeOk = await saveSetting("theme", theme);
    const sectionsOk = await saveSetting("sections", sections);
    const navigationOk = await saveSetting(
      "navigation",
      navigation
    );

    if (themeOk && sectionsOk && navigationOk) {
      setMessage("تم حفظ إعدادات المنصة بنجاح.");
    }

    setSaving(false);
  }

  async function resetAll() {
    setTheme(defaultTheme);
    setSections(defaultSections);
    setNavigation(defaultNavigation);
    setMessage("تمت إعادة الإعدادات للقيم الافتراضية. اضغط حفظ لتطبيقها.");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] p-6 text-right">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-sm">
          جاري تحميل Platform Builder...
        </div>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] p-6 text-right">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-[#512d68]">
            غير مصرح
          </h1>
          <p className="mt-3 text-gray-600">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen p-4 text-right sm:p-6"
      style={{ background: theme.background, color: theme.text }}
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header
          className="rounded-3xl p-6 text-white shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          }}
        >
          <div className="text-sm font-bold opacity-80">
            NOLERA X / ADMIN
          </div>
          <h1 className="mt-2 text-3xl font-black">
            Platform Builder
          </h1>
          <p className="mt-2 text-sm opacity-90">
            تحكم في مظهر المنصة والأقسام والتنقل بدون تعديل الكود.
          </p>
        </header>

        {message && (
          <div
            className="rounded-2xl border p-4 font-bold"
            style={{
              background: theme.surface,
              borderColor: theme.border,
              color: theme.primary,
            }}
          >
            {message}
          </div>
        )}

        <section
          className="rounded-3xl border p-5 shadow-sm"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="mb-5">
            <h2 className="text-2xl font-black">🎨 ألوان المنصة</h2>
            <p
              className="mt-1 text-sm"
              style={{ color: theme.mutedText }}
            >
              جميع الألوان الأساسية في مكان واحد.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(colorLabels) as Array<keyof Theme>).map(
              (key) => (
                <div
                  key={key}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: theme.border,
                    background: theme.card,
                  }}
                >
                  <label className="block text-sm font-black">
                    {colorLabels[key]}
                  </label>

                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          [key]: e.target.value,
                        })
                      }
                      className="h-12 w-16 cursor-pointer rounded-xl border-0"
                    />

                    <input
                      value={theme[key]}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          [key]: e.target.value,
                        })
                      }
                      className="min-w-0 flex-1 rounded-xl border px-3 py-3 font-mono text-sm"
                      style={{
                        borderColor: theme.border,
                        color: theme.text,
                        background: theme.surface,
                      }}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section
          className="rounded-3xl border p-5 shadow-sm"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="mb-5">
            <h2 className="text-2xl font-black">👁️ الأقسام</h2>
            <p
              className="mt-1 text-sm"
              style={{ color: theme.mutedText }}
            >
              تحكم في ظهور أقسام المنصة.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(sectionLabels).map((key) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  background: theme.card,
                }}
              >
                <span className="font-black">
                  {sectionLabels[key]}
                </span>

                <input
                  type="checkbox"
                  checked={Boolean(sections[key])}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      [key]: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </label>
            ))}
          </div>
        </section>

        <section
          className="rounded-3xl border p-5 shadow-sm"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="mb-5">
            <h2 className="text-2xl font-black">🧭 التنقل</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["bottomNav", "الشريط السفلي"],
              ["sidebar", "القائمة الجانبية"],
              ["showSearch", "البحث"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  background: theme.card,
                }}
              >
                <span className="font-black">{label}</span>

                <input
                  type="checkbox"
                  checked={Boolean(
                    navigation[key as keyof Navigation]
                  )}
                  onChange={(e) =>
                    setNavigation({
                      ...navigation,
                      [key]: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </label>
            ))}
          </div>
        </section>

        <section
          className="sticky bottom-3 rounded-3xl border p-4 shadow-lg"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={resetAll}
              className="rounded-2xl border px-6 py-4 font-black"
              style={{
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              🔄 إعادة الضبط
            </button>

            <button
              type="button"
              onClick={saveAll}
              disabled={saving}
              className="rounded-2xl px-8 py-4 font-black text-white disabled:opacity-60"
              style={{
                background: theme.primary,
              }}
            >
              {saving ? "جاري الحفظ..." : "💾 حفظ إعدادات المنصة"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
