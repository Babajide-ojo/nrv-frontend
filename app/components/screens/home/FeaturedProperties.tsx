import { FaPhoneAlt } from "react-icons/fa";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import { useState } from "react";
import Button from "../../shared/buttons/Button";

const propertyData = [
  {
    type: "Apartment",
    price: "#250,095",
    location: "29, Adeaga Street, Ibeju-Lekki, Lagos, Nigeria",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
    image: "/images/featured-img.svg",
    advisor: {
      name: "Dami Ademola",
      image: "/images/dami.svg"
    },
    features: {
      bedrooms: "4 bed",
      bathrooms: "4 room",
      area: "12x12 m2",
      style: "Modern"
    }
  },
  {
    type: "Commercial",
    price: "#500,000",
    location: "10, Victoria Island, Lagos, Nigeria",
    description: "A premium office space in the heart of the business district.",
    image: "/images/featured-img.svg",
    advisor: {
      name: "Dami Ademola",
      image: "/images/dami.svg"
    },
    features: {
      bedrooms: "N/A",
      bathrooms: "2 restrooms",
      area: "2000 sqft",
      style: "Corporate"
    }
  },
  {
    type: "Community",
    price: "#250,095",
    location: "29, Adeaga Street, Ibeju-Lekki, Lagos, Nigeria",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
    image: "/images/featured-img.svg",
    advisor: {
      name: "Dami Ademola",
      image: "/images/dami.svg"
    },
    features: {
      bedrooms: "4 bed",
      bathrooms: "4 room",
      area: "12x12 m2",
      style: "Modern"
    }
  },
  {
    type: "Ready Flat",
    price: "#500,000",
    location: "10, Victoria Island, Lagos, Nigeria",
    description: "A premium office space in the heart of the business district.",
    image: "/images/featured-img.svg",
    advisor: {
      name: "Dami Ademola",
      image: "/images/dami.svg"
    },
    features: {
      bedrooms: "N/A",
      bathrooms: "2 restrooms",
      area: "2000 sqft",
      style: "Corporate"
    }
  }
];

const FeaturedProperties = () => {
  const [selectedProperty, setSelectedProperty] = useState(propertyData[0]);

  return (
    <div className="bg-[#0D3520] flex items-center justify-center p-5">
      <div className="max-w-6xl w-full my-16">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-normal rounded-full border border-[#BBFF37] p-2">
            / FEATURED PROPERTIES
          </span>
        </div>
        <h2 className="md:text-3xl text-2xl font-bold text-white">
          Find Your Ideal Living Space
        </h2>
        <div className="md:flex md:justify-between block mt-4">
          <div className="flex space-x-3 text-sm overflow-x-auto">
            {propertyData.map((property) => (
              <button
                key={property.type}
                className={`md:px-4 md:py-2 px-2 rounded-full font-light md:text-[12px] text-[12px] ${
                  selectedProperty.type === property.type
                    ? "bg-lime-400 text-green-900"
                    : "bg-[#0D3520] border border-[#E9F4E7] text-[#E9F4E7]"
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                {property.type}
              </button>
            ))}
          </div>
          <Button
            variant="lemonPrimary"
            className="md:text-[16px] text-[14px] sm:w-64 mt-4 sm:mt-0"
            size="large"
          >
            Explore Our Services
          </Button>
        </div>

        <div className="mt-6 border border-[#E9F4E74D] rounded-2xl flex flex-col lg:flex-row">
  {/* Image Section */}
  <div className="relative w-full lg:w-2/5">
    <img
      src={selectedProperty.image}
      alt={selectedProperty.type}
      className="rounded-lg w-full h-full object-cover"
    />
  </div>

  {/* Property Details Section */}
  <div className="w-full lg:w-3/5 p-6 text-white flex flex-col justify-center">
    <div>
      {/* Price and Advisor Information */}
      <div className="flex justify-between">
        <p className="text-lime-400 text-[24px] sm:text-[30px] font-bold mt-4">
          {selectedProperty.price}{" "}
          <span className="text-sm font-light text-white">/ Month</span>
        </p>
        <div className="mt-4 md:flex hidden items-center mr-6">
          <img
            src={selectedProperty.advisor.image}
            alt={selectedProperty.advisor.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-3 mr-2">
            <p className="font-semibold">
              {selectedProperty.advisor.name}
            </p>
            <p className="text-white text-sm font-light">
              Property Advisor
            </p>
          </div>
          <button className="ml-auto bg-white p-4 rounded-full">
            <FaPhoneAlt
              size={16}
              className="font-medium"
              color="#03442C"
            />
          </button>
        </div>
      </div>

      {/* Property Type and Location */}
      <h3 className="text-2xl font-semibold md:mt-12 mt-4">
        {selectedProperty.type} Realty
      </h3>
      <p className="flex md:text-[18px] text-[14px] items-center mt-1 text-white py-4">
        <MapPin size={16} color="#BBFF37" className="mr-1" />{" "}
        {selectedProperty.location}
      </p>
      <p className="mt-2 text-white font-light text-[14px] leading-8">
        {selectedProperty.description}
      </p>
    </div>

    {/* Property Features */}
    <div className="mt-4 md:mb-8 bg-[#E9F4E7] p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 text-sm text-nrvPrimaryGreen font-medium gap-4">
      {Object.entries(selectedProperty.features).map(([key, value]) => (
        <div key={key}>
          <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
          <div className="flex items-center">
            {key === "bedrooms" && <Bed size={16} className="mr-1" />}
            {key === "bathrooms" && <Bath size={16} className="mr-1" />}
            {key === "area" && <Ruler size={16} className="mr-1" />}
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default FeaturedProperties;
