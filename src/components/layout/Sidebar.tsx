import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../../store/authStore";
import clsx from "clsx";

const superadminRoutes = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "School", href: "/schools", icon: BuildingOfficeIcon },
  { name: "Users", href: "/users", icon: UsersIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

const schoolAdminRoutes = [
  { name: "My School", href: "/schools/:id", icon: BuildingOfficeIcon },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const routes =
    user?.role === "superadmin" ? superadminRoutes : schoolAdminRoutes;

  // Generate proper URLs for school admin routes
  const getHref = (route: { href: string }) => {
    if (
      user?.role === "schooladmin" &&
      user?.school &&
      route.href.includes(":id")
    ) {
      return route.href.replace(":id", user.school);
    }
    return route.href;
  };

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Smart Shala Admin
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {user?.role === "superadmin" ? "Super Admin" : "School Admin"}
        </p>
      </div>

      <nav className="mt-6">
        {routes.map((route) => (
          <NavLink
            key={route.name}
            to={getHref(route)}
            className={({ isActive }) =>
              clsx(
                "flex items-center px-6 py-3 text-sm font-medium transition-colors",
                {
                  "bg-blue-50 text-blue-700 border-r-2 border-blue-700":
                    isActive,
                  "text-gray-700 hover:bg-gray-50 hover:text-gray-900":
                    !isActive,
                }
              )
            }
          >
            <route.icon className="mr-3 h-5 w-5" />
            {route.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
