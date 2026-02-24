"use client";

import React from "react";
import Button from "../buttons/Button";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaStar,
  FaPaintRoller,
} from "react-icons/fa";
import { FaAirbnb } from "react-icons/fa6";
import { CgStyle } from "react-icons/cg";

interface PropertyCardProps {
  imageUrl: string;
  address: string;
  rentAmount: string;
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  address,
  rentAmount,
  property,
}) => {
  const description = property?.description || property?.propertyId?.description || "Room Description";
  const addressText = address?.trim() || `${property?.propertyId?.streetAddress ?? ""} ${property?.propertyId?.city ?? ""} ${property?.propertyId?.state ?? ""}`.trim() || "—";
  const bedrooms = property?.noOfRooms ?? property?.propertyId?.noOfRooms ?? "N/A";
  const bathrooms = property?.noOfBaths ?? property?.propertyId?.noOfBaths ?? "N/A";
  const style = (property?.apartmentStyle ?? property?.propertyId?.apartmentStyle)?.toString()?.trim() || "N/A";
  const type = (property?.apartmentType ?? property?.propertyId?.apartmentType)?.toString()?.trim() || "N/A";

  return (
    <div className="w-full h-full flex flex-col bg-white shadow-lg border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image section with overlay button */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-4 shrink-0">
        <img
          src={imageUrl || property?.imageUrls?.[0] || property?.file || property?.propertyId?.file}
          alt="property"
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute bottom-4 right-4 bg-white text-gray-800 font-semibold text-sm px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
          View Details
        </button>
        {/* Carousel dots (static) */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"></span>
          <span className="w-2.5 h-2.5 bg-white bg-opacity-50 rounded-full shadow-sm"></span>
          <span className="w-2.5 h-2.5 bg-white bg-opacity-50 rounded-full shadow-sm"></span>
        </div>
      </div>

      {/* Title and address - fixed min height for alignment */}
      <div className="mb-4 min-h-[72px] flex flex-col shrink-0">
        <h2 className="text-sm font-light text-gray-800 mb-2 leading-relaxed line-clamp-2">
          {description}
        </h2>
        <div className="flex items-start text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 mt-0.5 shrink-0 text-gray-400" />
          <span className="text-gray-700 line-clamp-2 break-words">
            {addressText}
          </span>
        </div>
      </div>

      {/* Rent section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100 shrink-0">
        <div className="text-xl font-bold text-green-900">
          ₦ {parseInt(rentAmount || property?.rentAmount || "0", 10).toLocaleString()}
        </div>
        <div className="text-sm text-green-700 font-medium">
          {property?.rentAmountMetrics || "Per Annum"}
        </div>
      </div>

      {/* Features section - equal height cells for alignment */}
      <div className="bg-gray-50 py-4 px-3 rounded-xl mb-4 mt-auto shrink-0">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <FaBed className="text-green-600 text-lg" />, label: "Bedrooms", value: bedrooms },
            { icon: <FaBath className="text-green-600 text-lg" />, label: "Bathrooms", value: bathrooms },
            { icon: <FaPaintRoller className="text-green-600 text-lg" />, label: "Style", value: style },
            { icon: <CgStyle className="text-green-600 text-lg" />, label: "Type", value: type },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="text-center min-h-[64px] flex flex-col items-center justify-center"
            >
              <div className="flex items-center justify-center mb-1">{icon}</div>
              <div className="text-xs text-gray-600 mb-1">{label}</div>
              <div className="text-sm font-semibold text-gray-800 min-h-[20px] flex items-center justify-center">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
     {/* <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Available Amenities
        </h4>
        <div className="flex flex-wrap gap-2">
          {property?.otherAmentities?.map((item: string, idx: number) => (
            <span
              key={idx}
              className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-200"
            >
              {item}
            </span>
          ))}
        </div>
        {(!property?.otherAmentities || property?.otherAmentities.length === 0) && (
          <p className="text-gray-400 text-xs italic">No amenities listed</p>
        )}
      </div>

      {/* Room Status */}
      <div className="pt-3 border-t border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">Status:</span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            property?.assignedToTenant 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {property?.assignedToTenant ? 'Occupied' : 'Available'}
          </span>
        </div>
        {property?.leaseTerms && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lease Terms:</span>
            <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
              {property.leaseTerms}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
