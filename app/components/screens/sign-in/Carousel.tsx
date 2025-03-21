'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function RentalManagement() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      name: 'Mrs. Sarah Adebayo',
      role: 'Landlord, Ibeju-Lekki',
      text: 'NaijaRentVerify made finding a tenant for my property so easy. Their screening process is thorough, and I feel confident knowing my property is in good hands.',
      rating: 5,
      image: '/images/onboarding-profile-img.svg',
    },
  ];

  return (
    <div className="font-jakarta  relative bg-green-900 text-white py-16 px-6 sm:px-12 lg:px-24 flex flex-col justify-between  h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src="/images/onboarding-bg.jpeg" alt="Background" layout="fill" objectFit="cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
      <Image src="/images/light-green-logo.svg" alt="Background" width={200} height={50} />
        <h1 className="mt-16 md:text-[50px] text-[30px] font-bold leading-tight">Your Trusted Partner in Hassle-Free Rental Property Management</h1>
        <p className="mt-12 text-lg text-gray-200 italic font-light">
        &#34;At <span className="font-semibold">NaijaRentVerify</span>, we simplify rental property management for landlords and tenants alike. From verified listings to seamless transactions, we ensure every step is transparent, secure, and stress-free.&#34;
        </p>
      </div>

      {/* Testimonial Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mt-12 w-full max-w-lg"
      >
        <div className="bg-[#BBFF3733] backdrop-blur-md p-6 rounded-xl shadow-lg">
          <div>
            <p className="text-[16px] leading-8 italic">{testimonials[currentIndex].text}</p>
            <div className="mt-4 flex items-center gap-4">
              <Image src={testimonials[currentIndex].image} alt="Profile" width={50} height={50} className="rounded-full" />
              <div>
                <p className="font-medium">{testimonials[currentIndex].name}</p>
                <p className="text-[12px] text-gray-300">{testimonials[currentIndex].role}</p>
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
