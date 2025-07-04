"use client";
import { formatNumber } from "@/helpers/utils";
import React from "react";

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
  console.log({data})
  return (
    <div className="w-full font-jakarta border rounded-sm border-[#ECECEE] mt-4 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Info Section */}
        <div className="col-span-2 space-y-4">
          <h3 className="text-base font-semibold">Apartment Details</h3>

          <div className="grid grid-cols-2 text-sm">
        
            <div className="col-span-2 border-t py-4">
              <p className="text-gray-500 text-xs">Description</p>
              <p>{data?.description}</p>
            </div>
            <div className="border-t py-4">
              <p className="text-gray-500 text-xs">Number of Bedrooms</p>
              <p>{data?.noOfRooms}</p>
            </div>
            <div className="border-t py-4">
              <p className="text-gray-500 text-xs">Number of Bathrooms</p>
              <p>{data?.noOfBaths}</p>
            </div>

            <div className="border-t py-4">
              <p className="text-gray-500 text-xs">Apartment Style</p>
              <p>{data?.apartmentStyle}</p>
            </div>
            <div className="border-t py-4">
              <p className="text-gray-500 text-xs">Lease Terms</p>
              <p>{data?.leaseTerms}</p>
            </div>
            <div className="border-t py-4">
              <p className="text-gray-500 text-xs ">Rental Collection Preference</p>
              <p className="uppercase text-xs font-medium">{data?.rentAmountMetrics}</p>
            </div>
            <div className="border-t py-4">
              <p className="text-gray-500 text-xs">Payment Option</p>
              <p>{data?.paymentOption}</p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-gray-500 mb-2">Apartment Facilities/Amenities</p>
            <div className="flex flex-wrap gap-6">
       
              {data?.otherAmentities?.map((item: any, index: any) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Section */}
        <div className="w-full">
          <img
            src={data?.propertyId?.file}
            alt="Apartment"
            className="w-full h-[350px] object-cover rounded-xl mb-4"
          />
          <div className="grid grid-cols-2 gapy-4 text-sm">
            <div>
              <p className="text-gray-500">Apartment Style</p>
              <p className="font-medium">{data?.apartmentStyle}</p>
            </div>
            <div>
              <p className="text-gray-500">Price (Per Annum)</p>
              <p className="text-lg font-bold">₦{formatNumber(data?.rentAmount?.toString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyUnitDetails;
