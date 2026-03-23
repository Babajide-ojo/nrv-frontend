"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import Button from "../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getPropertyByUserId,
  getRentedApartmentsForTenant,
} from "../../../../redux/slices/propertySlice";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { FcHome } from "react-icons/fc";
import { FaPen } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const RandomColorCircle = ({ firstName, lastName }: any) => {
  // Function to generate random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Get initials
  const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

  // Styles for the circle with random background color
  const circleStyle = {
    backgroundColor: getRandomColor(),
    width: "50px", // adjust size as needed
    height: "50px", // adjust size as needed
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff", // Text color (white)
    fontWeight: "bold",
    fontSize: "18px", // Adjust font size as needed
  };

  return (
    <div className="w-1/7">
      <div style={circleStyle}>{initials}</div>
    </div>
  );
};

const RentersListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading

  const dispatch = useDispatch();
  const router = useRouter();

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
      page: page,
    };

    try {
      const response = await dispatch(
        getRentedApartmentsForTenant(formData) as any
      ); 
      // console.log({reponse: response?.payload?.data});
      const uniqueOwners: any = new Map(); // Use a Map to ensure uniqueness by ownerId

      response?.payload?.data.forEach((item: any) => {
          if (!uniqueOwners.has(item.ownerId)) {
              uniqueOwners.set(item.ownerId, item);
          }
      });
      
      const uniqueOwnerArray = Array.from(uniqueOwners.values());
      setProperties(uniqueOwnerArray);
      setTotalPages(response?.totalPages);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]); // Reload properties when page changes

  const handleNextPage = () => {
    if (page) {
      setIsPageLoading(true);
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setIsPageLoading(true);
      setPage(page - 1);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="text-xl">Messages 🏘️</div>

      {isLoading ? (
        <div className="md:mx-auto mt-8 mx-4 space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 rounded-lg w-full flex justify-between items-center bg-white border border-gray-100 animate-pulse">
              <div className="flex gap-4 items-center w-full">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="space-y-2 w-full max-w-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0"></div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {properties?.length < 1 ? (
            <div className="">
              <div className="flex justify-center items-center">
                <div className="w-full max-w-md text-center rounded-2xl border border-gray-200 bg-white p-8 mt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start a chat from a rented apartment when available.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:mx-auto mt-8 mx-4 ">
              {properties?.map((property: any) => (
                <div
                  key={property.id}
                  className="p-2 rounded rounded-lg w-full mt-8 flex justify-between"
                  onClick={() => {
                    router.push(
                      `/dashboard/tenant/messages/${property.ownerId._id}`
                    );
                  }}
                >
                  <div className="w-full">
                    <div className="flex gap-2 ">
                      <div className="w-1/7">
                        <RandomColorCircle
                          firstName={property.ownerId?.firstName}
                          lastName={property.ownerId?.lastName}
                        />
                      </div>

                      <p className="w-6/7 text-sm text-nrvDarkGrey font-light mt-3">
                        {property.ownerId?.firstName}{" "}
                        {property.ownerId?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/5 text-end flex flex-col justify-between h-full">
          
                    <FaPencil
                      className="cursor-pointer"
                      color="grey"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentersListScreen;
