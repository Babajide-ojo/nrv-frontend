"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  FileCheck,
  UserCheck,
  ArrowRight,
  Building2,
  Wrench,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Tenant Verification",
    description:
      "Comprehensive background checks including employment, identity, and rental history verification for Nigerian tenants.",
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
    quote: "I can see at a glance whether to offer the unit, without digging through raw data. The Tenant Trust Score and recommendation save me time on every application.",
    author: "Property manager, Lagos",
    avatar: "/images/dami.svg",
  },
  {
    quote: "Finally, a verification report that actually tells me what to do. The risk band and clear recommendation made my last two lettings stress-free.",
    author: "Landlord, Abuja",
    avatar: "/images/verified-user-icon.svg",
  },
];

const EXPLORE_PREVIEW = [
  { label: "Lagos · 3-bed", price: "From N2.5M/yr" },
  { label: "Abuja · 2-bed", price: "From N1.8M/yr" },
  { label: "Lekki · 4-bed", price: "From N4M/yr" },
];

const NewLanding = () => {
  return (
    <div className="font-jakarta bg-[#FAFAF9] text-[#031B14] antialiased">
      {/* Hero – id="home" for nav */}
      <section
        id="home"
        className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#03442C]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-24 right-10 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-12 pt-24 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] items-center gap-12">
            <div className="text-left text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-100 text-xs font-medium mb-6 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Trusted by 1,000+ landlords
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Find Trustworthy Tenants
              </h1>
              <p className="mt-4 text-base sm:text-lg text-emerald-100/90 max-w-lg">
                Verify identity, rental history, and references before you sign. One report, one decision.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up?role=landlord"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#03442C] font-semibold hover:bg-emerald-50 hover:shadow-lg transition-all duration-200"
                >
                  Verify Tenants
                </Link>
                <Link
                  href="/sign-up?role=landlord"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border-2 border-white/50 text-white font-semibold hover:bg-white/10 hover:border-white/70 transition-all duration-200"
                >
                  List a Home
                </Link>
              </div>
            </div>
            <div className="relative mt-10 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] max-h-[400px] lg:max-h-none shadow-2xl ring-2 ring-white/10">
                <Image
                  src="/images/nrv-hero-section-img.jpeg"
                  alt="Happy tenants"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-[#03442C]/50 pointer-events-none" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3 flex justify-between text-white text-sm">
                  <span><strong>1,000+</strong> Verified</span>
                  <span><strong>1,500+</strong> Homes</span>
                  <span><strong>98%</strong> Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAFAF9] to-transparent pointer-events-none" />
      </section>

      {/* Trust strip – what you get in every report */}
      <section className="relative z-20 px-4 sm:px-6 lg:px-12 -mt-10 pb-2">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-6 sm:p-8">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              In every report
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: "verified", label: "Tenant Trust Score", sub: "0–100 with Low / Moderate / High risk band" },
                { icon: "shield", label: "Verification status", sub: "Identity, employment, guarantor, address" },
                { icon: "usercheck", label: "Clear recommendation", sub: "Approve, proceed with caution, or request more info" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-emerald-50/50 hover:scale-[1.02] transition-all duration-200 cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 overflow-hidden">
                    {item.icon === "verified" ? (
                      <Image src="/images/verified-user-icon.svg" alt="" width={32} height={32} />
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

      {/* Everything You Need + Features grid – id="features" */}
      <section id="features" className="px-4 sm:px-6 lg:px-12 py-14 sm:py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[#03442C] text-xs font-semibold uppercase tracking-wide">
              Why NaijaRentVerify
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14] text-center mb-3">
            Everything You Need to Manage Rentals
          </h2>
          <p className="text-center text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-12">
            From verification to property management, we support the entire landlord-tenant relationship.
          </p>
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {FEATURES.slice(0, 3).map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-[#FAFAF9] p-6 hover:border-[#03442C]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-[#03442C] group-hover:scale-110 transition-all duration-200">
                  <f.icon className="w-6 h-6 text-[#03442C] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-[#031B14] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
          {/* Second row - 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {FEATURES.slice(3).map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-[#FAFAF9] p-6 hover:border-[#03442C]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-[#03442C] group-hover:scale-110 transition-all duration-200">
                  <f.icon className="w-6 h-6 text-[#03442C] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-[#031B14] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Nigerian Rental Market */}
      <section className="px-4 sm:px-6 lg:px-12 py-14 sm:py-20 bg-gradient-to-b from-[#F3F4F6] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative min-h-[280px] sm:min-h-[320px]">
              <Image
                src="/images/nigeria-home.jpeg"
                alt="Nigerian property"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 lg:right-0 lg:left-auto lg:w-24 bg-gradient-to-l lg:bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
            </div>
            <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14]">
                Built for the Nigerian Rental Market
              </h2>
              <p className="mt-3 text-gray-600 text-sm sm:text-base">
                From Lagos to Abuja, Port Harcourt to Ibadan—we address the specific needs of
                Nigerian landlords and tenants.
              </p>
              <ul className="mt-6 space-y-4">
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
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-12 py-14 sm:py-20 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14] text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-10">
            Three steps from request to decision-ready report.
          </p>
          <div className="relative grid sm:grid-cols-3 gap-6 mb-14">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-[#FAFAF9] border border-gray-200 p-6 text-center hover:border-[#03442C]/25 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 z-10"
              >
                <span className="inline-flex w-11 h-11 rounded-full bg-[#03442C] text-white items-center justify-center text-lg font-bold mb-4 shadow-md">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: "1,000+", label: "Tenants Verified" },
              { value: "1,500+", label: "Homes Listed" },
              { value: "98%", label: "Verification Success Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                <p className="text-3xl sm:text-4xl font-bold text-[#03442C]">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Verified Homes – id="explore" */}
      <section id="explore" className="px-4 sm:px-6 lg:px-12 py-14 sm:py-20 bg-gradient-to-b from-[#F3F4F6] to-white scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#031B14] text-center mb-3">
            Explore Verified Homes
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto text-center mb-8">
            Browse listings across Lagos, Abuja, and more. Filter by location and rent range to find
            your next rental.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {EXPLORE_PREVIEW.map((card, i) => (
              <div
                key={card.label}
                className="group rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#03442C]/20 transition-all duration-200"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image src="/images/featured-img.svg" alt={card.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 33vw" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#03442C] text-white text-xs font-medium">
                    Verified
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-[#031B14]">{card.label}</p>
                  <p className="text-xs text-[#03442C] font-semibold mt-1">{card.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#03442C] text-[#03442C] font-semibold hover:bg-[#03442C] hover:text-white transition-all duration-200"
            >
              Browse All Listings
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials – id="testimonials" */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-12 py-14 sm:py-20 bg-[#FAFAF9] scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#031B14] text-center mb-10">
            Trusted by Landlords & Tenants
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#03442C]/15 transition-all duration-200"
              >
                <p className="text-4xl font-serif text-[#03442C]/30 leading-none mb-4">&ldquo;</p>
                <blockquote className="text-gray-600 text-base leading-relaxed -mt-2 mb-6">
                  {t.quote}
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                    <Image src={t.avatar} alt="" width={40} height={40} className="object-cover" />
                  </div>
                  <p className="text-sm font-semibold text-[#03442C]">{t.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 sm:px-6 lg:px-12 py-14 sm:py-20 bg-[#03442C] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to make better rent decisions?
          </h2>
          <p className="mt-3 text-emerald-100/90 text-sm sm:text-base">
            Join the beta. Create an account and run your first verification in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up?role=landlord"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#03442C] font-semibold hover:bg-emerald-50 hover:shadow-lg transition-all duration-200"
            >
              Create landlord account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/50 font-semibold hover:bg-white/10 hover:border-white/70 transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer – id="contact" */}
      <footer id="contact" className="px-4 sm:px-6 lg:px-12 py-12 bg-[#022419] text-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Naija Rent Verify</h3>
              <p className="text-sm text-gray-400">
                Nigeria&apos;s trusted platform for tenant verification and property management.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/sign-in" className="hover:text-white transition-colors">Browse Listings</Link>
                </li>
                <li>
                  <Link href="/sign-up?role=landlord" className="hover:text-white transition-colors">Landlord Sign Up</Link>
                </li>
                <li>
                  <Link href="/sign-up?role=tenant" className="hover:text-white transition-colors">Tenant Sign Up</Link>
                </li>
                <li>
                  <Link href="/dashboard/landlord/properties/verification" className="hover:text-white transition-colors">Verify Tenants</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Naija Rent Verify. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
              <Link href="/sign-up" className="hover:text-white transition-colors">Sign up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLanding;
