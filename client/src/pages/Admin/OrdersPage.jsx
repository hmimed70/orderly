import { useEffect, useState } from "react";
import { useOrder } from '../../features/orders/useOrder';
import SearchBar from "../../components/SearchBar";
import StatusFilter from "../../components/StatusFilter";
import RowsPerPageSelector from "../../components/RowsPage";
import ColumnVisibilityToggle from "../../components/ColumnVisibilty";
import OrdersTable from "../../components/orders/OrderTable";
import Pagination from "../../components/Pagination";

const OrdersPage = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(""); // New state for status filter
  const { isLoading, data, error } = useOrder(currentPage, rowsPerPage,status);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
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

  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Retrieve saved column visibility from localStorage, or use default values if not available
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
  const totalOrders = searchTerm  ? filteredOrders.length : filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1); // Reset to page 1 whenever status changes
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <div>
    <h1 className="text-2xl font-bold">Orders</h1>
    <div className="flex space-x-4 mt-4">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StatusFilter status={status} handleStatusChange={handleStatusChange} />
      <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={handleRowsPerPageChange} ordersCount={ordersCount} />
    </div>
    <ColumnVisibilityToggle visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
    <OrdersTable
        orders={filteredOrders}
        visibleColumns={visibleColumns}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        handleOrderSelection={handleOrderSelection}
        handleSelectAll={handleSelectAll}
      />
    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} totalOrders={orders.length} ordersCount={ordersCount} />
  </div>
  );
};

export default OrdersPage;
