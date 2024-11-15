import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import {
  useAdminOrder,
  useMyOrder,
  useChangeStatus,
  useDeleteMultipleOrder,
  useDeleteOrder,
} from "../../hooks/useOrder";
import SearchBar from "../../components/shared/SearchBar";
import StatusFilter from "../../components/shared/StatusFilter";
import RowsPerPageSelector from "../../components/shared/RowsPage";
import OrdersTable from "../../components/orders/OrderTable";
import Pagination from "../../components/shared/Pagination";
import { NavLink } from "react-router-dom";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import DateFilter from "../../components/shared/DateFilter";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "../../utils";
import { useAuth } from "../../hooks/useAuth";
import { HiPlus, HiTrash } from "react-icons/hi";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";

const Orders = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendedVal, setSendedVal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const queryClient = useQueryClient();

  const { isLoading, data, error } = isAdmin
    ? useAdminOrder(currentPage, rowsPerPage, status, dateRange, sendedVal)
    : useMyOrder(currentPage, rowsPerPage, status, dateRange, sendedVal);

  const { isDeleting, deleteOrder } = useDeleteOrder();
  const { deleteMultipleOrder } = useDeleteMultipleOrder();
  const { changeStat, isChangingStatus } = useChangeStatus();

  const socket = io(BACKEND_URL);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsOrder");
    return savedColumns
      ? JSON.parse(savedColumns)
      : {
          id: true,
          client: true,
          product_name: true,
          wilaya: true,
          commune: true,
          confirmatrice: true,
          price: false,
          status: true,
          quantity: true,
          total: true,
          phone: true,
          actions: true,
          confirmedAt: false,
          cancelledAt: false,
          deletedAt: false
        };
  });

  const toggleColumnVisibility = useCallback((column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  }, []);

  useEffect(() => {
    socket.on("newOrder", () => {
      queryClient.invalidateQueries("orders");
    });

    return () => socket.off("newOrder");
  }, [queryClient, socket]);

  useEffect(() => {
    localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleDeleteSelected = () => {
    deleteMultipleOrder({ orderIds: selectedOrders });
  };
 console.log("sendedVal", sendedVal);
  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
  };

  const handleChangeStatus = (status, orderId) => {
    changeStat({ status, orderId });
  };

  const handleOrderSelection = useCallback((orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  }, []);

  const { ordersCount, orders, filteredOrdersCount } = data || {};

  const handleSelectAll = useCallback(() => {
    setSelectedOrders(
      selectedOrders.length === orders.length ? [] : orders.map((order) => order._id)
    );
  }, [selectedOrders.length, orders]);


  // Debounced function to update the search term after 3 seconds of inactivity
  const debounceSearch = useCallback(
    debounce((value) => {
      setSendedVal(value);
    }, 1000),
    []
  );
  // Trigger the search with debounced value
  const handleSearch = (value) => {
    setSearchTerm(value);
    debounceSearch(value); // Use debounce to delay the search term update
  };


  if (isLoading) return <p>{t("ordersPage.loadingOrders")}</p>;
  if (error) return <p>{t("ordersPage.error")}</p>;

  const totalOrders = filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("ordersPage.title")}</h1>
      <div className=" items-center justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex justify-center">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch} // Using the new debounced search handler
          />
        </div>

        <div className="flex justify-center">
          <StatusFilter
            status={status}
            handleStatusChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <DateFilter dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />
        </div>

        <div className="flex justify-center">
          <RowsPerPageSelector
            rowsPerPage={rowsPerPage}
            handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            ordersCount={ordersCount}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-x-4">
        { isAdmin &&(
        <button
          onClick={handleDeleteSelected}
          className={`bg-red-600 text-white py-3 px-6 rounded-md ${selectedOrders.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
          disabled={selectedOrders.length === 0}
        >
          <HiTrash />
        </button>
        )}
          <NavLink    className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600" to="/orders/create"><HiPlus /></NavLink>
      </div>


      <OrdersTable
        orders={orders} // Using filtered orders for the table
        selectedOrders={selectedOrders}
        handleOrderSelection={handleOrderSelection}
        handleSelectAll={handleSelectAll}
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
        onDeleteOrder={handleDeleteOrder}
        onChangeStatus={handleChangeStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
        totalOrders={totalOrders}
        ordersCount={ordersCount}
      />

<ColumnVisibilityToggle
  visibleColumns={visibleColumns}
  toggleColumnVisibility={toggleColumnVisibility}
/>
      {isModalOpen && (
        <ConfirmationModal
          disable={isDeleting}
          message={t("ordersPage.deleteConfirmation")}
          onConfirm={() => {
            deleteOrder(orderToDelete);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Orders;
