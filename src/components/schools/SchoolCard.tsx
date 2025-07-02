import React from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { School as SchoolType } from "../../types";

interface SchoolCardProps {
  school: SchoolType;
  onClick?: (school: SchoolType) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(school);
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-4 flex flex-col items-center aspect-square cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <BuildingOfficeIcon className="h-16 w-16 text-blue-600 mb-3" />
      <h3 className="font-medium text-gray-900 text-center mb-1">
        {school.name}
      </h3>
      <p className="text-sm text-gray-500 text-center mb-2">{school.address}</p>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          ID: {school.registrationId}
        </p>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            school.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {school.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};
