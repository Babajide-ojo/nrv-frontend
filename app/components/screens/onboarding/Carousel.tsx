import { useEffect } from "react";

interface CarouselProps {
  currentItem: {
    imageLink: string;
    title: string;
    description: string;
  };
}

const Carousel: React.FC<CarouselProps> = ({ currentItem }) => {


  return (
    <div className="w-full md:w-1/2 lg:w-1/2 py-8 px-12 hidden md:flex lg:flex items-center justify-center bg-nrvPrimaryGreen rounded-2xl m-8">
      <div className="w-full">
        <div className="flex justify-center items-center mb-2">
          <img
            src={currentItem.imageLink}
            className="w-10 h-10 bg-white rounded-sm"
            alt={currentItem?.title}
          />
        </div>
        <div className="text-white text-lg text-center mb-2">
          {currentItem?.title}
        </div>
        <div className="text-white text-md text-center w-2/3 justify-center mx-auto">
          {currentItem.description}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

