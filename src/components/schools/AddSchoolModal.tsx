import React from "react";
import { Modal } from "../ui/Modal";
import { SchoolForm } from "./SchoolForm";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleSuccess = () => {
    onClose();
    onSuccess();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New School">
      <SchoolForm onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  );
};
