"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getApplicationCount } from "@/redux/slices/propertySlice";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle, ArrowRight, Info } from "lucide-react";

import Button from "../../shared/buttons/Button";

import {
  FaBullhorn,
  FaChartLine,
  FaCoins,
  FaFileSignature,
  FaHome,
  FaUserShield,
} from "react-icons/fa";
import DashboardOverview from "./DashboardOverview";

// Dummy Chart Data
const chartData = [
  { month: "Jan", income: 0, expenses: 0 },
  { month: "Feb", income: 30000000, expenses: 15000000 },
  { month: "Mar", income: 40000000, expenses: 12000000 },
  { month: "Apr", income: 42000000, expenses: 14000000 },
  { month: "May", income: 35000000, expenses: 13000000 },
  { month: "Jun", income: 38000000, expenses: 12500000 },
  { month: "Jul", income: 39000000, expenses: 13500000 },
  { month: "Aug", income: 40000000, expenses: 14000000 },
  { month: "Sept", income: 37000000, expenses: 12000000 },
  { month: "Oct", income: 36000000, expenses: 13000000 },
  { month: "Nov", income: 38000000, expenses: 14000000 },
  { month: "Dec", income: 39000000, expenses: 12500000 },
];

const actions = [
  {
    title: "Screening",
    description:
      "Request a detailed report, eviction records and criminal history.",
    icon: <FaUserShield size={24} className="text-red-500" />,
    bgColor: "bg-[#FFECE5]",
    link: "/dashboard/landlord/properties/renters"
  },
  {
    title: "Applications",
    description: "Check out tenant applications and background checks.",
    icon: <FaFileSignature size={24} className="text-green-500" />,
    bgColor: "bg-[#E7F6EC]",
        link: "/dashboard/landlord/properties/renters"
  },
  {
    title: "Rent Collection",
    description: "Set up automated rent collection and view financial reports.",
    icon: <FaCoins size={24} className="text-purple-500" />,
    bgColor: "bg-[#EBE0FF]",
        link: "/"
  },
  {
    title: "Advertising",
    description: "Effortlessly advertise your rental on multiple platforms.",
    icon: <FaBullhorn size={24} className="text-yellow-500" />,
    bgColor: "bg-[#FEF6E7]",
        link: "/"
  },
  {
    title: "Invite your Tenants, Friends & Families with ease.",
    icon: <img src="/images/group-people.svg" className="" alt="User" />,
    bgColor: "bg-[#E3EFFC]",
        link: "/"
  },
];

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [count, setCount] = useState<any>({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);

    const formData = { id: user?.user?._id };

    try {
      const response = await dispatch(getApplicationCount(formData) as any);
      setCount(response.payload.data);
    } catch (error) {}
  };

  return (
    <div className="p-6 space-y-6 font-jakarta">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome Back, {user?.firstName || "Landlord"}
        </h1>
        <p className="text-gray-500">
          Manage your properties, track applications, and handle maintenance
          requests—all in one place.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: "Total Properties",
                count: count.totalProperties,
                change: "+15%",
                icon: "/icons/Properties.svg",
              },
              {
                title: "Total Leads & Applicants",
                count: count?.totalNew + count?.totalAccepted,
                change: "+15%",
                icon: "/icons/Leads.svg",
              },
              {
                title: "Total Tenants",
                count: count.totalActiveTenants,
                change: "-15%",
                icon: "/icons/Screening.svg",
              },
            ].map(({ title, count, change, icon }, index) => (
              <div className="p-3 border bg-white flex items-start" key={index}>
                <div>
                  <p className="text-[#767484] text-sm">{title}</p>
                  <p className="text-3xl font-semibold my-6">{count | 0}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#8D8B99]">
                    <FaChartLine
                      className="bg-green-100 p-1 rounded text-green-600"
                      size={18}
                    />
                    <span>{change} compared to last month</span>
                  </div>
                </div>
                <img src={icon} alt="photo" />
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Where would you like to start?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {actions.map((action, index) => (
                <div key={index} className={`p-6 rounded-lg cursor-pointer ${action.bgColor}`} onClick={()=> router.push(action.link)}>
                  <div className="mb-8">{action.icon}</div>
                  <p className="font-semibold text-[#1D2739] text-sm">
                    {action.title}
                  </p>
                  {action.description && (
                    <p className="mt-4 text-xs text-[#6A6A6A] leading-6003">
                      {action.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Financial Performance</h3>
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
              <Button variant="primary">
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="calendar">
                    📅
                  </span>{" "}
                  Last Year
                </span>
              </Button>
            </div>
            <div className="my-2 text-[14px] font-light text-[#909090]">
              Monthly income vs. expenses over the past 12 months
            </div>

            <div className="flex justify-end space-x-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-green-700 rounded-sm"></span>
                <span>Total Income</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-gray-300 rounded-sm"></span>
                <span>Total Expenses</span>
              </div>
            </div>

            <p className="text-3xl text-[#090814] font-bold mb-4">₦0.00k</p>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value: any) => `₦${value / 100000}M`}
                />
                <Tooltip />
                <Bar
                  dataKey="income"
                  barSize={10}
                  fill="#1E5128"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  barSize={10}
                  fill="#D1D5DB"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
