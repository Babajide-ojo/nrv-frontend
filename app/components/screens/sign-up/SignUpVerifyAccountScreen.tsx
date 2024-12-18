import { useEffect, useState } from "react";
import Button from "../../shared/buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import { verifyAccount } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";

const SignUpVerifyAccount: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const { error } = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const   handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("emailToVerify") || "{}");
    const payload = {
      email: user?.data?.email,
      confirmationCode: otp,
    };

    setIsLoading(true);
    try {
      await dispatch(verifyAccount(payload) as any).unwrap();
      const _formattedUser = JSON.parse(
        localStorage.getItem("nrv-user") || "{}"
      );
      const userAccountType = _formattedUser?.user?.accountType || "";

      if (
        userAccountType === "landlord" &&
        _formattedUser.user.isOnboarded === true
      ) {
        router.push("/dashboard/landlord");
      } else if (
        userAccountType === "landlord" &&
        _formattedUser.user.isOnboarded === false
      ) {
        router.push("/dashboard/landlord");
      } else if (userAccountType === "tenant") {
        router.push("/dashboard/tenant");
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error);
    } 
  };

  return (
    <main className="flex justify-center items-center bg-swSecondary50 mx-auto h-screen">
      <div className="w-full sm:w-3/5 p-2">
        <p className="text-2xl font-semibold text-swGray800 flex gap-2 text-center justify-center">
          Check your mail!
        </p>
        <p className="text-center mt-2 mb-8 text-[0.86rem] flex items-center justify-center font-light mx-auto">
          We just sent you an email. Enter the 6-digit
          code to verify your account.
        </p>
        <p className="text-center text-nrvLightBlue mt-5 mb-8 text-[0.86rem] flex items-center justify-center font-light nrvLightBlue">
          Open an email app <br />
          Change email or Resend code in 00:59
        </p>
        <div className="flex justify-center w-full  mx-auto">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span> </span>}
            renderInput={(props) => (
              <input
                {...props}
                className="otp-input "
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
        <div className="text-center text-red-500 mb-8 mt-6">
          {!otp && "Please enter the complete verification code."}
        </div>
        <div className="mt-24">
          <Button
            onClick={handleSubmit}
            size="minLarge"
            className="block w-full"
            variant="bluebg"
            showIcon={false}
            disabled={otp.length !== 6 || isLoading}
            isLoading= {isLoading ? true : false}
          >
            {isLoading ? "Loading..." : "Confirm"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SignUpVerifyAccount;
