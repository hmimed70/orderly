import { useEffect, useState } from "react";
import RowsPerPageSelector from "../components/shared/RowsPage";
import StatusFilter from "../components/shared/StatusFilter";
import SearchBar from "../components/shared/SearchBar";
import ColumnVisibilityToggle from "../components/shared/ColumnVisibilty";
import OrdersTable from "../components/orders/OrderTable";
import Pagination from "../components/shared/Pagination";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import {  useMyOrder } from "../hooks/useOrder"; // New hooks for confirming and canceling orders
import DateFilter from "../components/shared/DateFilter";
import { useTranslation } from "react-i18next";

const OrdersPage = () => {
  const {t} = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ date, setDate ] = useState(""); // New hook for canceling
  const [status, setStatus] = useState("inProgress"); // New state for status filter
  const { isLoading, data, error } = useMyOrder(currentPage, rowsPerPage,status, date);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsOrder");
    return savedColumns ? JSON.parse(savedColumns) : {
      id: true,
      client: true,
      product_sku: true,
      wilaya: true,
      commune: true,
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
    localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  if (isLoading) return <p>{t("loading")}</p>;
  if (error) return <p>{ t(`error ${error.message}`)} </p>;

  const { ordersCount, orders, filteredOrdersCount } = data;

  const filteredOrders = orders.filter(order => {
    return (
      order.nbr_order.toString().includes(searchTerm) ||
      order.invoice_information.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const totalOrders = searchTerm!==""  ? filteredOrders.length : filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <div>
    <h1 className="text-2xl font-bold">{t('orders')}</h1>
    <div className="flex flex-col space-y-4 mt-1 justify-center items-center lg:justify-around">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex flex-col md:flex-row  items-center justify-between gap-4 lg:gap-10">
          <StatusFilter status={status} handleStatusChange={(e) => setStatus(e.target.value)} />
          <DateFilter day={date} handleDayChange={(e) => setDate(e.target.value)} />
          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} ordersCount={ordersCount} />
        </div>
        </div>
    <ColumnVisibilityToggle visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
    <OrdersTable

        orders={filteredOrders}
        visibleColumns={visibleColumns}
      />    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} totalOrders={totalOrders} ordersCount={ordersCount} />

  </div>
  );
};

export default OrdersPage;




