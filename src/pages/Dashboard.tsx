import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { schoolService } from "../services/schoolService";
import { School } from "../types";
import {
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import { AddSchoolModal, SchoolCard } from "../components/schools";

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);
  const [loading, setLoading] = useState(false);

  // Add school modal state
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);

  const fetchSchools = async () => {
    if (loading) return; // Prevent multiple fetches

    try {
      setLoading(true);
      const searchQuery = searchTerm.length >= 3 ? searchTerm : undefined;
      const response = await schoolService.getSchools(
        currentPage,
        10,
        searchQuery
      );
      setSchools(response.schools || []);
      setTotalPages(response.pages || 1);
      setTotalSchools(response.total || 0);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools on mount and when search/pagination changes
  useEffect(() => {
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSchoolAdded = async () => {
    // Reset to first page and refresh the school list
    setCurrentPage(1);
    await fetchSchools();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Super Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/read-aloud")}
            variant="outline"
            className="flex items-center gap-1"
          >
            <BookOpenIcon className="h-5 w-5" />
            Reading Practice
          </Button>
          <Button
            onClick={() => setIsAddSchoolModalOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-5 w-5" />
            Add School
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Schools</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalSchools}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Teachers
              </p>
              <p className="text-2xl font-semibold text-gray-900">342</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Students
              </p>
              <p className="text-2xl font-semibold text-gray-900">8,905</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Search
          </button>
        </form>
      </div>

      {/* School Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Schools</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {schools.length > 0 ? (
                schools.map((school) => (
                  <SchoolCard
                    key={school._id}
                    school={school}
                    onClick={(school) => {
                      navigate(`/schools/${school._id}`);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No schools found
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 bg-gray-100 rounded-md disabled:opacity-50"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <span className="px-4 py-2 bg-white border rounded-md">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 bg-gray-100 rounded-md disabled:opacity-50"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New school registered
                </p>
                <p className="text-sm text-gray-500">Greenwood High School</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  User blocked
                </p>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Add School Modal */}
      <AddSchoolModal
        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
        onSuccess={handleSchoolAdded}
      />
    </div>
  );
};

const SchoolAdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        School Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Teachers
              </p>
              <p className="text-2xl font-semibold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p className="text-2xl font-semibold text-gray-900">678</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Classes
              </p>
              <p className="text-2xl font-semibold text-gray-900">28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Class Schedule
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Mathematics - Grade 10
                </p>
                <p className="text-sm text-gray-500">Room 101 • Mr. Johnson</p>
              </div>
              <span className="text-sm text-gray-500">9:00 AM - 10:00 AM</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Science - Grade 9
                </p>
                <p className="text-sm text-gray-500">Lab 201 • Ms. Smith</p>
              </div>
              <span className="text-sm text-gray-500">10:15 AM - 11:15 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.role === "superadmin") {
    return <SuperAdminDashboard />;
  }

  return <SchoolAdminDashboard />;
};
