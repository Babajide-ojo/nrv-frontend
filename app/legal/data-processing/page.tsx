"use client";

import React from "react";
import Link from "next/link";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

const DataProcessingPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-2">Data Processing Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: 28 February 2026</p>

        <div className="prose max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">1. Purpose</h2>
            <p>
              This Data Processing Policy outlines how NaijaRentVerify processes personal data in its capacity as both
              a data controller and data processor. This policy is aligned with the Nigeria Data Protection Regulation
              (NDPR) 2019, the Nigeria Data Protection Act (NDPA) 2023, and the EU General Data Protection Regulation
              (GDPR) 2016/679.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">2. Scope of Processing</h2>
            <h3 className="text-lg font-semibold text-[#03442C] mt-4 mb-2">2.1 Categories of Data Subjects</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Landlords and property managers</li>
              <li>Tenants and prospective tenants</li>
              <li>Property agents and listers</li>
              <li>Platform visitors</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#03442C] mt-4 mb-2">2.2 Categories of Personal Data Processed</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Identity Data:</strong> Full name, date of birth, NIN, BVN, passport photographs.
              </li>
              <li>
                <strong>Contact Data:</strong> Email address, phone number, residential address.
              </li>
              <li>
                <strong>Financial Data:</strong> Payment records, transaction history, rent amounts.
              </li>
              <li>
                <strong>Property Data:</strong> Property addresses, descriptions, images, pricing.
              </li>
              <li>
                <strong>Verification Data:</strong> Background check results, employment verification, rental history records.
              </li>
              <li>
                <strong>Technical Data:</strong> IP addresses, device information, browser data, access logs.
              </li>
              <li>
                <strong>Communication Data:</strong> In-platform messages, support tickets, email correspondence.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">3. Processing Principles</h2>
            <p>
              All data processing activities adhere to the following principles as mandated by both the NDPR and GDPR:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Lawfulness, Fairness, and Transparency:</strong> Data is processed lawfully, fairly, and in a
                transparent manner.
              </li>
              <li>
                <strong>Purpose Limitation:</strong> Data is collected for specified, explicit, and legitimate purposes only.
              </li>
              <li>
                <strong>Data Minimization:</strong> Only data that is necessary for the stated purpose is collected.
              </li>
              <li>
                <strong>Accuracy:</strong> Personal data is kept accurate and up to date.
              </li>
              <li>
                <strong>Storage Limitation:</strong> Data is retained only for as long as necessary for the purpose of processing.
              </li>
              <li>
                <strong>Integrity and Confidentiality:</strong> Data is processed with appropriate security measures.
              </li>
              <li>
                <strong>Accountability:</strong> We are responsible for and able to demonstrate compliance with these principles.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">4. Sub-Processors</h2>
            <p>We engage the following categories of sub-processors:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cloud Infrastructure: For secure data hosting and storage.</li>
              <li>Identity Verification Providers: For NIN/BVN validation and background checks.</li>
              <li>Payment Processors: For handling financial transactions securely.</li>
              <li>Communication Services: For email delivery and in-app messaging.</li>
              <li>Analytics Providers: For aggregated, anonymized usage analysis.</li>
            </ul>
            <p>
              All sub-processors are bound by data processing agreements that require them to implement appropriate
              technical and organizational measures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">5. Data Protection Impact Assessment (DPIA)</h2>
            <p>
              We conduct DPIAs for processing activities that are likely to result in high risk to data subjects,
              including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Large-scale processing of identity verification data (NIN, BVN).</li>
              <li>Automated decision-making related to tenant verification outcomes.</li>
              <li>Processing of financial data for rent payment tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">6. Cross-Border Data Transfers</h2>
            <p>
              Where personal data is transferred outside Nigeria or the European Economic Area (EEA), we ensure
              adequate protection through:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>EU Standard Contractual Clauses (SCCs) approved by the European Commission.</li>
              <li>Adequacy decisions recognized under the NDPR or GDPR.</li>
              <li>Binding Corporate Rules where applicable.</li>
              <li>Explicit consent of the data subject for specific transfers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">7. Data Breach Procedures</h2>
            <p>In the event of a personal data breach:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We will assess the nature and severity of the breach within 24 hours of discovery.</li>
              <li>
                The Nigeria Data Protection Commission (NDPC) and relevant supervisory authorities will be notified
                within 72 hours where required.
              </li>
              <li>
                Affected data subjects will be notified without undue delay if the breach is likely to result in high
                risk to their rights and freedoms.
              </li>
              <li>
                All breaches are documented with details of the breach, its effects, and remedial actions taken.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">8. Data Subject Rights</h2>
            <p>
              We facilitate the exercise of data subject rights as outlined in our{" "}
              <Link className="font-medium text-gray-800 hover:underline" href="/legal/privacy">
                Privacy Policy
              </Link>
              . All requests are processed within 30 days and verified through our identity confirmation process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">9. Sensitive Data Handling</h2>
            <p>
              Sensitive personal data, including NIN, BVN, and financial information, is subject to enhanced security
              measures:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encrypted at rest using AES-256 encryption.</li>
              <li>Encrypted in transit using TLS 1.3.</li>
              <li>Access restricted to authorized personnel on a need-to-know basis.</li>
              <li>Audit trails maintained for all access and modifications.</li>
              <li>Regular penetration testing and vulnerability assessments.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">10. Contact</h2>
            <p>
              Data Protection Officer:{" "}
              <a className="font-medium text-gray-800 hover:underline" href="mailto:dpo@naijarentverify.com">
                dpo@naijarentverify.com
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
            <Link href="/legal/disclaimer" className="hover:text-gray-900 transition-colors">
              Legal Disclaimer
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

export default DataProcessingPage;
