import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { schoolService } from "../services/schoolService";
import { School } from "../types";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { AddSchoolModal } from "../components/schools";

export const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getSchools();
      setSchools(data.schools || []);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;

    try {
      setDeleteLoading(true);
      await schoolService.deleteSchool(selectedSchool._id);
      setSchools(schools.filter((school) => school._id !== selectedSchool._id));
      setIsDeleteModalOpen(false);
      setSelectedSchool(null);
    } catch (error) {
      console.error("Failed to delete school:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (school: School) => {
    setSelectedSchool(school);
    setIsDeleteModalOpen(true);
  };

  const handleSchoolAdded = async () => {
    await fetchSchools();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
        <Button onClick={() => setIsAddSchoolModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school) => (
                <tr key={school._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {school.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {school.address}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {school.contactEmail}
                    </div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        school.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {school?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(school)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete School"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete "{selectedSchool?.name}"? This
            action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex space-x-3">
          <Button
            variant="danger"
            onClick={handleDeleteSchool}
            loading={deleteLoading}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
