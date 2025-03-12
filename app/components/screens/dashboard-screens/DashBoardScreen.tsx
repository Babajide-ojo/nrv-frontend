"use client";
import { useEffect } from "react";
import { dashboardMetrics, dashboardNavLinks } from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import DashboardNavigationCard from "../../shared/cards/DashboardNavigationCard";
import { useState } from "react";
import { getApplicationCount } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ApplicantScreen from "../renters/ApplicantScreen";
import BarChart from "../../charts/BarChart";
import DoughnutChart from "../../charts/PieChart";
import ApplicantScreenForDashboard from "../renters/ApplicantScreenForDashboard";
import { FcApprove, FcComboChart } from "react-icons/fc";
import { FcAcceptDatabase } from "react-icons/fc";
import { FcHome } from "react-icons/fc";

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
    console.log({user});
    
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
    };

    try {
      const response = await dispatch(getApplicationCount(formData) as any);
      setCount(response.payload.data);
    } catch (error) {
    } finally {
    }
  };
  const dashboardMetrics = [
    {
      imageLink: <FcComboChart color="#004B95"  size={35} />,
      title: "Applicants",
      number: count.totalNew,
    },
    {
      imageLink: <FcAcceptDatabase color="#004B95"  size={35} />,
      title: "Leads",
      number: count.totalAccepted,
    },
    {
      imageLink: <FcApprove color="#004B95" size={35} />,
      title: "Tenants",
      number: count.totalActiveTenants,
    },
    {
      imageLink: <FcHome color="#004B95"  size={35} />,
      title: "Properties",
      number: count.totalProperties,
    }

  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Set to false to allow custom height
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };

  const optionsForPiechart = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const data = {
    labels: ["Applicants", "Leads", "Tenants", "Properties"],
    datasets: [
      {
        label: "Applications",
        data: [count.totalNew, count.totalAccepted, count.totalActiveTenants, count.totalProperties],
        backgroundColor: ["#004B95"],
        borderColor: ["#153969", "#153969", "#153969", "#153969"],
        borderWidth: 1,
      },
    ],
  };

  const dataForPiechart = {
    labels: ["Applicants", "Leads", "Tenants", "Properties"],
    datasets: [
      {
        label: "Applications",
        data: [count.totalNew, count.totalAccepted, count.totalActiveTenants, count.totalProperties],
        backgroundColor: ["#004B95", "#C9190B", "#4CB140", "FCB640"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="md:p-8 p-3 mb-16 md:mb-0">
      <p className="text-xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName || "Landlord"} 👋
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="flex-row md:flex gap-4">
        <div className="md:w-1/2 w-full">
          <div className=" grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {dashboardMetrics.map(({ title, imageLink, number }, index) => (
              <div
                key={index}
                onClick={() =>
                  router.push("/dashboard/landlord/properties/renters")
                }
              >
                <DashboardNavigationCard
                  title={title}
                  imageLink={imageLink}
                  number={number}
                  isMetric={true}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 w-full md:mt-0 mt-4">
          <div className="w-full bg-white rounded-xl p-3 flex justify-between">
            <div className="pt-1 text-xs font-medium text-nrvPrimaryGreen">
              Ongoing Maintenance: 0
            </div>
            <div>
              <Button
                size="normal"
                className=""
                variant="lightGrey"
                showIcon={false}
              >
                View
              </Button>
            </div>
          </div>

          <div className="mt-3 w-full bg-white rounded-xl p-3 flex justify-between mb-2">
            <div className="pt-1 text-xs font-medium text-nrvPrimaryGreen">
              Tenant Verification
            </div>
            <div>
              <Button
                size="normal"
                className=""
                variant="lightGrey"
                showIcon={false}
                onClick={() => {
                  router.push('/dashboard/landlord/properties/verification')
                }}
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-row md:flex gap-4 mt-12">
        <div className="md:w-1/2 w-full">
          <div className="flex justify-between">
            <h2 className="text-sm">Recent Application Entries</h2>{" "}
            <p
              className="underline font-light text-nrvPrimaryGreen text-sm cursor-pointer hover:text-[16px]"
              onClick={() => {
                router.push("/dashboard/landlord/properties/renters");
              }}
            >
              View All
            </p>
          </div>
          <div>
            <ApplicantScreenForDashboard />
          </div>
        </div>

        <div className="md:w-1/2 w-full">
          <div className="text-sm">Analytics</div>
          <div>
            <BarChart options={options} data={data} />
          </div>
          <div>
            <DoughnutChart
              options={optionsForPiechart}
              data={dataForPiechart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
