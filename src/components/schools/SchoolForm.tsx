import React, { useState } from "react";
import { SchoolCreateData } from "../../types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { schoolService } from "../../services/schoolService";

interface SchoolFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: SchoolCreateData;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  onSuccess,
  onCancel,
  initialData = { name: "", address: "" },
}) => {
  const [school, setSchool] = useState<SchoolCreateData>(initialData);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    address?: string;
    general?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchool((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      address?: string;
    } = {};

    if (!school.name.trim()) {
      errors.name = "School name is required";
    }

    if (!school.address.trim()) {
      errors.address = "School address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    try {
      await schoolService.createSchool(school);

      // Reset form and call onSuccess callback
      setSchool({ name: "", address: "" });
      setFormErrors({});
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating school:", error);
      setFormErrors({
        general: "Failed to create school. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {formErrors.general}
        </div>
      )}

      <Input
        label="School Name"
        name="name"
        type="text"
        placeholder="Enter school name"
        value={school.name}
        onChange={handleInputChange}
        error={formErrors.name}
        required
      />

      <Input
        label="School Address"
        name="address"
        type="text"
        placeholder="Enter school address"
        value={school.address}
        onChange={handleInputChange}
        error={formErrors.address}
        required
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitLoading}>
          Create School
        </Button>
      </div>
    </form>
  );
};
