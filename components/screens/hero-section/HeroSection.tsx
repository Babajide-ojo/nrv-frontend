import GroupPeople from "../../../public/images/group-people.png";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa6";
import Button from '../../shared/buttons/Button';
import HoverableCard from "@/components/shared/cards/HoverableCard";
import { CardData } from "@/helpers/data";



const CardsList = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CardData.map((card, index) => (
          <HoverableCard
            key={index}
            imageLink={card.imageLink}
            title={card.title}
            content={card.content}
          />
        ))}
      </div>
    );
  };


const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="text-center">
        <div className="text-4xl text-nrvDarkBlue font-semibold">
          Streamline Your Rentals <br />
          with NaijaRentVerify: Secure, Simple, Smart.
        </div>
        <div className="mt-4 text-sm">
          Seamless Rentals, Smart Decisions: NaijaRentVerify - Your Secure,
          Simple, and Intelligent Property <br /> Management Solution.
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Image
          src={GroupPeople}
          width={200}
          height={100}
          alt="logo"
        //   className="object-fit"
        />
        <div>
          <div className="text-nrvDarkBlue font-semibold">3,050,543 users</div>
          <div className="flex mt-1">
            <FaStar className="text-nrvGold" />
            <FaStar className="text-nrvGold" />
            <FaStar className="text-nrvGold" />
            <FaStar className="text-nrvGold" />
            <FaRegStar className="text-nrvGold" />
            <p className="text-sm font-semibold ml-2">4.0</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
      <Button showIcon={true} size="large" variant="darkPrimary" >Get Started</Button>
      </div>
      <div className="mt-12 max-w-7xl">
        <p className="mb-4 ml-2 text-md font-semibold">Rental property management tool</p>
      <CardsList />
      </div>
    </div>
  );
};

export default HeroSection;
