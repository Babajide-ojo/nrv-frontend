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
          {property.city}, {property.state}
        </h2>
        <h2 className="text-sm font-medium text-nrvLightGrey pt-2">{address}</h2>
      </div>
      <div className="pt-4" style={{ maxHeight: "50px", minHeight: "50px" }}>
        <div className="flex gap-2">
          <Button
            size="smaller"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {property.propertyType.toUpperCase()}
          </Button>
          {/* <Button
            size="smaller"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            3 Bedrooms
          </Button>
          <Button
            size="smaller"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            2 Pools
          </Button> */}
          
        </div>
      </div>
      <div
        className="pt-2 flex flex-col justify-end pb-2"
        style={{ maxHeight: "50px", minHeight: "50px" }}
      >
        <div className="text-md font-medium text-nrvGreyBlack pt-4">
          {rentAmount}/month
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
