"use client";

import React from "react";
import logo from "./../../../public/images/property-success.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/app/components/shared/buttons/Button";

const PropertySuccess = () => {
  const router = useRouter();

  const handleViewProperties = () => {
    router.push("/dashboard/landlord/properties");
  };

  const handleCreateAnother = () => {
    router.push("/dashboard/landlord/properties/create");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full text-center">
        <Image
          src={logo}
          alt="Property created successfully"
          width={120}
          height={120}
          className="mx-auto"
        />
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Property created successfully
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your listing is ready. You can manage units and applicants from
          Properties.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="darkPrimary"
            showIcon={false}
            onClick={handleViewProperties}
            className="font-medium"
          >
            View properties
          </Button>
          <Button
            variant="light"
            showIcon={false}
            onClick={handleCreateAnother}
            className="font-medium"
          >
            Create another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertySuccess;
