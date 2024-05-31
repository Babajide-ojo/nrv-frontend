"use client";

import { BsHouse } from "react-icons/bs";
import { IoPencilOutline } from "react-icons/io5";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import { PiPencilSimpleLight } from "react-icons/pi";
import Button from "../../../../components/shared/buttons/Button";
import { useEffect, useState } from "react";
import PropertyOverview from "../../../../components/property-dashboard/PropertyOverview";
import PropertyMarketing from "../../../../components/property-dashboard/PropertyMarketing";
import PropertyMaintenance from "../../../../components/property-dashboard/PropertyMaintenance";
import PropertyDocuments from "../../../../components/property-dashboard/PropertyDocuments";
import PropertyExpenses from "../../../../components/property-dashboard/PropertyExpenses";
import { getPropertyByUserId } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { getPropertyById } from "../../../../../redux/slices/propertySlice";

const propertyDashboardLinks: any = [
  {
    id: 1,
    name: "Overview",
  },
  // {
  //   id: 2,
  //   name: "Marketing",
  // },
  {
    id: 2,
    name: "Maintenance",
  },
  {
    id: 3,
    name: "Document",
  },
  {
    id: 4,
    name: "Expenses",
  },
];

interface Property {
  id: string;
  file: string;
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
}

const SingleProperty = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();

  const [currentState, setCurrentState] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [singleProperty, setSingleProperty] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      try {
        const properties = await dispatch(getPropertyById(id) as any).unwrap();
        setSingleProperty(properties?.data);
      } catch (error) {}

      return () => clearTimeout(timer);
    };

    fetchData();
  }, []);

  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout>
          <div className="">
            <div>
              <div className="flex justify-between px-4 py-12 md:px-24 md:py-12">
                <div>
                  <div className="flex gap-2">
                    <div className="h-16 w-16  bg-nrvDarkBlue rounded rounded-lg flex justify-center flex-col items-center">
                      <BsHouse color="white" size={35} />
                    </div>
                    {/* <img
                          src={property.file}
                          className="h-16 w-16"
                          alt="Property"
                        /> */}
                    <p className="text-md font-medium text-nrvDarkBlue text-nrvDarkGrey font-light">
                      {singleProperty?.streetAddress}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      size="normal"
                      className="text-nrvDarkBlue border border-nrvDarkBlue mt-2 rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div className="flex gap-3 p-1.5">Rental ID: 1340201</div>
                    </Button>
                    <Button
                      size="normal"
                      className="text-nrvDarkBlue border border-nrvDarkBlue mt-2 rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div className="flex gap-3 p-1.5">Rent: ₦0.00</div>
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="p-2 border border-gray-500 rounded rounded-full">
                    <PiPencilSimpleLight />
                  </div>
                </div>
              </div>
              {/* <div className="flex w-full gap-1 md:gap-6 bg-nrvGreyMediumBg mt-1 md:pl-24 pl-4 overflow-scroll">
                {propertyDashboardLinks.map((item: any) => (
                  <div key={item.id}>
                    <Button
                      size="normal"
                      className="bg-nrvGreyMediumBg text-nrvDarkBlue p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2"
                      variant="mediumGrey"
                      showIcon={false}
                      onClick={() => {
                        setCurrentState(item.id)
                      }}
                    >
                      <div className="text-xs  md:text-md p-2">{item.name}</div>
                    </Button>
                  </div>
                ))}
              </div> */}
              <div className="flex w-full gap-1 md:gap-6 bg-nrvGreyMediumBg mt-1 md:pl-24 pl-4 overflow-scroll">
                {propertyDashboardLinks.map((item: any) => (
                  <div key={item.id}>
                    <Button
                      size="normal"
                      className={` text-nrvDarkBlue p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2 ${
                        currentState === item.id ? "bg-nrvDarkBlue text-white" : "bg-nrvGreyMediumBg"
                      }`}
                      variant="ordinary"
                      showIcon={false}
                      onClick={() => {
                        setCurrentState(item.id);
                      }}
                    >
                      <div className="text-xs  md:text-md p-2">{item.name}</div>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="px-4 py-12 md:px-24 md:py-12">
                {currentState === 1 && singleProperty && (
                  <PropertyOverview data={singleProperty} />
                )}
                {/* {currentState === 2 && <PropertyMarketing />} */}
                {currentState === 2 && <PropertyMaintenance />}
                {currentState === 3 && <PropertyDocuments />}
                {currentState === 4 && <PropertyExpenses />}
              </div>
            </div>
          </div>
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default SingleProperty;
