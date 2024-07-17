"use client";
import { dashboardMetrics } from "../../../helpers/data";
import {
  BsHouse,
  BsPlus,
  BsPlusCircle,
  BsPlusCircleFill,
} from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import CenterModal from "../shared/modals/CenterModal";
import { updateRoomStatus } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Data {
  data: any;
}

const PropertyOptions: React.FC<Data> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const updateRoom = async () => {
    const payload = {
      id: id,
      status: true,
    };
    try {
      setIsLoading(true);
      const properties = await dispatch(
        updateRoomStatus(payload) as any
      ).unwrap();
    //  router.push(`/dashboard/landlord/properties/rooms/${id}`)
    } catch (error) {
      toast.error("An error occured while performing update");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <div className="md:w-1/2 w-full mt-4 md:mt-0">
        <ToastContainer />
      <div className="bg-white rounded rounded-2xl p-4 m-1">
        <div className="text-start text-nrvDarkBlue font-semibold text-[15px]  pb-12">
          Objectives
        </div>

        <div className="w-full mt-6">
          <Button
            size="normal"
            className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
            variant="mediumGrey"
            showIcon={false}
            disabled={data.listRoom === false ? false : true}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <div className="flex gap-3 p-1.5 text-swBlue">
              {data.listRoom === false ? "List Apartment" : "Unlist Apartment"}
            </div>
          </Button>
        </div>

        <div className="w-full mt-6">
          <Button
            size="normal"
            className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
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
            className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
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
            className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
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
            className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
            variant="mediumGrey"
            showIcon={false}
          >
            <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
              E-sign a document
            </div>
          </Button>
        </div>
      </div>
      <CenterModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="mx-auto text-center p-4">
          <p className="text-nrvLightGrey text-md">
            Listing this property will make it visible to tenant for
            applications.
          </p>
          <p className="text-red-500 text-lg font-medium">
            Are you sure you want to continue?
          </p>

          <div className="mt-8 flex gap-3 justify-center text-center items-center">
            <Button
              size="large"
              className="text-red-500  border border-red-500 mt-2 rounded-md"
              variant="ordinary"
              showIcon={false}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div className="flex gap-3">Close</div>
            </Button>
            <Button
              size="large"
              className="text-white border border-nrvDarkBlue mt-2 rounded-md"
              variant="bluebg"
              showIcon={false}
            >
              <div className="flex gap-3" onClick={updateRoom}>
                Continue
              </div>
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};
export default PropertyOptions;
