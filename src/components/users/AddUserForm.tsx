import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { OnboardUserData, UserRole, ParentLanguage } from "../../types";

interface AddUserFormProps {
  role: UserRole;
  schoolId: string;
  onSubmit: (userData: OnboardUserData) => Promise<void>;
  onCancel: () => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({
  role,
  schoolId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<OnboardUserData>({
    name: "",
    email: "",
    mobile: "",
    role: role,
    schoolId: schoolId,
    parentLanguage: undefined,
    parentOccupation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      // Form submission successful, reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        role: role,
        schoolId: schoolId,
        parentLanguage: undefined,
        parentOccupation: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    switch (role) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Input
        label="Full Name"
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
        label={`${role === "student" ? "Parent's Mobile" : "Mobile"}`}
        name="mobile"
        type="tel"
        value={formData.mobile}
        onChange={handleChange}
        required
        maxLength={10}
      />

      {/* Student-specific fields */}
      {role === UserRole.Student && (
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

      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add {getRoleTitle()}
        </Button>
      </div>
    </form>
  );
};
