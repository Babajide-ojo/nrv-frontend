"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function RentalManagement() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      name: "Mrs. Sarah Adebayo",
      role: "Landlord, Ibeju-Lekki",
      text: "NaijaRentVerify made finding a tenant for my property so easy. Their screening process is thorough, and I feel confident knowing my property is in good hands.",
      rating: 5,
      image: "/images/onboarding-profile-img.svg",
    },
  ];

  return (
    <div className="font-jakarta relative bg-green-900 text-white py-10 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-24 flex flex-col justify-between min-h-screen min-h-[100dvh] lg:h-screen overflow-y-auto overflow-x-hidden hide-scrollbar w-full min-w-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/images/onboarding-bg.jpeg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full min-w-0 max-w-3xl">
        <Image
          src="/images/nrv-logo-latest.jpg"
          alt="NaijaRentVerify"
          width={200}
          height={50}
          className="h-9 sm:h-11 lg:h-12 w-auto max-w-[min(240px,85vw)] object-contain"
        />
        <h1 className="mt-8 sm:mt-12 lg:mt-16 text-[clamp(1.375rem,4.5vw,3.125rem)] md:text-[50px] font-bold leading-[1.15] sm:leading-tight">
          Your Trusted Partner in Hassle-Free Rental Property Management
        </h1>
        <p className="mt-8 sm:mt-10 lg:mt-12 text-base sm:text-lg text-gray-200 italic font-light">
          &#34;At <span className="font-semibold">NaijaRentVerify</span>, we
          simplify rental property management for landlords and tenants alike.
          From genuine listings to seamless transactions, we ensure every step
          is transparent, secure, and stress-free.&#34;
        </p>
      </div>

      {/* Testimonial Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mt-8 sm:mt-12 w-full min-w-0 max-w-lg"
      >
        <div className="bg-[#BBFF3733] backdrop-blur-md p-6 rounded-xl shadow-lg">
          <div>
            <p className="text-[15px] sm:text-[16px] leading-7 sm:leading-8 italic break-words">
              {testimonials[currentIndex].text}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Image
                src={testimonials[currentIndex].image}
                alt="Profile"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{testimonials[currentIndex].name}</p>
                <p className="text-[12px] text-gray-300">
                  {testimonials[currentIndex].role}
                </p>
                <div className="flex mt-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
