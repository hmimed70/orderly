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

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    client: true,
    product_sku: true,
    wilaya: true,
    commune: true,
    address: true,
    confirmatrice: true,
    price: true,
    status: true,
    total: true,
    actions: true,
  });
  
  // Adjust columns for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Set only the required columns for mobile view
        setVisibleColumns({
          id: true,
          client: true,
          product_sku: true,
          wilaya: false,
          commune: false,
          address: false,
          confirmatrice: false,
          price: false,
          status: true,
          total: true,
          actions: true,
        });
      } else {
        // Default view for larger screens
        setVisibleColumns({
          id: true,
          client: true,
          product_sku: true,
          wilaya: true,
          commune: true,
          address: true,
          confirmatrice: true,
          price: true,
          status: true,
          total: true,
          actions: true,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
    <OrdersTable orders={orders} visibleColumns={visibleColumns} />
    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} totalOrders={orders.length} ordersCount={ordersCount} />
  </div>
  );
};

export default OrdersPage;
