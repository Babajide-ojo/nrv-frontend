// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Star } from "lucide-react";

// export default function PropertyListing() {
//   const [property, setProperty] = useState(null);

//   useEffect(() => {
//     // Mock data sample
//     const sampleData = {
//       title: "Two Master Bedroom All En-Suite Apartment",
//       imageUrl: "/property.jpg", // replace with your image path
//       price: 445319000,
//       apartmentName: "Luxury 2–Bed Apartment",
//       address: "Plot 17b Oremeta Street, Off Opebi Link Bridge Oregun Ikeja.",
//       description:
//         "This apartment is located on the first floor with a balcony and terrace in a new building. It is simple, cosy, modern, and bright. Entering the house you can find an open kitchen with all appliances you might need: a table, 4 wooden chairs and a PLASMA TV 32”. The living room has a very comfortable double sofa bed and large windows.",
//       flatNumber: 4,
//       bedrooms: 2,
//       bathrooms: 3,
//       amenities: [
//         "Packing Space",
//         "Wi-Fi/Internet",
//         "Major Appliances",
//         "Gym",
//         "Power Backup",
//         "Swimming Pool",
//         "High Profile Security",
//         "24/7 Power Supply",
//         "Kids Play-ground",
//         "Elevator",
//       ],
//       owner: {
//         name: "Akinniyi Segun Peters",
//         email: "ojobabalaje629@gmail.com",
//         reviews: 345,
//         imageUrl: "/owner.jpg", // replace with your image path
//       },
//     };
//     setProperty(sampleData);
//   }, []);

//   if (!property) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-1">View Property Listings</h2>
//       <p className="text-muted-foreground mb-4">{property.title}</p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="rounded-2xl overflow-hidden">
//           <img
//             src={property?.property?.file}
//             alt="property"
//             className="w-full h-full object-cover rounded-2xl"
//           />
//           <Button className="w-full mt-4 bg-lime-400 text-black text-lg py-2">
//             Apply Now!
//           </Button>
//         </div>
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Price (Per Annum):</p>
//               <h3 className="text-xl font-bold">₦{property.price.toLocaleString()}</h3>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Property Owner Contact Info</p>
//               <Button variant="link" className="p-0 text-green-600">
//                 View Contact Information
//               </Button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="font-semibold">Apartment Name</p>
//               <p>{property.apartmentName}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Apartment Address/Location</p>
//               <p>{property.address}</p>
//             </div>
//           </div>

//           <div>
//             <p className="font-semibold">Description</p>
//             <p className="text-sm text-gray-700 leading-relaxed">
//               {property.description}
//             </p>
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <p className="font-semibold">Flat Number</p>
//               <p>{property.flatNumber}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Number of Bedrooms</p>
//               <p>{property.bedrooms}</pa>
//             </div>
//             <div>
//               <p className="font-semibold">Number of Bathrooms</p>
//               <p>{property.bathrooms}</p>
//             </div>
//           </div>

//           <div>
//             <p className="font-semibold mb-2">Apartment Facilities/Amenities</p>
//             <div className="flex flex-wrap gap-2">
//               {property.amenities.map((amenity, idx) => (
//                 <Badge key={idx} variant="outline" className="text-green-700 border-green-400">
//                   {amenity}
//                 </Badge>
//               ))}
//             </div>
//           </div>

//           <Card className="flex items-center gap-4 p-4 mt-4">
//             <img
//               src={property.owner.imageUrl}
//               alt="owner"
//               className="w-14 h-14 rounded-full object-cover"
//             />
//             <div>
//               <p className="font-semibold">{property.owner.name}</p>
//               <p className="text-sm text-gray-600">{property.owner.email}</p>
//               <div className="flex items-center text-sm text-yellow-500">
//                 <Star className="w-4 h-4 mr-1" fill="currentColor" />
//                 {property.owner.reviews} Reviews
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
