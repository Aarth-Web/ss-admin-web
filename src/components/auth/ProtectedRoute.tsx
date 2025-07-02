import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, setUser, logout, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // Check if school admin is trying to access unauthorized pages
  useEffect(() => {
    if (user?.role === "schooladmin" && user?.school) {
      const currentPath = location.pathname;
      const allowedPath = `/schools/${user.school}`;

      // If school admin tries to access a page other than their school page,
      // redirect them to their school page
      if (!currentPath.startsWith(allowedPath) && !isLoading) {
        navigate(allowedPath, { replace: true });
      }
    }
  }, [user, location.pathname, navigate, isLoading]);

  useEffect(() => {
    const validateToken = async () => {
      // If we already have a user and token, don't revalidate
      if (token && user) {
        setIsLoading(false);
        return;
      }

      if (token) {
        try {
          const userData = await authService.verifyToken();
          if (userData && userData.user) {
            setUser(userData.user);
          } else {
            console.error("Invalid user data from token verification");
            logout();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      } else {
        // No token available, clear auth state to be safe
        logout();
      }
      setIsLoading(false);
    };

    validateToken();
  }, [token, setUser, logout, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
