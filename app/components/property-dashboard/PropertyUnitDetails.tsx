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
  propertyName: string;
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
  
  console.log({data})
  
  // Get unit images from the data
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
    <div className="w-full font-jakarta bg-white shadow-lg border border-gray-100 rounded-2xl mt-6 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Apartment Details</h3>
            <p className="text-gray-600 text-sm">Complete information about this unit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Description</p>
                <p className="text-gray-800 font-medium leading-relaxed">{data?.description}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Number of Bedrooms</p>
                <p className="text-gray-800 font-semibold text-lg">{data?.noOfRooms}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Number of Bathrooms</p>
                <p className="text-gray-800 font-semibold text-lg">{data?.noOfBaths}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Apartment Style</p>
                <p className="text-gray-800 font-semibold">{data?.apartmentStyle}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Lease Terms</p>
                <p className="text-gray-800 font-semibold">{data?.leaseTerms}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Rental Collection Preference</p>
                <p className="text-green-600 font-bold text-sm uppercase">{data?.rentAmountMetrics}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Payment Option</p>
                <p className="text-gray-800 font-semibold">{data?.paymentOption}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Apartment Facilities & Amenities
            </h4>
            <div className="flex flex-wrap gap-3">
              {data?.otherAmentities?.map((item: any, index: any) => (
                <span
                  key={index}
                  className="bg-white text-green-700 text-sm px-4 py-2 rounded-full font-medium border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200"
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
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Unit Images</h4>
                <p className="text-gray-600 text-sm">Click on images to view full size</p>
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
              <div className="border-b border-gray-100 pb-3">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Property Image</h4>
                <p className="text-gray-600 text-sm">Main property image</p>
              </div>
              <img
                src={data?.propertyId?.file}
                alt="Apartment"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
          )}
          
          {/* Price and Style Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Apartment Style</span>
                <span className="text-gray-800 font-semibold">{data?.apartmentStyle}</span>
              </div>
              <div className="border-t border-green-200 pt-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-1">Price (Per Annum)</p>
                  <p className="text-2xl font-bold text-green-700">₦{formatNumber(data?.rentAmount?.toString())}</p>
                </div>
              </div>
            </div>
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

