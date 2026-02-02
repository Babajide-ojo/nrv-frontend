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
import { API_URL } from "@/config/constant";
import { getRelativeTime } from "@/helpers/utils";

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
  totalPropertiesLastMonth?: number;
  totalNewLastMonth?: number;
  totalAcceptedLastMonth?: number;
  totalActiveTenantsLastMonth?: number;
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

interface DashboardActivity {
  type: string;
  details: string;
  createdAt: string;
}

interface DashboardActivityDisplay {
  name: string;
  details: string;
  time: string;
}

// Fallback when no backend data
const EMPTY_CHART_DATA: ChartDataPoint[] = [
  { month: "Jan", income: 0, expenses: 0 },
  { month: "Feb", income: 0, expenses: 0 },
  { month: "Mar", income: 0, expenses: 0 },
  { month: "Apr", income: 0, expenses: 0 },
  { month: "May", income: 0, expenses: 0 },
  { month: "Jun", income: 0, expenses: 0 },
  { month: "Jul", income: 0, expenses: 0 },
  { month: "Aug", income: 0, expenses: 0 },
  { month: "Sept", income: 0, expenses: 0 },
  { month: "Oct", income: 0, expenses: 0 },
  { month: "Nov", income: 0, expenses: 0 },
  { month: "Dec", income: 0, expenses: 0 },
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

const getPercentChange = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = Math.round(((current - previous) / previous) * 100);
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change}%`;
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
const MetricCard: React.FC<MetricCard> = ({ title, count, change, icon }) => {
  const isPositive = change.startsWith("+") && change !== "+0%";
  const isNegative = change.startsWith("-");
  const changeColor = isPositive
    ? "text-green-600"
    : isNegative
    ? "text-red-600"
    : "text-[#8D8B99]";

  return (
    <div className="p-3 border bg-white flex items-start">
      <div>
        <p className="text-[#767484] text-sm">{title}</p>
        <p className="text-3xl font-semibold my-6">{count || 0}</p>
        <div className={`flex items-center gap-2 mt-2 text-xs ${changeColor}`}>
          <FaChartLine
            className={`p-1 rounded ${
              isPositive ? "bg-green-100 text-green-600" : isNegative ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            }`}
            size={18}
          />
          <span>{change} compared to last month</span>
        </div>
      </div>
      <img src={icon} alt={title} />
    </div>
  );
};

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
  const [chartData, setChartData] = useState<ChartDataPoint[]>(EMPTY_CHART_DATA);
  const [activities, setActivities] = useState<DashboardActivityDisplay[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized metrics data with real % change from backend
  const metrics = useMemo((): MetricCard[] => {
    const totalProperties = counts.totalProperties ?? 0;
    const totalLeads = (counts.totalNew ?? 0) + (counts.totalAccepted ?? 0);
    const totalTenants = counts.totalActiveTenants ?? 0;
    const totalPropertiesLastMonth = counts.totalPropertiesLastMonth ?? 0;
    const totalLeadsLastMonth = (counts.totalNewLastMonth ?? 0) + (counts.totalAcceptedLastMonth ?? 0);
    const totalTenantsLastMonth = counts.totalActiveTenantsLastMonth ?? 0;

    return [
      {
        title: "Total Properties",
        count: totalProperties,
        change: getPercentChange(totalProperties, totalPropertiesLastMonth),
        icon: METRIC_ICONS.properties,
      },
      {
        title: "Total Leads & Applicants",
        count: totalLeads,
        change: getPercentChange(totalLeads, totalLeadsLastMonth),
        icon: METRIC_ICONS.leads,
      },
      {
        title: "Total Tenants",
        count: totalTenants,
        change: getPercentChange(totalTenants, totalTenantsLastMonth),
        icon: METRIC_ICONS.tenants,
      },
    ];
  }, [counts]);

  // Fetch dashboard data (metrics, activities, financial)
  const fetchDashboardData = useCallback(async () => {
    const currentUser = getStoredUser();
    if (!currentUser?._id) {
      setIsLoading(false);
      setActivitiesLoading(false);
      return;
    }

    setUser(currentUser);

    try {
      const [metricsResponse, dashboardResponse] = await Promise.all([
        dispatch(getApplicationCount({ id: currentUser._id }) as any),
        fetch(`${API_URL}/dashboard?userId=${currentUser._id}&limit=20`),
      ]);

      setCounts(metricsResponse.payload?.data || {});

      const dashboardResult = await dashboardResponse.json();
      if (dashboardResult.status === "success" && dashboardResult.data) {
        const { activities: apiActivities, financialData } = dashboardResult.data;
        if (apiActivities?.length) {
          setActivities(
            apiActivities.map((a: DashboardActivity) => ({
              name: a.type,
              details: a.details,
              time: getRelativeTime(a.createdAt),
            }))
          );
        }
        if (financialData?.length) {
          setChartData(financialData);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setActivitiesLoading(false);
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
          <FinancialChart data={chartData} />
        </div>

        <div className="w-full md:w-1/3">
          <DashboardOverview
            activities={activities}
            isLoading={activitiesLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
