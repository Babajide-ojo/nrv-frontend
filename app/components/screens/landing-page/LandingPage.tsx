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
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <div className="bg-white hover:bg-[#E9F4E7] p-4 text-nrvPrimaryGreen h-60 ">
          {/* <div className="flex justify-center">
            <img src={imageUrl} alt="photo" className="w-12 h-12" />
          </div> */}
          <h2 className="mt-4 text-[24px] font-medium h-12">{title}</h2>
          <p className="mt-4 text-[14px] font-light pt-4">{description}</p>
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
    <div className="bg-nrvPrimaryGreen md:p-12 p-2">
      <div className=" flex p-4">
        <p className="text-white font-medium text-2xl mt-2 w-3/5">
          Whether you’re a landlord looking to maximize your returns or a <br></br> tenant
          searching for a verified home, NaijaRentVerify is here to make <br></br> renting
          easier, safer, and more efficient.
        </p>
        <div className="w-2/5 flex justify-end items-end">
          <Button variant="primary" className="text-[16px] w-80" size="large">
            Explore Our Services
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 mt-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  return (
    <div className="bg-white md:p-12 p-2 mx-auto mt-4 w-11/12">
      <div className="w-full flex justify-center">
        <div className="w-5/12">
          <div className="md:w-4/5">
            <h1 className="text-[#1D2227] font-medium text-[24px]">
              Who We Are ?
            </h1>
            <div className="font-light text-[#646D75]  text-[16px] leading-8">
              <span className="font-medium">NaijaRentVerify</span> was born out
              of a need for trust and transparency in Nigeria’s rental property
              market. We understand the challenges faced by both property owners
              and tenants—fraudulent listings, delayed payments, and lack of
              reliable property management services.
            </div>
          </div>

          <div className="md:w-4/5 pt-12">
            <h1 className="text-[#1D2227] font-medium text-[24px]">
              Our Mission ?
            </h1>
            <div className="font-light text-[#646D75] text-[16px] leading-8">
              Our mission is simple: to create a seamless, secure, and
              stress-free rental experience for everyone. Leveraging
              cutting-edge technology and a customer-first approach, we provide
              end-to-end property management solutions that you can trust.
            </div>
          </div>
        </div>
        <div className="w-7/12">
          <div className="pt-6">
            <div className="text-[30px] text-[#03442C] pb-8">
              Whether you are a landlord looking to maximize your returns or a
              tenant searching for a verified home, NaijaRentVerify is here to
              make renting easier, safer, and more efficient.
            </div>
            <Button variant="darkPrimary" className="text-[16px]" size="large">
              Explore Our Services
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-12 mt-16 mb-4">
        <div className="w-7/12">
          <Image
            alt="pto"
            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1741785309/Background_1_brbq1j.png"
            width={1020} // Replace with the actual width of the image
            height={880} // Replace with the actual height of the image
            className="w-full h-full"
          />
        </div>
        <div className="w-5/12">
          <Image
            alt="pto"
            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1741785308/Background_rph4rw.png"
            width={1020} // Replace with the actual width of the image
            height={880} // Replace with the actual height of the image
            className="w-full h-full"
          />
        </div>
      </div>
      <hr></hr>
      <div className="flex space-around mt-16">
        <div className="w-1/4 text-center">
          <div className="font-medium text-[#1D2227] text-[40px]">5,673+</div>
          <div className="font-light text-[#646D75]">Onboarded Landlords</div>
        </div>
        <div className="w-1/4 text-center">
          <div className="font-medium text-[#1D2227] text-[40px]">2,179+</div>
          <div className="font-light text-[#646D75]">Satisfied Reviews</div>
        </div>
        <div className="w-1/4 text-center">
          <div className="font-medium text-[#1D2227] text-[40px]">10+</div>
          <div className="font-light text-[#646D75]">Years Of Experience</div>
        </div>
        <div className="w-1/4 text-center">
          <div className="font-medium text-[#1D2227] text-[40px]">200k+</div>
          <div className="font-light text-[#646D75]">Active Users</div>
        </div>
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

const LandingPage = () => {
  const router = useRouter();
  return (
    <div className="md:m-8">
      <div
        style={{
          height: "700px",
          backgroundColor: "#ffffff",
        }}
        className="md:relative "
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://res.cloudinary.com/dzv98o7ds/image/upload/v1741768679/nrv-hero-section-img_ttbvxz.jpg')] bg-cover bg-center"></div>
        <div className="flex items-end gap-4 relative w-full h-full bg-gradient-to-t from-[#03442C] to-transparent opacity-90">
          <div>
            <div className="flex justify-end mr-20">
              <StatsIcon />
            </div>
            <div className="md:w-full md:flex block gap-4">
              <div className="md:w-2/3 w-full">
                <div className="text-white font-bold md:text-[60px] text-[28px] text-end mr-20">
                  <div>Find Trustworthy Tenants</div>
                  <div className="italic">
                    <div className="flex justify-end">
                      <span className="flex-col items-center my-auto pr-4">
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
              <div className="md:w-1/3 p-8 w-full">
                <div className="text-[16px] text-white font-light leading-8">
                  Say goodbye to rental risks and endless paperwork! With{" "}
                  <span className="font-bold">NaijaRentVerify</span>, you can
                  screen tenants in minutes, verify property details, and secure
                  hassle-free rental payments—all from your fingertips. Whether
                  you’re a landlord or a tenant, we make renting stress-free,
                  transparent, and secure.
                </div>
              </div>
            </div>
            <div className="bg-white w-2/5 text-[22px] text-[#03442C] flex justify-end">
              <button className="bg-white text-md p-6 hover:bg-nrvLightGreenButtonHover1 font-medium transition-colors duration-300 flex gap-6">
                <span>Get Started Now!</span>
                <div className="flex my-auto">
                  <svg
                    width="28"
                    height="20"
                    viewBox="0 0 28 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.8672 0.498047C18.6667 0.297525 18.4297 0.197266 18.1562 0.197266C17.8828 0.197266 17.6458 0.297525 17.4453 0.498047C17.2448 0.680338 17.1445 0.908203 17.1445 1.18164C17.1445 1.45508 17.2448 1.69206 17.4453 1.89258L24.6094 9.05664H0.984375C0.710938 9.05664 0.478516 9.15234 0.287109 9.34375C0.0957031 9.53516 0 9.76758 0 10.041C0 10.3145 0.0957031 10.5469 0.287109 10.7383C0.478516 10.9297 0.710938 11.0254 0.984375 11.0254H24.6094L17.4453 18.1895C17.2448 18.3717 17.1445 18.6042 17.1445 18.8867C17.1445 19.1693 17.2448 19.4017 17.4453 19.584C17.6458 19.7845 17.8828 19.8848 18.1562 19.8848C18.4297 19.8848 18.6667 19.7845 18.8672 19.584L27.6992 10.752C27.8997 10.5514 28 10.3145 28 10.041C28 9.76758 27.8997 9.5306 27.6992 9.33008L18.8672 0.498047Z"
                      fill="#03442C"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <AboutSection />
      <FeatureSection />
    </div>
  );
};

export default LandingPage;
