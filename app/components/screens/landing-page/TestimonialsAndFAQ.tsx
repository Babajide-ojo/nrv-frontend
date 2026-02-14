import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="text-white p-4 rounded-lg"
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <summary className="font-semibold cursor-pointer flex gap-3 items-center">
        <span className="text-lg font-bold">{isOpen ? "−" : "+"}</span>
        {question}
      </summary>
      {isOpen && <p className="mt-2 font-light text-sm text-white">{answer}</p>}
    </details>
  );
};

const TestimonialsAndFAQs: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Testimonials Section */}
      <section className="md:h-[400px] bg-[#E6F0E9] m-16 md:w-4/5 md:flex justify-center p-8 rounded-lg mx-auto">
        <div className="text-start mx-auto pt-16">
          <span className="text-[#0D3520] font-normal rounded-full border border-[#0D3520] p-2">
             Testimonials
          </span>
          <h2 className="my-8 text-4xl font-medium text-[#03442C]">
            Why They Love Us
          </h2>
          <p className="mt-2 text-[18px] font-light text-[#03442C]">
            Discover the voices of our satisfied clients who have experienced
            firsthand the exceptional service we provide in helping them find
            their dream homes.
          </p>
        </div>
        <div className="relative w-full max-w-2xl p-6 bg-white shadow-md rounded-lg h-96 flex items-end md:m-0 mt-12">
          <div>
            <p className="text-[20px] font-light text-[#03442C] leading-8 m-4">
              &rdquo;As a tenant, I appreciate the transparency{" "}
              <strong>NaijaRentVerify</strong> provides. The application process
              was smooth, and the screening report gave me confidence in my
              landlord&rdquo;s selection process.&rdquo;
            </p>
            <div className="mt-4">
              <p className="font-semibold">Emily Turner</p>
              <p className="text-sm text-gray-500">
                Landlord, Lagos, Nigeria
              </p>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button className="p-2 border rounded-full bg-gray-200">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 border rounded-full bg-gray-200">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="bg-[#03442C]">
        <section className="text-white md:p-10 p-4 rounded-lg md:flex gap-3 max-w-[1400px] mx-auto">
          <div className="md:w-1/2 w-full flex items-center">
            <div>
              <div className="mb-6">
                <span className="my-4 text-[#0D3520] font-normal rounded-full border border-[#0D3520] p-2 px-8 bg-[#E6F0E9]">
                   FAQs
                </span>
                <h2 className="my-8 md:text-3xl text-xl font-bold">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                <FAQItem
                  question="How Does NaijaRentVerify Work For Landlords?"
                  answer="Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
                />
                <FAQItem
                  question="Is NaijaRentVerify Available For Use In All Locations Within Nigeria?"
                  answer="Yes, NaijaRentVerify is available nationwide."
                />
                <FAQItem
                  question="What Information Is Included In The Tenant Screening Report?"
                  answer="The report includes identity verification, credit checks, and rental history."
                />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full mt-6 flex justify-center">
            <div className="text-black rounded-lg">
              <img
                src="/images/faq.svg"
                alt="Download App"
                className="rounded-lg w-[470px] h-[470px]"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestimonialsAndFAQs;
