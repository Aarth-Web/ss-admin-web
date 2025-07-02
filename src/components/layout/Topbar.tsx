import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { ResetPasswordModal } from "../users/ResetPasswordModal";
import { authService } from "../../services/authService";

export const Topbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleResetPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await authService.resetPassword(currentPassword, newPassword);
      setShowResetPasswordModal(false);
      setPasswordResetSuccess(true);

      // Show success message and auto logout after 5 seconds
      setTimeout(() => {
        setPasswordResetSuccess(false);
        logout();
        navigate("/login");
      }, 5000);
    } catch (err) {
      console.error("Error resetting password:", err);
      throw err;
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
            </div>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setShowResetPasswordModal(true)}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  Reset Password
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          isOpen={showResetPasswordModal}
          onClose={() => setShowResetPasswordModal(false)}
          onSubmit={handleResetPassword}
        />
      )}

      {/* Password Reset Success Notification */}
      {passwordResetSuccess && (
        <div
          className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md rounded"
          style={{ zIndex: 50 }}
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-green-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Password reset successful!</p>
              <p className="text-sm">
                You will be logged out in a few seconds. Please log in with your
                new password.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
