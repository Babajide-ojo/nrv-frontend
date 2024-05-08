"use client";

import LoadingPage from "../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../components/layout/LandLordLayout";
import EmptyState from "../../components/screens/empty-state/EmptyState";
import Button from "../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import InputField from "../../components/shared/input-fields/InputFields";
import { SlCloudUpload } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { createProperty, getPropertyByUserId } from '../../../redux/slices/propertySlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const dispatch = useDispatch();
  const [propertyData, setPropertyData] = useState<PropertyData>({
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
  });

 



  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
  
      try {
        const properties = await dispatch(getPropertyByUserId(user?.user?._id) as any).unwrap();
        console.log({x:properties });
        setProperties(properties?.data);
      } catch (error) {
        // Handle errors if any
      }
  
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
            {properties.length == 0 ? (
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
                          setShowEmptyState(false);
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
                <div>
                <div>Properties</div>
                {properties.map((property: Property) => (
                  <div key={property.id}>
                    <img src={property.file} className="h-20 w-20" alt="Property" />
                    <p>{property.streetAddress}</p>
                  </div>
                ))}
              </div>
            )}
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default PropertiesScreen;
