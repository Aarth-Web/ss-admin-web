import React from "react";
import { User } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface UserRolePermissionProps {
  user: User;
  schoolId: string;
  children: React.ReactNode;
}

export const UserRolePermission: React.FC<UserRolePermissionProps> = ({
  user,
  schoolId,
  children,
}) => {
  const { user: currentUser } = useAuthStore();

  // Permission checks
  const isSuperAdmin = currentUser?.role === "superadmin";
  const isSchoolAdmin =
    currentUser?.role === "schooladmin" && currentUser?.school === schoolId;
  const isTeacher =
    currentUser?.role === "teacher" && currentUser?.school === schoolId;

  const canView = () => {
    if (isSuperAdmin) return true;
    if (isSchoolAdmin) return user.school === schoolId;
    if (isTeacher) return user.role === "student" && user.school === schoolId;
    return false;
  };

  return <>{canView() ? children : null}</>;
};

export const EditPermission: React.FC<UserRolePermissionProps> = ({
  user,
  schoolId,
  children,
}) => {
  const { user: currentUser } = useAuthStore();

  // Permission checks
  const isSuperAdmin = currentUser?.role === "superadmin";
  const isSchoolAdmin =
    currentUser?.role === "schooladmin" && currentUser?.school === schoolId;
  const isTeacher =
    currentUser?.role === "teacher" && currentUser?.school === schoolId;

  const canEdit = () => {
    if (isSuperAdmin) return true;
    if (isSchoolAdmin)
      return user.role !== "superadmin" && user.school === schoolId;
    if (isTeacher) return user.role === "student" && user.school === schoolId;
    return false;
  };

  return <>{canEdit() ? children : null}</>;
};

export const DeletePermission: React.FC<UserRolePermissionProps> = ({
  user,
  schoolId,
  children,
}) => {
  const { user: currentUser } = useAuthStore();

  // Permission checks
  const isSuperAdmin = currentUser?.role === "superadmin";
  const isSchoolAdmin =
    currentUser?.role === "schooladmin" && currentUser?.school === schoolId;

  const canDelete = () => {
    if (isSuperAdmin) return true;
    if (isSchoolAdmin)
      return (
        (user.role === "teacher" || user.role === "student") &&
        user.school === schoolId
      );
    return false;
  };

  return <>{canDelete() ? children : null}</>;
};
