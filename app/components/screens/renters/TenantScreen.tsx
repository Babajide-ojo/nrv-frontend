import Button from "../../shared/buttons/Button";

const TenantScreen = () => {
  return (
    <div className="max-w-full w-120 rounded rounded-2xl p-4 mt-8 text-center">
      <div className="text-md py-2"> Set Up Their Tenant Portal</div>
      <div className="text-center flex mx-auto w-4/5 mt-4 text-sm text-nrvGrayText font-light">
        Add your renters to TurboTenant so they have a one-stop-shop to pay you
        rent online, sign your important documents, and even request
        maintenance.
      </div>

      <Button
        size="normal"
        className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-8 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
        variant="mediumGrey"
        showIcon={false}
      >
        <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
          Add Expenses
        </div>
      </Button>
    </div>
  );
};

export default TenantScreen;
