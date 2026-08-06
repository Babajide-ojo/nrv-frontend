"use client";

import React from "react";
import Link from "next/link";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

const LegalDisclaimerPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-2">Legal Disclaimer</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: 28 February 2026</p>

        <div className="prose max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">1. General Disclaimer</h2>
            <p>
              The information provided on the NaijaRentVerify platform ("Platform") is for general informational
              purposes only. While we strive to ensure the accuracy and completeness of all information, NaijaRentVerify
              makes no representations or warranties of any kind, express or implied, about the completeness, accuracy,
              reliability, suitability, or availability of the Platform or the information, services, or related
              graphics contained on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">2. No Legal or Financial Advice</h2>
            <p>
              Nothing on this Platform constitutes legal, financial, or professional advice. The verification reports,
              property listings, and other information provided through the Platform should not be considered as a
              substitute for professional consultation. Users are encouraged to seek independent legal and financial
              advice before entering into any rental agreements or property transactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">3. Verification Report Disclaimer</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Verification reports are generated based on information available at the time of the check and from
                third-party data sources.
              </li>
              <li>
                NaijaRentVerify does not guarantee the accuracy, completeness, or timeliness of any verification report.
              </li>
              <li>
                Verification results should be used as one component of a comprehensive assessment and should not be the
                sole basis for any tenancy decision.
              </li>
              <li>We are not liable for any actions taken or not taken based on verification reports.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">4. Property Listings Disclaimer</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Property listings are provided by third-party landlords, agents, and property managers.</li>
              <li>NaijaRentVerify does not own, manage, or control any listed properties.</li>
              <li>We do not guarantee the accuracy of property descriptions, images, pricing, or availability.</li>
              <li>Users should independently verify all property details before entering into any agreements.</li>
              <li>
                The display of the NaijaRent Verification Badge indicates that a property has undergone our verification
                process, but it does not constitute an endorsement or guarantee of the property condition.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">5. Third-Party Links and Services</h2>
            <p>
              The Platform may contain links to third-party websites and services. NaijaRentVerify has no control over
              the content, privacy policies, or practices of any third-party sites and accepts no responsibility for them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">6. Platform Availability</h2>
            <p>
              NaijaRentVerify does not warrant that the Platform will be uninterrupted, timely, secure, or error-free.
              We reserve the right to modify, suspend, or discontinue any part of the Platform at any time without prior
              notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">7. User-Generated Content</h2>
            <p>
              Users are solely responsible for the content they submit to the Platform, including property listings,
              reviews, messages, and verification requests. NaijaRentVerify is not responsible for the accuracy or
              legality of user-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">8. Limitation of Damages</h2>
            <p>
              In no event shall NaijaRentVerify, its directors, employees, partners, agents, suppliers, or affiliates
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your access to or use of (or inability to access or use) the Platform.</li>
              <li>Any conduct or content of any third party on the Platform.</li>
              <li>Any content obtained from the Platform.</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">9. Regulatory Compliance</h2>
            <p>
              This disclaimer is subject to and governed by the laws of the Federal Republic of Nigeria, including but
              not limited to the Nigerian Consumer Protection Act, the Nigeria Data Protection Act 2023, and applicable
              regulations of the Nigeria Data Protection Commission (NDPC).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">10. Contact</h2>
            <p>
              For legal inquiries:{" "}
              <a className="font-medium text-gray-800 hover:underline" href="mailto:legal@naijarentverify.com">
                legal@naijarentverify.com
              </a>
            </p>
          </section>

          <div className="pt-6 border-t border-gray-200 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/legal/terms" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/data-processing" className="hover:text-gray-900 transition-colors">
              Data Processing Policy
            </Link>
            <Link href="/legal/safety-tips" className="hover:text-gray-900 transition-colors">
              Safety Tips
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalDisclaimerPage;
