"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/layout/ManagerLayout";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import MultiImageUploader from "@/app/components/shared/MultiImageUploader";
import { createShortStayRoom } from "@/lib/shortletApi";
import { formatDisplayValue } from "@/helpers/utils";
import { nigerianStates } from "@/helpers/data";
import {
  blockNonPositiveRentKeys,
  isValidPositiveRentAmount,
  sanitizePositiveRentInput,
} from "@/lib/rentAmount";

const CreateShortStayPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    streetAddress: "",
    city: "",
    state: "",
    description: "",
    apartmentType: "",
    apartmentStyle: "",
    pricePerNight: "",
    minimumNights: "2",
    houseRules: "",
    noOfRooms: "",
    noOfBaths: "",
    images: [] as File[],
  });

  const setField = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.streetAddress ||
      !form.city ||
      !form.state ||
      !form.description ||
      !form.apartmentType ||
      !form.apartmentStyle ||
      !form.pricePerNight ||
      !form.minimumNights ||
      !form.noOfRooms ||
      !form.noOfBaths
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isValidPositiveRentAmount(form.pricePerNight)) {
      toast.error("Price per night must be greater than zero.");
      return;
    }
    const formData = new FormData();
    formData.append("streetAddress", form.streetAddress);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("description", form.description);
    formData.append("apartmentType", form.apartmentType);
    formData.append("apartmentStyle", form.apartmentStyle);
    formData.append("pricePerNight", form.pricePerNight);
    formData.append("minimumNights", form.minimumNights);
    formData.append("houseRules", form.houseRules);
    formData.append("noOfRooms", form.noOfRooms);
    formData.append("noOfBaths", form.noOfBaths);
    form.images.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      const response = await createShortStayRoom(formData);
      toast.success(
        response?.message ||
          "Short stay added. It is awaiting admin approval before it can be listed publicly.",
        { autoClose: 8000 },
      );
      router.push("/dashboard/manager/listings");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Could not create the short stay.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ManagerLayout mainPath="Listings" subMainPath="Add shortlet">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl p-3 font-jakarta sm:p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#101828]">Add a shortlet</h2>
            <p className="mt-2 text-sm font-light text-[#475467]">
              Enter the stay address and nightly rate. This is not a yearly or
              monthly rental listing.
            </p>
          </div>
          <div className="rounded-md border border-[#ECECEE] bg-[#FDFDFC] p-4 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#101828]">
                  Stay details
                </h3>
                <p className="mt-1 text-sm text-[#475467]">
                  Guests will see this address, price, and photos.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="light"
                  className="rounded-md px-6 py-1.5"
                  onClick={() => router.push("/dashboard/manager/listings")}
                >
                  Cancel
                </Button>
                <Button
                  variant="darkPrimary"
                  className="rounded-md px-6 py-1.5"
                  isLoading={loading}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Submitting" : "Submit for approval"}
                </Button>
              </div>
            </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <InputField
                label="Address"
                required
                placeholder="e.g. 27 Olarenwaju Street, Lekki"
                value={form.streetAddress}
                onChange={(e) => setField("streetAddress", e.target.value)}
                name="streetAddress"
              />
            </div>
            <InputField
              label="City"
              required
              placeholder="e.g. Lagos"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              name="city"
            />
            <SelectField
              label="State"
              required
              placeholder="Select state"
              value={
                form.state ? { label: form.state, value: form.state } : null
              }
              onChange={(val: any) => setField("state", val?.value || "")}
              options={nigerianStates}
              name="state"
            />
            <SelectField
              label="Apartment type"
              required
              placeholder="Select type"
              value={
                form.apartmentType
                  ? { label: form.apartmentType, value: form.apartmentType }
                  : null
              }
              onChange={(val: any) =>
                setField("apartmentType", val?.value || "")
              }
              options={[
                { label: "Studio Apartment", value: "Studio Apartment" },
                { label: "1 Bedroom Flat", value: "1 Bedroom Flat" },
                { label: "2 Bedroom Flat", value: "2 Bedroom Flat" },
                { label: "Serviced Apartment", value: "Serviced Apartment" },
              ]}
              name="apartmentType"
            />
            <SelectField
              label="Apartment style"
              required
              placeholder="Select style"
              value={
                form.apartmentStyle
                  ? { label: form.apartmentStyle, value: form.apartmentStyle }
                  : null
              }
              onChange={(val: any) =>
                setField("apartmentStyle", val?.value || "")
              }
              options={[
                { label: "Modern", value: "Modern" },
                { label: "Contemporary", value: "Contemporary" },
                { label: "Classic", value: "Classic" },
              ]}
              name="apartmentStyle"
            />
            <InputField
              label="Title"
              required
              placeholder="2-bed short stay in Lekki"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              name="description"
            />
            <InputField
              label="Price per night"
              required
              placeholder="50,000"
              value={formatDisplayValue(form.pricePerNight)}
              onChange={(e) =>
                setField(
                  "pricePerNight",
                  sanitizePositiveRentInput(e.target.value),
                )
              }
              onKeyPress={blockNonPositiveRentKeys}
              name="pricePerNight"
            />
            <InputField
              label="Minimum nights"
              required
              placeholder="2"
              value={form.minimumNights}
              onChange={(e) => setField("minimumNights", e.target.value)}
              name="minimumNights"
            />
            <InputField
              label="Bedrooms"
              required
              placeholder="2"
              value={form.noOfRooms}
              onChange={(e) => setField("noOfRooms", e.target.value)}
              name="noOfRooms"
            />
            <InputField
              label="Bathrooms"
              required
              placeholder="1"
              value={form.noOfBaths}
              onChange={(e) => setField("noOfBaths", e.target.value)}
              name="noOfBaths"
            />
            <div className="md:col-span-2">
              <InputField
                label="House rules"
                placeholder="No parties"
                value={form.houseRules}
                onChange={(e) => setField("houseRules", e.target.value)}
                name="houseRules"
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                label="Photos"
                value={form.images}
                onChange={(files) =>
                  setForm((prev) => ({ ...prev, images: files }))
                }
              />
            </div>
          </div>
          </div>
        </form>
    </ManagerLayout>
  );
};

export default CreateShortStayPage;
