import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { userService } from "../services/userService";
import { schoolService } from "../services/schoolService";
import { User, UpdateUserData, School } from "../types";
import { EditUserModal } from "../components/users";
import {
  PlusIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"block" | "unblock" | "delete">(
    "block"
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const data = await schoolService.getSchools(1, 100);
      setSchools(data.schools || []);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      switch (actionType) {
        case "block":
          await userService.blockUser(selectedUser._id);
          break;
        case "unblock":
          await userService.unblockUser(selectedUser._id);
          break;
        case "delete":
          await userService.deleteUser(selectedUser._id);
          break;
      }

      await fetchUsers();
      setActionModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(`Failed to ${actionType} user:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (
    user: User,
    action: "block" | "unblock" | "delete"
  ) => {
    setSelectedUser(user);
    setActionType(action);
    setActionModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      await userService.updateUser(userId, userData);
      await fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case "block":
        return "Block";
      case "unblock":
        return "Unblock";
      case "delete":
        return "Delete";
      default:
        return "";
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
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration ID
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
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registrationId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit User"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {user.isActive ? (
                        <button
                          onClick={() => openActionModal(user, "block")}
                          className="text-orange-600 hover:text-orange-900"
                          title="Block User"
                        >
                          <NoSymbolIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openActionModal(user, "unblock")}
                          className="text-green-600 hover:text-green-900"
                          title="Unblock User"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openActionModal(user, "delete")}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
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

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={`${getActionText()} User`}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to {actionType} "{selectedUser?.name}"?
            {actionType === "delete" && " This action cannot be undone."}
          </p>
        </div>
        <div className="mt-4 flex space-x-3">
          <Button
            variant={actionType === "delete" ? "danger" : "primary"}
            onClick={handleUserAction}
            loading={actionLoading}
          >
            {getActionText()}
          </Button>
          <Button variant="secondary" onClick={() => setActionModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          onSubmit={handleUpdateUser}
          schools={schools}
        />
      )}
    </div>
  );
};
