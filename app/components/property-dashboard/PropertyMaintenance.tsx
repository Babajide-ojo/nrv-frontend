"use client";

import Button from "../shared/buttons/Button";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

const PropertyMaintenance = () => {
  const router = useRouter();
  const [showBadge, setShowBadge] = useState(true);
  return (
    <div className="pb-12 md:pb-0 md:flex gap-6">
      <div className="md:w-1/2 w-full">
        {showBadge && (
          <div className="bg-[#DDE4F3] max-w-full w-120 rounded rounded-2xl p-4 mb-8">
            <div className="flex justify-between mb-2">
              <div className="font-light text-nrvPrimaryGreen"></div>

              <div className="text-xs md:text-md p-1 flex gap-2 font-lighter">
                <FaTimes className="cursor-pointer font-lighter" size={15} onClick={() => {
                  setShowBadge(false);
                }} />
              </div>
            </div>
            <div className="text-center text-nrvDarkGrey font-semibold text-[15px]">
              A Maintenance process run for you, not by you.
            </div>
            <div className="text-center flex mx-auto mt-2 text-nrvGrayText font-light text-[13px]">
              Connect your tenants and rentals together—keeping everything
              organized. Leases make it easy to electronically sign and share
              documents with your tenants and even collect rent online.
            </div>
          </div>
        )}

        <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4">
          <div className="flex justify-between mb-4">
            <div className="font-light text-nrvPrimaryGreen text-xs">
              Ongoing Maintenance: 0
            </div>
            {/* <div>
              <Button
                size="normal"
                className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvPrimaryGreen"
                variant="mediumGrey"
                showIcon={false}
              >
                <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                  Create Request
                </div>
              </Button>
            </div> */}
          </div>
          <div className="text-center flex mx-auto mt-2 text-nrvGrayText font-light text-[13px]">
            Instead of being spread across text/emails/voicemails you now have a
            centralized place to view, respond to, and track maintenance logged
            by you or your tenant.
          </div>
        </div>
      </div>
      <div className="md:w-1/2 w-full mt-4 md:mt-0">
        <div className="bg-white rounded rounded-2xl p-4">
          <div className="text-start text-nrvPrimaryGreen font-semibold text-[15px]  pb-12">
            Objectives
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvPrimaryGreen text-bg-nrvPrimaryGreen"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                List Apartment
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvPrimaryGreen text-bg-nrvPrimaryGreen"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Invite to apply
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvPrimaryGreen text-bg-nrvPrimaryGreen"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Screen a tenant
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvPrimaryGreen text-bg-nrvPrimaryGreen"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Build a lease agreement
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvPrimaryGreen text-bg-nrvPrimaryGreen"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                E-sign a document
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PropertyMaintenance;
