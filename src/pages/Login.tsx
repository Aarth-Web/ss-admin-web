import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";
import { LoginCredentials } from "../types";

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginCredentials>();

  // Clear server error when user changes input
  React.useEffect(() => {
    const subscription = watch(() => {
      if (error) setError("");
    });
    return () => subscription.unsubscribe();
  }, [watch, error]);

  // Custom redirect based on user role
  const getRedirectPath = (user: any) => {
    if (user?.role === "schooladmin" && user?.school) {
      return `/schools/${user.school}`;
    }
    return (location.state as any)?.from?.pathname || "/dashboard";
  };

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(data);

      if (!response || !response.access_token || !response.user) {
        throw new Error("Invalid response from server");
      }

      const { access_token, user, permissions } = response;

      // First store token in localStorage
      localStorage.setItem("access_token", access_token);

      // Then update the state
      login(access_token, user, permissions);

      // Allow state to update before redirecting
      setTimeout(() => {
        // Redirect based on user role
        const redirectPath = getRedirectPath(user);
        navigate(redirectPath, { replace: true });
      }, 100);
    } catch (err: any) {
      console.error("Login error:", err);

      // More detailed error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            School Management Dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-8 rounded-lg shadow-md">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Registration ID"
              type="text"
              {...register("registrationId", {
                required: "Registration ID is required",
              })}
              error={errors.registrationId?.message}
              placeholder="Enter your registration ID"
            />

            <Input
              label="Password"
              type="password"
              {...register("password", { required: "Password is required" })}
              error={errors.password?.message}
              placeholder="Enter your password"
            />

            <Button type="submit" loading={isLoading} className="w-full">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
