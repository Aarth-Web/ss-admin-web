import React from "react";
import { UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export enum TabType {
  SchoolAdmin = "SchoolAdmin",
  Teachers = "Teachers",
  Students = "Students",
}

interface UserTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const UserTabs: React.FC<UserTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
              activeTab === TabType.SchoolAdmin
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange(TabType.SchoolAdmin)}
          >
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              School Administrators
            </div>
          </button>
          <button
            className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
              activeTab === TabType.Teachers
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange(TabType.Teachers)}
          >
            <div className="flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Teachers
            </div>
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TabType.Students
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange(TabType.Students)}
          >
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Students
            </div>
          </button>
        </nav>
      </div>
    </div>
  );
};
