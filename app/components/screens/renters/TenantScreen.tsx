"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../../shared/buttons/Button";
import {
  getApplicationsByLandlordId,
  updateApplicationStatus,
} from "../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaPlus, FaPlusCircle } from "react-icons/fa";
import CenterModal from "../../shared/modals/CenterModal";
import { Form, Formik, FormikHelpers } from "formik";
import FormikInputField from "../../shared/input-fields/FormikInputField";
import * as yup from "yup";
import FormikSelectField from "../../shared/input-fields/FormikSelectField";
import { getAllLandlordApartment } from "../../../../redux/slices/propertySlice";
import {
  createUserByLandlord,
  getTenantsOnboardedByLandlord,
} from "../../../../redux/slices/userSlice";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import Modal from "../../shared/modals/Modal";
import CustomDatePicker from "../../shared/CustomDatePicker";
import { FcHome } from "react-icons/fc";
import DataTable from "../../shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { formatDate, formatDateToWords } from "@/helpers/utils";

const TenantScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [tenents, setTenants] = useState<object[]>([]);
  const [application, setApplication] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openAddTenantModal, setOpenAddTenantModal] = useState(false);
  const [landlordProperties, setLandlordProperties] = useState<any>([]);
  const [toggleTenantView, setToggleTenantView] =
    useState<string>("onboarded_tenant");

  // Define a type for the function parameters
  type AddTenantFunction = (
    values: any,
    formikHelpers: FormikHelpers<any>,
    dispatch: ThunkDispatch<any, any, AnyAction>
  ) => Promise<void>;
  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem("nrv-user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      console.log({user});
      

      if (!user?.user?._id) {
        console.error("Invalid user data or user not logged in");
        setIsLoading(false);
        setIsPageLoading(false);
        return;
      }

      setUser(user.user);

      const formData = {
        page,
        id: user.user._id,
        status: "activeTenant",
      };

      const _response = await dispatch(
        getAllLandlordApartment(formData) as any
      );
      if (_response?.payload?.data) {
        const properties = _response.payload.data;
        setProperties(properties);
        const landlordProperties = properties.map((item: any) => ({
          label: (
            <div className="text-xs">
              {item.propertyId?.streetAddress} | Property ID - {item?.roomId}
            </div>
          ),
          value: item._id,
        }));
        setLandlordProperties(landlordProperties);
        setTotalPages(_response?.totalPages || 1);
      } else {
        setProperties([]);
        setLandlordProperties([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching landlord apartments:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  const fetchSelfOnboardedTenantData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") || "{}");
    const currentUser = user?.user;
    const formData = {
      page: page, // Ensure 'page' is defined or passed as a parameter
      id: currentUser?._id,
    };

    try {
      const _response = await dispatch(
        getTenantsOnboardedByLandlord(formData) as any
      );
      if (_response?.payload?.data) {
        setTenants(_response.payload.data);
      }
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const handleSubmit = async (status: any) => {
    const payload = {
      id: application?._id,
      status: status,
    };
    try {
      setIsLoading(true);
      await dispatch(updateApplicationStatus(payload) as any).unwrap();
      toast.success("Application moved to tenant", {
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
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const addTenant: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(createUserByLandlord(values))) as any;

      // Check if there is an error in the result
      if (result.error) {
        if (result.error.message === "Rejected") {
          toast.error(
            result.payload || "Failed to add tenant. Please try again."
          ); // Assuming payload contains the error message
        } else {
          toast.error("Failed to add tenant. Please try again.");
        }
      } else {
        toast.success("Tenant onboarded successfully");
        resetForm(); // Reset form fields after successful submission
      }
    } catch (error: any) {
      // Catch any unexpected errors
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  const validationSchema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    nin: yup.string().required("NIN is required").min(11).max(11),
    rentEndDate: yup.string().required("Rent start date is required"),
    rentStartDate: yup.string().required("Rent end date is required"),
  });

  useEffect(() => {
    fetchData();
    fetchSelfOnboardedTenantData();
  }, []);
  return (
    <div>
      <ToastContainer />
      <div className="">
        <div className="w-full md:w-2/5 mx-auto flex justify-end items-end mt-2">
          <Button
            size="large"
            className="font-medium text-nrvPrimaryGreen text-sm  border border-nrvPrimaryGreen hover:bg-nrvPrimaryGreen hover:text-white rounded rounded-full"
            variant="lightGrey"
            showIcon={false}
            onClick={() => {
              setOpenAddTenantModal(true);
            }}
          >
            Add Tenant
          </Button>
        </div>
        <div className="">
          <DataTable
            //rowActions={handleRowAction}
            //key={activeTab}
            endpoint={`${API_URL}/properties/tenant/landlord-onboarded/${JSON.parse(localStorage.getItem("nrv-user")as any ).user._id}`}
            //status={activeTab}
            columns={[
              {
                key: "applicant",
                label: "Tenant Name",
                render: (val) => (
                  <div>
                    <div className="text-[#667085] font-light">
                      {val?.firstName}  {val?.lastName}
                    </div>
                  </div>
                ),
              },
              {
                key: "tenantName",
                label: "Tenant Name",
                render: (val) => (
                  <span className="font-medium italic text-[#045D23]">
                    MR-{val}
                  </span>
                ),
              },
              {
                key: "title",
                label: "Title",
              },
              {
                key: "rentStartDate",
                label: "Lease Start Date",
                render: (val) => <span>{formatDate(val.slice(0, 10)) }</span>,
              },
              {
                key: "rentEndDate",
                label: "Lease End Date",
                render: (val) => <span>{formatDate(val.slice(0, 10))}</span>,
              },
              {
                key: "status",
                label: "Status",
                render: (val) => (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      val === "Resolved"
                        ? "bg-[#F7F6F2] text-green-700"
                        : "bg-[#F7F6F2] text-yellow-700"
                    }`}
                  >
                    {val || "Pending"}
                  </span>
                ),
              },
           
            ]}
          />
        </div>
      </div>

      <CenterModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="mx-auto text-center p-4 w-full md:w-4/5">
          <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
            Transfer Application as Tenant
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will make this applicant the current occupant
            of this property for the designated time
          </p>

          <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              size="large"
              className="text-white w-72 max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
              variant="bluebg"
              showIcon={false}
            >
              <div
                className="flex gap-3"
                onClick={() => {
                  handleSubmit("activeTenant");
                }}
              >
                Submit
              </div>
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              size="large"
              className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2  hover:text-white hover:bg-nrvPrimaryGreen"
              variant="mediumGrey"
              showIcon={false}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div className="flex gap-2">Close</div>
            </Button>
          </div>
        </div>
      </CenterModal>
      <Modal
        isOpen={openAddTenantModal}
        onClose={() => {
          setOpenAddTenantModal(false);
        }}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-nrvPrimaryGreen font-semibold text-2xl">
            Onboard A New Tenant
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will make this applicant the current occupant
            of this property for the designated time
          </p>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              nin: "",
              propertyId: "",
              ownerId: user?._id,
              rentEndDate: "",
              rentStartDate: "",
              accountType: "tenant",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers) =>
              addTenant(values, formikHelpers, dispatch)
            }
          >
            {({ isSubmitting, resetForm, values }) => (
              <Form>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="w-full md:flex flex-row gap-3">
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="firstName"
                        placeholder="Enter First Name"
                        label="First Name"
                        value={values.firstName}
                      />
                    </div>
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="lastName"
                        placeholder="Last Name"
                        label="Enter Last Name"
                        value={values.lastName}
                      />
                    </div>
                  </div>
                  <div className="w-full md:flex flex-row gap-3">
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="email"
                        placeholder="Tenant Email"
                        label="Email"
                        value={values.email}
                      />
                    </div>
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="nin"
                        placeholder="Tenant NIN"
                        label="National Identification Number"
                        value={values.nin}
                      />
                    </div>
                  </div>

                  <div className="w-full md:flex flex-row gap-3">
                    <div className="md:w-1/2 w-full mt-0 md:mt-0">
                      <CustomDatePicker
                        label="Rent Start Date"
                        name="rentStartDate"
                      />
                    </div>
                    <div className="md:w-1/2 w-full mt-0 md:mt-0">
                      <CustomDatePicker
                        label="Rent End Date"
                        name="rentEndDate"
                      />
                    </div>
                  </div>
                  <div className="w-full md:flex flex-row gap-3"></div>

                  <div className="w-full mt-0 md:mt-0">
                    <FormikSelectField
                      name="propertyId"
                      placeholder="Select Property"
                      label="Select Apartment"
                      options={landlordProperties}
                      isSearchable={true}
                    />
                  </div>
                </div>
                <div className="mt-4  mx-auto w-full mt-8 flex gap-4 justify-between">
                  <Button
                    type="button"
                    size="large"
                    className="block w-full"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      resetForm();
                      setOpenAddTenantModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="large"
                    className="block w-full"
                    variant="lightGrey"
                    showIcon={false}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default TenantScreen;
