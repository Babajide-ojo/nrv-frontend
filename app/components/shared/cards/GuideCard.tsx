"use client";

import React, { useState } from "react";

interface GuideCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const GuideCard: React.FC<GuideCardProps> = ({
  imageUrl,
  title,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full relative bg-white shadow-md rounded-3xl transition-width duration-300"
      style={{
        height: "500px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white relative z-10">
          {title}
        </h2>

        <div className="text-sm text-white relative z-10 mt-4">
          {description}
        </div>

        <div className="flex justify-end pt-4 pb-4">
          <img
            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1716353814/Component_46_cqcjvp.png"
            alt="photo"
            className="h-12 w-12"
          />
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
