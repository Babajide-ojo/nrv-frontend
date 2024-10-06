import { useState } from "react";
import Button from "../shared/buttons/Button";
import AddExpense from "./AddExpenseForm";

const PropertyExpenses = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  return (
    <div className="max-w-full w-120 rounded rounded-2xl p-4">
      {currentStep === 1 && (
        <div className="text-center">
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
    </div>
  );
};

export default PropertyExpenses;
