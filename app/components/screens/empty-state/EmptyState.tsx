import Image from "next/image";
import emptyStateImg from "../../../../public/images/empy.png"
const EmptyState = () => {
  return <div>
    <Image src={emptyStateImg} alt="photo" />
  </div>;
};

export default EmptyState;
