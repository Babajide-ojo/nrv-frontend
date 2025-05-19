"use client";

import React from "react";
import Button from "../buttons/Button";
import { FaMapMarkerAlt, FaBed, FaBath, FaUsers, FaStar } from "react-icons/fa";
import { FaAirbnb } from "react-icons/fa6";

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
  console.log({ imageUrl, address, rentAmount, property });

  return (
    <div className="w-full bg-white shadow-md rounded-3xl p-4">
      {/* Image section with overlay button */}
      <div className="relative h-80 rounded-xl overflow-hidden">
        <img
          src={property.propertyId.file}
          alt="property"
          className="object-cover w-full h-full"
        />
        <button className="absolute bottom-4 right-4 bg-lime-400 text-black font-medium text-sm px-4 py-2 rounded-full shadow">
          View Details
        </button>
        {/* Carousel dots (static) */}
        <div className="absolute bottom-4 left-4 flex gap-1">
          <span className="w-2 h-2 bg-lime-400 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      <div className="flex justify-between">
        {/* Title and address */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {property.description || "Two Master Bedroom All En-suite"}
          </h2>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <FaMapMarkerAlt className="mr-1" />
            {property?.propertyId?.streetAddress} {property?.propertyId?.city}{" "}
            {property?.propertyId?.state}
          </div>
        </div>
        {/* Rent */}
        <div className="mt-4 text-lg font-semibold text-gray-800 text-end">
          ₦ {parseInt(rentAmount).toLocaleString()}{" "}<br></br>
          <span className="text-sm font-light">Per Annum</span>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-[#F9FAFB] py-6 rounded-sm grid grid-cols-4 text-center text-sm text-[#03442C] mt-4">
        <div className="text-center items-center">
          <div className="text-[11px] pb-1">Bedrooms</div>
          <div className="flex gap-2 text-center justify-center">
            <FaBed className="" />
            {property?.noOfRooms} bed
          </div>
        </div>
        <div className="text-center items-center">
          <div className="text-[11px] pb-1">Bathrooms</div>
          <div className="flex gap-2 text-center justify-center">
            <FaBath className="" />
            {property?.noOfBaths}
          </div>
        </div>
        <div className="text-center items-center">
          <div className="text-[11px] pb-1">Apartment Style</div>
          <div className="flex gap-2 text-center justify-center">
            <FaUsers className="" />
            {property?.apartmentStyle}
          </div>
        </div>
        <div className="text-center items-center">
          <div className="text-[11px] pb-1">Apartment Type</div>
          <div className="flex gap-2 text-center justify-center">
            <FaAirbnb className="" />
            {property?.apartmentType}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">
          Available Amenities
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {property?.otherAmentities?.map((item: string, idx: number) => (
            <span
              key={idx}
              className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
