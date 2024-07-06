"use client";
import { useEffect } from "react";
import { dashboardMetrics, dashboardNavLinks } from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import DashboardNavigationCard from "../../shared/cards/DashboardNavigationCard";
import { useState } from "react";
import { getApplicationCount } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

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
    const formData = {
      id: user?.user?._id,
    };

    try {
      const response = await dispatch(getApplicationCount(formData) as any);
      console.log({ response: response.payload.data });

      setCount(response.payload.data);
    } catch (error) {
    } finally {
    }
  };
const dashboardMetrics = [
    {
      imageLink:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
      title: "Tenants",
      number: count.totalActiveTenants,
    },
    {
      imageLink:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
      title: "Leads",
      number:  count.totalAccepted,
    },
    {
      imageLink:
        "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
      title: "Applicants",
      number:  count.totalNew,
    },
  ];

  return (
    <div className="md:p-8 p-3 mb-16 md:mb-0">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} 👋,
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="flex-row md:flex gap-12">
        <div className="md:w-1/2 w-full">
          <div className=" grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {dashboardMetrics.map(({ title, imageLink, number }, index) => (
              <div key={index} onClick={() => router.push('/dashboard/landlord/properties/renters')}>
                <DashboardNavigationCard
                  title={title}
                  imageLink={imageLink}
                  number={number}
                  isMetric={true}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 w-full bg-white rounded-lg p-3 flex justify-between">
            <div className="pt-1 font-light">Ongoing Maintenance: 0</div>
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

          <div className="mt-8 w-full bg-white rounded-lg p-3 flex justify-between mb-4">
            <div className="pt-1 font-light">Collect Rent Online</div>
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
        </div>

        <div className="md:w-1/2 w-full">
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardNavLinks.map(({ title, imageLink, number }, index) => (
              <div key={index}>
                <DashboardNavigationCard
                  title={title}
                  imageLink={imageLink}
                  number={number}
                  isMetric={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
