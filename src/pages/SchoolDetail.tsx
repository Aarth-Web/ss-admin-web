import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { schoolService } from "../services/schoolService";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import {
  School,
  User,
  UserRole,
  UpdateUserData,
  OnboardUserData,
} from "../types";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { AddUserModal, EditUserModal } from "../components/users";
import {
  SchoolHeader,
  SchoolInformation,
  UserTabs,
  TabType,
  UserList,
  DeleteConfirmationModal,
} from "../components/schools/schoolDetail";

export const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SchoolAdmin);

  // Users state
  const [schoolAdmins, setSchoolAdmins] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Add User Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addingUserRole, setAddingUserRole] = useState<UserRole>(
    UserRole.SchoolAdmin
  );

  // Edit User Modal state
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Delete User Modal state
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // No password reset functionality - moved to Topbar for user's own password

  // Permissions
  const isSuperAdmin = currentUser?.role === UserRole.SuperAdmin;
  const isSchoolAdmin =
    currentUser?.role === UserRole.SchoolAdmin && currentUser?.school === id;
  const isTeacher =
    currentUser?.role === UserRole.Teacher && currentUser?.school === id;

  // Check user permissions for a specific action
  const canEditSchool = isSuperAdmin || isSchoolAdmin;
  const canDeleteSchool = isSuperAdmin;
  const canEditUser = (user: User) => {
    if (isSuperAdmin) return true;
    if (isSchoolAdmin)
      return user.role !== UserRole.SuperAdmin && user.school === id;
    if (isTeacher) return user.role === UserRole.Student && user.school === id;
    return false;
  };

  const canDeleteUser = (user: User) => {
    if (isSuperAdmin) return true;
    if (isSchoolAdmin)
      return user.role === UserRole.Teacher || user.role === UserRole.Student;
    return false;
  };

  const canAddUser = (role: UserRole) => {
    if (role === UserRole.SchoolAdmin) return isSuperAdmin || isSchoolAdmin;
    if (role === UserRole.Teacher) return isSuperAdmin || isSchoolAdmin;
    if (role === UserRole.Student)
      return isSuperAdmin || isSchoolAdmin || isTeacher;
    return false;
  };

  // Fetch school details
  useEffect(() => {
    if (!id) return;

    const fetchSchoolDetails = async () => {
      try {
        setLoading(true);
        const response = await schoolService.getSchoolById(id);
        setSchool(response.school);
        setError(null);
      } catch (err) {
        console.error("Error fetching school details:", err);
        setError("Failed to load school details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [id]);

  const updateSchoolUsers = async () => {
    try {
      if (!id) return;
      const response = await userService.getSchoolUsers(id);
      setSchoolAdmins(
        response.users.filter(
          (user: User) => user.role === UserRole.SchoolAdmin
        ) || []
      );
      setTeachers(
        response.users.filter((user: User) => user.role === UserRole.Teacher) ||
          []
      );
      setStudents(
        response.users.filter((user: User) => user.role === UserRole.Student) ||
          []
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    }
  };

  // Fetch users
  useEffect(() => {
    if (!id) return;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        await updateSchoolUsers();
      } catch (err) {
        console.error(`Error fetching users:`, err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [id, activeTab]);

  const handleUpdateSchool = async (formData: {
    name: string;
    address: string;
    isActive: boolean;
  }) => {
    if (!id) return;

    try {
      setUpdateLoading(true);
      const updatedData = await schoolService.updateSchool(id, formData);
      setSchool(updatedData.school || updatedData);
    } catch (err) {
      console.error("Error updating school:", err);
      setError("Failed to update school details. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteSchool = async () => {
    if (!id) return;

    try {
      setDeleteLoading(true);
      await schoolService.deleteSchool(id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error deleting school:", err);
      setError("Failed to delete school. Please try again.");
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleUserStatusToggle = async (
    userId: string,
    currentStatus: string
  ) => {
    try {
      if (currentStatus === "active") {
        await userService.blockUser(userId);
      } else {
        await userService.unblockUser(userId);
      }

      updateSchoolUsers();
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Failed to update user status. Please try again.");
    }
  };

  const handleShowDeleteUserConfirm = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteUserConfirm(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete);
      setShowDeleteUserConfirm(false);
      setUserToDelete(null);
      updateSchoolUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleShowAddUserModal = (
    role: UserRole.SchoolAdmin | UserRole.Teacher | UserRole.Student
  ) => {
    setAddingUserRole(role);
    setShowAddUserModal(true);
  };

  const handleAddUser = async (userData: OnboardUserData) => {
    try {
      // Don't need to format mobile here as we're now handling it in authService.onboardUser
      await authService.onboardUser(userData);
      setShowAddUserModal(false);
      updateSchoolUsers();
    } catch (err) {
      console.error("Error adding user:", err);
      throw err;
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      // No need to format mobile here as we're handling it in the service
      await userService.updateUser(userId, userData);
      setShowEditUserModal(false);
      updateSchoolUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  // Password reset functionality moved to Topbar for user's own password

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-1">
            <p className="text-sm text-red-700">
              {error || "School not found"}
            </p>
          </div>
          <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Get the current users based on active tab
  const getCurrentUsers = (): User[] => {
    switch (activeTab) {
      case TabType.SchoolAdmin:
        return schoolAdmins;
      case TabType.Teachers:
        return teachers;
      case TabType.Students:
        return students;
      default:
        return [];
    }
  };

  // Get the current role based on active tab
  const getCurrentRole = ():
    | UserRole.SchoolAdmin
    | UserRole.Teacher
    | UserRole.Student => {
    switch (activeTab) {
      case TabType.SchoolAdmin:
        return UserRole.SchoolAdmin;
      case TabType.Teachers:
        return UserRole.Teacher;
      case TabType.Students:
        return UserRole.Student;
      default:
        return UserRole.Student;
    }
  };

  return (
    <div>
      {/* Header with back button */}
      <SchoolHeader
        schoolName={school.name}
        enableBackButton={currentUser?.role === UserRole.SuperAdmin}
      />

      {/* School Info/Edit Card */}
      <SchoolInformation
        school={school}
        canEditSchool={canEditSchool}
        canDeleteSchool={canDeleteSchool}
        onEdit={handleUpdateSchool}
        onDelete={() => setShowDeleteConfirm(true)}
        updateLoading={updateLoading}
      />

      {/* User Tabs */}
      <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <UserList
            users={getCurrentUsers()}
            role={getCurrentRole()}
            usersLoading={usersLoading}
            canAddUser={canAddUser(getCurrentRole())}
            onAddUser={() => handleShowAddUserModal(getCurrentRole())}
            canEditUser={canEditUser}
            canDeleteUser={canDeleteUser}
            onStatusToggle={handleUserStatusToggle}
            onDeleteUser={handleShowDeleteUserConfirm}
            onEditUser={handleEditUser}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onDelete={handleDeleteSchool}
        loading={deleteLoading}
      />

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onSubmit={handleAddUser}
          role={addingUserRole}
          schoolId={id as string}
        />
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <EditUserModal
          isOpen={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          user={selectedUser}
          schools={school ? [school] : []}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* Delete User Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteUserConfirm}
        onClose={() => setShowDeleteUserConfirm(false)}
        onDelete={handleDeleteUser}
        loading={false}
        title="Delete User"
        message="This action cannot be undone. This will permanently delete the user account."
      />

      {/* Password reset functionality moved to Topbar for users to reset their own passwords */}
    </div>
  );
};
