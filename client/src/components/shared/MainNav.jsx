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
        <li>
          <NavLink to="/dashboard" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineHome />
            <span className>{t("home")}</span>
          </NavLink>
        </li>
      )}
      {/* Conditionally render Home link for admin */}
      {isAdmin && (
        <li>
          <NavLink to="/admin/dashboard" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineHome />
            <span>{t("home")}</span>
          </NavLink>
        </li>
      )}
            {isAdmin && (
        <li>
          <NavLink to="/orders" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineCalendarDays />
            <span>{t("orders")}</span>
          </NavLink>
        </li>
      )}
      {/* My Orders link for regular users only */}
      {isUser && (
        <li>
          <NavLink to="/orders" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineCalendarDays />
            <span>{t("myOrders")}</span>
          </NavLink>
        </li>
      )}
      {/* Orders link for both admin and regular users */}
      {/* Users link for admin only */}
      {isAdmin && (
        <li>
          <NavLink to="/admin/users" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineUsers />
            <span>{t("users")}</span>
          </NavLink>
        </li>
      )}
        {isAdmin && (
        <li>
          <NavLink to="/admin/products" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineShoppingCart />
            <span>{t("products")}</span>
          </NavLink>
        </li>
      )}
      {/* Statistics link for admin and regular users */}
      {isAdmin && (
        <li>
          <NavLink to="/admin/statistics" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineChartPie />
            <span>{t("statistics")}</span>
          </NavLink>
        </li>
      )}
      {isUser && (
        <li>
          <NavLink to="/statistics" className="navlink dark:text-gray-200 text-gray-900">
            <HiOutlineChartPie />
            <span>{t("statistics")}</span>
          </NavLink>
        </li>
      )}
            {(isUser || isAdmin) && (
          <li>
          <NavLink to="/trash" className="navlink dark:text-gray-200 text-gray-900">
            <HiTrash />
            <span>{t("Trash")}</span>
          </NavLink>
        </li>
              )}
    </ul>
  );
}
