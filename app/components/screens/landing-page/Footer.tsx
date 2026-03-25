"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D3520] text-white w-full overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* CTA */}
        <div className="bg-[#0D3520] rounded-2xl border border-white/10 px-6 sm:px-10 py-10 sm:py-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Ready to Rent with Confidence?</h2>
          <p className="mt-3 text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-7">
            Join thousands of Nigerian landlords and tenants who trust NaijaRentVerify for safer, smarter
            renting.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0D3520] font-semibold px-6 py-3 rounded-full"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/25 text-white/90 hover:text-white hover:border-white/35 transition-colors"
            >
              View Properties
            </Link>
          </div>
        </div>

        <div className="h-px bg-white/15 mt-10" />

        {/* Columns */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white/80" />
              <span className="font-semibold text-white/90">NaijaRentVerify</span>
            </div>
            <p className="mt-3 text-sm text-white/60 leading-6 max-w-[230px]">
              Nigeria&apos;s trusted platform for tenant verification and property management.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90">Platform</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
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
                  href="/sign-in?redirect=/dashboard/landlord/properties/verification/request"
                  className="hover:text-white transition-colors"
                >
                  Verify Tenants
                </Link>
              </li>
            </ul>
          </div>

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

          <div>
            <h3 className="text-sm font-semibold text-white/90">Resources</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us?subject=problem" className="hover:text-white transition-colors">
                  Report a Problem
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs sm:text-sm text-white/60">2026 NaijaRentVerify. All rights reserved.</p>
          <div className="mt-2 flex items-center justify-center gap-6 text-[11px] text-white/45">
            <Link href="/about-us" className="hover:text-white transition-colors">
              About Portal
            </Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
