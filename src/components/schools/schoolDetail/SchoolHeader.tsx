import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../ui/Button";

interface SchoolHeaderProps {
  schoolName: string;
  enableBackButton: boolean;
}

export const SchoolHeader: React.FC<SchoolHeaderProps> = ({
  schoolName,
  enableBackButton,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6">
      {enableBackButton && (
        <Button
          variant="secondary"
          size="sm"
          className="mr-4 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back
        </Button>
      )}
      <h1 className="text-2xl font-bold text-gray-900 flex-1">{schoolName}</h1>
    </div>
  );
};
