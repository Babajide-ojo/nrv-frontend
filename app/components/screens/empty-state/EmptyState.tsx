import Image from "next/image";
import emptyStateImg from "../../../../public/images/empty.png";
const EmptyState = () => {
  return (
    <div>
      <Image src={emptyStateImg} alt="photo" height={300} className="w-full" />
    </div>
  );
};

export default EmptyState;
