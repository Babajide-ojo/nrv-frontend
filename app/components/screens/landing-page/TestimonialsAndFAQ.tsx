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
      <section className="h-[400px] bg-[#E6F0E9] m-16 w-4/5 flex justify-center p-8 rounded-lg mx-auto">
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
        <div className="relative w-full max-w-2xl p-6 bg-white shadow-md rounded-lg h-96 flex items-end">
          <div>
            <p className="text-[20px] font-light text-[#03442C] leading-8 m-4">
            &rdquo;As a tenant, I appreciate the transparency{" "}
              <strong>NaijaRentVerify</strong> provides. The application process
              was smooth, and the screening report gave me confidence in my
              landlord&rdquo;s selection process.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://s3-alpha-sig.figma.com/img/ddb3/b48c/134527f0bdfe0af081ee3998bf2c2660?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WiUgJRLmKBZtqMdo3q5MRBxGUONHbhaWwQpNMTl3erm-PksYHI-UJEQI0cGdj1l55j3ajzaB~tNgZoImCyIvoGS~MTeY3cwIv4tIAWHRQ4E8CXtDls9AqVOAdX4DAXRPooej3eeLwWO9H5tIR98iShRZ9X8dLwvTB1CndptYLctYzLcQKV-8~bnP1qtu-7YQ5NYq9UfaDPXt2WhUXwwKFbrGK~-ZWL76GbOW~AGxma0sRTLzBIFuZaNrqbIKb86iX06PSb8hGEXnGiLMVOZ~wVkQpTf7sKy9pkBNb5AX5iipxVED9PQe1PFxS9Kvx0zNzAMAhiACCVB6eUNmjAgW4w__"
                alt="Emily Turner"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Emily Turner</p>
                <p className="text-sm text-gray-500">
                  Landlord, Lagos, Nigeria
                </p>
              </div>
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
        <section className="text-white p-10 rounded-lg flex gap-3 w-4/5 mx-auto">
          <div className="w-1/2 flex items-center">
            <div>
              <div className="mb-6">
                <span className="my-4 text-[#0D3520] font-normal rounded-full border border-[#0D3520] p-2 px-8 bg-[#E6F0E9]">
                  FAQs
                </span>
                <h2 className="my-8 text-3xl font-bold">
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
          <div className="w-1/2 mt-6 flex justify-center">
            <div className="text-black rounded-lg">
              <img
                src="https://s3-alpha-sig.figma.com/img/7d71/9111/75ef4ba531bf6a9aa8778a8e9e6834f7?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=byPIXwQQXoJZ9oXROPkq~Rgu0xeJeRYqP0B0WK4YxoniCh8dNsUjbLy~~WIP4s9Dsa6BNbq96Mx02JUwXnDO6-9mPEWaZpvaqx-wpxxkOYnEL8G4KVva8PxmafFaJNLqbvGcBjO8JKJlKy8mCxgAGNODCdAgiT7TOhRt4h5ee7iAW~MtPfSI7R-RpHFeKfVpHjEp5cw8TSu70rDDtNqABEambcq2LPc~b4Yj8c9Wvngk8pe5KR5ztkR75O2Log~scbeffMHZXzi-n-oqlsRafH1SaR17O-h~YdyPp5bhoPSwsg6EFNFXQrBlEhV0tzsTryWNjDxeHXLHefS3OnzufA__"
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
