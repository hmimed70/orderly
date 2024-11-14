import { useEffect, useState } from "react";
import {  useChangeStatus, useDeleteMultipleOrder, useDeleteOrder,UseRecoverFromTrash,useTrashOrder } from "../hooks/useOrder";

import { NavLink } from "react-router-dom";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next"; // Importing the translation hook
import { useQueryClient } from "@tanstack/react-query";
import SearchBar from "../components/shared/SearchBar";
import RowsPerPageSelector from "../components/shared/RowsPage";
import DateFilter from "../components/shared/DateFilter";
import StatusFilter from "../components/shared/StatusFilter";
import Pagination from "../components/shared/Pagination";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { useAuth } from "../hooks/useAuth";
import { BACKEND_URL } from "../utils";
import ColumnVisibilityToggle from "../components/shared/ColumnVisibilty";
import OrdersTable from "../components/orders/OrderTable";

const TrashOrders = () => {

  const { t } = useTranslation(); // Initialize the translation hook
   const { isAdmin } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const { isLoading, data, error } =  useTrashOrder(currentPage, rowsPerPage, status, dateRange);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const { isDeleting, deleteOrder } = useDeleteOrder();
  const { isRecovering, recoverMultipleOrder } = UseRecoverFromTrash();
  const socket = io(BACKEND_URL); // Replace with your server URL
  const queryClient = useQueryClient(); // Initialize React Query client for manual query invalidation
  const { changeStat, isChangingStatus } = useChangeStatus();
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsOrder");
    return savedColumns ? JSON.parse(savedColumns) : {
      id: true,
      client: true,
      product_sku: true,
      wilaya: true,
      commune: true,
      confirmatrice: true,
      price: false,
      status: true,
      total: true,
      attempt: true,
      phone: true,
      actions: true,
      confirmedAt: false,
      cancelledAt: false,
    };
  });

  useEffect(() => {
    socket.on("newOrder", () => {
      // Invalidate the orders query to refetch the data
      queryClient.invalidateQueries("orders");
    });

    // Cleanup on component unmount
    return () => socket.off("newOrder");
  }, [queryClient, socket]);

  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter(id => id !== orderId); // Deselect the order
      }
      return [...prevSelectedOrders, orderId]; // Select the order
    });
  };

  // Handle "select all" functionality
  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]); // Deselect all
    } else {
      setSelectedOrders(orders.map(order => order._id)); // Select all orders
    }
  };

  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleRecoverSelected = () => {
    recoverMultipleOrder({ orderIds: selectedOrders });
    console.log(selectedOrders);
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
  };
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    // Perform any additional filtering actions with the date range
  };

  const handleChangeStatus = (status, orderId) => {
    changeStat({ status, orderId });
  };

  if (isLoading) return <p>{t('ordersPage.loadingOrders')}</p>;
  if (error) return <p>{t('ordersPage.error')}</p>;

  const { ordersCount, orders, filteredOrdersCount } = data;
  const filteredOrders = orders.filter(order => (
    order.nbr_order.toString().includes(searchTerm) ||
    order.invoice_information.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.confirmatrice?.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const totalOrders = searchTerm !== "" ? filteredOrders.length : filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('ordersPage.title')}</h1>
      <div className="flex flex-col space-y-4 mt-1 justify-center items-center lg:justify-around">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {isAdmin && (
          <div className="mb-4">
            <button
              onClick={handleRecoverSelected}
              className={`bg-red-600 text-white px-4 py-2 rounded-md ${
                selectedOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
              disabled={selectedOrders.length === 0} // Disable button if no orders are selected
            >
              {t('recoverSelectedOrders')}
            </button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row  items-center justify-between gap-4 lg:gap-10">
          <StatusFilter status={status} handleStatusChange={(e) => setStatus(e.target.value)} />
          <DateFilter dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />;          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} ordersCount={ordersCount} />
          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} ordersCount={ordersCount} />
        </div>
      </div>

      <ColumnVisibilityToggle 
        visibleColumns={visibleColumns} 
        toggleColumnVisibility={(column) => setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))} 
      />
      <OrdersTable 
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        handleOrderSelection={handleOrderSelection}
        handleSelectAll={handleSelectAll}
        orders={filteredOrders} 
        visibleColumns={visibleColumns} 
        isChangingStatus={isChangingStatus}
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

      {isModalOpen && (
        <ConfirmationModal 
          disable={isDeleting}
          message={t('ordersPage.deleteConfirmation')}
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

export default TrashOrders;
