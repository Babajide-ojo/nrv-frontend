"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y, Scrollbar } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Button from "../../shared/buttons/Button";
import { useRef } from "react";

const slides = [
  {
    title: "Create Account & List Your Property",
    description:
      "Get started by creating your account. Sign up with your email and set a secure password. It only takes a few moments. List your properties effortlessly. Add details like address, rental price, and amenities. Your properties are now ready for screening.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/7f3130d43bb5895b921e9f45b7194570_wkqtv8.jpg",
  },
  {
    title: "Invite Tenants & Screen With Confidence",
    description:
      "Invite prospective tenants to apply directly through the app. Our messaging system makes communication easy and streamlined. Initiate background checks seamlessly. Access credit histories, criminal records, and eviction histories to make informed decisions.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/91e3f96fd2a036f8ec62326b3d7f02a0_icvez0.jpg",
  },
  {
    title: "Manage Everything",
    description:
      "Effortlessly manage properties, tenants, and payments with your personalized dashboard. Get real-time notifications for new applications, messages, and important updates, so you're never missing a beat.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/7f3130d43bb5895b921e9f45b7194570_wkqtv8.jpg",
  },
  {
    title: "Create Account & List Your Property",
    description:
      "Get started by creating your account. Sign up with your email and set a secure password. It only takes a few moments. List your properties effortlessly. Add details like address, rental price, and amenities. Your properties are now ready for screening.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/7f3130d43bb5895b921e9f45b7194570_wkqtv8.jpg",
  },
  {
    title: "Invite Tenants & Screen With Confidence",
    description:
      "Invite prospective tenants to apply directly through the app. Our messaging system makes communication easy and streamlined. Initiate background checks seamlessly. Access credit histories, criminal records, and eviction histories to make informed decisions.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/91e3f96fd2a036f8ec62326b3d7f02a0_icvez0.jpg",
  },
  {
    title: "Manage Everything",
    description:
      "Effortlessly manage properties, tenants, and payments with your personalized dashboard. Get real-time notifications for new applications, messages, and important updates, so you're never missing a beat.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/7f3130d43bb5895b921e9f45b7194570_wkqtv8.jpg",
  },
];

const HowItWorks = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      const { clientX } = e;
      const screenWidth = window.innerWidth;
      const threshold = 100; // Sensitivity margin

      if (clientX < threshold) {
        swiper.slidePrev();
      } else if (clientX > screenWidth - threshold) {
        swiper.slideNext();
      }
    }
  };

  return (
    <section className="bg-[#E6F0E9] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#0D3520] font-normal rounded-full border border-[#0D3520] p-2">
            / HOW IT WORKS
          </span>
        </div>
        <div className="md:flex md:justify-between block">
          <div>
            <h2 className="md:text-3xl text-xl md:text-4xl md:font-bold font-medium text-green-800">
              Here’s How NaijaRentVerify Works:
            </h2>
            <div className="md:text-3xl text-xl md:font-bold font-medium text-green-800 mt-4">
              Simple, Transparent, and Efficient.
            </div>
          </div>
          <div className="items-end flex md:mt-0 mt-8">
            <Button variant="lemonPrimary" className="text-[16px] w-64" size="large">
              Explore Our Services
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10" onMouseMove={handleMouseMove}>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={20}
          slidesPerView={1} // Default to 1 slide on mobile
          breakpoints={{
            640: {
              slidesPerView: 1, // 1 slide per view on small screens
            },
            768: {
              slidesPerView: 2, // 2 slides per view on medium screens
            },
            1024: {
              slidesPerView: 3, // 3 slides per view on larger screens
            },
          }}
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 seconds
          loop={true} // Enable continuous looping
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative rounded-lg overflow-hidden bg-black text-white">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[370px] object-cover opacity-80"
                />
                <div className="absolute inset-0 flex flex-col justify-end  p-8 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  <h3 className="text-2xl font-semibold my-4">{slide.title}</h3>
                  <p className="text-[16px] mt-2 leading-8 font-light">{slide.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HowItWorks;
