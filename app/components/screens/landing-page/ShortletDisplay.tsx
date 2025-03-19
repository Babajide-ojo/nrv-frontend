import Image from "next/image";
import { FaCalendar } from "react-icons/fa";
import { IoCalendarClearOutline } from "react-icons/io5";

const shortLets = [
  {
    id: 1,
    title: "Beachfront Apartment. Best View In Lagos!",
    date: "February 25, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/images/shortlet1.jpeg",
  },
  {
    id: 2,
    title: "Harris James Villa – Absolute Finest.",
    date: "February 25, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/images/shortlet2.jpeg",
  },
  {
    id: 3,
    title: "Luxury Home In Victoria Island",
    date: "February 25, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/images/shortlet3.jpeg",
  },
];

export default function ShortLets() {
  return (
    <section className="py-12 px-6 md:px-16 w-4/5 mx-auto">
      <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
        <div className="mb-6 md:mb-0">
        <span className="text-[#0D3520] font-normal rounded-full border border-[#0D3520] p-2 ">
            / FEATURED
          </span>
          <h2 className="text-3xl md:text-[50px] font-medium mt-3 text-green-900 leading-8 mt-8">
          Explore our  Perfect <br></br><br></br>
          Vacation Rentals
          </h2>
        </div>
        <div>
          <p className="text-gray-600 mb-4 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <button className="bg-green-800 text-white px-8 py-4 hover:bg-green-900 transition rounded rounded-full">
            Book a Reservation →
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {shortLets.map((letItem) => (
          <div key={letItem.id} className="bg-[#E9F4E7] overflow-hidden">
            <Image
              src={letItem.image}
              alt={letItem.title}
              width={300}
              height={250}
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <p className="text-md font-medium text-[#045D23] flex items-center gap-2">
                <IoCalendarClearOutline size={16} /> {letItem.date}
              </p>
              <h3 className="text-[24px] font-semibold text-green-900 mt-2">
                {letItem.title}
              </h3>
              <p className="text-[#67667A] font-light mt-2 leading-8">{letItem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
