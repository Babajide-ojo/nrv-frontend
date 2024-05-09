"use client";

import LoadingPage from "../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../components/layout/LandLordLayout";
import EmptyState from "../../components/screens/empty-state/EmptyState";
import Button from "../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getPropertyByUserId } from "../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsHouse } from "react-icons/bs";
import CenterModal from "@/app/components/shared/modals/CenterModal";

interface PropertyData {
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Property {
  id: string;
  file: string;
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
}

const PropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [singleProperty, setSingleProperty] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      try {
        const properties = await dispatch(
          getPropertyByUserId(user?.user?._id) as any
        ).unwrap();
        console.log({ x: properties });
        setProperties(properties?.data);
      } catch (error) {}

      return () => clearTimeout(timer);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout>
            <ToastContainer />
            {properties.length == 2 ? (
              <div className="p-8 w-full">
                <div className="text-2xl">Properties 🏘️,</div>
                <p className="text-sm text-nrvLightGrey">
                  Let’s add another property :)
                </p>
                <div className="w-full h-screen flex justify-center items-center">
                  <div className="">
                    <EmptyState />
                    <p className="text-nrvLightGrey m-2">
                      No property listed yet
                    </p>
                    <Button
                      size="small"
                      className="text-nrvDarkBlue block w-full border border-nrvDarkBlue mt-4 rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div
                        className="flex gap-3"
                        onClick={() => {
                          router.push("/dashboard/properties/create");
                        }}
                      >
                        <IoAddCircle size={20} className="text-nrvDarkBlue" />{" "}
                        <p className="text-nrvDarkBlue">Add New</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl min-w-lg md:mx-auto mt-8 mx-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-2xl">Properties 🏘️,</div>
                    <p className="text-sm text-nrvLightGrey">
                      Let’s add another property :)
                    </p>
                  </div>
                  <Button
                    size="small"
                    className="text-nrvDarkBlue p-3  border border-nrvDarkBlue mt-4 rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                  >
                    <div
                      className="flex gap-3"
                      onClick={() => {
                        router.push("/dashboard/properties/create");
                      }}
                    >
                      <IoAddCircle size={20} className="text-nrvDarkBlue" />{" "}
                      <p className="text-nrvDarkBlue">Add New</p>
                    </div>
                  </Button>
                </div>
                {properties.map((property: Property) => (
                  <div
                    key={property.id}
                    className="bg-white p-3 rounded rounded-lg w-full mt-8 flex justify-between"
                  >
                    <div className="w-3/5">
                      <div className="flex gap-2">
                        <div className="h-16 md:w-16 w-32 bg-nrvDarkBlue rounded rounded-lg flex justify-center flex-col items-center">
                          <BsHouse color="white" size={35} />
                        </div>
                        {/* <img
                          src={property.file}
                          className="h-16 w-16"
                          alt="Property"
                        /> */}
                        <p className="text-xs text-nrvDarkGrey font-light">
                          {property.streetAddress}
                        </p>
                      </div>
                    </div>
                    <div className="w-2/5 text-end">
                      <Button
                        size="small"
                        className="text-nrvDarkBlue text-xs  border border-nrvDarkBlue mt-8 rounded-md"
                        variant="lightGrey"
                        showIcon={false}
                      >
                        <div
                          className="flex gap-3"
                          onClick={() => {
                            setSingleProperty(property);
                            setIsOpen(true);
                          }}
                        >
                          <p className="text-nrvDarkBlue text-xs">
                            View details
                          </p>
                        </div>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </LandLordLayout>
          <CenterModal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <div className="mx-auto text-center p-4">
              <h2 className="text-nrvDarkBlue font-semibold">Full Details</h2>
              <p className="text-nrvLightGrey text-sm">
                View your property full details
              </p>
              <p className="text-nrvLightGrey underline mt-4 text-sm">
                {singleProperty.streetAddress}
              </p>

              <ul className="list-disc pl-6">
                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue text-md">
                    Property Type:{" "}
                    <span className="text-nrvLightGrey">
                      Single-Family Home
                    </span>
                  </div>
                </li>
                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue text-md">
                    Bedrooms: <span className="text-nrvLightGrey">3</span>
                  </div>
                </li>
                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue text-md">
                    Baths:<span className="text-nrvLightGrey">5</span>
                  </div>
                </li>
                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue text-md">
                    {" "}
                    Rent Amount:{" "}
                    <span className="text-nrvLightGrey">
                      {" "}
                      ₦600,000 per month
                    </span>
                  </div>
                </li>
                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue text-md">
                    Security Deposit:{" "}
                    <span className="text-nrvLightGrey"> ₦100,000</span>
                  </div>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                <Button
                  size="large"
                  className="text-white w-72 max-w-full   border border-nrvDarkBlue mt-2 rounded-md"
                  variant="bluebg"
                  showIcon={false}
                >
                  <div
                    className="flex gap-3"
                    onClick={() => {
                    router.push(`/dashboard/properties/${1}`)
                    }}
                  >
                    Edit Property
                  </div>
                </Button>
                <Button
                  size="large"
                  className="text-nrvDarkBlue  w-72  max-w-full border border-nrvDarkBlue mt-2 rounded-md"
                  variant="lightGrey"
                  showIcon={false}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <div
                    className="flex gap-3"
                 
                  >
                    Close
                  </div>
                </Button>
              </div>
            </div>
          </CenterModal>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default PropertiesScreen;
