"use client";

import React from "react";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

export default function SafetyTipsPage() {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#03442C] mb-3">Safety Tips</h1>
        <p className="text-gray-600 text-base leading-relaxed mb-10">
          Your safety is our priority. Follow these guidelines to protect yourself when engaging with
          landlords, agents, or property listers on NaijaRentVerify.
        </p>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 sm:p-8 mb-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#03442C] text-white">
              <BadgeCheck className="h-7 w-7" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#03442C]/80 mb-1">
                NaijaRent Verification Badge
              </p>
              <h2 className="text-lg font-semibold text-[#031B14] mb-2">Look for the NaijaRent Verification Badge</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Properties displaying the NaijaRent Verification Badge have been reviewed and approved by our
                team. This badge indicates that the property listing has been verified for accuracy, the landlord
                or agent identity has been confirmed, and the property meets our listing standards. Always
                prioritize verified properties for a safer rental experience.
              </p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none text-gray-600 space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-[#03442C] mb-6 pb-2 border-b border-gray-100">
              For Tenants
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Verify the Landlord or Agent</h3>
                <p className="leading-relaxed">
                  Before making any payments, confirm the identity of the landlord or agent. Request valid
                  identification, business registration documents, and proof of property ownership. Use
                  NaijaRentVerify to check their profile and verification status.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Inspect the Property in Person</h3>
                <p className="leading-relaxed">
                  Never rent a property sight-unseen. Always schedule a physical visit during daylight hours.
                  Bring a trusted friend or family member along. Check for structural integrity, water supply,
                  electricity, and security features.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Beware of Deals Too Good to Be True</h3>
                <p className="leading-relaxed">
                  If a rental price is significantly below market rate for the area, proceed with extreme caution.
                  Scammers often use unrealistically low prices to lure victims. Compare prices with similar
                  properties in the neighborhood.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Insist on a Written Agreement</h3>
                <p className="leading-relaxed">
                  Never rely on verbal agreements. Ensure all terms are documented in a formal tenancy agreement
                  signed by both parties. The agreement should cover rent amount, payment schedule, duration,
                  maintenance responsibilities, and termination conditions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Use Secure Payment Methods</h3>
                <p className="leading-relaxed">
                  Avoid cash payments where possible. Use bank transfers or other traceable payment methods.
                  Always obtain and keep receipts for every payment. Never pay rent into personal accounts —
                  insist on registered business or property owner accounts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Research the Neighborhood</h3>
                <p className="leading-relaxed">
                  Visit the area at different times of day to assess safety, noise levels, and accessibility.
                  Speak with current tenants or neighbors about their experience. Check proximity to essential
                  services like hospitals, markets, and transport.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Protect Your Personal Information</h3>
                <p className="leading-relaxed">
                  Only share sensitive documents (NIN, BVN, bank details) through the secure NaijaRentVerify
                  platform. Never send these details via WhatsApp, SMS, or email. Be wary of agents who ask for
                  excessive personal information upfront.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Report Suspicious Activity</h3>
                <p className="leading-relaxed">
                  If you encounter a suspicious listing, fraudulent agent, or any form of rental scam, report it
                  immediately through the NaijaRentVerify platform or contact our support team. Your report helps
                  protect the entire community.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#03442C] mb-6 pb-2 border-b border-gray-100">
              For Landlords and Agents
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Screen Tenants Thoroughly</h3>
                <p className="leading-relaxed">
                  Use NaijaRentVerify to run comprehensive background checks on prospective tenants. Verify their
                  identity, employment, rental history, and references before granting tenancy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Document Everything</h3>
                <p className="leading-relaxed">
                  Maintain detailed records of the property condition (photos and written inventory) before and
                  after each tenancy. Keep copies of all signed agreements, payment receipts, and correspondence.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Use Formal Agreements</h3>
                <p className="leading-relaxed">
                  Always use a legally binding tenancy agreement prepared or reviewed by a legal professional.
                  Include clear clauses on rent payment, security deposit, maintenance, property rules, and
                  eviction procedures.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Collect Payments Securely</h3>
                <p className="leading-relaxed">
                  Use the NaijaRentVerify payment tracking system to record all transactions. Issue receipts for
                  every payment received. Avoid informal cash arrangements without documentation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Maintain Your Property</h3>
                <p className="leading-relaxed">
                  Keep the property in good habitable condition. Respond promptly to maintenance requests. Regular
                  maintenance protects your investment and ensures tenant satisfaction and retention.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#031B14] mb-2">Respect Tenant Privacy</h3>
                <p className="leading-relaxed">
                  Give adequate notice before property inspections (minimum 24 hours). Do not enter the property
                  without the tenant&apos;s knowledge except in genuine emergencies. Respect the tenant&apos;s right
                  to quiet enjoyment.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#03442C] mb-4">Report a Problem</h2>
            <p className="mb-4 text-gray-700">
              If you suspect fraud, encounter a dangerous situation, or need immediate assistance:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                <strong>Report on the platform:</strong> Use the &quot;Report&quot; button on any listing or user profile.
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:safety@naijarentverify.com" className="font-medium text-[#03442C] hover:underline">
                  safety@naijarentverify.com
                </a>
              </li>
              <li>
                <strong>Nigeria Police Emergency:</strong> 112 or 199
              </li>
              <li>
                <strong>Consumer Protection Council:</strong> 08002255282
              </li>
            </ul>
          </section>

          <div className="pt-6 border-t border-gray-200 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/legal" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/privacy?tab=data-processing" className="hover:text-gray-900 transition-colors">
              Data Processing Policy
            </Link>
            <Link href="/legal?tab=disclaimer" className="hover:text-gray-900 transition-colors">
              Legal Disclaimer
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
