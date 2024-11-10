import { useEffect, useState } from "react";
import { useAdminOrder, useDeleteOrder } from '../../hooks/useOrder';
import SearchBar from "../../components/shared/SearchBar";
import StatusFilter from "../../components/shared/StatusFilter";
import RowsPerPageSelector from "../../components/shared/RowsPage";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import OrdersTable from "../../components/orders/OrderTable";
import Pagination from "../../components/shared/Pagination";
import { NavLink } from "react-router-dom";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import DateFilter from "../../components/shared/DateFilter";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next"; // Importing the translation hook
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "../../utils";

const OrdersPage = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const { isLoading, data, error } = useAdminOrder(currentPage, rowsPerPage, status, date);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const { isDeleting, deleteOrder } = useDeleteOrder();
  const socket = io(BACKEND_URL); // Replace with your server URL
  const queryClient = useQueryClient(); // Initialize React Query client for manual query invalidation

  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Retrieve saved column visibility from localStorage, or use default values if not available
    const savedColumns = localStorage.getItem("visibleColumnsOrder");
    return savedColumns ? JSON.parse(savedColumns) : {
      id: true,
      client: true,
      product_sku: true,
      wilaya: true,
      commune: true,
      address: false,
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
  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
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
        <div className="flex flex-col md:flex-row  items-center justify-between gap-4 lg:gap-10">
          <StatusFilter status={status} handleStatusChange={(e) => setStatus(e.target.value)} />
          <DateFilter day={date} handleDayChange={(e) => setDate(e.target.value)} />
          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} ordersCount={ordersCount} />
        <button type="submit" className="py-3 px-6 rounded-md bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
          <NavLink to="/admin/orders/create">{t('ordersPage.createOrderButton')}</NavLink>
        </button>
        </div>
      </div>

      <ColumnVisibilityToggle 
        visibleColumns={visibleColumns} 
        toggleColumnVisibility={(column) => setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))} 
      />
      <OrdersTable 
        orders={filteredOrders} 
        visibleColumns={visibleColumns} 
        onDeleteOrder={handleDeleteOrder} 
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

export default OrdersPage;
