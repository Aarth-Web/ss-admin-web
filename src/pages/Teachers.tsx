import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { userService } from "../services/userService";
import { User } from "../types";
import { PlusIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers("teacher");
      setTeachers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-700">
                  {teacher.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {teacher.name}
                </h3>
                <p className="text-sm text-gray-500">{teacher.role}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                {teacher.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">ID:</span>
                {teacher.registrationId}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  teacher.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {teacher.isActive}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
