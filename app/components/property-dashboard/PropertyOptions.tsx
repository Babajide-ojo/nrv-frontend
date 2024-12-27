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
import copy from "copy-to-clipboard";
import { FaCheckCircle } from "react-icons/fa";

interface Data {
  data: any;
}

const PropertyOptions: React.FC<Data> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
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


  const copyToClipboard = (text: any) => {
    let copyText = text;
    let isCopy = copy(copyText);
    if (isCopy) {
      toast.success(
        "Link copied, you can share this on your social media handle.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          style: {
            background: "#ffffff",
            color: "#153969",
          },
          progressStyle: {
            background: "#153969",
          },
          icon: <FaCheckCircle size={25} style={{ color: "#153969" }} />,
        }
      );
    }
  };
  return (
    <div className="md:w-1/2 w-full mt-4 md:mt-0">
        <ToastContainer />
      <div className="bg-white rounded rounded-2xl p-4 m-1">
        <div className="text-start text-nrvDarkBlue font-semibold text-[15px]  pb-4">
          Objectives
        </div>

        <div className="w-full mt-6">
          <Button
            size="normal"
            className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
            variant="mediumGrey"
            showIcon={false}
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
            onClick={() => {
              copyToClipboard(
                `https://nrv-frontend.vercel.app/dashboard/tenant/properties`
              );
            }}
          >
            <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
              Invite to apply
            </div>
          </Button>
        </div>

        {/* <div className="w-full mt-6">
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
        </div> */}
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
      <CenterModal
            isOpen={isOpenInvite}
            onClose={() => {
              setIsOpenInvite(false);
            }}
          >
            <div className="flex justify-end" onClick={() => {}}>
              <svg
                onClick={() => {
                  copyToClipboard(
                    `https://nrv-frontend.vercel.app/dashboard/tenant/properties`
                  );
                }}
                className="cursor-pointer"
                width="54"
                height="54"
                viewBox="0 0 54 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.25"
                  y="1.25"
                  width="51.5"
                  height="51.5"
                  rx="25.75"
                  stroke="#153969"
                  stroke-width="1.5"
                />
                <path
                  d="M22.5 31.5001C22.5 27.2574 22.5 25.1361 23.818 23.818C25.1361 22.5 27.2574 22.5 31.5001 22.5H33.0001C37.2427 22.5 39.364 22.5 40.6821 23.818C42.0001 25.1361 42.0001 27.2574 42.0001 31.5001V33.0001C42.0001 37.2427 42.0001 39.364 40.6821 40.6821C39.364 42.0001 37.2427 42.0001 33.0001 42.0001H31.5001C27.2574 42.0001 25.1361 42.0001 23.818 40.6821C22.5 39.364 22.5 37.2427 22.5 33.0001V31.5001Z"
                  stroke="#153969"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M34.5 22.5001C34.4964 18.0644 34.4294 15.7668 33.1381 14.1937C32.8888 13.8898 32.6103 13.6113 32.3065 13.3619C30.6469 12 28.1814 12 23.2501 12C18.3188 12 15.8532 12 14.1937 13.3619C13.8898 13.6113 13.6113 13.8898 13.3619 14.1937C12 15.8532 12 18.3188 12 23.2501C12 28.1814 12 30.6469 13.3619 32.3065C13.6113 32.6103 13.8898 32.8888 14.1937 33.1381C15.7668 34.4294 18.0644 34.4964 22.5001 34.5"
                  stroke="#153969"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="mx-auto text-center p-4 md:w-4/5 w-full">
              <div className="flex justify-center">
                <svg
                  width="38"
                  height="37"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.75 1L1.5 9.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 2.75V36H10.25C6.95017 36 5.30025 36 4.27513 34.9748C3.25 33.9497 3.25 32.2998 3.25 29V9.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 9.75L36.5 18.5"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.5 35.9995H27.75C31.0498 35.9995 32.6997 35.9995 33.7248 34.9743C34.75 33.9492 34.75 32.2993 34.75 28.9995V17.625"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M29.5 15V9.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.25 16.75H12M10.25 23.75H12"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26 22H27.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26.875 36V29"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-nrvDarkBlue font-semibold text-xl">
                Contact Info
              </h2>
              <p className="text-nrvLightGrey text-md">
                Here are the contact details of this landlord
              </p>

              <ul className="list-disc">
                <li className="mb-2 flex md:items-center items-start mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
              
                </li>

                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
              
                </li>
                <div className="mt-4">
                  <Button
                    size="large"
                    variant="primary"
                    showIcon={false}
                    className="block w-full"
                  >
                    Message
                  </Button>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    size="large"
                    variant="lightGrey"
                    showIcon={false}
                    className="block w-full"
                  >
                    Close
                  </Button>
                </div>
              </ul>
            </div>
          </CenterModal>
    </div>
  );
};
export default PropertyOptions;
