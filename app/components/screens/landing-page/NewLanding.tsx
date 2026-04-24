"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  Shield,
  CreditCard,
  UserCheck,
  ArrowRight,
  Building2,
  Wrench,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
  Search,
  Home,
  ChevronDown,
  Phone,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  detectNgNetwork,
  formatNigerianInternational,
  normalizeNigerianMobile,
} from "@/lib/nigerianPhone";
import { API_URL } from "@/config/constant";
import { PublicPropertyDetailsModal } from "@/app/components/property/PublicPropertyDetailsModal";
import PropertyCard from "@/app/components/shared/cards/PropertyCard";
import { LANDING_SCROLL_STORAGE_KEY } from "@/app/components/shared/navigations/NavLink";

const FEATURES = [
  {
    icon: Shield,
    title: "Tenant Verification",
    description:
      "Comprehensive background checks including employment, identity, and rental history verification for Nigerian tenants.",
  },
  {
    icon: CreditCard,
    title: "Rent Payment Tracking",
    description:
      "Track all rent payments in one place. Never lose track of who has paid and who owes.",
  },
  {
    icon: Building2,
    title: "Property Management",
    description:
      "Manage multiple properties, add tenants, and keep records of all your rental units from a single dashboard.",
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    description:
      "Tenants can submit maintenance requests and landlords can track and resolve them efficiently.",
  },
  {
    icon: MessageCircle,
    title: "In-App Messaging",
    description:
      "Communicate directly between landlords and tenants without sharing personal phone numbers.",
  },
  {
    icon: MapPin,
    title: "Property Listings",
    description:
      "List your available properties with photos, maps, and details to attract verified tenants.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Enter Tenant Details",
    desc: "Provide the tenant's name, phone number, or email address to begin the verification process.",
  },
  {
    step: "2",
    title: "Instant Verification",
    desc: "Our system checks identity, rental history, employment status, and previous landlord references within minutes.",
  },
  {
    step: "3",
    title: "Securely Rent Out",
    desc: "Make informed decisions with a comprehensive verification report. Rent out your property with confidence.",
  },
];

const NIGERIAN_BULLETS = [
  "Verify tenant identity with NIN & BVN",
  "Legal-grade verification reports",
  "Works across all Nigerian states",
  "Tenant Trust Score (0–100) with clear risk bands",
];

const TESTIMONIALS = [
  {
    quote:
      "Naija Rent Verify saved me from a terrible tenant experience. The verification report was thorough and I could make an informed decision. Highly recommended for every Lagos landlord!",
    name: "Chinedu Okafor",
    role: "Landlord",
    location: "Lagos",
    avatar: "/images/onboarding-profile-img.svg",
  },
  {
    quote:
      "As a tenant, having a verified profile made it so much easier to find a good apartment. Landlords trusted me immediately and the whole process was smooth.",
    name: "Amara Nwosu",
    role: "Tenant",
    location: "Abuja",
    avatar: "/images/dami.svg",
  },
  {
    quote:
      "Managing 15 properties became so much easier with Naija Rent Verify. Rent tracking, maintenance requests, and tenant communication all in one place.",
    name: "Funke Adeyemi",
    role: "Property Manager",
    location: "Port Harcourt",
    avatar: "/images/confirmed-user-icon.svg",
  },
];

const NewLanding = () => {
  const SHOW_HEATMAP = false;
  const [heroPhone, setHeroPhone] = useState("");
  const [verifyPreviewOpen, setVerifyPreviewOpen] = useState(false);

  // Scroll to section when arriving from another page (NavLink stores id in sessionStorage)
  useEffect(() => {
    let sectionId: string | null = null;
    try {
      sectionId = sessionStorage.getItem(LANDING_SCROLL_STORAGE_KEY);
      if (sectionId) sessionStorage.removeItem(LANDING_SCROLL_STORAGE_KEY);
    } catch {
      return;
    }
    if (!sectionId) return;

    const scroll = () => {
      const el = document.getElementById(sectionId!);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(scroll));
  }, []);

  // Property listing (Explore section) – search & filters
  const LIST_LIMIT = 3;
  const [listFilters, setListFilters] = useState({
    searchTerm: "",
    minimiumPrice: "",
    maximiumPrice: "",
  });
  const [listProperties, setListProperties] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listPage, setListPage] = useState(1);

  const fetchListings = useCallback(
    async (overrides?: { page?: number; searchTerm?: string; minimiumPrice?: string; maximiumPrice?: string }) => {
      const page = overrides?.page ?? listPage;
      const searchTerm = overrides?.searchTerm ?? listFilters.searchTerm;
      const minP = overrides?.minimiumPrice ?? listFilters.minimiumPrice;
      const maxP = overrides?.maximiumPrice ?? listFilters.maximiumPrice;
      setListLoading(true);
      try {
        let url = `${API_URL}/rooms/all?page=${page}&limit=${LIST_LIMIT}`;
        if (searchTerm?.trim()) url += `&search=${encodeURIComponent(searchTerm.trim())}`;
        const min = minP ? Number(String(minP).replace(/,/g, "")) : undefined;
        const max = maxP ? Number(String(maxP).replace(/,/g, "")) : undefined;
        if (min != null && !Number.isNaN(min)) url += `&minPrice=${min}`;
        if (max != null && !Number.isNaN(max)) url += `&maxPrice=${max}`;
        const res = await axios.get(url);
        const data = res?.data?.data;
        setListProperties(Array.isArray(data) ? data : []);
      } catch {
        setListProperties([]);
      } finally {
        setListLoading(false);
      }
    },
    [listPage, listFilters.searchTerm, listFilters.minimiumPrice, listFilters.maximiumPrice],
  );

  useEffect(() => {
    fetchListings();
  }, [listPage]);

  const QUICK_LOCATIONS = ["Lagos", "Abuja", "Ikeja", "Lekki", "Port Harcourt", "Ibadan"];

  const clearListFilters = () => {
    setListFilters({ searchTerm: "", minimiumPrice: "", maximiumPrice: "" });
    setListPage(1);
    fetchListings({ page: 1, searchTerm: "", minimiumPrice: "", maximiumPrice: "" });
  };

  // Heatmap (rent insights)
  const [heatmapState, setHeatmapState] = useState<string>('Lagos');
  const [heatmapYear, setHeatmapYear] = useState<string>(''); // '' => all years
  const [heatmapAreaSearch, setHeatmapAreaSearch] = useState<string>('');
  const [heatmapLoading, setHeatmapLoading] = useState<boolean>(false);
  const [heatmapData, setHeatmapData] = useState<{
    state: string;
    year?: number;
    areas: Array<{ city: string; avgAnnualRent: number; listingsCount: number }>;
    minAvgAnnualRent: number;
    maxAvgAnnualRent: number;
  } | null>(null);

  const [heatmapInsightsLoading, setHeatmapInsightsLoading] = useState<boolean>(false);
  const [heatmapInsights, setHeatmapInsights] = useState<{
    provider: "gemini" | "fallback";
    generatedAt: string;
    summary: string;
    bullets: string[];
    disclaimer: string;
  } | null>(null);

  const heatmapYears = (() => {
    const current = new Date().getFullYear();
    return [current - 4, current - 3, current - 2, current - 1, current].map(String);
  })();

  const fetchHeatmap = useCallback(async () => {
    setHeatmapLoading(true);
    try {
      const params = new URLSearchParams();
      if (heatmapState?.trim()) params.append('state', heatmapState.trim());
      if (heatmapYear?.trim()) params.append('year', heatmapYear.trim());

      const url = `${API_URL}/properties/rent-heatmap?${params.toString()}`;
      const res = await axios.get(url);
      setHeatmapData(res?.data?.data ?? null);
    } catch {
      setHeatmapData(null);
    } finally {
      setHeatmapLoading(false);
    }
  }, [heatmapState, heatmapYear]);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  const fetchHeatmapInsights = useCallback(async () => {
    setHeatmapInsightsLoading(true);
    try {
      const params = new URLSearchParams();
      if (heatmapState?.trim()) params.append('state', heatmapState.trim());
      if (heatmapYear?.trim()) params.append('year', heatmapYear.trim());
      const url = `${API_URL}/properties/rent-heatmap/insights?${params.toString()}`;
      const res = await axios.get(url);
      setHeatmapInsights(res?.data?.data ?? null);
    } catch {
      setHeatmapInsights(null);
    } finally {
      setHeatmapInsightsLoading(false);
    }
  }, [heatmapState, heatmapYear]);

  useEffect(() => {
    fetchHeatmapInsights();
  }, [fetchHeatmapInsights]);

  const [propertyModalId, setPropertyModalId] = useState<string | null>(null);

  const goToPropertyDetails = (propertyId: string) => {
    setPropertyModalId(propertyId);
  };

  const normalizedHeroPhone = normalizeNigerianMobile(heroPhone);
  const heroNetwork = normalizedHeroPhone ? detectNgNetwork(normalizedHeroPhone) : null;
  const tenantVerifySignUpHref =
    normalizedHeroPhone != null
      ? `/sign-up?role=landlord&phone=${encodeURIComponent(`0${normalizedHeroPhone}`)}`
      : "/sign-up?role=landlord";

  const formatNaira = (amount: number) =>
    Number.isFinite(amount)
      ? `₦${Math.round(amount).toLocaleString()}`
      : "—";

  const normalizeAreaKey = (value: string) =>
    String(value || "")
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const heatmapAreas = heatmapData?.areas ?? [];
  const heatmapAreasFiltered = heatmapAreaSearch.trim()
    ? heatmapAreas.filter((a) =>
        normalizeAreaKey(a.city).includes(normalizeAreaKey(heatmapAreaSearch)),
      )
    : heatmapAreas;

  const mostExpensive = heatmapAreas[0];
  const mostAffordable = heatmapAreas.length ? heatmapAreas[heatmapAreas.length - 1] : undefined;

  const lagosAverage = (() => {
    if (!heatmapAreas.length) return 0;
    const totalCount = heatmapAreas.reduce((acc, a) => acc + (a.listingsCount || 0), 0);
    if (!totalCount) return 0;
    const weightedSum = heatmapAreas.reduce(
      (acc, a) => acc + (a.avgAnnualRent || 0) * (a.listingsCount || 0),
      0,
    );
    return Math.round(weightedSum / totalCount);
  })();

  const bubbleSlots = [
    { label: "Eko Atlantic City", left: "7%", top: "28%" },
    { label: "Maryland", left: "22%", top: "41%" },
    { label: "Ikeja", left: "50%", top: "45%" },
    { label: "Lekki", left: "67%", top: "54%" },
    { label: "Magodo", left: "78%", top: "37%" },
    { label: "V. Island (VI)", left: "61%", top: "27%" },
    { label: "Badagry", left: "86%", top: "56%" },
  ] as const;

  const getHeatColor = (avgAnnualRent: number) => {
    const min = heatmapData?.minAvgAnnualRent ?? 0;
    const max = heatmapData?.maxAvgAnnualRent ?? 0;
    const denom = max - min;
    const ratio = denom > 0 ? (avgAnnualRent - min) / denom : 0.5;
    const t = Math.max(0, Math.min(1, ratio));

    // Interpolate emerald (#10B981) -> red (#EF4444)
    const emerald = { r: 16, g: 185, b: 129 };
    const red = { r: 239, g: 68, b: 68 };
    const r = Math.round(emerald.r + (red.r - emerald.r) * t);
    const g = Math.round(emerald.g + (red.g - emerald.g) * t);
    const b = Math.round(emerald.b + (red.b - emerald.b) * t);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.75)`,
    };
  };

  return (
    <div className="font-jakarta bg-[#FAFAF9] text-[#031B14] antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroFadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .hero-animate-1 { animation: heroFadeInUp 0.6s ease-out forwards; }
        .hero-animate-2 { animation: heroFadeInUp 0.6s ease-out 0.1s forwards; opacity: 0; }
        .hero-animate-3 { animation: heroFadeInUp 0.6s ease-out 0.2s forwards; opacity: 0; }
        .hero-animate-4 { animation: heroFadeInUp 0.6s ease-out 0.3s forwards; opacity: 0; }
        .hero-animate-5 { animation: heroFadeInUp 0.6s ease-out 0.4s forwards; opacity: 0; }
        .hero-animate-6 { animation: heroFadeInUp 0.5s ease-out 0.5s forwards; opacity: 0; }
        .hero-img-wrap { animation: heroScaleIn 0.7s ease-out 0.2s forwards; opacity: 0; }
      `}} />
      {/* Hero – id="home" for nav */}
      <section
        id="home"
        className="relative min-h-[55vh] sm:min-h-[60vh] flex flex-col justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#03442C]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-24 right-10 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
        <div className="relative z-10 px-4 sm:px-6 lg:px-12 pt-20 pb-10 sm:pt-24 sm:pb-12">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] items-center gap-8 lg:gap-10">
            <div className="text-left text-white">
              <div className="hero-animate-1 flex flex-wrap gap-2">
                <Link
                  href="/sign-up?role=landlord"
                  className="inline-flex items-center rounded-full bg-[#BBFF37] px-4 py-2 text-xs font-semibold text-[#031B14] shadow-sm transition hover:bg-[#d4ff6a]"
                >
                  Verify Tenants
                </Link>
                <Link
                  href="/sign-up?role=landlord"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  <Home className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  List a Home
                </Link>
              </div>
              <h1 className="hero-animate-2 mt-5 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.12]">
                Find Trustworthy Tenants
              </h1>
              <div className="hero-animate-4 mt-6 flex max-w-xl flex-col gap-2 sm:flex-row sm:items-stretch">
                <label className="relative flex flex-1 items-center rounded-xl bg-white px-3 py-2.5 shadow-md ring-1 ring-black/5">
                  <span className="sr-only">Phone number</span>
                  <Phone className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400" aria-hidden />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+234 901 234 5678"
                    value={heroPhone}
                    onChange={(e) => setHeroPhone(e.target.value)}
                    className="w-full rounded-lg border-0 bg-transparent py-1 pl-9 pr-2 text-sm text-[#031B14] outline-none placeholder:text-gray-400"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setVerifyPreviewOpen(true)}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#022818] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#031f14] sm:min-w-[140px]"
                >
                  Verify Tenant
                </button>
              </div>
              <p className="hero-animate-5 mt-4 flex gap-2 text-sm leading-relaxed text-emerald-50/95 max-w-xl">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#BBFF37]" aria-hidden />
                <span>
                  Before signing any lease, protect your property by thoroughly verifying your
                  prospective tenant&apos;s identity, rental history, and references — ensuring a
                  safe, trustworthy tenancy from day one.
                </span>
              </p>
            </div>
            <div className="relative mt-6 lg:mt-0 hero-img-wrap">
              <div className="relative aspect-[4/3] max-h-[300px] overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10 sm:max-h-[340px] lg:aspect-[5/4] lg:max-h-[420px]">
                <Image
                  src="/images/hero-couple.jpg"
                  alt="Happy couple — verified tenants and confident landlords"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF9] to-transparent pointer-events-none" />
      </section>

      <Dialog open={verifyPreviewOpen} onOpenChange={setVerifyPreviewOpen}>
        <DialogContent className="max-w-md border-gray-200 bg-white text-[#031B14] sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-semibold">
              Verification Preview
            </DialogTitle>
            <DialogDescription className="text-left text-gray-600">
              {normalizedHeroPhone
                ? `We analyzed ${formatNigerianInternational(normalizedHeroPhone)}`
                : heroPhone.trim()
                  ? "We could not validate this as a Nigerian mobile line yet. Update the number to continue."
                  : "Enter a Nigerian mobile number in the field above to generate a verification preview."}
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              {normalizedHeroPhone ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
              )}
              <span>
                <span className="font-medium text-[#031B14]">Phone Number:</span>{" "}
                {normalizedHeroPhone ? (
                  <span className="text-emerald-700">Valid Nigerian number</span>
                ) : (
                  <span className="text-amber-800">Not a valid Nigerian mobile number</span>
                )}
              </span>
            </li>
            <li className="flex gap-3">
              {normalizedHeroPhone ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
              )}
              <span>
                <span className="font-medium text-[#031B14]">Carrier:</span>{" "}
                <span
                  className={
                    normalizedHeroPhone ? "text-emerald-800" : "text-gray-500"
                  }
                >
                  {normalizedHeroPhone
                    ? heroNetwork && heroNetwork !== "Unknown"
                      ? heroNetwork
                      : "Unknown network (prefix not matched)"
                    : "—"}
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              <span>
                <span className="font-medium text-[#031B14]">Preliminary Risk Signals:</span>{" "}
                <span className="text-gray-700">{normalizedHeroPhone ? "Detected" : "Unavailable"}</span>
              </span>
            </li>
            <li className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm font-semibold text-[#031B14]">Full Report Includes:</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-700">
                <li>Identity Verification Score</li>
                <li>Rental History Insights</li>
                <li>Payment Behavior</li>
                <li>Background Risk Indicators</li>
              </ul>
            </li>
            <li className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
              <span className="text-amber-950">
                Full identity &amp; rental history is securely unlocked with tenant authorization.
              </span>
            </li>
          </ul>
          <p className="text-center text-sm font-medium text-[#03442C]">
            Avoid costly rental mistakes. Verify before you rent.
          </p>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {normalizedHeroPhone ? (
              <>
                <Link
                  href={tenantVerifySignUpHref}
                  onClick={() => setVerifyPreviewOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#03442C] px-4 py-3 text-sm font-semibold text-[#03442C] transition hover:bg-emerald-50"
                >
                  Unlock full report
                </Link>
                <Link
                  href={tenantVerifySignUpHref}
                  onClick={() => setVerifyPreviewOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#03442C] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#022818]"
                >
                  Continue Verification
                </Link>
              </>
            ) : (
              <>
                <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-500">
                  Unlock full report
                </span>
                <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-400">
                  Continue Verification
                </span>
                <p className="text-center text-xs text-gray-500">
                  Enter a valid Nigerian mobile number above to continue.
                </p>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trust strip – what you get in every report */}
      <section className="relative z-20 px-4 sm:px-6 lg:px-12 -mt-6 pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-4 sm:p-6">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              In every report
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "confirmed", label: "Tenant Trust Score", sub: "0–100 with Low / Moderate / High risk band" },
                { icon: "shield", label: "Verification status", sub: "Identity, employment, guarantor, address" },
                { icon: "usercheck", label: "Clear recommendation", sub: "Approve, proceed with caution, or request more info" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-emerald-50/50 hover:scale-[1.02] transition-all duration-200 cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2 overflow-hidden">
                    {item.icon === "confirmed" ? (
                      <Image src="/images/confirmed-user-icon.svg" alt="" width={32} height={32} />
                    ) : item.icon === "shield" ? (
                      <Shield className="w-6 h-6 text-[#03442C]" />
                    ) : (
                      <UserCheck className="w-6 h-6 text-[#03442C]" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#031B14]">{item.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features grid – id="features" (2×3 cards, pale green-grey background) */}
      <section id="features" className="px-4 sm:px-6 lg:px-12 py-10 sm:py-14 bg-[#EDF1EF] scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100/80"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8F3EC] flex items-center justify-center mb-4 shrink-0">
                  <f.icon className="w-5 h-5 text-[#03442C]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Nigerian Rental Market */}
      <section className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-b from-[#F3F4F6] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative min-h-[220px] sm:min-h-[260px]">
              <Image
                src="/images/hero-building-1.jpg"
                alt="Nigerian rental property"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 lg:right-0 lg:left-auto lg:w-24 bg-gradient-to-l lg:bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
            </div>
            <div className="lg:w-1/2 p-5 sm:p-6 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14]">
                Built for the Nigerian Rental Market
              </h2>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                From Lagos to Abuja, Port Harcourt to Ibadan—we address the specific needs of
                Nigerian landlords and tenants.
              </p>
              <ul className="mt-4 space-y-2">
                {NIGERIAN_BULLETS.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#03442C] shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works + stats – id="how-it-works" */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14] text-center mb-2">
            How It Works
          </h2>
          <p className="text-center text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Three steps from request to decision-ready report.
          </p>
          <div className="relative grid sm:grid-cols-3 gap-4 mb-8">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-[#FAFAF9] border border-gray-200 p-4 text-center hover:border-[#03442C]/25 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 z-10"
              >
                <span className="inline-flex w-10 h-10 rounded-full bg-[#03442C] text-white items-center justify-center text-base font-bold mb-3 shadow-md">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-[#031B14] mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "1,000+", label: "Tenants Processed" },
              { value: "1,500+", label: "Homes Listed" },
              { value: "98%", label: "Success Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-4 text-center hover:shadow-md transition-shadow"
              >
                <p className="text-2xl sm:text-3xl font-bold text-[#03442C]">{stat.value}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Verified Homes – id="explore" */}
      <section id="explore" className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-[#F3F4F6] scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14] text-left mb-4">
            Explore Verified Homes
          </h2>

          <div className="relative mb-6 inline-flex w-full max-w-xs">
            <Home className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden />
            <select
              value={listFilters.searchTerm}
              onChange={(e) => {
                const v = e.target.value;
                setListFilters((prev) => ({ ...prev, searchTerm: v }));
                setListPage(1);
                fetchListings({ page: 1, searchTerm: v });
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-gray-900 shadow-sm focus:border-[#03442C] focus:outline-none focus:ring-2 focus:ring-[#03442C]/20"
              aria-label="Filter by city"
            >
              <option value="">All Cities</option>
              {QUICK_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden />
          </div>

          {listLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 animate-pulse">
                  <div className="h-80 rounded-xl bg-gray-200 mb-4" />
                  <div className="h-5 w-3/4 rounded bg-gray-200 mb-2" />
                  <div className="h-4 w-1/2 rounded bg-gray-100 mb-4" />
                  <div className="h-10 w-1/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !listProperties.length ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center mb-6 shadow-sm">
              <p className="text-gray-600 font-medium">No listings match your search</p>
              <p className="text-sm text-gray-500 mt-1">Try another city or clear the filter.</p>
              <button
                type="button"
                onClick={clearListFilters}
                className="mt-4 text-sm font-semibold text-[#03442C] hover:underline"
              >
                Show all cities
              </button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
              {listProperties.map((room: any) => {
                const prop = room?.propertyId || {};
                const locationLine = [prop.city, prop.state].filter(Boolean).join(", ") || "—";
                return (
                  <div
                    key={room._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => goToPropertyDetails(room._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToPropertyDetails(room._id);
                      }
                    }}
                    className="cursor-pointer h-full"
                  >
                    <PropertyCard
                      imageUrl={
                        room?.imageUrls?.[0] || room?.file || prop?.file || "/images/featured-img.svg"
                      }
                      address={locationLine}
                      rentAmount={room?.rentAmount}
                      property={room}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#03442C] text-[#03442C] font-semibold hover:bg-[#03442C] hover:text-white transition-all duration-200"
            >
              Browse All Listings
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {SHOW_HEATMAP && (
          <>
          {/* Lagos Property Price Heat Map */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#03442C] bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-4 h-4" />
                  Rent Insights
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Lagos Property Price Heat Map</h3>
                <p className="text-gray-600 text-sm mt-2 max-w-2xl">
                  Explore average annual rent prices across Lagos neighborhoods. Warmer colors indicate higher prices. Click any area for detailed insights.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Most Expensive</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {heatmapLoading ? "Loading..." : mostExpensive?.city ?? "—"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {heatmapLoading || !mostExpensive
                      ? "—"
                      : `${formatNaira(mostExpensive.avgAnnualRent)}/yr • ${mostExpensive.listingsCount} listings`}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Most Affordable</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {heatmapLoading ? "Loading..." : mostAffordable?.city ?? "—"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {heatmapLoading || !mostAffordable
                      ? "—"
                      : `${formatNaira(mostAffordable.avgAnnualRent)}/yr • ${mostAffordable.listingsCount} listings`}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Lagos Average</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {heatmapLoading ? "Loading..." : formatNaira(lagosAverage)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {heatmapLoading ? "—" : `${heatmapAreas.length} areas shown`}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Filters:</span>
                <select
                  value={heatmapState}
                  onChange={(e) => {
                    setHeatmapState(e.target.value);
                    setHeatmapAreaSearch("");
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03442C]/20"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Rivers">Rivers</option>
                </select>
                <select
                  value={heatmapYear}
                  onChange={(e) => setHeatmapYear(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03442C]/20"
                >
                  <option value="">All Years</option>
                  {heatmapYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    value={heatmapAreaSearch}
                    onChange={(e) => setHeatmapAreaSearch(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03442C]/20 w-[220px]"
                    placeholder="Search area..."
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {heatmapLoading ? "Loading..." : `${heatmapAreasFiltered.length} areas shown`}
              </div>
            </div>

            {/* Heatmap */}
            <div className="relative h-[420px] rounded-xl border border-gray-200 overflow-hidden bg-[linear-gradient(to_right,rgba(3,68,44,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(3,68,44,0.08)_1px,transparent_1px)] bg-[size:32px_32px]">
              {heatmapLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  Loading rent insights...
                </div>
              )}

              {/* Bubbles (now driven by API data) */}
              {bubbleSlots.map((slot) => {
                const area = heatmapAreasFiltered.find(
                  (a) => normalizeAreaKey(a.city) === normalizeAreaKey(slot.label),
                );
                if (!area) return null;

                const min = heatmapData?.minAvgAnnualRent ?? 0;
                const max = heatmapData?.maxAvgAnnualRent ?? 0;
                const denom = max - min;
                const ratio = denom > 0 ? (area.avgAnnualRent - min) / denom : 0.5;
                const size = Math.round(12 + Math.max(0, Math.min(1, ratio)) * 22);
                const color = getHeatColor(area.avgAnnualRent).backgroundColor;

                return (
                  <div
                    key={slot.label}
                    className="absolute"
                    style={{ left: slot.left, top: slot.top }}
                  >
                    <div className="flex flex-col items-center -translate-x-1/2 -translate-y-full">
                      <div
                        className="mb-1 text-[11px] bg-white/90 border border-gray-200 px-2 py-0.5 rounded-full text-gray-700 whitespace-nowrap"
                        title={`${area.city}: ${formatNaira(area.avgAnnualRent)}/yr • ${area.listingsCount} listings`}
                      >
                        {area.city}
                      </div>
                      <div
                        className="rounded-full border-2 border-white shadow-sm"
                        style={{ width: size, height: size, backgroundColor: color }}
                        aria-label={area.city}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Background crosshair / hint */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[50%] top-[50%] w-[2px] h-[2px] bg-transparent" />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                  AI-powered market insights
                </p>
                <p className="text-[11px] text-gray-500">
                  {heatmapInsightsLoading
                    ? "Generating..."
                    : heatmapInsights?.provider === "gemini"
                      ? "Powered by AI"
                      : "Auto summary"}
                </p>
              </div>

              <p className="mt-2 text-sm text-gray-700">
                {heatmapInsightsLoading
                  ? "Generating insights from listing data..."
                  : heatmapInsights?.summary ?? "Insights unavailable at the moment."}
              </p>

              {!heatmapInsightsLoading && heatmapInsights?.bullets?.length ? (
                <ul className="mt-2 list-disc pl-5 text-xs text-gray-600 space-y-1">
                  {heatmapInsights.bullets.slice(0, 5).map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-2 text-[11px] text-gray-500 leading-5">
                {heatmapInsights?.disclaimer ??
                  "AI-generated insights based on aggregated listing data. Estimates are indicative."}
              </p>
            </div>
          </div>
          </>
          )}

        </div>
      </section>

      {/* Testimonials – id="testimonials" */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-12 py-10 sm:py-14 bg-[#EDF1EF] scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#031B14] text-center leading-tight">
            Trusted by Landlords & <br className="hidden sm:block" />
            Tenants Across Nigeria
          </h2>
          <p className="text-center text-gray-600 mt-3 mb-8">
            See what our users have to say about their experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6 shadow-sm"
              >
                <div className="text-[#0A7A4B] text-sm tracking-[2px] mb-4">★★★★★</div>
                <blockquote className="text-gray-700 text-[15px] leading-7 mb-4 min-h-[140px]">
                  {t.quote}
                </blockquote>
                <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                    <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#031B14]">{t.name}</p>
                    <p className="text-xs text-gray-500">
                      {t.role}, {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 sm:px-6 lg:px-12 py-10 sm:py-14 bg-[#0D3520] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0D3520] rounded-2xl border border-white/10 px-6 sm:px-10 py-10 sm:py-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to Rent with Confidence?
            </h2>
            <p className="mt-3 text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-7">
              Join thousands of Nigerian landlords and tenants who trust NaijaRentVerify for safer, smarter
              renting.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0D3520] font-semibold px-6 py-3 rounded-full hover:shadow-sm transition-all duration-200"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/25 text-white/90 hover:text-white hover:border-white/35 transition-colors duration-200"
              >
                View Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer – id="contact" */}
      <footer id="contact" className="px-4 sm:px-6 lg:px-12 py-8 bg-[#0D3520] text-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-white/15 mt-10" />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-flex items-center gap-2">
                <Shield className="w-4 h-4 text-white/80" />
                <span className="font-semibold text-white/90">NaijaRentVerify</span>
              </Link>
              <p className="mt-3 text-sm text-white/60 leading-6 max-w-[230px]">
                Nigeria&apos;s trusted platform for tenant verification and property management.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-sm font-semibold text-white/90">Platform</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-white/65">
                <li>
                  <Link href="/listings" className="hover:text-white transition-colors">
                    Browse Listings
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up?role=landlord" className="hover:text-white transition-colors">
                    Landlord Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up?role=tenant" className="hover:text-white transition-colors">
                    Tenant Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up?role=landlord"
                    className="hover:text-white transition-colors"
                  >
                    Verify Tenants
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-white/90">Legal</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-white/65">
                <li>
                  <Link href="/legal" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy?tab=data-processing" className="hover:text-white transition-colors">
                    Data Processing Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal?tab=disclaimer" className="hover:text-white transition-colors">
                    Legal Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-white/90">Resources</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-white/65">
                <li>
                  <Link href="/legal/safety-tips" className="hover:text-white transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                <a href="mailto:safety@naijarentverify.com" className="hover:text-white transition-colors">
                  Report a Problem
                </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="mt-10 border-t border-white/10 pt-6 text-center">
            <p className="text-xs sm:text-sm text-white/60">
              2026 NaijaRentVerify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <PublicPropertyDetailsModal
        roomId={propertyModalId}
        open={propertyModalId !== null}
        onOpenChange={(next) => {
          if (!next) setPropertyModalId(null);
        }}
      />
    </div>
  );
};

export default NewLanding;
