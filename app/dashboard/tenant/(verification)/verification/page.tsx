"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TenantVerificationPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, any> | null>(null);

  console.log("USer", user);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("nrv-user");
      if (!user) {
        router.push("/sign-in");
      } else {
        const parsedUser = JSON.parse(user);
        if (parsedUser?.user?.accountType === "tenant") {
          setUser(parsedUser?.user);
        } else {
          router.push("/sign-in");
        }
      }
    }
  }, []);

  return (
    <div className="">
      <div className="max-w-[1000px] mx-auto w-full p-3 bg-white rounded-lg flex flex-col md:flex-row md:items-center gap-5">
        <div className="h-[auto] w-1/2 ">
          <Image
            height={100}
            width={100}
            src="/images/verfication_landing.svg"
            alt="Verification"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="md:w-1/2 flex md:justify-center md:items-center">
          <div className="md:max-w-[300px] w-full">
            <h2 className="font-bold text-[18px]">Hi {user?.firstName},</h2>
            <h2 className="font-bold text-[18px]">
              Welcome to NaijaRentVerify
            </h2>
            <h2 className="font-bold text-[18px]">
              Let&apos;s get you verified
            </h2>
            <p className="mt-5 text-[14px] mb-5">
              We need some important information to enable us verify your
              identity on behalf of your Landlord on{" "}
              <span className="font-bold">NaijaRentVerify</span>. No sensitive
              data is shared directly with your Landlord and this is used solely
              for verification purposes.
            </p>
            <Button
              onClick={() =>
                router.push("/dashboard/tenant/verification/personal-info")
              }
              className="w-40 bg-[#2B892B] hover:bg-[#2B892B]/80 rounded-full text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantVerificationPage;
