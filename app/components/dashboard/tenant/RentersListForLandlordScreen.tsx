"use client";

import React, { useState, useEffect } from "react";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FaPencil } from "react-icons/fi";
import { getTenantsOnboardedByLandlord } from "@/redux/slices/userSlice";
import { getApplicationsByLandlordId } from "@/redux/slices/propertySlice";
import { apiClient } from "@/lib/api";

const RandomColorCircle = ({ firstName, lastName }: any) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;

  const circleStyle = {
    backgroundColor: getRandomColor(),
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
  };

  return (
    <div className="w-1/7">
      <div style={circleStyle}>{initials}</div>
    </div>
  );
};

const getTenantId = (item: any): string | null => {
  const applicant = item?.applicant;
  if (!applicant) {
    return null;
  }
  if (typeof applicant === "string") {
    return applicant;
  }
  return applicant?._id ? String(applicant._id) : null;
};

const RentersListForLandlordScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tenants, setTenants] = useState<any[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchCombinedData = async () => {
    const stored = JSON.parse(localStorage.getItem("nrv-user") as any);
    const landlordId = stored?.user?._id;
    if (!landlordId) {
      setTenants([]);
      setIsLoading(false);
      return;
    }

    const formData = {
      page,
      id: landlordId,
      status: "active",
    };

    try {
      const [applicationsResponse, tenantsResponse, partnersResponse] =
        await Promise.all([
          dispatch(getApplicationsByLandlordId(formData) as any),
          dispatch(getTenantsOnboardedByLandlord({ id: landlordId }) as any),
          apiClient.get(`/messages/partners/${landlordId}`).catch(() => null),
        ]);

      const applicationRows = applicationsResponse?.payload?.data || [];
      const onboardedRows = Array.isArray(tenantsResponse?.payload)
        ? tenantsResponse.payload
        : tenantsResponse?.payload?.data || [];
      const partnerRows = partnersResponse?.data?.data || [];

      const uniqueTenants = new Map<string, any>();

      [...applicationRows, ...onboardedRows].forEach((item: any) => {
        const tenantId = getTenantId(item);
        if (tenantId && !uniqueTenants.has(tenantId)) {
          uniqueTenants.set(tenantId, item);
        }
      });

      partnerRows.forEach((partner: any) => {
        const tenantId = String(partner?.partnerId || "");
        if (!tenantId || uniqueTenants.has(tenantId)) {
          return;
        }
        const user = partner?.partner || {};
        uniqueTenants.set(tenantId, {
          _id: tenantId,
          applicant: user,
          lastMessage: partner?.lastMessage,
        });
      });

      setTenants(Array.from(uniqueTenants.values()));
    } catch (error) {
      console.error("Error fetching combined data:", error);
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, [page]);

  return (
    <div className="p-4 w-full">
      <div className="text-xl">Messages 🏘️...</div>

      {isLoading ? (
        <div className="w-full mx-auto">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex mt-4 rounded-2xl p-4">
              <div className="w-1/5">
                <div className="h-20 rounded" />
              </div>
              <div className="w-4/5">
                <div className="flex justify-between w-full">
                  <div className="h-6 rounded w-1/2" />
                  <div className="h-6 rounded w-1/2 text-right" />
                </div>
                <div className="h-4 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {tenants.length < 1 ? (
            <div className="flex justify-center items-center">
              <div>
                <EmptyState />
                <p className="text-nrvLightGrey m-2">No Tenant Yet</p>
              </div>
            </div>
          ) : (
            <div className="md:mx-auto mt-8 mx-4">
              {tenants.map((property: any) => {
                const tenantId = getTenantId(property);
                const applicant = property?.applicant || {};
                return (
                  <div
                    key={tenantId || property._id}
                    role="button"
                    tabIndex={0}
                    className="p-2 rounded-lg w-full mt-8 flex justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      if (tenantId) {
                        router.push(`/dashboard/landlord/messages/${tenantId}`);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        tenantId
                      ) {
                        e.preventDefault();
                        router.push(`/dashboard/landlord/messages/${tenantId}`);
                      }
                    }}
                  >
                    <div className="w-full">
                      <div className="flex gap-2 items-center">
                        <RandomColorCircle
                          firstName={applicant?.firstName}
                          lastName={applicant?.lastName}
                        />
                        <div>
                          <p className="w-full text-sm text-nrvDarkGrey font-medium mt-1">
                            {applicant?.firstName} {applicant?.lastName}
                          </p>
                          {property?.lastMessage ? (
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {property.lastMessage}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/5 text-end flex flex-col justify-between h-full">
                      <FaPencil className="cursor-pointer" color="grey" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentersListForLandlordScreen;
