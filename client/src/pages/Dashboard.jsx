import { useEffect, useState } from "react";
import { useAssignOrders,useOrdersPending } from "../hooks/useOrder"; // New hooks for confirming and canceling orders
import RowsPerPageSelector from "../components/shared/RowsPage";
import SearchBar from "../components/shared/SearchBar";

import OrdersTable from "../components/orders/OrderTable";
import Pagination from "../components/shared/Pagination";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import ColumnVisibilityToggle from "../components/shared/ColumnVisibilty";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../utils";

const Dashboard = () => {
  const socket = io(BACKEND_URL); 
  const queryClient = useQueryClient(); // Initialize React Query client for manual query invalidation
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, data, error } = useOrdersPending(currentPage, rowsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAssigning, assignOrder } = useAssignOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // Track action type for modal
  const { t } = useTranslation();
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("dashboardColumns");
    return savedColumns ? JSON.parse(savedColumns) : {
    id: true,
    client: true,
    product_sku: true,
    wilaya: true,
    commune: true,
    price: true,
    status: true,
    total: true,
    }
  });
  useEffect(() => {
    localStorage.setItem("dashboardColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);
  useEffect(() => {
    socket.on("orderUpdate", () => {

      queryClient.invalidateQueries("orders");
    })
    socket.on("newOrder", () => {
      // Invalidate the orders query to refetch the data
      queryClient.invalidateQueries("orders");
    });

    // Cleanup on component unmount
    return () => socket.off("newOrder");
  }, [queryClient, socket]);
  
  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { ordersCount, orders, filteredOrdersCount } = data;

  const filteredOrders = orders.filter(order => {
    return (
      order.nbr_order.toString().includes(searchTerm) ||
      order.invoice_information.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalOrders = searchTerm !== "" ? filteredOrders.length : filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  const handleAssignOrders = () => {
    setModalAction("assign");
    setIsModalOpen(true);
  };


  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const handleModalConfirm = () => {
    if (modalAction === "assign") {
      assignOrder();
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("orders")}</h1>
      <div className="flex flex-col lg:flex-row space-y-4 mt-4 justify-center items-center lg:justify-around">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center space-x-2">
          <RowsPerPageSelector
            rowsPerPage={rowsPerPage}
            handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            ordersCount={ordersCount}
          />
        </div>

        <button onClick={handleAssignOrders} className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
           {t("assignOrders")}
        </button>
      </div>
      <ColumnVisibilityToggle visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
      <OrdersTable
        orders={filteredOrders}
        visibleColumns={visibleColumns}
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
          disable={isAssigning }
          message={`Are you sure you want to ${modalAction} orders?`}
          onConfirm={handleModalConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
