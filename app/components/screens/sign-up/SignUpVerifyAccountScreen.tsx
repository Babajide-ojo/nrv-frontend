import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAccount } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";
import { IoReload } from "react-icons/io5";
import Button from "../../shared/buttons/Button";
import PreferencesForm from "./PreferencesForm";
import VerifyAccountSideBar from "./VerifyAccountSideBar";
import CompleteProfileSideBar from "./CompleteProfileSideBar";
import AddPropertySideBar from "./AddPropertySideBar";
import MultiStepForm from "./MultiStepForm";

const SignUpVerifyAccount: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const { error } = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    const user = JSON.parse(localStorage.getItem("emailToVerify") || "{}");

    const payload = {
      email: user?.data?.email || user.user.email,
      confirmationCode: otp,
    };

    setIsLoading(true);
    try {
      const response = await dispatch(verifyAccount(payload) as any).unwrap();
      setData(response);
      localStorage.removeItem("stepToLoad");
      setStep(2); 
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error);
    }
  };

  const handleResend = () => {
    setTimer(120);
    setCanResend(false);
  };

  return (
    <main className=" bg-white">
      <div className="w-full bg-white">
        {step === 1 ? (
          <div className="w-full flex">
            <div className="w-1/2 bg-[#E9F4E7]">
              {" "}
              <VerifyAccountSideBar />
            </div>
            <div className="w-1/2 flex flex-col justify-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Verify Your Email Address
                </h2>
                <p className="mt-2 text-gray-600">
                  We&#34;ve sent a verification link to your email.
                </p>
                <p className="mt-1 text-gray-600">
                  Enter the 6-digit OTP to verify your account.
                </p>

                <div className="mt-4 text-left text-gray-700">
                  <p className="font-semibold">Instructions:</p>
                  <ul className="list-disc list-inside text-sm">
                    <li className="mt-4">Open your email inbox.</li>
                    <li className="mt-4">
                      Look for an email from NaijaRentVerify.
                    </li>
                    <li className="mt-4">
                      Copy the One-time PIN (OTP) and paste it here.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span> </span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="otp-input outline-none border-1 border-gray-300"
                        style={{
                          fontSize: "16px",
                          height: "50px",
                          textAlign: "center",
                          width: "54px",
                          border: "1px rgba(208, 213, 221, 1) solid",
                          marginRight: "8px",
                          marginLeft: "8px",
                          borderRadius: "9px",
                        }}
                      />
                    )}
                  />
                </div>

                <p className="mt-4 text-sm text-gray-500 text-center">
                  Did not receive verification code?
                </p>
                <div className="mt-2 flex items-center justify-center space-x-2 text-green-600 text-center">
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      className="flex items-center gap-1"
                    >
                      <IoReload className="text-lg" /> Resend OTP
                    </button>
                  ) : (
                    <p className="text-gray-500">
                      {Math.floor(timer / 60)}:
                      {(timer % 60).toString().padStart(2, "0")}s
                    </p>
                  )}
                </div>

                <Button
                  size="large"
                  className="block w-full mt-6 font-medium text-[16px]"
                  variant="darkPrimary"
                  showIcon={false}
                  onClick={handleSubmit}
                  disabled={otp.length !== 6 || isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? "Loading..." : "Continue"}
                </Button>

                <p className="mt-4 text-gray-500 italic text-center font-light">
                  Contact Support
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {data.user.accountType === "tenant" && (
              <div className="flex w-full">
                <div className="w-1/2 bg-[#E9F4E7]">
                  <CompleteProfileSideBar />
                </div>
                <div className="w-1/2 flex-col justify-center">
                  <div className="max-w-md mx-auto">
                    <PreferencesForm />
                  </div>
                </div>
              </div>
            )}

            {data.user.accountType === "landlord" && (
              <div className="flex w-full">
                <div className="w-1/2 bg-[#E9F4E7]">
                  <AddPropertySideBar />
                </div>
                <div className="w-1/2 flex-col justify-center">
                  <div className="max-w-xl mx-auto">
                    <MultiStepForm />
                  </div>
                </div>
              </div>

              
            )}

           
          </div>
        )}
      </div>
    </main>
  );
};

export default SignUpVerifyAccount;
