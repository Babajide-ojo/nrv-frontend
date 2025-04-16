"use client";

import React, { useState } from "react";
import Button from "../buttons/Button";

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
  return (
    <div
      className="w-full bg-white shadow-md rounded-3xl p-3"
      style={{ minHeight: "400px" }}
    >
      {" "}
      <div className="pb-4 h-48">
        <img
          src={imageUrl}
          alt="photo"
          className="h-48 w-full rounded rounded-lg"
        />
      </div>
      <div className="pt-4" style={{ maxHeight: "100px", minHeight: "100px" }}>
        <h2 className="text-lg font-medium text-nrvGreyBlack pt-2">
          {property?.propertyId?.city}, {property?.propertyId?.state}
        </h2>
        <h2 className="text-sm text-nrvLightGrey pt-2 font-light">
          {address}
        </h2>
      </div>
      <div className="pt-4" style={{ maxHeight: "50px", minHeight: "50px" }}>
        <div className="flex gap-2">
          <Button
            size="smaller"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {property?.noOfRooms} Rooms
          </Button>
          <Button
            size="smaller"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {property?.noOfBaths} Baths
          </Button>
          <Button
            size="smaller"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {property?.noOfPools} Pools
          </Button>
        </div>
      </div>
      <div
        className="pt-2 flex flex-col justify-end pb-2"
        style={{ maxHeight: "50px", minHeight: "50px" }}
      >
        <div className="text-md font-medium text-nrvGreyBlack pt-4">
        ₦ {parseInt(property?.rentAmount).toLocaleString() }/ <span className="font-light">{property?.rentAmountMetrics}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
