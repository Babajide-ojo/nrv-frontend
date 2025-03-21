const ShortletBadge = () => {
  return (
    <div className="flex items-center space-x-2 text-[14px] text-nrvLightGreyText font-light hover:font-medium hover:text-nrvPrimaryGreen cursor-pointer">
      <span className="flex items-center">
      Rent a Shortlet ⚡
      </span>
      <span className="bg-lime-300 text-green-900 text-sm font-semibold px-2 py-1 rounded-full">
        New
      </span>
    </div>
  );
};

export default ShortletBadge;
