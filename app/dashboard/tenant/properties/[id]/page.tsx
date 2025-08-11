"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import Button from "../../../../components/shared/buttons/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import TenantLayout from "../../../../components/layout/TenantLayout";
import {
  applyForProperty,
  getPropertyByIdForTenant,
} from "../../../../../redux/slices/propertySlice";
import GoogleMapReact from "google-map-react";
import CenterModal from "../../../../components/shared/modals/CenterModal";
import copy from "copy-to-clipboard";
import { FaCheckCircle } from "react-icons/fa";
import BackIcon from "@/app/components/shared/icons/BackIcon";

import CustomDatePicker from "@/app/components/shared/CustomDatePicker";
import { Form, Formik } from "formik";
import FormikInputField from "@/app/components/shared/input-fields/FormikInputField";

import { SlCloudUpload } from "react-icons/sl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Copy,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  Star,
  Twitter,
  User,
  MapPin,
  Calendar,
  Bed,
  Bath,
  Home,
  Building,
} from "lucide-react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Label } from "@/components/ui/label";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfToday } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

const TenantPropertiesScreen = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [property, setProperty] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<any>(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [applicationData, setApplicationData] = useState<any>({
    currentEmployer: "",
    monthlyIncome: "",
    currentResidence: "",
    reasonForLeaving: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();


  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const body = {
      id: id,
      tenantId: user?.user?._id,
    };
    try {
      const response = await dispatch(getPropertyByIdForTenant(body) as any);
      const raw = response?.payload?.data?.property; // Pass page parameter
            let mapped = {
        title: raw?.apartmentType + " • " + raw?.apartmentStyle,
        imageUrl: raw?.propertyId.file,
        imageUrls: raw?.imageUrls || [],
        price: raw?.rentAmount,
        apartmentName: raw?.apartmentType,
        address: `${raw?.propertyId.streetAddress}, ${raw?.propertyId.city}, ${raw.propertyId.state}`,
        description: raw?.description,
        flatNumber: raw?.roomId,
        bedrooms: raw?.noOfRooms,
        bathrooms: raw?.noOfBaths,
        apartmentStyle: raw?.apartmentStyle,
        leaseTerms: raw?.leaseTerms,
        amenities: raw?.otherAmentities,
        hasApplied:  response?.payload?.data.hasApplied,
        owner: {
          name: `${raw?.propertyId.createdBy.firstName} ${raw?.propertyId.createdBy.lastName}`,
          email: raw?.propertyId.createdBy.email,
          phoneNumber: raw?.propertyId.createdBy.phoneNumber,
          id: raw?.propertyId.createdBy._id,
          reviews: 345,
          imageUrl: "/owner.jpg", // placeholder
        },
      };
      setProperty(mapped);
      //setProperty(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicationData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
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

  console.log({ property });
  const handleSubmit = async (value: any) => {
    const formData: any = new FormData();

    formData.append("propertyId", id);
    formData.append("applicant", user?._id);
    formData.append("status", "New");
    formData.append("ownerId", property?.owner.id);
    formData.append("currentEmployer", value.currentEmployer);

    formData.append("monthlyIncome", value.monthlyIncome);

    formData.append("currentAddress", value.currentResidence);
    formData.append("reasonForLeaving", value.reasonForLeaving);
    formData.append("file", selectedFiles);

    try {
      setLoading(true);

      await dispatch(applyForProperty(formData) as any).unwrap();
      toast.success("Your property application has been sent to the landlord");
      setApplicationData({
        currentEmployer: "",
        jobTitle: "",
        monthlyIncome: "",
        jobStartDate: "",
        criminalRecord: "",
        criminalRecordDetails: "",
        numberOfVehicles: "",
        petNumber: "",
        smoker: "",
        evictionHistory: "",
        evictionDetails: "",
        currentLandlord: "",
        currentAddress: "",
        reasonForLeaving: "",
        leaseStartDate: "",
        leaseEndDate: "",
      });
      setTimeout(() => {
        router.push("/dashboard/tenant/properties");
      }, 2000);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showImageModal || !property.imageUrls || property.imageUrls.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => 
          prev === 0 ? property.imageUrls.length - 1 : prev - 1
        );
      } else if (event.key === 'ArrowRight') {
        setSelectedImageIndex(prev => 
          prev === property.imageUrls.length - 1 ? 0 : prev + 1
        );
      } else if (event.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showImageModal, property.imageUrls]);

  // Reset image states when property changes
  useEffect(() => {
    if (property.imageUrls && property.imageUrls.length > 0) {
      setSelectedImageIndex(0);
      setImageLoading(true);
      setImageError(false);
    }
  }, [property.imageUrls]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout mainPath="/dashboard/tenant/properties">
            <ToastContainer />
            {currentStep === 1 && (
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Enhanced Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
                    {/* Left Side: Back + Titles */}
                    <div className="flex items-start md:items-center gap-4">
                      <BackIcon />
                      <div className="border-l h-6 mx-2 hidden md:block"></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          View Property Details
                        </h2>
                        <p className="text-gray-600 text-base">
                          {property?.apartmentName} • {property?.apartmentStyle}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
            

                      <div className="flex items-center gap-3">
                        <Copy className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Image and Apply Button */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Image Gallery */}
                      <div className="relative">
                        {/* Main Image */}
                        <div className="relative h-80 overflow-hidden">
                          {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            </div>
                          )}
                          
                          {imageError && (
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">Image failed to load</p>
                              </div>
                            </div>
                          )}
                          
                          {!property.imageUrls || property.imageUrls.length === 0 ? (
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">No images available</p>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={property.imageUrls[selectedImageIndex]}
                              alt="property"
                              className={`w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105 ${
                                imageLoading || imageError ? 'opacity-0' : 'opacity-100'
                              }`}
                              onClick={() => setShowImageModal(true)}
                              onLoad={handleImageLoad}
                              onError={handleImageError}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          
                          {/* Image Navigation Arrows */}
                          {property.imageUrls && property.imageUrls.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex(prev => 
                                    prev === 0 ? property.imageUrls.length - 1 : prev - 1
                                  );
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex(prev => 
                                    prev === property.imageUrls.length - 1 ? 0 : prev + 1
                                  );
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                        
                        {/* Image Thumbnails */}
                        {property.imageUrls && property.imageUrls.length > 1 && (
                          <div className="p-4 bg-gray-50">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {property.imageUrls.map((imageUrl: string, index: number) => (
                                <button
                                  key={index}
                                  onClick={() => setSelectedImageIndex(index)}
                                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    index === selectedImageIndex 
                                      ? 'border-green-500 ring-2 ring-green-200' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="relative w-full h-full">
                                    <img
                                      src={imageUrl}
                                      alt={`Property ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      onLoad={() => {
                                        if (index === selectedImageIndex) {
                                          setImageLoading(false);
                                          setImageError(false);
                                        }
                                      }}
                                      onError={() => {
                                        if (index === selectedImageIndex) {
                                          setImageLoading(false);
                                          setImageError(true);
                                        }
                                      }}
                                    />
                                    {index === selectedImageIndex && (
                                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-2">
                              {selectedImageIndex + 1} of {property.imageUrls.length} images
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Apply Button */}
                      <div className="p-6">
                        <Button
                         variant="darkPrimary"
                          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
                          onClick={() => setCurrentStep(2)}
                          disabled={property.hasApplied === true}
                        >
                          {property.hasApplied === true ? "You have applied to this unit" : "Apply Now!"}
                        </Button>
                        
                        {property.hasApplied && (
                          <p className="text-center text-green-600 text-sm mt-3 font-medium">
                             Application submitted successfully
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Property Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Price and Contact Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-1">Price (Per Annum)</p>
                          <h3 className="text-3xl font-bold text-green-700">
                            ₦{property?.price?.toLocaleString()}
                          </h3>
                        </div>
                        <Button
                          variant="darkPrimary"
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
                          onClick={() => setIsModalOpen(true)}
                        >
   
                          Contact Owner
                        </Button>
                      </div>

                      {/* Key Features Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="flex justify-center mb-2">
                            <Home className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-gray-500 text-xs font-medium mb-1">Style</p>
                          <p className="text-gray-800 font-semibold">{property?.apartmentStyle}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="flex justify-center mb-2">
                            <Bed className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-gray-500 text-xs font-medium mb-1">Bedrooms</p>
                          <p className="text-gray-800 font-semibold">{property?.bedrooms}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="flex justify-center mb-2">
                            <Bath className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-gray-500 text-xs font-medium mb-1">Bathrooms</p>
                          <p className="text-gray-800 font-semibold">{property?.bathrooms}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="flex justify-center mb-2">
                            <Building className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-gray-500 text-xs font-medium mb-1">Unit #</p>
                          <p className="text-gray-800 font-semibold">{property?.flatNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Location and Description */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-1/3">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <p className="text-gray-500 text-sm font-medium">Location</p>
                            </div>
                            <p className="text-gray-800 font-medium leading-relaxed">
                              {property?.address}
                            </p>
                          </div>
                          <div className="w-2/3">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <p className="text-gray-500 text-sm font-medium">Lease Terms</p>
                            </div>
                            <p className="text-gray-800 font-medium">
                              {property?.leaseTerms}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-3">Description</p>
                          <p className="text-gray-800 leading-relaxed text-sm font-light ">
                            {property?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Apartment Facilities & Amenities
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {property?.amenities?.map((amenity: any, idx: any) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-green-700 border-green-400 bg-green-50 px-4 py-2 text-sm font-medium hover:bg-green-100 transition-colors"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Owner Information */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 mb-1">
                            {property?.owner?.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {property?.owner?.email}
                          </p>
                          <div className="flex items-center text-sm text-yellow-600">
                            <Star className="w-4 h-4 mr-1" fill="currentColor" />
                            {property?.owner?.reviews} Reviews
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Form Step */}
            {currentStep === 2 && (
              <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-6 px-4">
                <div className="max-w-4xl mx-auto">
                  {/* Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-green-600">Property Selected</p>
                          </div>
                        </div>
                        
                        <div className="w-12 h-0.5 bg-green-200"></div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-green-600">Application Form</p>
                          </div>
                        </div>
                        
                        <div className="w-12 h-0.5 bg-gray-200"></div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-400">Review & Submit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Container */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="text-xl font-bold">
                            Tenant Application Form 🏘️
                          </h2>
                          <p className="text-green-100 text-sm mt-1">
                            Complete your application for {property?.apartmentType} • {property?.apartmentStyle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                      <Formik
                        initialValues={{
                          currentResidence: "",
                          monthlyIncome: "",
                          desiredMoveInDate: new Date(),
                          currentEmployer: "",
                          reasonForLeaving: "",
                          jobTitle: "",
                          ownerId: user?._id,
                        }}
                        onSubmit={(values, formikHelpers) => handleSubmit(values)}
                      >
                        {({ isSubmitting, resetForm, values }) => (
                          <Form className="w-full">
                            {/* Property Summary Card */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-green-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Building className="w-6 h-6 text-green-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      {property?.apartmentType} • {property?.apartmentStyle}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{property?.address}</p>
                                    <p className="text-xl font-bold text-green-600 mt-1">
                                      ₦{property?.price?.toLocaleString()}/year
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">Unit Number</div>
                                  <div className="text-xl font-bold text-gray-800">{property?.flatNumber}</div>
                                </div>
                              </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                              {/* Personal Information Section */}
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Current Residence Address
                                    </Label>
                                    <FormikInputField
                                      name="currentResidence"
                                      placeholder="Enter your current address"
                                      value={values.currentResidence}
                                      css="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 rounded-lg text-sm"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Job Title / Business Type
                                    </Label>
                                    <FormikInputField
                                      name="jobTitle"
                                      placeholder="e.g., Software Engineer, Business Owner"
                                      value={values.jobTitle}
                                      css="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Employment Section */}
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                  Employment & Income
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Current Employer
                                    </Label>
                                    <FormikInputField
                                      name="currentEmployer"
                                      placeholder="Company or organization name"
                                      value={values.currentEmployer}
                                      css="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 rounded-lg text-sm"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Monthly Income
                                    </Label>
                                    <FormikInputField
                                      name="monthlyIncome"
                                      placeholder="₦0.00"
                                      value={values.monthlyIncome}
                                      css="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Move-in Details Section */}
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                  Move-in Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-8 block">
                                      Desired Move-in Date
                                    </Label>
                                    <div className="h-10 rounded-lg border border-gray-200 px-3 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200">
                                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                          value={values.desiredMoveInDate}
                                          minDate={startOfToday()}
                                          slotProps={{
                                            textField: {
                                              fullWidth: true,
                                              size: "small",
                                              variant: "standard",
                                              InputProps: {
                                                disableUnderline: true,
                                              },
                                              sx: {
                                                fontSize: "13px",
                                                boxShadow: "none",
                                                "&:hover": {
                                                  boxShadow: "none",
                                                  borderColor: "#10B981",
                                                },
                                                "& .Mui-focused": {
                                                  boxShadow: "none",
                                                },
                                                "& input": {
                                                  color: "#374151",
                                                  padding: "8px 4px",
                                                },
                                              },
                                            },
                                            day: {
                                              sx: {
                                                backgroundColor: "#F9FAFB",
                                                "&.Mui-selected": {
                                                  backgroundColor: "#10B981",
                                                  color: "#ffffff",
                                                },
                                                "&.MuiPickersDay-today": {
                                                  border: "2px solid #10B981",
                                                  backgroundColor: "#10B981",
                                                },
                                                "&.MuiPickersDay-today.Mui-selected": {
                                                  backgroundColor: "#10B981",
                                                  color: "#fff",
                                                },
                                                "&:hover": {
                                                  backgroundColor: "#10B981",
                                                  color: "#ffffff",
                                                },
                                              },
                                            },
                                          }}
                                        />
                                      </LocalizationProvider>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Reason for Moving
                                    </Label>
                                    <FormikInputField
                                      name="reasonForLeaving"
                                      placeholder="e.g., Job relocation, lease ending"
                                      value={values.reasonForLeaving}
                                      css="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                              <Button
                                type="button"
                                size="large"
                                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 h-11 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                                variant="lightGrey"
                                showIcon={false}
                                onClick={() => {
                                  resetForm();
                                  setCurrentStep(1);
                                }}
                              >
                            
                                Back to Property
                              </Button>
                              <Button
                                type="submit"
                                size="large"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md text-sm"
                                variant="darkPrimary"
                                showIcon={false}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submit Application
                                  </div>
                                )}
                              </Button>
                            </div>

                            {/* Application Tips */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <h5 className="font-medium text-blue-800 mb-2 text-sm">Application Tips</h5>
                                  <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Ensure all information is accurate and up-to-date</li>
                                    <li>• Provide complete contact details for verification</li>
                                    <li>• Be honest about your income and employment status</li>
                                    <li>• The landlord will review your application within 24-48 hours</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TenantLayout>

          {/* Enhanced Contact Modal */}
          <CenterModal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    copyToClipboard(
                      `https://nrv-frontend.vercel.app/dashboard/tenant/properties/${property._id}`
                    );
                  }}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Contact Information
                </h2>
                <p className="text-gray-600">
                  Get in touch with the property owner
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                    <p className="text-gray-800 font-semibold">{property?.owner?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                    <p className="text-gray-800 font-semibold">{property?.owner?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="large"
                  variant="primary"
                  showIcon={false}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Send Message
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="large"
                  variant="lightGrey"
                  showIcon={false}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </CenterModal>

          {/* Enhanced Dialog Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-gray-800">
                  <User className="h-5 w-5 text-green-600" />
                  Contact Information
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Name</p>
                    <p className="font-semibold text-gray-800">{property?.owner?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="font-semibold text-gray-800">{property?.owner?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                    <p className="font-semibold text-gray-800">{property?.owner?.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link className="flex-1" href={`tel:${property?.owner?.phoneNumber}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <div className="flex items-center gap-2 py-1">
                      <Phone className="h-4 w-4" />
                      Call
                    </div>
                  </Button>
                </Link>
                <Link className="flex-1" href={`mailto:${property?.owner?.email}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <div className="flex items-center gap-2 py-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>

          {/* Image Modal */}
          <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-gray-800">
                  <span>Property Images</span>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="relative">
                {/* Main Image Display */}
                <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
                  {!property.imageUrls || property.imageUrls.length === 0 ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No images available</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={property.imageUrls[selectedImageIndex]}
                      alt="property"
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {/* Navigation Arrows */}
                  {property.imageUrls && property.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(prev => 
                          prev === 0 ? property.imageUrls.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => setSelectedImageIndex(prev => 
                          prev === property.imageUrls.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {property.imageUrls && property.imageUrls.length > 1 && (
                  <div className="mt-4">
                    <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                      {property.imageUrls.map((imageUrl: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            index === selectedImageIndex 
                              ? 'border-green-500 ring-2 ring-green-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-3">
                      {selectedImageIndex + 1} of {property.imageUrls.length} images
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default TenantPropertiesScreen;
