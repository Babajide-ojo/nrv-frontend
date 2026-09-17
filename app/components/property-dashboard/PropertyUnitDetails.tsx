"use client";
import { formatNumber } from "@/helpers/utils";
import React, { useState } from "react";

interface PropertyData {
  tenantName: string;
  tenantAge: string;
  tenantType: string;
  rentStart: string;
  rentEnd: string;
  tenantStatus: string;
  address: string;
  description: string;
  noOfBedrooms: number;
  noOfBathrooms: number;
  apartmentSize: string;
  propertyType: string;
  rentPreference: string;
  paymentOption: string;
  amenities: string[];
  apartmentStyle: string;
  rentAmount: number;
  file: string;
}

interface Props {
  data: any;
}

const PropertyUnitDetails: React.FC<Props> = ({ data }) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const unitImages = data?.imageUrls || [];
  const hasImages = unitImages.length > 0;
  
  // Show first 2 images initially, or all if showAllImages is true
  const displayedImages = showAllImages ? unitImages : unitImages.slice(0, 2);
  const remainingCount = unitImages.length - 2;
  
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="mt-6 w-full rounded-2xl border border-gray-100 bg-white p-3 font-jakarta shadow-lg sm:p-5 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="mb-1 text-base font-semibold text-gray-800">
              Apartment Details
            </h3>
            <p className="text-xs text-gray-500">
              Complete information about this unit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {data?.description || "—"}
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Number of Bedrooms
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {data?.noOfRooms ?? "—"}
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Number of Bathrooms
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {data?.noOfBaths ?? "—"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Apartment Style
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {data?.apartmentStyle || "—"}
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Lease Terms
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {data?.leaseTerms || "—"}
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Rental Collection Preference
                </p>
                <p className="text-sm font-medium capitalize text-[#099137]">
                  {data?.rentAmountMetrics || "—"}
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Payment Option
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {data?.paymentOption || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="rounded-xl border border-green-100 bg-[#F3FAF4] p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-800">
              Apartment Facilities & Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {data?.otherAmentities?.map((item: any, index: any) => (
                <span
                  key={index}
                  className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-medium text-green-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Section */}
        <div className="w-full space-y-6">
          {/* Unit Images Gallery */}
          {hasImages ? (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h4 className="text-sm font-semibold text-gray-800">Unit Images</h4>
                <p className="text-xs text-gray-500">Click on images to view full size</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {displayedImages.map((imageUrl: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Unit ${index + 1}`}
                      className="w-full h-36 object-cover rounded-xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-md"
                      onClick={() => handleImageClick(imageUrl)}
                    />
                    {/* Enhanced overlay for hover effect */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-xl flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-2">
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* See More Button */}
              {!showAllImages && remainingCount > 0 && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200"
                >
                  + See {remainingCount} more image{remainingCount > 1 ? 's' : ''}
                </button>
              )}
              
              {/* Show Less Button */}
              {showAllImages && unitImages.length > 2 && (
                <button
                  onClick={() => setShowAllImages(false)}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  Show Less
                </button>
              )}
            </div>
          ) : (
            /* Fallback to property image if no unit images */
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h4 className="text-sm font-semibold text-gray-800">Property Image</h4>
                <p className="text-xs text-gray-500">Main property image</p>
              </div>
              <img
                src={data?.propertyId?.file}
                alt="Apartment"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
          )}
          
          {/* Price summary */}
          <div className="rounded-xl border border-green-100 bg-[#F3FAF4] p-4">
            <p className="text-xs font-medium text-gray-500">Price (Per Annum)</p>
            <p className="mt-1 text-lg font-semibold text-[#099137]">
              ₦{formatNumber(data?.rentAmount?.toString())}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-5xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closeImageModal}
                className="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                ×
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyUnitDetails;

