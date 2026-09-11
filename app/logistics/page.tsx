"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  CalendarDays,
  Star,
  Building2,
  Home,
  Truck,
  Wrench,
  ShieldCheck,
  Sparkles,
  Package,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Globe2,
  Plus,
  X,
  Send,
  WalletCards,
  Heart,
  Navigation,
  FileText,
  Users,
  CreditCard,
  ChevronRight,
  Filter,
} from "lucide-react";

import { getBalance } from "@/lib/nolera-state";
import { purchase } from "@/lib/nolera-actions";

type Category =
  | "real-estate"
  | "property"
  | "logistics"
  | "moving"
  | "construction"
  | "maintenance"
  | "cleaning"
  | "security"
  | "business";

type Provider = {
  id: string;
  name: string;
  category: Category;
  country: string;
  city: string;
  area: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviews: number;
  verified: boolean;
};

type RequestItem = {
  id: string;
  service: string;
  provider: string;
  location: string;
  amount: number;
  status: "Pending" | "Paid" | "Completed";
  date: string;
};

const providers: Provider[] = [
  {
    id: "global-real-estate",
    name: "NOLERA Global Real Estate Network",
    category: "real-estate",
    country: "Global",
    city: "Global",
    area: "Worldwide",
    description:
      "Global directory for real-estate companies, offices, agents and property services. Provider data can be connected to verified APIs.",
    phone: "",
    email: "",
    website: "",
    rating: 0,
    reviews: 0,
    verified: false,
  },
  {
    id: "global-logistics",
    name: "NOLERA Global Logistics Network",
    category: "logistics",
    country: "Global",
    city: "Global",
    area: "Worldwide",
    description:
      "Global logistics and transport service directory prepared for API-connected providers.",
    phone: "",
    email: "",
    website: "",
    rating: 0,
    reviews: 0,
    verified: false,
  },
  {
    id: "global-business",
    name: "NOLERA Business Services Network",
    category: "business",
    country: "Global",
    city: "Global",
    area: "Worldwide",
    description:
      "Business consultants, offices and professional service providers.",
    phone: "",
    email: "",
    website: "",
    rating: 0,
    reviews: 0,
    verified: false,
  },
];

const categories = [
  ["all", "All Services", <Globe2 size={18} />],
  ["real-estate", "Real Estate", <Building2 size={18} />],
  ["property", "Properties", <Home size={18} />],
  ["logistics", "Logistics", <Truck size={18} />],
  ["moving", "Moving", <Package size={18} />],
  ["construction", "Construction", <Wrench size={18} />],
  ["maintenance", "Maintenance", <Wrench size={18} />],
  ["cleaning", "Cleaning", <Sparkles size={18} />],
  ["security", "Security", <ShieldCheck size={18} />],
  ["business", "Business", <BriefcaseBusiness size={18} />],
] as const;

const services = [
  { name: "Consultation", price: 5000, icon: <MessageCircle /> },
  { name: "Appointment", price: 3000, icon: <CalendarDays /> },
  { name: "Property Search", price: 7500, icon: <Home /> },
  { name: "Office Search", price: 5000, icon: <Building2 /> },
  { name: "Moving Service", price: 25000, icon: <Package /> },
  { name: "Logistics Request", price: 15000, icon: <Truck /> },
  { name: "Business Consultation", price: 10000, icon: <BriefcaseBusiness /> },
  { name: "Maintenance Request", price: 12000, icon: <Wrench /> },
];

export default function LogisticsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const [balance, setBalance] = useState(0);
  const [selected, setSelected] = useState<Provider | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const [showPayment, setShowPayment] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showAddBusiness, setShowAddBusiness] = useState(false);

  const [requests, setRequests] = useState<RequestItem[]>([]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return providers.filter((p) => {
      const categoryOK =
        category === "all" || p.category === category;

      const searchOK =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const countryOK =
        !country ||
        p.country.toLowerCase().includes(country.toLowerCase()) ||
        p.country === "Global";

      const cityOK =
        !city ||
        p.city.toLowerCase().includes(city.toLowerCase()) ||
        p.city === "Global";

      const areaOK =
        !area ||
        p.area.toLowerCase().includes(area.toLowerCase()) ||
        p.area === "Worldwide";

      return categoryOK && searchOK && countryOK && cityOK && areaOK;
    });
  }, [category, search, country, city, area]);

  function refreshWallet() {
    setBalance(getBalance());
  }

  function openPaidService(service: string, price: number) {
    refreshWallet();
    setSelectedService(`${service}|${price}`);
    setShowPayment(true);
  }

  function confirmPayment() {
    if (!selectedService) return;

    const [service, rawPrice] = selectedService.split("|");
    const price = Number(rawPrice);

    try {
      purchase(
        price,
        "NOLERA Global Services",
        `Logistics / ${service}`
      );

      const newRequest: RequestItem = {
        id: `REQ-${Date.now()}`,
        service,
        provider:
          selected?.name || "NOLERA Global Services",
        location:
          [country, city, area].filter(Boolean).join(", ") ||
          "Global",
        amount: price,
        status: "Paid",
        date: new Date().toLocaleString(),
      };

      const old = JSON.parse(
        localStorage.getItem("nolera_logistics_requests") || "[]"
      );

      const updated = [newRequest, ...old];

      localStorage.setItem(
        "nolera_logistics_requests",
        JSON.stringify(updated)
      );

      setRequests(updated);
      setShowPayment(false);
      setSelectedService(null);
      refreshWallet();

      alert("تم الدفع وتسجيل طلب الخدمة بنجاح.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "تعذر تنفيذ الدفع."
      );
    }
  }

  function loadRequests() {
    const saved = JSON.parse(
      localStorage.getItem("nolera_logistics_requests") || "[]"
    );

    setRequests(saved);
    setShowRequests(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-600 p-3 text-white">
              <Globe2 size={23} />
            </div>

            <div>
              <h1 className="font-black">
                NOLERA Global Services
              </h1>

              <p className="text-xs text-slate-500">
                Logistics • Property • Business
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshWallet}
              className="flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-sm font-bold text-purple-700"
            >
              <WalletCards size={17} />
              {balance.toLocaleString()} SDG
            </button>

            <button
              onClick={loadRequests}
              className="hidden rounded-xl border px-4 py-2 text-sm font-bold md:block"
            >
              My Requests
            </button>

            <button
              onClick={() => setShowAddBusiness(true)}
              className="hidden items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white md:flex"
            >
              <Plus size={17} />
              Add Business
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold">
            <Globe2 size={14} />
            GLOBAL NETWORK
          </span>

          <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Find property, logistics and professional services anywhere.
          </h2>

          <p className="mt-5 max-w-3xl text-slate-300">
            Search companies, offices, properties, transport,
            moving, construction, maintenance, cleaning, security
            and business services worldwide.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-4 text-slate-900 shadow-2xl">
            <div className="grid gap-3 lg:grid-cols-5">
              <div className="relative lg:col-span-2">
                <Search
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company or service..."
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-3 outline-none"
                />
              </div>

              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="rounded-xl border bg-slate-50 px-3 py-3 outline-none"
              />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="rounded-xl border bg-slate-50 px-3 py-3 outline-none"
              />

              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Area"
                className="rounded-xl border bg-slate-50 px-3 py-3 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-7">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(([id, name, icon]) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`flex min-w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
                category === id
                  ? "bg-purple-600 text-white"
                  : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {icon}
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* QUICK PAID SERVICES */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="mb-5">
          <h2 className="text-2xl font-black">
            NOLERA Service Center
          </h2>

          <p className="text-sm text-slate-500">
            Choose a service and pay securely from your NOLERA Wallet.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <button
              key={service.name}
              onClick={() =>
                openPaidService(service.name, service.price)
              }
              className="rounded-3xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
                  {service.icon}
                </div>

                <ChevronRight size={18} className="text-slate-300" />
              </div>

              <h3 className="mt-5 font-black">
                {service.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Starting from
              </p>

              <p className="mt-1 font-black text-purple-700">
                {service.price.toLocaleString()} SDG
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* DIRECTORY */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Global Directory
            </h2>

            <p className="text-sm text-slate-500">
              {filtered.length} available directory profiles
            </p>
          </div>

          <Filter size={19} className="text-slate-400" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider) => (
            <article
              key={provider.id}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
                  <Building2 />
                </div>

                {provider.verified ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 size={13} />
                    Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    API Ready
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-lg font-black">
                {provider.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {provider.description}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {provider.country} • {provider.city}
                </div>

                <div className="flex items-center gap-2">
                  <Star size={16} />
                  {provider.rating
                    ? `${provider.rating} (${provider.reviews})`
                    : "No reviews yet"}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelected(provider)}
                  className="rounded-xl border py-3 text-sm font-bold"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    setSelected(provider);
                    openPaidService("Consultation", 5000);
                  }}
                  className="rounded-xl bg-purple-600 py-3 text-sm font-bold text-white"
                >
                  Request
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PAYMENT MODAL */}
      {showPayment && selectedService && (
        <Modal onClose={() => setShowPayment(false)}>
          {(() => {
            const [service, raw] = selectedService.split("|");
            const amount = Number(raw);
            const current = getBalance();
            const enough = current >= amount;

            return (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black">
                      Confirm Service
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Pay using your NOLERA Wallet.
                    </p>
                  </div>

                  <button onClick={() => setShowPayment(false)}>
                    <X />
                  </button>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Service
                  </p>

                  <p className="mt-1 font-black">
                    {service}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span>Price</span>

                    <strong className="text-xl">
                      {amount.toLocaleString()} SDG
                    </strong>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span>Your Balance</span>

                    <strong className="text-purple-700">
                      {current.toLocaleString()} SDG
                    </strong>
                  </div>
                </div>

                {!enough && (
                  <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                    الرصيد غير كافٍ لتنفيذ هذه الخدمة.
                  </div>
                )}

                <button
                  disabled={!enough}
                  onClick={confirmPayment}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 p-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CreditCard size={18} />
                  Pay & Create Request
                </button>
              </>
            );
          })()}
        </Modal>
      )}

      {/* PROVIDER DETAILS */}
      {selected && !showPayment && (
        <Modal onClose={() => setSelected(null)}>
          <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
              <Building2 />
            </div>

            <button onClick={() => setSelected(null)}>
              <X />
            </button>
          </div>

          <h2 className="mt-5 text-2xl font-black">
            {selected.name}
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            {selected.description}
          </p>

          <div className="mt-5 space-y-3">
            <Info
              icon={<MapPin size={17} />}
              text={`${selected.country} • ${selected.city} • ${selected.area}`}
            />

            {selected.phone && (
              <Info
                icon={<Phone size={17} />}
                text={selected.phone}
              />
            )}

            {selected.email && (
              <Info
                icon={<Mail size={17} />}
                text={selected.email}
              />
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => openPaidService("Consultation", 5000)}
              className="rounded-xl bg-purple-600 p-3 font-bold text-white"
            >
              Consultation
            </button>

            <button
              onClick={() => openPaidService("Appointment", 3000)}
              className="rounded-xl border p-3 font-bold"
            >
              Appointment
            </button>
          </div>
        </Modal>
      )}

      {/* REQUESTS */}
      {showRequests && (
        <Modal onClose={() => setShowRequests(false)}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">
              My Requests
            </h2>

            <button onClick={() => setShowRequests(false)}>
              <X />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {requests.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                No service requests yet.
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black">
                        {request.service}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {request.provider}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {request.location}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between border-t pt-3 text-sm">
                    <span>{request.date}</span>

                    <strong>
                      {request.amount.toLocaleString()} SDG
                    </strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}

      {/* ADD BUSINESS */}
      {showAddBusiness && (
        <Modal onClose={() => setShowAddBusiness(false)}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Add Business
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provider onboarding will connect to the NOLERA
                verification system later.
              </p>
            </div>

            <button onClick={() => setShowAddBusiness(false)}>
              <X />
            </button>
          </div>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setShowAddBusiness(false);
              alert("تم تسجيل طلب إضافة الشركة للمراجعة.");
            }}
          >
            <input
              required
              placeholder="Company / Office name"
              className="w-full rounded-xl border p-3 outline-none"
            />

            <input
              required
              placeholder="Country"
              className="w-full rounded-xl border p-3 outline-none"
            />

            <input
              required
              placeholder="City"
              className="w-full rounded-xl border p-3 outline-none"
            />

            <input
              placeholder="Area"
              className="w-full rounded-xl border p-3 outline-none"
            />

            <input
              placeholder="Website"
              className="w-full rounded-xl border p-3 outline-none"
            />

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 p-3 font-black text-white">
              <Send size={17} />
              Submit for Verification
            </button>
          </form>
        </Modal>
      )}
    </main>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function Info({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <span className="text-purple-600">{icon}</span>
      {text}
    </div>
  );
}
