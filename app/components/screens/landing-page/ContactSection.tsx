import React from "react";
import { Mail, Clock, MapPin, Phone } from "lucide-react";

const ContactSection: React.FC = () => {
  //
  return (
    <section className="sticky bg-white overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-[url('/images/contact-us.jpeg')] bg-cover bg-center z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[#045D23CC] opacity-80 z-10"></div>
      <div className="relative z-10 p-4 sm:p-6 md:p-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white landing-heading-2">
            Get in Touch – We are Here to Help!
          </h2>
          <p className="mt-3 text-base font-light max-w-md text-center mx-auto text-white landing-body">
            We would love to hear from you! Whether you have a question, need
            assistance, or want to learn more about our services, our team is
            here to help.
          </p>
          <div className="flex justify-center gap-2 mt-4 text-white">
            <span className="flex items-center gap-2">
              ✅ Free Consultation
            </span>
            <span className="flex items-center gap-2">
              ✅ 24/7 Online Support
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Operating Hours */}
          <div className="p-6 bg-[#E9F4E7] text-black flex flex-col text-left">
            <Clock className="bg-[#045D23] text-white w-8 h-8 p-2 rounded rounded-md" />
            <h3 className="mt-3 text-lg font-medium text-[#0D3520] landing-heading-2">
              Operating Hours
            </h3>
            <p className="text-sm mt-1 font-light text-[#045D23] landing-body">
              Monday - Friday: <br></br> 8:00 AM - 6:00 PM
            </p>
            <p className="text-[13px]  pt-4 font-medium text-[#045D23]">
              Saturday: 9:00 AM - 4:00 PM
            </p>
          </div>

          {/* Chat to Support */}
          <div className="p-6 bg-[#E9F4E7] text-black flex flex-col text-left">
            <Mail className="bg-[#045D23] text-white w-8 h-8 p-2 rounded rounded-md" />
            <h3 className="mt-3 text-lg font-medium text-[#0D3520] landing-heading-2">
              Chat to support
            </h3>
            <p className="text-sm mt-1 font-light text-[#045D23] landing-body">
              We’re here to help.
            </p>
            <p className="text-sm pt-4 font-medium text-[#045D23] landing-body">
              info@naijarentverify.com
            </p>
          </div>

          {/* Visit Us */}
          <div className="p-6 bg-[#E9F4E7] text-black flex flex-col text-left">
            <MapPin className="bg-[#045D23] text-white w-8 h-8 p-2 rounded rounded-md" />
            <h3 className="mt-3 text-lg font-medium text-[#0D3520] landing-heading-2">
              Visit us
            </h3>
            <p className="text-sm mt-1 font-light text-[#045D23] landing-body">
              Office Address
            </p>
            <p className="text-sm pt-4 font-medium text-[#045D23] landing-body">
              123 Rental Avenue, Lagos State, Nigeria
            </p>
          </div>

          {/* Phone */}
          <div className="p-6 bg-[#E9F4E7] text-black flex flex-col text-left">
            <Phone className="bg-[#045D23] text-white w-8 h-8 p-2 rounded rounded-md" />
            <h3 className="mt-3 text-lg font-medium text-[#0D3520] landing-heading-2">Phone</h3>
            <p className="text-sm mt-1 font-light text-[#045D23] landing-body">
              Mon-Fri from 8am to 5pm.
            </p>
            <p className="text-sm pt-4 font-medium text-[#045D23] landing-body">
              +234 800 123 4567
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
