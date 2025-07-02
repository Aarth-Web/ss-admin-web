import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
  title?: string;
  message?: string;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onDelete,
  loading,
  title = "Delete School",
  message = "This action cannot be undone. This will permanently delete the school and all associated data.",
}) => {
  return (
    <Modal title={title} onClose={onClose} isOpen={isOpen}>
      <div className="py-1">
        <div className="flex items-start justify-start mb-2">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600 mr-2" />
          <h3 className="text-md font-medium text-gray-900">
            Are you sure you want to delete this {title.toLowerCase()}?
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-2 px-2">{message}</p>
        <div className="mt-5 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
