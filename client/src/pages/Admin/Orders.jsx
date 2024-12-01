import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import {
  useAdminOrder,
  useMyOrder,
  useChangeStatus,
  useDeleteMultipleOrder,
  useDeleteOrder,
  useAddOrderstoDelivry
} from "../../hooks/useOrder";
import SearchBar from "../../components/shared/SearchBar";
import StatusFilter from "../../components/shared/StatusFilter";
import RowsPerPageSelector from "../../components/shared/RowsPage";
import OrdersTable from "../../components/orders/OrderTable";
import Pagination from "../../components/shared/Pagination";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import DateFilter from "../../components/shared/DateFilter";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_URL } from "../../utils";
import { useAuth } from "../../hooks/useAuth";
import { HiPlus, HiRefresh, HiTrash } from "react-icons/hi";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import { useSearchParams } from "react-router-dom";

const Orders = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
    const filter_status = searchParams.get("filter_status"); // Get the filter_status query parameter
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
    ? useAdminOrder(currentPage, rowsPerPage, status, dateRange, sendedVal,filter_status)
    : useMyOrder(currentPage, rowsPerPage, status, dateRange, sendedVal,filter_status);

  const { isDeleting, deleteOrder } = useDeleteOrder();
  const { deleteMultipleOrder } = useDeleteMultipleOrder();

  const { changeStat, isChangingStatus } = useChangeStatus();

  const socket = io(SOCKET_URL);

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
          deletedAt: false,
          livraison: false,
          shippedAt: false
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
  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
  };
  const resetFilters = () => {
    searchParams.delete("filter_status"); // Remove the filter_status query param
    setSearchParams(searchParams); // Update the search params
    navigate("/orders"); // Navigate to the orders page without query params
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
      <div className="bg-white dark:bg-gray-800 my-2 p-2 rounded-md">

      <div className=" items-center justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
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
          <HiTrash  size={25}/>
        </button>
        )}
        { /*
        <button
          className={`bg-green-600 text-white py-3 px-6 rounded-md ${selectedOrders.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
          disabled={selectedOrders.length === 0}
        >
          <HiTruck size={25} />
        </button>
         */
        }
          <NavLink  className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600" to="/orders/create"><HiPlus size={25} /></NavLink>
     
          <button
            onClick={resetFilters}
            className="py-3 px-6 rounded-md bg-blue-600 cursor-pointer text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <HiRefresh size={25} />
          </button>
      </div>
      </div>


      <OrdersTable
        orders={orders} // Using filtered orders for the table
        selectedOrders={selectedOrders}
        handleOrderSelection={handleOrderSelection}
        handleSelectAll={handleSelectAll}
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
        onDeleteOrder={handleDeleteOrder}
        isChangingStatus={isChangingStatus}
        onChangeStatus={handleChangeStatus}
      //  onDelivryOrder={onDelivryOrder}
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
