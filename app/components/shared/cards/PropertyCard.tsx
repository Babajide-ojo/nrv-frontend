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
  console.log({ imageUrl, address, rentAmount, property });

  return (
    <div className="w-full h-full bg-white shadow-lg border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image section with overlay button */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-4">
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

      {/* Title and address section */}
      <div className="mb-4">
        <h2 className="text-sm font-light text-gray-800 mb-2 leading-relaxed">
          {property?.description || property?.propertyId?.description || "Room Description"}
        </h2>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span className="text-gray-700">
            {address || `${property?.propertyId?.streetAddress || ''} ${property?.propertyId?.city || ''} ${property?.propertyId?.state || ''}`}
          </span>
        </div>
        
        {/* Rent section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
          <div className="text-xl font-bold text-green-900">
            ₦ {parseInt(rentAmount || property?.rentAmount || '0').toLocaleString()}
          </div>
          <div className="text-sm text-green-700 font-medium">
            {property?.rentAmountMetrics || 'Per Annum'}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-4 px-3 rounded-xl mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FaBed className="text-green-600 text-lg" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Bedrooms</div>
            <div className="text-sm font-semibold text-gray-800">
              {property?.noOfRooms || property?.propertyId?.noOfRooms || 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FaBath className="text-green-600 text-lg" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Bathrooms</div>
            <div className="text-sm font-semibold text-gray-800">
              {property?.noOfBaths || property?.propertyId?.noOfBaths || 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FaPaintRoller className="text-green-600 text-lg" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Style</div>
            <div className="text-sm font-semibold text-gray-800">
              {property?.apartmentStyle || property?.propertyId?.apartmentStyle || 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CgStyle className="text-green-600 text-lg" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Type</div>
            <div className="text-sm font-semibold text-gray-800">
              {property?.apartmentType || property?.propertyId?.apartmentType || 'N/A'}
            </div>
          </div>
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
      <div className="pt-3 border-t border-gray-100">
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
