"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CheckCircle2, Clock3, Search, Wrench } from "lucide-react";
import ProtectedRoute from "@/app/components/guard/TenantProtectedRoute";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import TenantLayout from "@/app/components/layout/TenantLayout";
import MaintainanceCard from "@/app/components/maintainance/MaintainanceCard";
import { getTenantByMaintenance } from "@/redux/slices/maintenanceSlice";

type StatusFilter = "All" | "Open" | "In Progress" | "Resolved";

const statusFilters: StatusFilter[] = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
];

const Maintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const storedUser = JSON.parse(
        localStorage.getItem("nrv-user") || "null",
      );
      const response = await dispatch(
        getTenantByMaintenance({ id: storedUser?.user?._id } as any) as any,
      );
      const records = response?.payload?.data;
      setMaintenance(Array.isArray(records) ? records : []);
    } catch {
      setMaintenance([]);
      setErrorMessage("We could not load your maintenance requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(
    () => ({
      all: maintenance.length,
      open: maintenance.filter((item) =>
        ["New", "Acknowledged"].includes(item.status),
      ).length,
      inProgress: maintenance.filter(
        (item) => item.status === "In Progress",
      ).length,
      resolved: maintenance.filter((item) => item.status === "Resolved").length,
    }),
    [maintenance],
  );

  const filteredMaintenance = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return maintenance.filter((item) => {
      const matchesStatus =
        activeFilter === "All" ||
        (activeFilter === "Open" &&
          ["New", "Acknowledged"].includes(item.status)) ||
        item.status === activeFilter;
      const searchableText = [
        item.title,
        item.description,
        item.maintenanceId,
        item.roomId?.apartmentStyle,
        item.roomId?.apartmentType,
        item.roomId?.propertyId?.streetAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedSearchTerm ||
          searchableText.includes(normalizedSearchTerm))
      );
    });
  }, [activeFilter, maintenance, searchTerm]);

  const filterCount = (filter: StatusFilter) => {
    if (filter === "Open") {
      return counts.open;
    }
    if (filter === "In Progress") {
      return counts.inProgress;
    }
    if (filter === "Resolved") {
      return counts.resolved;
    }
    return counts.all;
  };

  return (
    <ProtectedRoute>
      <TenantLayout>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <header className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-1 rounded-lg p-1.5 text-gray-600 transition hover:bg-gray-100"
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
                Track every reported issue and its latest update.
              </p>
            </div>
          </header>

          <section className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Open requests",
                value: counts.open,
                icon: Wrench,
                iconClass: "bg-blue-50 text-blue-700",
              },
              {
                label: "In progress",
                value: counts.inProgress,
                icon: Clock3,
                iconClass: "bg-violet-50 text-violet-700",
              },
              {
                label: "Resolved",
                value: counts.resolved,
                icon: CheckCircle2,
                iconClass: "bg-emerald-50 text-emerald-700",
              },
            ].map(({ label, value, icon: Icon, iconClass }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                  <p className="text-xs font-medium text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? "bg-[#03442C] text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {filter}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        activeFilter === filter
                          ? "bg-white/15 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {filterCount(filter)}
                    </span>
                  </button>
                ))}
              </div>
              <label className="relative block w-full lg:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <span className="sr-only">Search maintenance requests</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search requests"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#03442C] focus:ring-2 focus:ring-[#03442C]/10"
                />
              </label>
            </div>

            {isLoading ? (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
                  >
                    <div className="h-4 w-24 rounded bg-gray-100" />
                    <div className="mt-3 h-6 w-2/3 rounded bg-gray-200" />
                    <div className="mt-5 h-16 rounded-xl bg-gray-100" />
                    <div className="mt-5 h-20 rounded-xl bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : errorMessage ? (
              <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                <p className="text-sm font-medium text-red-700">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => void fetchData()}
                  className="mt-4 text-sm font-semibold text-[#03442C]"
                >
                  Try again
                </button>
              </div>
            ) : filteredMaintenance.length < 1 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-14 text-center">
                <Wrench
                  className="mx-auto h-8 w-8 text-gray-300"
                  aria-hidden="true"
                />
                <p className="mt-3 font-semibold text-gray-800">
                  No matching requests
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try another status or search term.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {filteredMaintenance.map((item) => (
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
                      item?.roomId?.apartmentType
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
          </section>
        </main>
      </TenantLayout>
    </ProtectedRoute>
  );
};

export default Maintainance;
