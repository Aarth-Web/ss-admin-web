import React from "react";
import { Modal } from "../ui/Modal";
import { AddUserForm } from "./AddUserForm";
import { OnboardUserData, UserRole } from "../../types";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  schoolId: string;
  onSubmit: (userData: OnboardUserData) => Promise<void>;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  role,
  schoolId,
  onSubmit,
}) => {
  const getModalTitle = () => {
    switch (role) {
      case UserRole.SchoolAdmin:
        return "Add School Administrator";
      case UserRole.Teacher:
        return "Add Teacher";
      case UserRole.Student:
        return "Add Student";
      default:
        return "Add User";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <AddUserForm
        role={role}
        schoolId={schoolId}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};
