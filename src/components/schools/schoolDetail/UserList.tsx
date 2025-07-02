import React from "react";
import { User, UserRole } from "../../../types";
import { Button } from "../../ui/Button";
import { PencilIcon } from "@heroicons/react/24/outline";

interface UserListProps {
  users: User[];
  role: UserRole;
  usersLoading: boolean;
  canAddUser: boolean;
  onAddUser: () => void;
  canEditUser: (user: User) => boolean;
  canDeleteUser: (user: User) => boolean;
  onStatusToggle: (userId: string, currentStatus: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  role,
  usersLoading,
  canAddUser,
  onAddUser,
  canEditUser,
  canDeleteUser,
  onDeleteUser,
  onEditUser,
}) => {
  // Define the role display text
  const getRoleDisplayText = () => {
    switch (role) {
      case UserRole.SchoolAdmin:
        return "school administrators";
      case UserRole.Teacher:
        return "teachers";
      case UserRole.Student:
        return "students";
      default:
        return "users";
    }
  };

  // Get the header title
  const getHeaderTitle = () => {
    switch (role) {
      case UserRole.SchoolAdmin:
        return "School Administrators";
      case UserRole.Teacher:
        return "Teachers";
      case UserRole.Student:
        return "Students";
      default:
        return "Users";
    }
  };

  // Get the button text
  const getButtonText = () => {
    switch (role) {
      case UserRole.SchoolAdmin:
        return "Add Admin";
      case UserRole.Teacher:
        return "Add Teacher";
      case UserRole.Student:
        return "Add Student";
      default:
        return "Add User";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {getHeaderTitle()}
        </h2>
        {canAddUser && (
          <Button size="sm" className="flex items-center" onClick={onAddUser}>
            <PencilIcon className="h-4 w-4 mr-2" /> {getButtonText()}
          </Button>
        )}
      </div>
      {/* Loading state */}
      {usersLoading && (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!usersLoading && !users.length && (
        <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-md">
          No {getRoleDisplayText()} found for this school.
        </div>
      )}

      {/* Table state */}
      {!usersLoading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.registrationId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.mobile || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {canEditUser(user) && (
                        <>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => onEditUser(user)}
                          >
                            Edit
                          </Button>

                          {canDeleteUser(user) && (
                            <Button
                              variant="danger"
                              size="xs"
                              onClick={() => onDeleteUser(user._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
