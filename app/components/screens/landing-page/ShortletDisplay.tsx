import Image from "next/image";
import { FaCalendar } from "react-icons/fa";
import { IoCalendarClearOutline } from "react-icons/io5";

const shortLets = [
  {
    id: 1,
    title: "Beachfront Apartment. Best View In Lagos!",
    date: "February 25, 2025",
    description: "Beachfront getaway with stunning views and modern amenities.",
    image: "/images/shortlet1.jpeg",
  },
  {
    id: 2,
    title: "Harris James Villa – Absolute Finest.",
    date: "February 25, 2025",
    description: "Premium villa with spacious living and top-tier finishes.",
    image: "/images/shortlet2.jpeg",
  },
  {
    id: 3,
    title: "Luxury Home In Victoria Island",
    date: "February 25, 2025",
    description: "Elegant Victoria Island home with premium facilities.",
    image: "/images/shortlet3.jpeg",
  },
];

export default function ShortLets() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-5 max-w-[1400px] mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 md:flex-nowrap">
        <div className="mb-4 md:mb-0">
          <span className="text-[#0D3520] font-normal rounded-full border border-[#0D3520] px-3 py-1.5 text-sm">
            FEATURED
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[50px] font-medium mt-3 text-green-900 leading-tight mt-6 md:mt-8">
            Explore our Perfect
            <br className="hidden sm:block" />
            <span className="sm:block">Vacation Rentals</span>
          </h2>
        </div>
        <div className="w-full sm:max-w-md">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Discover handpicked vacation rentals for your next trip. Book with confidence.
          </p>
          <button className="bg-green-800 text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 hover:bg-green-900 transition rounded-full w-full sm:w-auto">
            Book a Reservation →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10">
        {shortLets.map((letItem) => (
          <div key={letItem.id} className="bg-[#E9F4E7] overflow-hidden rounded-lg">
            <Image
              src={letItem.image}
              alt={letItem.title}
              width={300}
              height={250}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <div className="p-4 sm:p-5">
              <p className="text-md font-medium text-[#045D23] flex items-center gap-2">
                <IoCalendarClearOutline size={16} /> {letItem.date}
              </p>
              <h3 className="text-lg sm:text-[21px] font-semibold text-green-900 mt-2">
                {letItem.title}
              </h3>
              <p className="text-[#67667A] font-light mt-2 text-sm sm:text-base leading-7 sm:leading-8">
                {letItem.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
