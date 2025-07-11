"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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

// Types
interface User {
  firstName?: string;
  _id?: string;
}

interface DashboardCounts {
  totalProperties?: number;
  totalNew?: number;
  totalAccepted?: number;
  totalActiveTenants?: number;
}

interface MetricCard {
  title: string;
  count: number;
  change: string;
  icon: string;
}

interface ActionCard {
  title: string;
  description?: string;
  icon: React.ReactNode;
  bgColor: string;
  link: string;
}

interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
}

// Constants
const CHART_DATA: ChartDataPoint[] = [
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

const DASHBOARD_ACTIONS: ActionCard[] = [
  {
    title: "Screening",
    description: "Request a detailed report, eviction records and criminal history.",
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

const METRIC_ICONS = {
  properties: "/icons/Properties.svg",
  leads: "/icons/Leads.svg",
  tenants: "/icons/Screening.svg",
};

// Utility functions
const formatCurrency = (amount: number): string => {
  if (amount === 0) return "₦0.00k";
  return `₦${(amount / 1000000).toFixed(1)}M`;
};

const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem("nrv-user");
    return userData ? JSON.parse(userData)?.user : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Components
const MetricCard: React.FC<MetricCard> = ({ title, count, change, icon }) => (
  <div className="p-3 border bg-white flex items-start">
    <div>
      <p className="text-[#767484] text-sm">{title}</p>
      <p className="text-3xl font-semibold my-6">{count || 0}</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-[#8D8B99]">
        <FaChartLine
          className="bg-green-100 p-1 rounded text-green-600"
          size={18}
        />
        <span>{change} compared to last month</span>
      </div>
    </div>
    <img src={icon} alt={title} />
  </div>
);

const ActionCard: React.FC<ActionCard & { onClick: () => void }> = ({ 
  title, 
  description, 
  icon, 
  bgColor, 
  onClick 
}) => (
  <div 
    className={`p-6 rounded-lg cursor-pointer transition-transform hover:scale-105 ${bgColor}`} 
    onClick={onClick}
  >
    <div className="mb-8">{icon}</div>
    <p className="font-semibold text-[#1D2739] text-sm">
      {title}
    </p>
    {description && (
      <p className="mt-4 text-xs text-[#6A6A6A] leading-6003">
        {description}
      </p>
    )}
  </div>
);

const FinancialChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const totalIncome = useMemo(() => 
    data.reduce((sum, item) => sum + item.income, 0), 
    [data]
  );

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Financial Performance</h3>
          <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>
        <Button variant="primary">
          <span className="flex items-center gap-2">
            <span role="img" aria-label="calendar">📅</span>
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

      <p className="text-3xl text-[#090814] font-bold mb-4">
        {formatCurrency(totalIncome)}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(value: number) => `₦${value / 100000}M`}
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
  );
};

const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [counts, setCounts] = useState<DashboardCounts>({});
  const [isLoading, setIsLoading] = useState(true);

  // Memoized metrics data
  const metrics = useMemo((): MetricCard[] => [
    {
      title: "Total Properties",
      count: counts.totalProperties || 0,
      change: "+15%",
      icon: METRIC_ICONS.properties,
    },
    {
      title: "Total Leads & Applicants",
      count: (counts.totalNew || 0) + (counts.totalAccepted || 0),
      change: "+15%",
      icon: METRIC_ICONS.leads,
    },
    {
      title: "Total Tenants",
      count: counts.totalActiveTenants || 0,
      change: "-15%",
      icon: METRIC_ICONS.tenants,
    },
  ], [counts]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    const currentUser = getStoredUser();
    if (!currentUser?._id) {
      setIsLoading(false);
      return;
    }

    setUser(currentUser);

    try {
      const response = await dispatch(getApplicationCount({ id: currentUser._id }) as any);
      setCounts(response.payload.data || {});
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Handle action card clicks
  const handleActionClick = useCallback((link: string) => {
    router.push(link);
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Action Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Where would you like to start?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {DASHBOARD_ACTIONS.map((action, index) => (
                <ActionCard
                  key={index}
                  {...action}
                  onClick={() => handleActionClick(action.link)}
                />
              ))}
            </div>
          </div>

          {/* Financial Chart */}
          <FinancialChart data={CHART_DATA} />
        </div>

        <div className="w-full md:w-1/3">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
