"use client";

import React from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

const PrivacyPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-6">Privacy Notice</h1>
        <div className="prose max-w-none text-gray-600 space-y-6">
          <p>
            NaijaRentVerify (“we”, “us”, “or “our”) is committed to protecting your privacy and personal data.
            This Privacy Notice explains how we collect, use, store, and protect your information in connection
            with your use of the NaijaRentVerify platform (“Platform”). We may update this Privacy Notice from time
            to time to reflect changes in our practices or legal requirements.
          </p>

          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">1. Introduction</h2>
            <p>
              This Privacy Notice explains how NaijaRentVerify collects and processes personal data when you
              access our website or use our services. It also describes your privacy rights and how the law
              protects you.
            </p>
          </section>

          {/* 2. Data Controller */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">2. Data Controller</h2>
            <p>
              NaijaRentVerify acts as the data controller for personal data collected through this Platform.
              For questions regarding your data, contact our Data Protection Officer at{" "}
              <span className="font-medium text-gray-800">dpo@naijarentverify.com</span>.
            </p>
          </section>

          {/* 3. Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">3. Information We Collect</h2>
            <p>
              We collect personal data that you provide to us and data that is collected automatically when you
              interact with the Platform.
            </p>

            <h3 className="text-lg font-semibold text-[#03442C] mt-4 mb-2">3.1 Information You Provide</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Account Information:</strong> Full name, email address, phone number, role (landlord/tenant), and password.
              </li>
              <li>
                <strong>Verification Data:</strong> National Identification Number (NIN), Bank Verification Number (BVN), passport photographs, employment details, and previous rental history.
              </li>
              <li>
                <strong>Property Information:</strong> Property addresses, description, images, pricing, and amenities.
              </li>
              <li>
                <strong>Payment Information:</strong> Transaction records, payment amounts, and payment method details.
              </li>
              <li>
                <strong>Communications:</strong> Messages exchanged between landlords and tenants through the Platform.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-[#03442C] mt-4 mb-2">3.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device information (browser type, operating system, device identifiers).</li>
              <li>IP address and approximate geographic location.</li>
              <li>Usage data (pages visited, features used, timestamps).</li>
              <li>Cookies and similar tracking technologies.</li>
            </ul>
          </section>

          {/* 4. Legal Basis for Processing */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">4. Legal Basis for Processing</h2>
            <p>
              We process your personal data based on the following legal grounds:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Consent:</strong> You have given explicit consent for processing (e.g., during registration).
              </li>
              <li>
                <strong>Contractual Necessity:</strong> Processing is necessary to fulfil our service agreements with you.
              </li>
              <li>
                <strong>Legal Obligation:</strong> Processing is required to comply with Nigerian law.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests (where permitted by law).
              </li>
            </ul>
          </section>

          {/* 5. How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">5. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and manage your account.</li>
              <li>To verify tenant information and generate reports.</li>
              <li>To facilitate property listings and rental transactions.</li>
              <li>To process payments and maintain financial records.</li>
              <li>To enable communication between landlords and tenants.</li>
              <li>To send service-related notifications and updates.</li>
              <li>To detect, prevent, and address fraud, security issues, and technical problems.</li>
              <li>To improve and optimize the Platform experience.</li>
              <li>To comply with legal obligations and regulatory requirements.</li>
            </ul>
          </section>

          {/* 6. Data Sharing and Disclosure */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">6. Data Sharing and Disclosure</h2>
            <p>
              We may share your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Verification Partners:</strong> Third-party identity and background check services that help us perform verification.
              </li>
              <li>
                <strong>Service Providers:</strong> Cloud hosting, payment processing, and communication service providers.
              </li>
              <li>
                <strong>Law Enforcement:</strong> Where required by law, court order, or a lawful request.
              </li>
              <li>
                <strong>Other Users:</strong> Information may be shared between landlords and tenants where necessary to enable rental arrangements.
              </li>
            </ul>
            <p>
              We aim to share the minimum necessary data for the relevant purposes.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">7. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Account Data:</strong> Retained for the duration of your account and up to 3 years after deletion (unless required by law).
              </li>
              <li>
                <strong>Verification Records:</strong> Retained for 7 years to comply with regulatory requirements.
              </li>
              <li>
                <strong>Transaction Records:</strong> Retained for 6 years for financial reporting and tax purposes.
              </li>
              <li>
                <strong>Communication Data:</strong> Retained for 2 years from the date of the last message.
              </li>
            </ul>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">8. Your Rights</h2>
            <p>
              Under the NDPR, NDPA, and GDPR (where applicable), you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your data, subject to legal retention obligations.</li>
              <li><strong>Restriction:</strong> Request that we limit the processing of your data.</li>
              <li><strong>Portability:</strong> Request transfer of your data in a structured, commonly readable format.</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
              <li><strong>Withdrawal of Consent:</strong> Withdraw consent at any time without affecting lawful prior processing.</li>
            </ul>
            <p>
              To exercise these rights, contact us at <span className="font-medium text-gray-800">dpo@naijarentverify.com</span>.
              We will respond within 30 days.
            </p>
          </section>

          {/* 9. Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">9. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encryption of data in transit (TLS/SSL) and at rest.</li>
              <li>Access controls and authentication mechanisms.</li>
              <li>Regular security audits and vulnerability assessments.</li>
              <li>Employee training on data protection practices.</li>
              <li>Secure data storage with reputable cloud service providers.</li>
            </ul>
          </section>

          {/* 10. International Data Transfers */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">10. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries outside Nigeria. Where such transfers occur,
              we ensure adequate data protection through standard contractual clauses, adequacy decisions, or other legally
              recognized transfer mechanisms as required by Nigerian data protection laws and applicable international frameworks.
            </p>
          </section>

          {/* 11. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">11. Cookies</h2>
            <p>
              We use essential cookies for Platform functionality and optional analytics cookies to improve our services.
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          {/* 12. Children */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">12. Children</h2>
            <p>
              The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal data
              from minors.
            </p>
          </section>

          {/* 13. Changes to This Policy */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent
              notice on the Platform.
            </p>
          </section>

          {/* 14. Complaints */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">14. Complaints</h2>
            <p>
              If you believe your data protection rights have been violated, you may lodge a complaint with the Nigeria Data Protection
              Commission (NDPC) at <span className="font-medium text-gray-800">ndpc.gov.ng</span>, or where applicable, with the relevant
              supervisory authority under the GDPR.
            </p>
          </section>

          {/* 15. Contact Us */}
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">15. Contact Us</h2>
            <p>
              Data Protection Officer: <span className="font-medium text-gray-800">dpo@naijarentverify.com</span>
              <br />
              General Inquiries: <span className="font-medium text-gray-800">support@naijarentverify.com</span>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Last updated: 28 February 2026</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
