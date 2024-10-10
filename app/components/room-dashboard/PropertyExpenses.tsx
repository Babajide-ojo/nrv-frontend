import { useEffect, useState } from "react";
import Button from "../shared/buttons/Button";
import AddExpense from "./AddExpenseForm";
import { getApartmentExpense } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

const PropertyExpenses = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [expenses, setExpenses] = useState<any>([]);
  const [singleExpense, setSingleExpense] = useState<any>({});
  const { id } = useParams();
  const dispatch = useDispatch();

  const fetchData = async () => {
    const formData = {
      id: id,
    };

    try {
      const response = await dispatch(getApartmentExpense(formData) as any);
      setExpenses(response?.payload?.data);
      if (response?.payload?.data.length) {
        setCurrentStep(3);
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="rounded rounded-2xl p-4">
      <div>
        {currentStep === 1 && (
          <div className="text-center w-120">
            <div className="text-md py-2"> All your expenses in one place</div>
            <div className="text-center flex mx-auto w-4/5 mt-4 text-sm text-nrvGrayText font-light">
              Keep track of your expenses to get a clearer picture of
              profitability and capitalize on all the tax deductions that
              landlords are entitled to.
            </div>

            <Button
              size="normal"
              className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-8 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
              onClick={() => setCurrentStep(2)}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Add Expenses
              </div>
            </Button>
          </div>
        )}

        {currentStep === 2 && <AddExpense />}
        {currentStep === 3 && (
          <div>
            <div className="flex justify-end">
              <Button
                size="small"
                className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
                variant="whitebg"
                showIcon={false}
                onClick={() => {
              
                  setCurrentStep(2);
                }}
              >
                Record Expense
              </Button>
            </div>
            <div className="mt-8 mx-auto grid gap-6 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {expenses &&
                expenses.map((item: any) => {
                  return (
                    <div
                      key={item.id}
                      className="bg-white shadow-md rounded-lg p-5 transition-transform transform hover:scale-105"
                      onClick={() => {
                        //  alert("I was clicked");

                        setSingleExpense(item);
                       
          
                        setCurrentStep(4);
                      }}
                    >
                      <div className="flex justify-between mb-4">
                        <div className="mb-2 text-xs font-semibold text-gray-800">
                          Amount:{" "}
                          <span className="text-green-600">
                            {item.amount.toLocaleString()} NGN
                          </span>
                        </div>
                        <div className="mb-2 text-xs font-semibold text-gray-800">
                          <Button
                            size="smaller"
                            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 bg-white  transition"
                            showIcon={false}
                            onClick={() => {
                              // Add your view details logic here
                            }}
                          >
                            <span className="">{item.category}</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mb-4 text-xs text-gray-600 text-wrap md:truncate h-50">
                        {item.description}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
     {currentStep === 4 && (
  <div>
    <div className="mt-8 mx-auto bg-white shadow-md rounded-lg p-6 max-w-md">
      <div className="mb-4">
        <h2 className="text-md font-bold text-gray-800">Expense Details</h2>
      </div>

      <div className="mb-4">
        <span className="font-medium text-sm text-gray-600">Category: </span>
        <span className="text-gray-800">{singleExpense.category}</span>
      </div>

      <div className="mb-4">
        <span className="font-medium text-sm text-gray-600">Amount: </span>
        <span className="text-green-600 font-semibold">
          {singleExpense.amount.toLocaleString()} NGN
        </span>
      </div>

      <div className="mb-4">
        <span className="font-medium text-sm text-gray-600">Description: </span>
        <p className="text-gray-700 text-xs">{singleExpense.description}</p>
      </div>

      <div className="mb-4">
        <span className="font-medium text-sm text-gray-600">Uploaded Document: </span>
        <p className="text-gray-700">URL</p>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          size="small"
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
          variant="whitebg"
          showIcon={false}
          onClick={() => {
            setCurrentStep(3);
          }}
        >
          Back
        </Button>

        <Button
          size="small"
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
          variant="whitebg"
          showIcon={false}
          onClick={() => {
            // Add your view details logic here
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default PropertyExpenses;
