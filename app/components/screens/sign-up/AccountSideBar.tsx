import { Mail } from "lucide-react";

const AccountSideBar = () => {
  return (
    <div>
      {/* Sidebar Navigation */}
      <div className="w-full p-8 flex flex-col justify-between h-screen">
        <div>
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-black">NaijaRentVerify</h1>
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-green-900">
                Log in here.
              </a>
            </p>
          </div>
          <div className="mt-8 space-y-12">
            <div className="flex items-start space-x-2">
              <span className="">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_401_8721)">
                    <rect width="32" height="32" rx="16" fill="white" />
                    <rect
                      x="1"
                      y="1"
                      width="30"
                      height="30"
                      rx="15"
                      stroke="#045D23"
                      stroke-width="2"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22.7953 9.85322L13.2487 19.0666L10.7153 16.3599C10.2487 15.9199 9.51534 15.8932 8.982 16.2666C8.462 16.6532 8.31534 17.3332 8.63534 17.8799L11.6353 22.7599C11.9287 23.2132 12.4353 23.4932 13.0087 23.4932C13.5553 23.4932 14.0753 23.2132 14.3687 22.7599C14.8487 22.1332 24.0087 11.2132 24.0087 11.2132C25.2087 9.98655 23.7553 8.90655 22.7953 9.83989V9.85322Z"
                      fill="#045D23"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_401_8721">
                      <rect width="32" height="32" rx="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-[#645D5D]">Select User Type</h3>
                <p className="text-sm text-gray-600">
                  Find and secure your dream home with verified listings.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
            <div className="">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_401_9055)">
                      <g clip-path="url(#clip0_401_9055)">
                        <rect
                          x="4"
                          y="4"
                          width="32"
                          height="32"
                          rx="16"
                          fill="white"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="30"
                          height="30"
                          rx="15"
                          fill="white"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="30"
                          height="30"
                          rx="15"
                          stroke="#045D23"
                          stroke-width="2"
                        />
                        <circle cx="20" cy="20" r="5" fill="#045D23" />
                      </g>
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_401_9055"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feMorphology
                          radius="4"
                          operator="dilate"
                          in="SourceAlpha"
                          result="effect1_dropShadow_401_9055"
                        />
                        <feOffset />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_401_9055"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_401_9055"
                          result="shape"
                        />
                      </filter>
                      <clipPath id="clip0_401_9055">
                        <rect
                          x="4"
                          y="4"
                          width="32"
                          height="32"
                          rx="16"
                          fill="white"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              <div>
                <h3 className="font-medium text-[#645D5D]">Create Your Account</h3>
                <p className="text-sm text-gray-600">
                Create Your NaijaRentVerify Account
                </p>
              </div>
            </div>
            {["Verify Email or Phone"].map((step) => (
              <div key={step} className="flex items-start space-x-2">
                <div className="">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_401_9055)">
                      <g clip-path="url(#clip0_401_9055)">
                        <rect
                          x="4"
                          y="4"
                          width="32"
                          height="32"
                          rx="16"
                          fill="white"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="30"
                          height="30"
                          rx="15"
                          fill="white"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="30"
                          height="30"
                          rx="15"
                          stroke="#045D23"
                          stroke-width="2"
                        />
                        <circle cx="20" cy="20" r="5" fill="#045D23" />
                      </g>
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_401_9055"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feMorphology
                          radius="4"
                          operator="dilate"
                          in="SourceAlpha"
                          result="effect1_dropShadow_401_9055"
                        />
                        <feOffset />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_401_9055"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_401_9055"
                          result="shape"
                        />
                      </filter>
                      <clipPath id="clip0_401_9055">
                        <rect
                          x="4"
                          y="4"
                          width="32"
                          height="32"
                          rx="16"
                          fill="white"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#645D5D]">{step}</h3>
                  <p className="text-sm text-gray-600">
                    Next steps after creating your account.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="flex justify-between items-center px-6 py-4 text-green-900 text-sm">
          <p>© Naijarentverify 2025</p>
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <a
              href="mailto:info@naijarentverify.com"
              className="hover:underline"
            >
              info@naijarentverify.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AccountSideBar;
