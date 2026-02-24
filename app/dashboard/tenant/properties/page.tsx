"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getAllPropertyForTenant } from "../../../../redux/slices/propertySlice";
import "react-toastify/dist/ReactToastify.css";
import TenantLayout from "../../../components/layout/TenantLayout";
import PropertyCard from "../../../components/shared/cards/PropertyCard";
import InputField from "../../../components/shared/input-fields/InputFields";
import Button from "@/app/components/shared/buttons/Button";
import { RefreshCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Button as Btn } from "@/components/ui/button";

const INITIAL_FILTERS = {
  searchTerm: "",
  minimiumPrice: "",
  maximiumPrice: "",
};

const LIMIT = 12;

const TenantPropertiesScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<typeof INITIAL_FILTERS>(INITIAL_FILTERS);
  const [isListLoading, setIsListLoading] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 400;

  const buildPayload = useCallback(
    (overrides?: { page?: number; filters?: typeof INITIAL_FILTERS }) => {
      const p = overrides?.page ?? page;
      const f = overrides?.filters ?? formData;
      const payload: any = { page: p, limit: LIMIT };
      if (f.searchTerm?.trim()) payload.searchTerm = f.searchTerm.trim();
      const min = f.minimiumPrice ? Number(String(f.minimiumPrice).replace(/,/g, "")) : undefined;
      const max = f.maximiumPrice ? Number(String(f.maximiumPrice).replace(/,/g, "")) : undefined;
      if (min != null && !Number.isNaN(min)) payload.minimiumPrice = min;
      if (max != null && !Number.isNaN(max)) payload.maximiumPrice = max;
      return payload;
    },
    [page, formData],
  );

  const fetchData = useCallback(
    async (overrides?: { page?: number; filters?: typeof INITIAL_FILTERS }) => {
      const payload = buildPayload(overrides);
      try {
        if (initialLoad) {
          setInitialLoad(false);
        } else {
          setIsListLoading(true);
        }
        const response = await dispatch(getAllPropertyForTenant(payload) as any);
        const data = response?.payload?.data;
        setProperties(Array.isArray(data) ? data : []);
      } catch {
        setProperties([]);
      } finally {
        setIsListLoading(false);
      }
    },
    [dispatch, buildPayload, initialLoad],
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "searchTerm") {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        setPage(1);
        fetchData({ page: 1, filters: { ...formData, searchTerm: value } });
      }, DEBOUNCE_MS);
    }
  };

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    if (page === 1) fetchData();
  };

  const handleClearFilters = () => {
    setFormData(INITIAL_FILTERS);
    setPage(1);
    if (page === 1) {
      fetchData({ page: 1, filters: INITIAL_FILTERS });
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApplyFilters();
  };

  const hasActiveFilters =
    (formData.searchTerm?.trim()?.length ?? 0) > 0 ||
    (formData.minimiumPrice?.toString()?.trim() ?? "") !== "" ||
    (formData.maximiumPrice?.toString()?.trim() ?? "") !== "";

  const minPriceDisplay =
    formData.minimiumPrice !== "" && formData.minimiumPrice != null
      ? String(formData.minimiumPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "";

  return (
    <div>
      {initialLoad && !properties.length && !isListLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl text-nrvGreyBlack font-semibold">
                    Available Rooms & Apartments
                  </h1>
                  <p className="text-nrvLightGrey text-sm mt-1">
                    Browse and apply for available rooms and apartments
                  </p>
                </div>
                <Btn
                  variant="outline"
                  size="sm"
                  className="gap-2 shrink-0 w-fit"
                  onClick={handleRefresh}
                  disabled={isListLoading}
                >
                  <RefreshCcw className={`w-4 h-4 ${isListLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Btn>
              </div>

              <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-nrvGreyBlack">
                    Filter by location and budget
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search by location
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="search"
                        name="searchTerm"
                        placeholder="City, state or address"
                        value={formData.searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Updates as you type (no need to click Apply)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum price (₦)
                    </label>
                    <InputField
                      css="bg-white border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. 100000"
                      name="minimiumPrice"
                      value={minPriceDisplay}
                      onChange={handleInputChange}
                      onKeyPress={(e: any) => e.key === "Enter" && handleApplyFilters()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum price (₦)
                    </label>
                    <InputField
                      css="bg-white border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. 5000000"
                      inputType="text"
                      name="maximiumPrice"
                      value={formData.maximiumPrice}
                      onChange={handleInputChange}
                      onKeyPress={(e: any) => e.key === "Enter" && handleApplyFilters()}
                    />
                  </div>
                  <div className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                    <Button
                      size="small"
                      className="flex-1 sm:flex-none text-white bg-green-700 hover:bg-green-800 border-0"
                      variant="ordinary"
                      showIcon={false}
                      onClick={handleApplyFilters}
                      disabled={isListLoading}
                    >
                      Apply filters
                    </Button>
                    <Button
                      size="small"
                      className="flex-1 sm:flex-none text-nrvDarkGrey bg-gray-200 hover:bg-gray-300 border-0 gap-1"
                      variant="ordinary"
                      showIcon={false}
                      onClick={handleClearFilters}
                      disabled={!hasActiveFilters || isListLoading}
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  </div>
                </div>
                {hasActiveFilters && (
                  <p className="text-xs text-gray-500 mt-3">
                    Filters applied. Change values and click &quot;Apply filters&quot; to update, or &quot;Clear&quot; to reset.
                  </p>
                )}
              </section>

              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-nrvGreyBlack">
                  {properties.length > 0
                    ? `${properties.length} propert${properties.length === 1 ? "y" : "ies"} found`
                    : "Results"}
                </h2>
              </div>

              {isListLoading && !initialLoad ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse"
                    >
                      <div className="h-80 rounded-xl bg-gray-200 mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : !properties?.length ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-10 text-center">
                  <p className="text-gray-600 font-medium">No properties match your filters</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting location or price range, or clear filters to see all listings.
                  </p>
                  <Btn
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </Btn>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {properties.map((room: any) => (
                    <div
                      key={room._id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/tenant/properties/${room._id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/dashboard/tenant/properties/${room._id}`);
                        }
                      }}
                    >
                      <PropertyCard
                        imageUrl={
                          room?.imageUrls?.[0] || room?.file || room?.propertyId?.file
                        }
                        address={`${room?.propertyId?.streetAddress ?? ""} ${room?.propertyId?.city ?? ""} ${room?.propertyId?.state ?? ""}`.trim()}
                        rentAmount={room?.rentAmount}
                        property={room}
                      />
                    </div>
                  ))}
                </div>
              )}

              {properties.length >= LIMIT && !isListLoading && (
                <div className="flex justify-center gap-2 mt-8">
                  <Btn
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Btn>
                  <span className="flex items-center px-3 text-sm text-gray-600">
                    Page {page}
                  </span>
                  <Btn
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={properties.length < LIMIT}
                  >
                    Next
                  </Btn>
                </div>
              )}
            </div>
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default TenantPropertiesScreen;
