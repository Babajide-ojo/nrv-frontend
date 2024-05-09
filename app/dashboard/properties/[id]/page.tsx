import { BsHouse } from "react-icons/bs";
import { IoPencilOutline } from "react-icons/io5";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import { PiPencilSimpleLight } from "react-icons/pi";
import Button from "../../../components/shared/buttons/Button";

const propertyDashboardLinks: any = [
  {
    id: 1,
    name: "Overview",
  },
  {
    id: 2,
    name: "Marketing",
  },
  {
    id: 1,
    name: "Maintenance",
  },
  {
    id: 1,
    name: "Document",
  },
  {
    id: 1,
    name: "Expenses",
  },
];
const SingleProperty = () => {
  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout>
          <div className="">
            <div>
              <div className="flex justify-between px-4 py-12 md:px-24 md:py-12">
                <div>
                  <div className="flex gap-2">
                    <div className="h-16 w-16  bg-nrvDarkBlue rounded rounded-lg flex justify-center flex-col items-center">
                      <BsHouse color="white" size={35} />
                    </div>
                    {/* <img
                          src={property.file}
                          className="h-16 w-16"
                          alt="Property"
                        /> */}
                    <p className="text-md font-medium text-nrvDarkBlue text-nrvDarkGrey font-light">
                      888 Elmwood Terrace
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      size="normal"
                      className="text-nrvDarkBlue border border-nrvDarkBlue mt-2 rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div className="flex gap-3 p-1.5">Rental ID: 1340201</div>
                    </Button>
                    <Button
                      size="normal"
                      className="text-nrvDarkBlue border border-nrvDarkBlue mt-2 rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div className="flex gap-3 p-1.5">Rent: ₦0.00</div>
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="p-2 border border-gray-500 rounded rounded-full">
                    <PiPencilSimpleLight />
                  </div>
                </div>
              </div>
              <div className="flex w-full gap-1 md:gap-6 bg-nrvGreyMediumBg mt-1 pl-4">
                {propertyDashboardLinks.map((item: any) => (
                  <div key={item.id}>
                    <Button
                      size="normal"
                      className="bg-nrvGreyMediumBg text-nrvDarkBlue p-1 border border-nrvGreyMediumBg mt-2 rounded-md mb-2"
                      variant="mediumGrey"
                      showIcon={false}
                    >
                      <div className="text-xs  md:text-md  ">{item.name}</div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default SingleProperty;
