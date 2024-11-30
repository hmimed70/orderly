import { NavLink } from "react-router-dom";
import {
  HiOutlineCalendarDays,
  HiOutlineChartPie,
  HiOutlineHome,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { HiOutlineShoppingCart, HiTrash } from "react-icons/hi";

export default function MainNav() {
  const { isAdmin, isUser } = useAuth(); // Get user role from custom hook
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col gap-y-2 text-sm">
      {/* Conditionally render Home link for regular users */}
      {isUser && (
      
         <li className="group flex items-center justify-start gap-2">
         <NavLink
           to="/dashboard"
           className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
         >
           <HiOutlineHome />
           <span className="text-sm md:hidden group-hover:inline">{t("home")}</span>
         </NavLink>
       </li>
      )}

      {/* Conditionally render Home link for admin */}
      {isAdmin && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/admin/dashboard"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineHome />
            <span className="text-sm md:hidden group-hover:inline">{t("home")}</span>
          </NavLink>
        </li>
      )}

      {/* Orders link for admin */}
      {isAdmin && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/orders"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineCalendarDays />
            <span className="text-sm md:hidden group-hover:inline">{t("orders")}</span>
          </NavLink>
        </li>
      )}

      {/* My Orders link for regular users only */}
      {isUser && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/orders"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineCalendarDays />
            <span className="text-sm md:hidden group-hover:inline">{t("myOrders")}</span>
          </NavLink>
        </li>
      )}

      {/* Users link for admin only */}
      {isAdmin && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/admin/users"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineUsers />
            <span className="text-sm md:hidden group-hover:inline">{t("users")}</span>
          </NavLink>
        </li>
      )}

      {/* Products link for admin only */}
      {isAdmin && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/admin/products"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineShoppingCart />
            <span className="text-sm md:hidden group-hover:inline">{t("products")}</span>
          </NavLink>
        </li>
      )}

      {/* Statistics link for admin and regular users */}
      {isAdmin && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/admin/statistics"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineChartPie />
            <span className="text-sm md:hidden group-hover:inline">{t("statistics")}</span>
          </NavLink>
        </li>
      )}

      {isUser && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/statistics"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiOutlineChartPie />
            <span className="text-sm md:hidden group-hover:inline">{t("statistics")}</span>
          </NavLink>
        </li>
      )}

      {/* Trash link for both user and admin */}
      {(isUser || isAdmin) && (
        <li className="group flex items-center justify-start gap-2">
          <NavLink
            to="/trash"
            className="navlink dark:text-gray-200 text-gray-900 flex items-center justify-center gap-2"
          >
            <HiTrash />
            <span className="text-sm md:hidden group-hover:inline">{t("Trash")}</span>
          </NavLink>
        </li>
      )}
    </ul>
  );
}
