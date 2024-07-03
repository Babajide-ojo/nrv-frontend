"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsHouse, BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { updateRoomStatus } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropertyOptions from "../property-dashboard/PropertyOptions";

interface Data {
  data: any;
}



const RoomOverview: React.FC<Data> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const updateRoom = async () => {
  
    const payload = {
      id: id,
      status: true
    }
    try {
      setIsLoading(true);
      const properties = await dispatch(updateRoomStatus(payload) as any).unwrap();
     
    } catch (error) {
      toast.error("An error occured while performing update");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <div className="pb-12 md:pb-0 md:flex gap-6">
      <div className="md:w-1/2 w-full">
        <div className="flex justify-between">
          {dashboardMetrics.map(({ title, imageLink, number }, index) => (
            <div key={index}>
              <DashboardNavigationCard
                title={title}
                imageLink={imageLink}
                number={number}
                isMetric={true}
              />
            </div>
          ))}
        </div>

        <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4 mt-8">
          <div className="flex justify-between mb-2">
            <div className="font-light text-nrvDarkBlue">Leases</div>
            <div>
              <Button
                size="normal"
                className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
                variant="mediumGrey"
                showIcon={false}
              >
                <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                  New Lease
                </div>
              </Button>
            </div>
          </div>
          <div className="text-center text-nrvDarkGrey font-semibold text-[15px]">
            Add a Lease to NaijaRentVerify
          </div>
          <div className="text-center flex mx-auto mt-2 text-nrvGrayText font-light text-[13px]">
            Connect your tenants and rentals together—keeping everything
            organized. Leases make it easy to electronically sign and share
            documents with your tenants and even collect rent online.
          </div>
        </div>
        <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4 mt-8">
          <div className="flex justify-between mb-4">
            <div className="font-light text-nrvDarkBlue">
              Ongoing Maintenance: 0
            </div>
            <div>
              <Button
                size="normal"
                className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
                variant="mediumGrey"
                showIcon={false}
              >
                <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                  Create Request
                </div>
              </Button>
            </div>
          </div>
          <div className="text-center flex mx-auto mt-2 text-nrvGrayText font-light text-[13px]">
            Instead of being spread across text/emails/voicemails you now have a
            centralized place to view, respond to, and track maintenance logged
            by you or your tenant.
          </div>
        </div>
        <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4 mt-8">
          <div className="flex justify-between mb-4">
            <div className="font-light text-nrvDarkBlue">
              Ongoing Maintenance: 0
            </div>
            <div>
              <Button
                size="normal"
                className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
                variant="mediumGrey"
                showIcon={false}
              >
                <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                  Create Request
                </div>
              </Button>
            </div>
          </div>
          <div className="text-center flex mx-auto mt-2 text-nrvGrayText font-light text-[13px]">
            Instead of being spread across text/emails/voicemails you now have a
            centralized place to view, respond to, and track maintenance logged
            by you or your tenant.
          </div>
        </div>
      </div>
    <PropertyOptions data={data} />
    </div>
  );
};
export default RoomOverview;
