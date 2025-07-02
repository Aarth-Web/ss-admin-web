import React, { useState } from "react";
import { PencilIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { School } from "../../../types";

interface SchoolInformationProps {
  school: School;
  canEditSchool: boolean;
  canDeleteSchool: boolean;
  onEdit: (formData: {
    name: string;
    address: string;
    isActive: boolean;
  }) => Promise<void>;
  onDelete: () => void;
  updateLoading: boolean;
}

export const SchoolInformation: React.FC<SchoolInformationProps> = ({
  school,
  canEditSchool,
  canDeleteSchool,
  onEdit,
  onDelete,
  updateLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    address: string;
    isActive: boolean;
  }>({
    name: school.name,
    address: school.address,
    isActive: school.isActive,
  });

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setEditFormData({
        ...editFormData,
        [name]: checkbox.checked,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onEdit(editFormData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmitEdit}>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Edit School
            </h2>
            <Input
              label="School Name"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              required
            />
            <Input
              label="Address"
              name="address"
              value={editFormData.address}
              onChange={handleEditFormChange}
              required
            />

            {/* Status Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editFormData.isActive}
                  onChange={handleEditFormChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  School Active
                </span>
              </label>
            </div>

            <div className="mt-6 flex justify-between">
              {canDeleteSchool && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={onDelete}
                  size="sm"
                >
                  Delete School
                </Button>
              )}
              <div className="space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData({
                      name: school.name,
                      address: school.address,
                      isActive: school.isActive,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={updateLoading}>
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                School Information
              </h2>
              {canEditSchool && (
                <Button
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" /> Edit
                </Button>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                <div className="p-4">
                  <BuildingOfficeIcon className="h-24 w-24 text-blue-600 mx-auto" />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      School Name
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">{school.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Registration ID
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {school.registrationId}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Address
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {school.address}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <p className="mt-1 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          school.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {school.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
