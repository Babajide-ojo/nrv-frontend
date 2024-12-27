const MarketingDetailsScreen = () => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/2 py-8 px-12 hidden md:flex lg:flex items-center justify-center bg-nrvDarkBlue rounded-2xl m-8">
      <div className="w-full text-center text-nrvLightGreyBg max-w-sm">
        {/* <p className="text-sm mb-2">Marketing</p>
        <p className="text-xs">Easily Find Quality Tenants</p> */}

        <div className="">
          <div className="mt-8 text-start">
            <p className="font-semibold text-md">Post across the web</p>
            <p className="text-sm font-normal">
              Add your property details and then post to different platforms for
              free!
            </p>
          </div>
          <div className="mt-8 text-start">
            <p className="font-semibold text-md">Manage your leads</p>
            <p className="text-sm font-normal">
              Keep track of everyone that’s interested in one place!{" "}
            </p>
          </div>
          <div className="mt-8 text-start">
            <p className="font-semibold text-md">Screen Tenants</p>
            <p className="text-sm font-normal">
              Rent with confidence when you use our rental application and
              credit, criminal, and eviction report.
            </p>
          </div>
 
          
        </div>
      </div>
    </div>
  );
};

export default MarketingDetailsScreen;
