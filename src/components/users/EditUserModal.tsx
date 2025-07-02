import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { User, UserRole, ParentLanguage, UpdateUserData } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { API_CONFIG } from "../../config";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  schools?: { _id: string; name: string }[];
  onSubmit: (userId: string, userData: UpdateUserData) => Promise<void>;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  schools = [],
  onSubmit,
}) => {
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === UserRole.SuperAdmin;

  // Check for parentLanguage and parentOccupation in both locations
  // For backward compatibility, we look in both top level and additionalInfo
  const [formData, setFormData] = useState<UpdateUserData>({
    name: user.name,
    email: user.email || "",
    mobile: user.mobile?.startsWith(`+${API_CONFIG.COUNTRY_CODE}`)
      ? user.mobile.slice(API_CONFIG.COUNTRY_CODE.length + 1) // +1 for the + symbol
      : user.mobile || "",
    isActive: user.isActive,
    role: user.role,
    school: user.school || "",
    parentLanguage: user?.additionalInfo?.parentLanguage,
    parentOccupation: user?.additionalInfo?.parentOccupation || "",
    additionalInfo: user.additionalInfo || {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(user._id, formData);
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    switch (user.role) {
      case "schooladmin":
        return "School Administrator";
      case "teacher":
        return "Teacher";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${getRoleTitle()}`}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Toggle at the top */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg mb-2">
          <div>
            <h3 className="font-medium text-gray-700">User Status</h3>
            <p className="text-sm text-gray-500">
              {formData.isActive
                ? "This user is currently active"
                : "This user is currently inactive"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email (optional)"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label={`${
            user.role === "student" ? "Parent's Mobile" : "Mobile"
          } (optional)`}
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleChange}
          maxLength={10}
        />

        {/* Student-specific fields */}
        {user.role === UserRole.Student && (
          <>
            <Select
              label="Parent's Language"
              name="parentLanguage"
              value={formData.parentLanguage || ""}
              onChange={handleChange}
              options={Object.values(ParentLanguage).map((lang) => ({
                value: lang,
                label: lang.charAt(0).toUpperCase() + lang.slice(1),
              }))}
              placeholder="Select a language"
            />

            <Input
              label="Parent's Occupation"
              name="parentOccupation"
              value={formData.parentOccupation || ""}
              onChange={handleChange}
            />
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
