"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import { useDispatch } from "react-redux";
import { getAllPropertyForTenant } from "../../../../redux/slices/propertySlice";
import TenantLayout from "../../../components/layout/TenantLayout";
import PropertyCard from "../../../components/shared/cards/PropertyCard";
import InputField from "../../../components/shared/input-fields/InputFields";
import Button from "@/app/components/shared/buttons/Button";
import { RefreshCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Button as Btn } from "@/components/ui/button";
import { PublicPropertyDetailsModal } from "@/app/components/property/PublicPropertyDetailsModal";

const INITIAL_FILTERS = {
  searchTerm: "",
  minimiumPrice: "",
  maximiumPrice: "",
};

const LIMIT = 12;

const TenantPropertiesScreen = () => {
  const dispatch = useDispatch();
  const [initialLoad, setInitialLoad] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<typeof INITIAL_FILTERS>(INITIAL_FILTERS);
  const [isListLoading, setIsListLoading] = useState(false);
  const [propertyModalId, setPropertyModalId] = useState<string | null>(null);
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
    const formatMoneyLike = (raw: string) => {
      const digits = raw.replace(/[^\d]/g, "");
      if (!digits) return "";
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const nextValue =
      name === "minimiumPrice" || name === "maximiumPrice"
        ? formatMoneyLike(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (name === "searchTerm") {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        setPage(1);
        fetchData({ page: 1, filters: { ...formData, searchTerm: nextValue } });
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
  const maxPriceDisplay =
    formData.maximiumPrice !== "" && formData.maximiumPrice != null
      ? String(formData.maximiumPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "";

  return (
    <div>
      <ProtectedRoute>
        <TenantLayout>
          <div className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-5 md:px-6 lg:p-8">
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

              <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <SlidersHorizontal className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Find your perfect home
                    </h2>
                    <p className="text-sm text-gray-500">Filter by location and budget</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="search"
                        name="searchTerm"
                        placeholder="City, state or address..."
                        value={formData.searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Min Price (₦)
                    </label>
                    <InputField
                      css="bg-gray-50 border border-gray-300 rounded-xl text-sm py-2.5 focus:bg-white transition-all"
                      placeholder="e.g. 100,000"
                      name="minimiumPrice"
                      value={minPriceDisplay}
                      onChange={handleInputChange}
                      onKeyPress={(e: any) => e.key === "Enter" && handleApplyFilters()}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Max Price (₦)
                    </label>
                    <InputField
                      css="bg-gray-50 border border-gray-300 rounded-xl text-sm py-2.5 focus:bg-white transition-all"
                      placeholder="e.g. 5,000,000"
                      inputType="text"
                      name="maximiumPrice"
                      value={maxPriceDisplay}
                      onChange={handleInputChange}
                      onKeyPress={(e: any) => e.key === "Enter" && handleApplyFilters()}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2 h-[42px]">
                    <Button
                      size="small"
                      className="flex-1 h-full text-white bg-green-700 hover:bg-green-800 border-0 rounded-xl font-medium shadow-sm"
                      variant="ordinary"
                      showIcon={false}
                      onClick={handleApplyFilters}
                      disabled={isListLoading}
                    >
                      Apply
                    </Button>
                    <Button
                      size="small"
                      className="px-3 h-full text-gray-600 bg-gray-100 hover:bg-gray-200 border-0 rounded-xl"
                      variant="ordinary"
                      showIcon={false}
                      onClick={handleClearFilters}
                      disabled={!hasActiveFilters || isListLoading}
                      title="Clear filters"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    <p className="text-xs text-gray-600 font-medium">
                      Filters applied. Change values and click Apply to update.
                    </p>
                  </div>
                )}
              </section>

              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-nrvGreyBlack">
                  {properties.length > 0
                    ? `${properties.length} propert${properties.length === 1 ? "y" : "ies"} found`
                    : "Results"}
                </h2>
              </div>

              {isListLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse"
                    >
                      <div className="h-64 rounded-xl bg-gray-200 mb-4" />
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
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
                      onClick={() => setPropertyModalId(room._id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPropertyModalId(room._id);
                        }
                      }}
                    >
                      <PropertyCard
                        imageUrl={
                          room?.imageUrls?.[0] || room?.file || "/images/featured-img.svg"
                        }
                        address={[room?.propertyId?.city, room?.propertyId?.state].filter(Boolean).join(", ") || "—"}
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

          <PublicPropertyDetailsModal
            roomId={propertyModalId}
            open={propertyModalId !== null}
            onOpenChange={(next) => {
              if (!next) setPropertyModalId(null);
            }}
          />
        </ProtectedRoute>
    </div>
  );
};

export default TenantPropertiesScreen;
