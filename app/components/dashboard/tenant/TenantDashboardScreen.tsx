"use client";

import { useEffect } from "react";
import { tenantDashboardMetrics } from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TenantDashboardNavigationCard from "../../shared/cards/TenantDashboardNavigationCard";
import RentedPropertiesScreen from "./RentedPropertiesScreen";
import { useDispatch } from "react-redux";
import { getTenantMetrics } from "@/redux/slices/propertySlice";
import { FcComboChart, FcHome, FcParallelTasks } from "react-icons/fc";
import { FaChartLine } from "react-icons/fa";
import DashboardOverview from "../../screens/dashboard-screens/DashboardOverview";
import InputField from "../../shared/input-fields/InputFields";
import House from "../../icons/House";
import Notes from "../../icons/Notes";
import Users from "../../icons/Users";
//import RentedPropertiesScreen from "@/app/dashboard/tenant/rented-properties/page";

const RentedApartments = () => {
  const apartmentImages = [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be", // apt1
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994", // apt2
  ];

  const thumbImages = [
    "https://images.unsplash.com/photo-1599423300746-b62533397364",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471",
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold">My Rented Apartments</h2>

      {/* Search and Filter */}
      <div className="flex justify-between items-center gap-4">
        <div className="w-1/2">
          <InputField
            name="search"
            inputType="text"
            placeholder="Search anything or type a command"
            css="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="border border-gray-300 rounded-md px-4 py-2 text-xs">
          Advanced Filter
        </button>
      </div>

      {/* Apartment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apartmentImages.map((img, index) => (
          <div
            key={index}
            className={`rounded-xl overflow-hidden shadow border ${
              index === 1 ? "" : ""
            }`}
          >
            <div className="relative h-52">
              <img
                src={img}
                alt="Apartment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white text-lg font-semibold">
                  Luxurious Apartment
                </h3>
                <p className="text-white text-sm flex items-center gap-1">
                  📍 29B, Lekki Phase 1
                </p>
              </div>
              {index === 1 && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white border-2 border-blue-600"></div>
              )}
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p className="text-green-600 font-semibold text-base">
                ₦250,095{" "}
                <span className="text-gray-500 text-sm">/ Per Annum</span>
              </p>
              <p className="text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <div>
                  <p className="font-medium text-[#03442C] text-xs">Bedroom</p>
                  <p>4 Beds</p>
                </div>
                <div>
                  <p className="font-medium text-[#03442C] text-xs">Bathroom</p>
                  <p>4 rooms</p>
                </div>
                <div>
                  <p className="font-medium text-[#03442C] text-xs">
                    Square Area
                  </p>
                  <p>12 x 12 m²</p>
                </div>
                <div>
                  <p className="font-medium text-[#03442C] text-xs">Style</p>
                  <p>🏙️ Modern</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore More Properties */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Explore more Properties</h3>
          <button className="text-green-600 text-sm font-medium">
            See all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {thumbImages.map((thumb, index) => (
            <div
              key={index}
              className="min-w-[240px] rounded-xl border shadow p-3 flex bg-white"
            >
              <div className="relative h-16 rounded-md overflow-hidden">
                <img
                  src={thumb}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {index === 0 ? (
                    <span className="text-red-500 text-xl">❤️</span>
                  ) : (
                    <span className="text-gray-400 text-xl">🤍</span>
                  )}
                </div>
              </div>
              <div className="ml-3 space-y-1">
                <p className="text-sm font-medium text-[#263245]">
                  Luxury Apartment
                </p>
                <p className="text-[11px] font-light text-[#737D8C] flex items-center gap-1">
                  📍 Victoria Island
                </p>
                <p className="text-[#263245] text-[11px]">
                  ₦10,000,000 / Per Annum
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TenantDashboardCard = ({ user }: { user: any }) => {
  return (
    <div className="max-w-md mx-auto p-4 pt-0 space-y-6">
      {/* Date Range Filter */}
      {/* <div className="flex gap-2 flex-wrap">
        {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "Custom"].map(
          (label, i) => (
            <button
              key={i}
              className={`px-4 py-1 rounded-full text-sm border ${
                label === "Today"
                  ? "bg-green-800 text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div> */}

      {/* Profile Card */}
      <div className="rounded-xl border shadow overflow-hidden">
        <div className="h-28 relative bg-[url('/images/user-bg.png')] bg-cover bg-center bg-no-repeat">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="absolute -bottom-6 left-4 w-16 h-16 rounded-full ring-4 ring-white object-cover"
            alt="Profile"
          />
        </div>
        <div className="pt-8 px-4 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            {/* <a href="#" className="text-green-600 text-sm font-medium">
              Upgrade Account →
            </a> */}
          </div>
          {/* <div className="mt-2 text-sm">
            <span className="text-gray-600">Account Level: </span>
            <span className="bg-lime-200 text-lime-800 px-2 py-0.5 rounded-full text-xs font-medium">
              Tier 2
            </span>
          </div> */}
        </div>
      </div>

      {/* Setup Progress */}
      {/* <div className="bg-green-50 p-4 rounded-xl border flex justify-between items-center">
        <div>
          <p className="font-medium text-sm">Complete your Account Setup</p>
          <p className="text-sm text-gray-600 mt-1">
            Tell us more about yourself and what you&#39;re looking for to get
            personalized recommendations.
          </p>
          <a
            href="#"
            className="text-green-700 mt-2 inline-block text-sm font-medium"
          >
            Update Account Now →
          </a>
        </div>
      </div> */}

      {/* Quick Actions */}
      <div className="rounded-xl border divide-y">
        <div className="p-4">
          <p className="font-semibold">Quick Actions</p>
        </div>
        {[
          {
            icon: "🏠",
            title: "Rent Payment/ Renew",
            desc: "Initiate rent payment or renewal and upload receipt for prove.",
          },
          {
            icon: "🛠️",
            title: "Request Maintenance",
            desc: "Submit a repair request (e.g., plumbing, HVAC)",
          },
          {
            icon: "💬",
            title: "Message Landlord/Manager",
            desc: "In-app messaging to communicate with the Landlord.",
          },
          {
            icon: "📄",
            title: "View Lease Agreement",
            desc: "Access the signed lease PDF to check terms, and rules.",
          },
        ].map((action, i) => (
          <div key={i} className="p-4 flex gap-3 items-start hover:bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-lg">
              {action.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs text-gray-600">{action.desc}</p>
            </div>
            <div className="text-gray-400 text-lg">›</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TenantDashboardScreen = () => {
  const [user, setUser] = useState<any>({});
  const [count, setCount] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
    };
    try {
      const response = await dispatch(getTenantMetrics(formData) as any);
      setCount(response.payload.data);
    } catch (error) {
    } finally {
    }
  };

  console.log("User:", user);

  const tenantDashboardMetrics = [
    {
      imageLink: <FcHome color="#004B95" size={35} />,
      title: "Apartments",
      number: count.totalNew,
      link: "/dashboard/tenant/rented-properties",
      icon: <House className="w-[20px] h-[20px]" />,
    },
    {
      imageLink: <FcComboChart color="#004B95" size={35} />,
      title: "Applications",
      number: count.totalAccepted,
      link: "/dashboard/tenant/properties/applications",
      icon: <Notes className="w-[20px] h-[20px]" />,
    },
    {
      imageLink: <FcParallelTasks color="#004B95" size={35} />,
      title: "Maintenance",
      number: count.totalActiveTenants,
      link: "/dashboard/tenant/properties/maintenance",
      icon: <Users className="w-[20px] h-[20px]" />,
    },
  ];
  return (
    <div className="md:p-8 p-3 mb-16 md:mb-0">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} {user?.lastName}👋,
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {tenantDashboardMetrics.map(
                  ({ title, imageLink, number, link, icon }, index) => (
                    <div
                      className={`p-3 border bg-white flex items-start justify-between ${
                        index === 0 &&
                        "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none lg:rounded-bl-lg"
                      }
                      ${
                        index === 1 &&
                        "sm:rounded-tr-lg sm:rounded-br-lg lg:rounded-tr-none lg:rounded-br-none"
                      }
                      ${
                        index === 2 &&
                        "rounded-bl-lg rounded-br-lg lg:rounded-bl-none lg:rounded-tr-lg l:rounded-br-lg "
                      }`}
                      key={index}
                    >
                      <div>
                        <p className="text-[#767484] text-sm">{title}</p>
                        <p className="text-3xl font-semibold my-6">
                          {number | 0}
                        </p>
                        {/* <div className="flex items-center gap-2 mt-2 text-xs text-[#8D8B99]">
                          <FaChartLine
                            className="bg-green-100 p-1 rounded text-green-600"
                            size={18}
                          />
                        </div> */}
                      </div>
                      <div
                        className={`flex items-center justify-center rounded-full h-[40px] w-[40px] ${
                          index === 0
                            ? "bg-[#429634]"
                            : index === 1
                            ? "bg-[#4F81E5]"
                            : "bg-[#F4BE50]"
                        }`}
                      >
                        {icon}
                      </div>
                    </div>
                  )
                )}
              </div>
              <RentedApartments />
            </div>

            <div className="w-full md:w-1/3">
              <TenantDashboardCard user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardScreen;
