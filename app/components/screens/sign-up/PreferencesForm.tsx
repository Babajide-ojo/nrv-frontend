import React, { useState } from "react";
import SelectField from "../../shared/input-fields/SelectField";
import Button from "../../shared/buttons/Button";
import InputField from "../../shared/input-fields/InputFields";
import { Form, Formik } from "formik";
import DatePickerField from "../../shared/input-fields/DatePickerField";
import { updateUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../../shared/modals/Modal";
import CenterModal from "../../shared/modals/CenterModal";
import Link from "next/link";

type GenderOption = { value: string; label: string };

type FormDataType = {
  gender: GenderOption | null;
  dob: string;
  file: any;
  employmentStatus: string | null;
  employer: string;
  jobTitle: string;
  incomeRange: string | null;
};

const genderOptions: GenderOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const employmentOptions = [
  { value: "self-employed", label: "Self-Employed" },
  { value: "employed", label: "Employed" },
];

const incomeOptions = [
  { value: "below-300k", label: "Below ₦300,000" },
  { value: "above-300k", label: "Above ₦300,000" },
];

const PreferencesForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    gender: null,
    dob: "",
    file: null,
    employmentStatus: null,
    employer: "",
    jobTitle: "",
    incomeRange: null,
  });

  return step === 1 ? (
    <ProfileSetup
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStep(2)}
    />
  ) : (
    <PreferencesStep formData={formData} setFormData={setFormData} />
  );
};

type ProfileSetupProps = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  onNext: () => void;
};

const ProfileSetup: React.FC<ProfileSetupProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        file: file,
      }));
    }
  };

  return (
    <div className="flex flex-col w-full justify-center h-screen">
      <div className="bg-white p-6 rounded-2xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Help us personalize your experience by providing a few more details.
        </p>

        <Formik initialValues={formData} onSubmit={onNext}>
          {() => (
            <Form>
              <div className="border-dashed border-2 p-6 text-center rounded-lg mb-6 relative">
                {formData.file ? (
                  <div>
                    <div className="flex justify-center">
                      <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Profile Preview"
                        className="h-20 w-20 rounded-full"
                      />
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">
                      <span className="text-nrvPrimaryGreen font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      SVG, PNG, JPG, GIF (max. 800×400px)
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <img
                        src="/icons/Upload.svg"
                        alt="Profile Preview"
                        className=""
                      />
                    </div>
                    <p className="text-gray-500 mt-2">
                      <span className="text-nrvPrimaryGreen">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      SVG, PNG, JPG, GIF (max. 800×400px)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, gender: selected }))
                }
                options={genderOptions}
                placeholder="Select your Gender"
              />
              <DatePickerField
                name="dob"
                label="Date of Birth"
                onChange={(date: any) =>
                  setFormData((prev) => ({ ...prev, dob: date.toISOString() }))
                }
              />

              <Button
                variant="darkPrimary"
                className="w-full text-[14px]"
                size="large"
                onClick={onNext}
              >
                Save and Continue
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/dashboard/tenant"
                  className="text-[#807F94] text-xs"
                >
                  Skip for Now
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

type PreferencesStepProps = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

const PreferencesStep: React.FC<PreferencesStepProps> = ({
  formData,
  setFormData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<any>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      console.log({ user });

      const formDataObject = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof FileList) {
          Array.from(value).forEach((file) => formDataObject.append(key, file));
        } else {
          formDataObject.append(key, value as any);
        }
      });

      const userData = await dispatch(
        updateUser({ id: user.user._id, payload: formDataObject }) as any
      ).unwrap();

      localStorage.setItem("nrv-user", JSON.stringify(userData));
      setShowModal(true); // Show success modal
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full min-h-screen">
      <ToastContainer />
      <div className="bg-white p-6 rounded-2xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Set Up Preferences
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Tell us more about what you are looking for to get personalized
          recommendations.
        </p>

        <div className="space-y-8">
          <SelectField
            label="Employment Status"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, employmentStatus: selected }))
            }
            options={employmentOptions}
            placeholder="Pick Employment Status"
          />

          <InputField
            label="Current Employer (if employed)"
            name="employer"
            value={formData.employer}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, employer: e.target.value }))
            }
            placeholder="Enter Employer Name"
          />

          <InputField
            label="Enter Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
            placeholder="Enter Job Title"
          />

          <SelectField
            label="Monthly Income Range"
            name="incomeRange"
            value={formData.incomeRange}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, incomeRange: selected }))
            }
            options={incomeOptions}
            placeholder="Pick Monthly Income Range"
          />
        </div>

        <Button
          variant="darkPrimary"
          className="w-full text-[14px] mt-8"
          size="large"
          onClick={handleSubmit}
          isLoading={isLoading ? true : false}
          //disabled={ isLoading? true : false}
        >
          Save Preferences
        </Button>

        <div className="mt-4 text-center">
             <Link href="/dashboard/tenant" className="text-[#807F94] text-xs">Skip for Now</Link>
             </div>
      </div>

      <CenterModal isOpen={showModal} onClose={() => !showModal}>
        <div>
          <div className="flex justify-center items-center">
            <div className="rounded-2xl p-8 w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Welcome to NaijaRentVerify
                </h2>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Thank you for creating an account with NaijaRentVerify! We are
                excited to have you on board.
              </p>
              <p className="mt-4 text-gray-600 text-sm">
                You can now proceed to your dashboard to complete your Account
                configuration. Its Secure, and Hassle-Free.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end bg-gray-100 p-4">
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-full text-sm font-medium shadow-md hover:bg-green-700"
              onClick={() => router.push("/dashboard/tenant")}
            >
              Proceed to Dashboard
            </button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};

export default PreferencesForm;
