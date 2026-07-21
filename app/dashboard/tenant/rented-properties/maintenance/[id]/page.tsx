"use client";
import TenantLayout from "@/app/components/layout/TenantLayout";
import ProtectedRoute from "@/app/components/guard/TenantProtectedRoute";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MaintainanceCard from "@/app/components/maintainance/MaintainanceCard";
import { useDispatch } from "react-redux";
import { getMaintenanceByUserId } from "../../../../../../redux/slices/maintenanceSlice";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import { Plus, Wrench } from "lucide-react";

const Maintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [maintenance, setMaintenance] = useState<any[]>([]);


  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    const formData = {
      page: 1,
      id: user?.user?._id,
      roomId: id,
    };

    try {
      const response = await dispatch(getMaintenanceByUserId(formData) as any);
      setMaintenance(
        Array.isArray(response?.payload?.data) ? response.payload.data : [],
      );
    } catch {
      setMaintenance([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const room = maintenance[0]?.roomId;
  const listing = room?.propertyId;
  const apartmentAddress = [
    listing?.streetAddress,
    listing?.city,
    listing?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <ProtectedRoute>
      <TenantLayout>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="mt-1 rounded-md p-1 text-gray-600 transition hover:bg-gray-100"
                aria-label="Go back"
              >
                <BackIcon />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-[#03442C]" aria-hidden="true" />
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    Maintenance requests
                  </h1>
                </div>
                <p className="mt-1.5 text-sm text-gray-600">
                  Track reported issues and updates for this apartment.
                </p>
                {room && (
                  <p className="mt-2 text-sm font-medium text-[#03442C]">
                    {room?.apartmentStyle || room?.description || "Apartment"}
                    {room?.roomId != null ? ` · Unit ${room.roomId}` : ""}
                    {apartmentAddress ? ` · ${apartmentAddress}` : ""}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/tenant/rented-properties/maintenance/request-maintainance/${id}`,
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#03442C] px-5 text-sm font-semibold text-white transition hover:bg-[#023522]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create request
            </button>
          </div>

          {!isLoading && maintenance.length > 0 && (
            <div className="mt-7 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {maintenance.length}{" "}
                {maintenance.length === 1 ? "request" : "requests"}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
                >
                  <div className="h-5 w-2/3 rounded bg-gray-200" />
                  <div className="mt-4 h-4 w-full rounded bg-gray-100" />
                  <div className="mt-2 h-4 w-4/5 rounded bg-gray-100" />
                  <div className="mt-6 h-20 rounded-xl bg-gray-100" />
                </div>
              ))}
            </div>
          ) : maintenance.length < 1 ? (
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                  <Wrench className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                </div>
                <p className="mt-4 font-medium text-gray-800">
                  No maintenance requests yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Report an issue and track its progress here.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/dashboard/tenant/rented-properties/maintenance/request-maintainance/${id}`,
                    )
                  }
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#03442C] px-5 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create request
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {maintenance.map((item: any) => (
                <MaintainanceCard
                  key={item._id}
                  type="tenant"
                  title={item.title}
                  description={item.description}
                  dateLogged={item.createdAt}
                  status={item.status}
                  id={item._id}
                  maintenanceId={item.maintenanceId}
                  priority={item.priority}
                  file={item.file}
                  apartmentId={item?.roomId?._id}
                  unitNumber={item?.roomId?.roomId}
                  apartmentName={
                    item?.roomId?.apartmentStyle ||
                    item?.roomId?.description
                  }
                  address={[
                    item?.roomId?.propertyId?.streetAddress,
                    item?.roomId?.propertyId?.city,
                    item?.roomId?.propertyId?.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              ))}
            </div>
          )}
        </main>
      </TenantLayout>
    </ProtectedRoute>
  );
};

export default Maintainance;
