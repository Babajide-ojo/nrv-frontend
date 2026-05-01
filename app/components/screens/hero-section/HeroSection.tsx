"use client";

import GroupPeople from "../../../../public/images/group-people.png";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa6";
import Button from "../../shared/buttons/Button";
import HoverableCard from "@/app/components/shared/cards/HoverableCard";
import { CardData } from "@/helpers/data";
import GuideCard from "../../shared/cards/GuideCard";
import { useRouter } from "next/navigation";


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
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <div className="bg-red p-4 text-nrvPrimaryGreen h-60 rounded-4xl text-center">
          <div className="flex justify-center">
            <img src={imageUrl} alt="photo" className="w-12 h-12" />
          </div>
          <h2 className="mt-4 text-md">{title}</h2>
          <p className="mt-4 text-xs font-light">{description}</p>
        </div>
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
      title: "Tenant Screening",
      description:
        "Efficiently screen potential tenants by accessing comprehensive background checks, credit history, and rental application details.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321116/tazn6fia8p6phjao8kkl.png",
      title: "Secure Rent Payments",
      description:
        "Seamlessly process rent payments within the app using a secure payment gateway, providing convenience for both landlords and tenants.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321116/jl1kpsnwhoguzqi1cpu9.png",
      title: "User-Friendly Dashboard",
      description:
        "Access dashboard that provides a quick overview of property listings, notifications, and account settings for efficient management.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/pqi5czr38jzuhwnqonhd.png",
      title: "Instant Notifications",
      description:
        "Get instant notifications regarding new tenant applications, updates on property status, and important messages from applicants.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321116/y7wioy8wv350nw7xokfy.png",
      title: "Comprehensive Property Listings",
      description:
        "Easily manage and view detailed property listings, including essential information such as address, rental price, and availability status.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/cxs0ybb8jty0n67p7c5g.png",
      title: "Effortless Tenant Communication",
      description:
        "Enable smooth landlord-tenant communication with an in-app messaging system for quick and efficient information exchange.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/pqi5czr38jzuhwnqonhd.png",
      title: "Intuitive Application Process",
      description:
        "Simplify the tenant application process with a user-friendly interface, guiding applicants through each step for a hassle-free experience.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/pqi5czr38jzuhwnqonhd.png",
      title: "Detailed Screening Reports",
      description:
        "Access comprehensive tenant screening reports for a thorough evaluation, covering credit history, employment verification, rental history, and background checks.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716321117/oztkr7otv3sivyxoypfs.png",
      title: "Transparent Application Status",
      description:
        "Provide transparency in the application process with a clear display of application status (Pending, Approved, Rejected) for both landlords and tenants.",
    },
  ];

  return (
    <div className="bg-nrvPrimaryGreen md:p-12 p-2">
      <div className="text-center text-white">
        <h2 className="uppercase text-2xl">Key Features</h2>
        <p className="font-semibold text-2xl mt-2">
          Experience the Next Level: <br></br> NaijaRentVerify&#39;s Top
          Features at a Glance
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mt-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

const GuideSection: React.FC = () => {
  const features: Feature[] = [
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716356193/image_7_qjg5fa.png",
      title: "Step 1: Sign Up",
      description:
        "Get started by creating your account. Sign up with your email and set a secure password. It only takes a few moments.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354782/image_8_rvyp5d.png",
      title: "Step 2: Add Your Properties",
      description:
        "List your properties effortlessly. Add details like address, rental price, and amenities. Your properties are now ready for screening.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354783/image_9_ftl12i.png",
      title: "Step 3: Invite Tenants to Apply",
      description:
        "Invite prospective tenants to apply directly through the app. Our messaging system makes communication easy and streamlined.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354782/image_10_kuvlmc.png",
      title: "Step 4: Review Tenant Applications",
      description:
        "Receive and review tenant applications in one place. Evaluate their information and rental history at your convenience.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354784/image_11_ooxnvo.png",
      title: "Step 5: Screen with Confidence",
      description:
        "Initiate background checks seamlessly. Access credit histories, criminal records, and eviction histories to make informed decisions.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354780/image_11_1_hzghgk.png",
      title: "Step 6: Easy Rent Payments",
      description:
        "Handle rent payments securely within the app. Our integrated payment gateway ensures a hassle-free transaction experience.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354784/image_10_1_pyrcaw.png",
      title: "Step 7: Stay Informed with Notifications",
      description:
        "Receive real-time notifications for new tenant applications, messages, and important updates. Stay informed without missing a beat.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354783/image_10_2_bnpmxr.png",
      title: "Step 8: Manage Everything in Your Dashboard",
      description:
        "Effortlessly manage properties, applications, and payments with your personalized dashboard.",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354783/image_11_2_qjllir.png",
      title: "Step 9: Reach Out for Support",
      description:
        "Provide transparency in the application process with a clear display of application status (Pending, Approved, Rejected) for both landlords and tenants.",
    },
    // {
    //   imageUrl:
    //     "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716354779/image_10_3_agvsof.png",
    //   title: "Step 10: Enjoy Stress-Free Tenant Screening",
    //   description:
    //     "Sit back, relax, and enjoy stress-free tenant screening. NaijaRentVerify simplifies the process, making renting a breeze.",
    // },
  ];

  return (
    <div className="bg-nrvLightGreyBg md:p-12 p-2">
      <div className="text-center">
        <h2 className="uppercase text-2xl">How It Works</h2>
        <p className="font-semibold text-nrvPrimaryGreen md:text-2xl text-xl mt-2">
          Unlocking Seamless Tenant Management: <br></br> A Step-by-Step Guide
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mt-8">
        {features.map((feature, index) => (
          <GuideCard key={index} {...feature} />
        ))}
      </div>
      <div className="flex justify-center p-8">
        <div className="bg-white rounded rounded-full p-4 md:flex gap-4 block text-center">
          <p className="text-sm md:text-md text-center pt-0 md:pt-4">
            ✨ Experience the Future of Tenant Management – Try NaijaRentVerify
            Today! ✨
          </p>{" "}
          <Button size="large" variant="primary" showIcon={false}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  const testimonials: Testimonials[] = [
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716357763/Frame_27_9_aubrs6.png",
      title: "Easy-to-Use Platform",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716357763/Frame_27_10_jrbp8l.png",
      title: "Helpful Online Filing System",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716357763/Frame_27_11_f6m7hr.png",
      title: "Efficient Communication",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716357764/Frame_27_12_ve2m8y.png",
      title: "Cost-Effective & Business Focused",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716357764/Frame_27_13_bj8pzz.png",
      title: "Qualified Tenants",
    },
    {
      imageUrl:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1716357764/Frame_27_14_kmronf.png",
      title: "Effortless Payment Collection",
    },
  ];

  return (
    <div className="bg-nrvLightGreyBg md:p-12 p-2 w-full">
      <div className="max-w-5xl mx-auto ">
        <div className="text-center">
          <h2 className=" text-2xl">Testimonials</h2>
          <p className="font-semibold text-nrvPrimaryGreen md:text-4xl text-3xl mt-2">
            Discover What Our Users Are Saying
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 p-4 mt-8">
          {testimonials.map((testimonial, index) => (
            <div className=" gap-12 pt-8 pb-8 text-center" key={index}>
              <div className="flex justify-center">
                <img
                  src={testimonial.imageUrl}
                  alt="photo"
                  className="h-12 w-12"
                />
              </div>
              <p className="text-sm mt-4">{testimonial.title}</p>
            </div>
          ))}
        </div>
        <div className="md:flex gap-3 justfy-center block p-4">
          <div className="mt-4 md:w-1/2 w-full">
            <div className="bg-white rounded-2xl p-4 w-full h-96">
              <img
                src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716361304/Pexels_Photo_by_Tarzine_Jackson_bl6ze1.png"
                alt="person"
              />
              <img
                src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716361318/Frame_427319574_e28npi.png"
                alt="person"
                className="mt-4"
              />
              <p className="mt-4 font-semibold text-lg">Emily Turner</p>
              <p className="mt-4 text-nrvLightGrey">
                Landlord, Lagos, Nigeria 🇳🇬{" "}
              </p>
              <p className="mt-4 font-light">
                &#34;NaijaRentVerify made tenant screening a breeze! The
                user-friendly interface and detailed screening reports helped me
                find the perfect tenant for my property.&#34;
              </p>
            </div>
          </div>
          <div className="mt-4 md:w-1/2 w-full">
            <div className="bg-white rounded-2xl p-4 w-full h-96">
              <img
                src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716361304/Pexels_Photo_by_Justin_Shaifer_pb7dvo.png"
                alt="person"
              />
              <img
                src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716361318/Frame_427319574_e28npi.png"
                alt="person"
                className="mt-4"
              />
              <p className="mt-4 font-semibold text-lg">David Johnson</p>
              <p className="mt-4 text-nrvLightGrey">
                Tenant, Lagos, Nigeria 🇳🇬{" "}
              </p>
              <p className="mt-4 font-light">
                &#34;https://lms-frontend-cki9.vercel.app/As a tenant, I
                appreciate the transparency NaijaRentVerify provides. The
                application process was smooth, and the screening report gave me
                confidence in my landlord&#39;s selection process.&#34;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  return (
    <div className="bg-nrvLightGreyBg md:p-12 p-2 w-full">
      <div className="max-w-5xl mx-auto ">
        <div className="text-center">
          <h2 className="text-nrvPrimaryGreen text-2xl">
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="font-semibold text-nrvPrimaryGreen md:text-4xl text-3xl mt-2">
            Discover More About Our Platform
          </p>
        </div>

        <div className="md:flex gap-3 justfy-center block p-4">
          <div className="mt-4 md:w-1/2 w-full">
            <ul className="list-none">
              <li className="bg-white mt-4 p-4 md:w-4/5 w-full rounded-lg text-sm h-16 flex items-center before:content-['•'] before:mr-2 before:text-black">
                How does NaijaRentVerify work for landlords?
              </li>
              <li className="bg-white mt-4 p-4 md:w-4/5 w-full rounded-lg text-sm h-16 flex items-center before:content-['•'] before:mr-2 before:text-black">
                Is NaijaRentVerify available for use in all locations within
                Nigeria?
              </li>
              <li className="bg-white mt-4 p-4 md:w-4/5 w-full rounded-lg text-sm h-16 flex items-center before:content-['•'] before:mr-2 before:text-black">
                What information is included in the tenant screening report?
              </li>
              <li className="bg-white mt-4 p-4 md:w-4/5 w-full rounded-lg text-sm h-16 flex items-center before:content-['•'] before:mr-2 before:text-black">
                How secure are the payment transactions within NaijaRentVerify?
              </li>
              <li className="bg-white mt-4 p-4 md:w-4/5 w-full rounded-lg text-sm h-16 flex items-center before:content-['•'] before:mr-2 before:text-black">
                Can I edit or update property details after adding them to
                NaijaRentVerify?
              </li>
              <li className="bg-white mt-4 p-4 md:w-4/5 w-full rounded-lg text-sm h-16 flex items-center before:content-['•'] before:mr-2 before:text-black">
                What happens if a tenant application is rejected?
              </li>
            </ul>
          </div>
          <div className="mt-4 md:w-1/2 w-full">
            <img
              src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716362692/Frame_427319528_ltn8kr.png"
              alt="faq"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <div className="bg-nrvLightGreyBg w-full">
      <div className="md:flex gap-3 justify-center">
        <div className="mt-4 md:w-4/10 w-full">
          <img
            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716365043/Frame_427319537_z0emzc.png"
            alt="mobile-app"
            className="md:w-4/5 w-full"
          />
        </div>
        <div className="mt-6 md:w-4/10 w-full px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:gap-24">
            <div>
              <div className="text-nrvDarkGrey font-semibold mb-4 text-nrvPrimaryGreen">
                Company
              </div>

              <div>
                <a className="text-sm block mb-8 cursor-pointer">About us</a>
                <a className="text-sm block mb-8 cursor-pointer">Contact us</a>
              </div>
            </div>
            <div>
              <div className="text-nrvDarkGrey font-semibold mb-4 text-nrvPrimaryGreen">
                Socials
              </div>

              <div>
                <a className="text-sm block mb-8 cursor-pointer">Facebook</a>
                <a className="text-sm block mb-8 cursor-pointer">Twitter</a>
                <a className="text-sm block mb-8 cursor-pointer">LinkedIn</a>
              </div>
            </div>
            <div>
              <div className="text-nrvDarkGrey font-semibold mb-4 text-nrvPrimaryGreen">
                Instagram
              </div>

              <div>
                <a className="text-sm block mb-8 cursor-pointer">About us</a>
                <a className="text-sm block mb-8 cursor-pointer">Privacy</a>
                <a className="text-sm block mb-8 cursor-pointer">Cookies</a>
                <a className="text-sm block mb-8 cursor-pointer">Licenses</a>
              </div>
            </div>
            <div>
              <div className="text-nrvDarkGrey font-semibold mb-4 text-nrvPrimaryGreen">
                Help
              </div>

              <div>
                <a className="text-sm block mb-8">Term of Use</a>
                <a className="text-sm block mb-8">FAQs</a>
              </div>
            </div>
          </div>
          <div className="mt-8 max-w-lg">
            <p className="text-sm mb-8">Stay updated with</p>
            <p className="text-nrvPrimaryGreen font-semibold text-4xl">
              NaijaRentVerify by signing up for our newsletter
            </p>
          </div>

          <div className="" style={{ alignItems: "flex-end" }}>
            <div className="mt-12 mb-12 flex gap-2 text-sm">
              <img
                src="https://res.cloudinary.com/dyb8cgrxm/image/upload/v1716442703/icon-park-outline_handle-c_cdcjiz.png"
                alt="icon"
              />{" "}
              <p>NaijaRentVerify 2024. All rights reserved.</p>
            </div>
            <p className="mt-12 mb-12 font-light">
              <span className="font-semibold">Changes to Terms :</span>{" "}
              NaijaRentVerify retains the authority to modify or substitute any
              segment of these Terms of Service and Privacy Policy. Users will
              be notified of any alterations, and it is incumbent upon them to
              regularly review and stay informed about these policies.
            </p>
            <p className="mb-8 text-lg font-semibold text-nrvPrimaryGreen">
              Connect with us
            </p>

            <div className="flex gap-12 pb-20">
              <img
                src="https://res.cloudinary.com/dyb8cgrxm/image/upload/v1716442703/ri_facebook-fill_uqpbfe.png"
                alt="socials"
                className=""
              />
              <img
                src="https://res.cloudinary.com/dyb8cgrxm/image/upload/v1716442703/ri_twitter-fill_gjymnu.png"
                alt="socials"
                className=""
              />
              <img
                src="https://res.cloudinary.com/dyb8cgrxm/image/upload/v1716442703/ri_instagram-fill_vnwn7o.png"
                alt="socials"
                className=""
              />
              <img
                src="https://res.cloudinary.com/dyb8cgrxm/image/upload/v1716442703/ri_twitter-fill_gjymnu.png"
                alt="socials"
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
    
      <FeatureSection />
      <GuideSection />
      <TestimonialSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default HeroSection;
