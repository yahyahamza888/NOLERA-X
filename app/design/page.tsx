"use client";

import { useEffect, useState } from "react";
import {
  getDesignTools,
  getMyDesignRentals,
  rentDesignTool,
  type DesignTool,
} from "@/lib/nolera-design";

const categories = [
  "الكل",
  "الألوان",
  "واجهات",
  "أيقونات",
  "ذكاء اصطناعي",
  "خطوط",
];

export default function DesignPage() {
  const [tools, setTools] = useState<DesignTool[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [category, setCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setLoading(true);
      const [toolData, rentalData] = await Promise.all([
        getDesignTools(),
        getMyDesignRentals(),
      ]);

      setTools(toolData);
      setRentals(rentalData);
    } catch (error: any) {
      setMessage(error?.message || "تعذر تحميل أدوات التصميم");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRent(tool: DesignTool) {
    try {
      setRenting(tool.id);
      setMessage("");

      await rentDesignTool(tool.id, tool.currency || "USD");

      setMessage(`تم استئجار ${tool.name} بنجاح`);
      await load();
    } catch (error: any) {
      setMessage(error?.message || "تعذر استئجار الأداة");
    } finally {
      setRenting(null);
    }
  }

  const filtered =
    category === "الكل"
      ? tools
      : tools.filter((tool) => tool.category === category);

  const activeRental = (toolId: string) =>
    rentals.some(
      (r) =>
        r.tool_id === toolId &&
        new Date(r.expires_at).getTime() > Date.now()
    );

  return (
    <main dir="rtl" className="min-h-screen bg-background p-4 pb-24">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            NOLERA X
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            NOLERA DESIGN
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            مركز أدوات التصميم لإنشاء وتطوير منتجاتك داخل منصة NOLERA.
          </p>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                category === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {message && (
          <div className="rounded-2xl border bg-card p-4 text-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-card p-6 text-center">
            جاري تحميل أدوات التصميم...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-center">
            لا توجد أدوات متاحة حاليًا.
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => {
              const rented = activeRental(tool.id);

              return (
                <article
                  key={tool.id}
                  className="rounded-3xl border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">
                        {tool.name}
                      </h2>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {tool.category}
                      </p>
                    </div>

                    <span className="text-2xl">
                      {tool.icon || "🎨"}
                    </span>
                  </div>

                  <p className="mt-4 min-h-10 text-sm text-muted-foreground">
                    {tool.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <strong>
                        {Number(tool.price).toFixed(2)}
                      </strong>{" "}
                      {tool.currency}
                      <div className="text-xs text-muted-foreground">
                        لمدة 30 يوم
                      </div>
                    </div>

                    <button
                      disabled={rented || renting === tool.id}
                      onClick={() => handleRent(tool)}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {rented
                        ? "مستأجرة"
                        : renting === tool.id
                          ? "جاري..."
                          : "استئجار"}
                    </button>
                  </div>

                  {tool.external_url && (
                    <a
                      href={tool.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 block text-center text-xs text-muted-foreground underline"
                    >
                      فتح المورد الخارجي
                    </a>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
