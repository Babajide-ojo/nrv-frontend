"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  Scrollbar,
} from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Button from "../../shared/buttons/Button";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Create Account & List Your Property",
    description:
      "Get started by creating your account. Sign up with your email and set a secure password. It only takes a few moments. List your properties effortlessly. Add details like address, rental price, and amenities. Your properties are now ready for screening.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/7f3130d43bb5895b921e9f45b7194570_wkqtv8.jpg",
    url: "/sign-in",
  },
  {
    title: "Invite Tenants & Screen With Confidence",
    description:
      "Invite prospective tenants to apply directly through the app. Our messaging system makes communication easy and streamlined. Initiate background checks seamlessly. Access credit histories, criminal records, and eviction histories to make informed decisions.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/91e3f96fd2a036f8ec62326b3d7f02a0_icvez0.jpg",
      url: "/sign-in",
  },
  {
    title: "Manage Everything",
    description:
      "Effortlessly manage properties, tenants, and payments with your personalized dashboard. Get real-time notifications for new applications, messages, and important updates, so you're never missing a beat.",
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1741931650/7f3130d43bb5895b921e9f45b7194570_wkqtv8.jpg",
      url: "/sign-in",
  },
];

const HowItWorks = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();

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
            <Button
              variant="lemonPrimary"
              className="text-[16px] w-64"
              size="large"
              onClick={() => router.push('/sign-up')}
            >
              Sign Up to Get Started
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
              slidesPerView: 2, // 3 slides per view on larger screens
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
                <div className="absolute inset-0 flex justify-end  p-8 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  <div>
                    {" "}
                    <h3 className="text-2xl font-semibold my-4">
                      {slide.title}
                    </h3>
                    <p className="text-[16px] mt-2 leading-8 font-light">
                      {slide.description}
                    </p>
                  </div>
                  <div
                    className="flex items-end cursor-pointer"
                    onClick={() => {
                      router.push(slide.url);
                    }}
                  >
                    <svg
                      width="61"
                      height="61"
                      viewBox="0 0 61 61"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.82373"
                        width="60"
                        height="60"
                        rx="30"
                        fill="#F2F2F2"
                      />
                      <rect
                        x="0.5"
                        y="0.82373"
                        width="60"
                        height="60"
                        rx="30"
                        fill="#F2F2F2"
                      />
                      <rect
                        x="0.5"
                        y="0.82373"
                        width="60"
                        height="60"
                        rx="30"
                        fill="#F2F2F2"
                      />
                      <path
                        d="M38.7337 26.99L36.2631 36.2106C36.1857 36.4993 35.9968 36.7455 35.738 36.8949C35.4792 37.0444 35.1715 37.0849 34.8828 37.0075C34.5941 36.9302 34.348 36.7413 34.1986 36.4824C34.0491 36.2236 34.0086 35.916 34.086 35.6273L35.8545 29.0323L23.9196 35.9229C23.6612 36.0721 23.3541 36.1125 23.0659 36.0353C22.7777 35.9581 22.532 35.7695 22.3828 35.5111C22.2336 35.2527 22.1932 34.9457 22.2704 34.6575C22.3476 34.3693 22.5362 34.1235 22.7946 33.9744L34.7295 27.0837L28.134 25.3144C27.8453 25.2371 27.5991 25.0482 27.4497 24.7893C27.3003 24.5305 27.2598 24.2229 27.3371 23.9342C27.4145 23.6455 27.6034 23.3993 27.8622 23.2499C28.121 23.1005 28.4286 23.06 28.7173 23.1373L37.938 25.608C38.0812 25.6462 38.2154 25.7123 38.333 25.8025C38.4505 25.8927 38.5491 26.0052 38.623 26.1336C38.697 26.262 38.7448 26.4038 38.7638 26.5508C38.7828 26.6977 38.7726 26.847 38.7337 26.99Z"
                        fill="#03442C"
                      />
                    </svg>
                  </div>
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
