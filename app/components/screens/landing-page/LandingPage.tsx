"use client";

import GroupPeople from "../../../../public/images/group-people.png";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa6";
import Button from "../../shared/buttons/Button";
import HoverableCard from "@/app/components/shared/cards/HoverableCard";
import { CardData } from "@/helpers/data";
import GuideCard from "../../shared/cards/GuideCard";
import { useRouter } from "next/navigation";
import StatsIcon from "../../icons/StatsIcon";
import FeaturedProperties from "../home/FeaturedProperties";
import HowItWorks from "../home/HowItWorks";
import TestimonialsAndFAQs from "./TestimonialsAndFAQ";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
// import ShortLets from "./ShortletDisplay";

//import heroBgImage from "../../../../public/images/nrv-hero-section-img.jpeg";

interface Feature {
  imageUrl: string;
  title: string;
  description: string;
}

interface Testimonials {
  imageUrl: string;
  title: string;
}

const FeatureCard: React.FC<Feature> = ({ imageUrl, title, description }) => {
  const router = useRouter();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <div className="bg-white hover:bg-[#E9F4E7] p-4 text-nrvPrimaryGreen h-60">
          <h2 className="mt-4 text-[20px] font-medium h-12">{title}</h2>
          <p className="mt-4 text-[14px] font-light pt-4 leading-8">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const WhyChooseUsCard: React.FC<Feature> = ({
  imageUrl,
  title,
  description,
}) => {
  return (
    <div
      style={{ width: "100%", height: "300px" }}
      className="bg-[#E9F4E7] hover:bg-[#E9F4E7] p-4 text-nrvPrimaryGreen rounded-2xl hover:bg-[#BBFF37E5]"
    >
      <div className="">
        <div className="flex justify-start py-4">
          <img src={imageUrl} alt="photo" className="w-12 h-12" />
        </div>
        <h2 className="mt-4 text-[20px] font-medium h-8">{title}</h2>
        <p className="mt-4 text-[14px] font-light pt-4 leading-8">
          {description}
        </p>
      </div>
    </div>
  );
};

const CardsList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {CardData.map((card, index) => (
        <HoverableCard
          key={index}
          imageLink={card.imageLink}
          title={card.title}
          content={card.content}
        />
      ))}
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features: Feature[] = [
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/lu7xulisznbrr8bhns4h.png",
      title: "Tenant Screening & Background Checks",
      description:
        "Access to background checks and tenant screening reports to assist in thorough tenant evaluations.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321116/tazn6fia8p6phjao8kkl.png",
      title: "Property Management Features",
      description:
        "Tools for effective property listing management, rental payment handling, and occupancy tracking.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321116/jl1kpsnwhoguzqi1cpu9.png",
      title: "Rent Collection & Financial Management",
      description:
        "Automated rent collection and timely payments. Detailed financial reports for better property management.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321116/y7wioy8wv350nw7xokfy.png",
      title: "Application Management",
      description:
        "Efficient tools to manage tenant applications, review submissions, and track application statuses.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/cxs0ybb8jty0n67p7c5g.png",
      title: "Verified Listing",
      description:
        "Browse 100% verified properties with no hidden surprises. Transparent pricing and detailed property descriptions.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/pqi5czr38jzuhwnqonhd.png",
      title: "Maintenence Request",
      description:
        "Easy-to-use platform for reporting and tracking maintenance issues. Hassle-free maintenance services handled by trusted professionals",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/pqi5czr38jzuhwnqonhd.png",
      title: "Rent Payment Assistance",
      description:
        "Safe and secure payment options for rent and deposits. No more middlemen or fraudulent deals",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/oztkr7otv3sivyxoypfs.png",
      title: "Relocation Support",
      description:
        "Assistance with finding and moving into your new home. From viewing to moving in, we’ve got you covered",
    },
  ];

  return (
    <div className="sticky bg-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://res.cloudinary.com/dzv98o7ds/image/upload/v1741878901/nithgfm5chcnnwtqd1bl.jpg')] bg-cover bg-center z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-nrvPrimaryGreen opacity-80 z-10"></div>

      <div className="relative z-10 p-2 md:p-12">
        <div className="p-4">
          <Button
            variant="transparentBg"
            className="text-[16px] bg-transparent w-48"
            size="large"
          >
            Services
          </Button>
        </div>
        <div className="flex p-4 flex-col sm:flex-row">
          <p className="text-white font-medium text-xl sm:text-2xl mt-2 sm:mt-0 sm:w-3/5">
            Whether you’re a landlord looking to maximize your returns or a{" "}
            <br /> tenant searching for a verified home, NaijaRentVerify is here
            to make <br /> renting easier, safer, and more efficient.
          </p>
          <div className="w-full sm:w-2/5 flex sm:justify-end items-center sm:items-end mt-4 sm:mt-0">
            {/* <Button
              variant="lemonPrimary"
              className="text-[16px] w-64"
              size="large"
            >
              Explore Our Services
            </Button> */}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-2 sm:p-4 mt-6 sm:mt-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  return (
    <div className="bg-white md:p-12 p-4 sm:p-6 mx-auto mt-4 w-full max-w-[1400px] px-4 sm:px-6">
      <div className="flex flex-col md:flex-row gap-6 md:gap-0">
        <div className="md:w-5/12 w-full">
          <div className="md:w-4/5">
            <h1 className="text-[#1D2227] font-medium text-lg sm:text-[20px] md:text-[24px]">
              Who We Are ?
            </h1>
            <div className="font-light text-[#646D75] text-[14px] md:text-[16px] leading-7 md:leading-8 mt-1">
              <span className="font-medium">NaijaRentVerify</span> was born out
              of a need for trust and transparency in Nigeria’s rental property
              market. We understand the challenges faced by both property owners
              and tenants—fraudulent listings, delayed payments, and lack of
              reliable property management services.
            </div>
          </div>

          <div className="md:w-4/5 pt-6 sm:pt-8 md:pt-12">
            <h1 className="text-[#1D2227] font-medium text-lg sm:text-[20px] md:text-[24px]">
              Our Mission ?
            </h1>
            <div className="font-light text-[#646D75] text-[14px] md:text-[16px] leading-7 md:leading-8 mt-1">
              Our mission is simple: to create a seamless, secure, and
              stress-free rental experience for everyone. Leveraging
              cutting-edge technology and a customer-first approach, we provide
              end-to-end property management solutions that you can trust.
            </div>
          </div>
        </div>

        <div className="md:w-7/12 w-full pt-2 md:pt-0">
          <div className="text-[#03442C] text-base sm:text-lg md:text-[30px] md:pb-8 leading-snug">
            Whether you are a landlord looking to maximize your returns or a
            tenant searching for a verified home, NaijaRentVerify is here to
            make renting easier, safer, and more efficient.
          </div>
          <Button
            variant="darkPrimary"
            className="text-sm sm:text-[16px] md:my-0 my-6 w-full sm:w-auto"
            size="large"
          >
            Explore Our Services
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-12 mt-10 sm:mt-16 mb-4">
        <div className="w-full md:w-7/12">
          <Image
            alt="pto"
            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1741785309/Background_1_brbq1j.png"
            width={1020}
            height={880}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-5/12">
          <Image
            alt="pto"
            src="/images/nigeria-home.jpeg"
            width={1020}
            height={880}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <hr className="my-8 md:my-12" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 md:mt-16 text-center">
        <div className="mb-2 md:mb-4">
          <div className="font-medium text-[#1D2227] text-2xl sm:text-[32px] md:text-[40px]">5,673+</div>
          <div className="font-light text-[#646D75] text-xs sm:text-sm">Onboarded Landlords</div>
        </div>
        <div className="mb-2 md:mb-4">
          <div className="font-medium text-[#1D2227] text-2xl sm:text-[32px] md:text-[40px]">2,179+</div>
          <div className="font-light text-[#646D75] text-xs sm:text-sm">Satisfied Reviews</div>
        </div>
        <div className="mb-2 md:mb-4">
          <div className="font-medium text-[#1D2227] text-2xl sm:text-[32px] md:text-[40px]">10+</div>
          <div className="font-light text-[#646D75] text-xs sm:text-sm">Years Of Experience</div>
        </div>
        <div>
          <div className="font-medium text-[#1D2227] text-2xl sm:text-[32px] md:text-[40px]">200k+</div>
          <div className="font-light text-[#646D75] text-xs sm:text-sm">Active Users</div>
        </div>
      </div>
    </div>
  );
};

const WhyChooseUs: React.FC = () => {
  const features: Feature[] = [
    {
      imageUrl:
        "/icons/TenantScreening.svg",
      title: "Tenant Screening",
      description:
        "Efficiently screen potential tenants by accessing comprehensive background checks, credit history, and rental application details.",
    },
    {
      imageUrl:
        "/icons/PropertyListing.svg",
      title: "Property Listing",
      description:
        "Easily manage and view detailed property listings, including essential information such as address, rental price, and availability status.",
    },
    {
      imageUrl:
        "/icons/SecureRentPayment.svg",
      title: "Secure Rent Payment",
      description:
        "Seamlessly process rent payments within the app using a secure payment gateway, providing convenience for both landlords & tenants.",
    },
    {
      imageUrl:
        "/icons/IntuitiveApplication.svg",
      title: "Intuitive Application",
      description:
        "Simplify the tenant application process with a user-friendly interface, guiding applicants through each step for a hassle-free experience.",
    },
    {
      imageUrl:
        "/icons/Dashboard.svg",
      title: "User Friendly Dashboard",
      description:
        "Access dashboard that provides a quick overview of property listings, notifications, and account settings for efficient management.",
    },
    {
      imageUrl:
        "/icons/Communication.svg",
      title: "In App Communication",
      description:
        "Enable smooth landlord-tenant communication with an in-app messaging system for quick and efficient information exchange.",
    },
    {
      imageUrl:
        "/icons/notification.svg",
      title: "Instant Notification",
      description:
        "Get instant notifications regarding new tenant applications, updates on property status, and important messages from applicants.",
    },
    {
      imageUrl:
        "/icons/Support.svg",
      title: "24/7 Support",
      description:
        "Dedicated support team to assist with your rental journey From viewing to moving in, we got you covered.",
    },
  ];

  return (
    <div className="relative bg-white overflow-x-hidden">
      <div className="p-4 sm:p-6 md:p-12">
        <div className="p-2 sm:p-4">
          <Button variant="primary" className="text-sm sm:text-[16px] w-full sm:w-48" size="large">
            Why Choose Us
          </Button>
        </div>
        <div className="flex p-2 sm:p-4">
          <p className="text-nrvPrimaryGreen font-medium text-xl sm:text-2xl md:text-3xl mt-2 w-full leading-snug">
            NaijaRentVerify is a leading rental property management company dedicated to making property rental
            seamless, secure, and stress-free.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4 mt-6 sm:mt-8">
          {features.map((feature, index) => (
            <WhyChooseUsCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="font-jakarta m-0 md:m-8 overflow-x-hidden">
      <div
        id="home"
        style={{ backgroundColor: "#ffffff" }}
        className="md:relative flex flex-col justify-end min-h-[520px] sm:min-h-[600px] md:h-[700px]"
      >
        <div className="flex flex-col justify-end absolute top-0 left-0 w-full h-full bg-[url('https://res.cloudinary.com/dzv98o7ds/image/upload/v1741768679/nrv-hero-section-img_ttbvxz.jpg')] bg-cover bg-center"></div>
        <div className="flex flex-col justify-end absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#03442C] to-transparent opacity-90"></div>
        <div className="relative px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          <div className="md:flex justify-end md:mr-20 hidden">
            <StatsIcon />
          </div>
          <div className="md:w-full md:flex block gap-4">
            <div className="md:w-2/3 w-full">
              <div className="text-white font-bold text-[26px] sm:text-[28px] md:text-[60px] md:text-end pl-0 md:pl-8 leading-tight">
                <div className="">Find Trustworthy Tenants</div>
                <div className="italic">
                  <div className="flex md:justify-end">
                    <span className="md:flex-col items-center my-auto pr-4 hidden">
                      <svg
                        width="106"
                        height="4"
                        viewBox="0 0 106 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask id="path-1-inside-1_121_27156" fill="white">
                          <path d="M0 0.446289H105.25V3.44629H0V0.446289Z" />
                        </mask>
                        <path
                          d="M0 3.44629H105.25V-2.55371H0V3.44629Z"
                          fill="white"
                          mask="url(#path-1-inside-1_121_27156)"
                        />
                      </svg>
                    </span>
                    <span>No More Guesswork!</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 px-0 py-4 sm:py-6 md:p-8 w-full mr-0 md:mr-20 max-w-xl">
              <div className="text-sm sm:text-[16px] text-white font-light leading-7 sm:leading-8">
                Say goodbye to rental risks and endless paperwork! With{" "}
                <span className="font-bold">NaijaRentVerify</span>, you can
                screen tenants in minutes, verify property details, and secure
                hassle-free rental payments—all from your fingertips. Whether
                you’re a landlord or a tenant, we make renting stress-free,
                transparent, and secure.
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex justify-start md:justify-end mt-2">
            <button
              className="bg-white text-[#03442C] text-sm sm:text-base md:text-[22px] px-5 py-4 sm:p-6 hover:bg-nrvLightGreenButtonHover1 font-medium transition-colors duration-300 flex gap-3 sm:gap-6 items-center rounded-lg active:scale-[0.98]"
              onClick={() => router.push("/sign-up")}
            >
              <span>Get Started Now!</span>
              <svg className="w-5 h-4 md:w-7 md:h-5 shrink-0" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.8672 0.498047C18.6667 0.297525 18.4297 0.197266 18.1562 0.197266C17.8828 0.197266 17.6458 0.297525 17.4453 0.498047C17.2448 0.680338 17.1445 0.908203 17.1445 1.18164C17.1445 1.45508 17.2448 1.69206 17.4453 1.89258L24.6094 9.05664H0.984375C0.710938 9.05664 0.478516 9.15234 0.287109 9.34375C0.0957031 9.53516 0 9.76758 0 10.041C0 10.3145 0.0957031 10.5469 0.287109 10.7383C0.478516 10.9297 0.710938 11.0254 0.984375 11.0254H24.6094L17.4453 18.1895C17.2448 18.3717 17.1445 18.6042 17.1445 18.8867C17.1445 19.1693 17.2448 19.4017 17.4453 19.584C17.6458 19.7845 17.8828 19.8848 18.1562 19.8848C18.4297 19.8848 18.6667 19.7845 18.8672 19.584L27.6992 10.752C27.8997 10.5514 28 10.3145 28 10.041C28 9.76758 27.8997 9.5306 27.6992 9.33008L18.8672 0.498047Z" fill="#03442C" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <section id="about">
        <AboutSection />
      </section>
      <section id="services">
        <FeatureSection />
      </section>
      <WhyChooseUs />
      <FeaturedProperties />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      {/* Vacation rental section - commented out
      <ShortLets />
      */}
      <div id="faqs">
        <TestimonialsAndFAQs />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
