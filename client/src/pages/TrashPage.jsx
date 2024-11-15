import { useCallback, useEffect, useState } from "react";
import { useClearTrash, UseRecoverFromTrash, useTrashOrder } from "../hooks/useOrder";
import { useTranslation } from "react-i18next"; 
import SearchBar from "../components/shared/SearchBar";
import RowsPerPageSelector from "../components/shared/RowsPage";
import DateFilter from "../components/shared/DateFilter";
import StatusFilter from "../components/shared/StatusFilter";
import Pagination from "../components/shared/Pagination";
import { useAuth } from "../hooks/useAuth";
import ColumnVisibilityToggle from "../components/shared/ColumnVisibilty";
import OrdersTable from "../components/orders/OrderTable";
import ConfirmationModal from "../components/shared/ConfirmationModal"; 
import { MdRecycling } from "react-icons/md";
import { debounce } from "lodash";
import { HiTrash } from "react-icons/hi";

const TrashOrders = () => {
  const { t } = useTranslation(); 
  const { isAdmin } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendedVal, setSendedVal] = useState("");
  const [modalContext, setModalContext] = useState(null); // Context for the modal (delete or recover)
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  const { isRecovering, recoverMultipleOrder } = UseRecoverFromTrash();
  const { isDeleting, clearTrashAdmin } = useClearTrash();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { isLoading, data, error } = useTrashOrder(currentPage, rowsPerPage, status, dateRange, sendedVal);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsOrder");
    return savedColumns ? JSON.parse(savedColumns) : {
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
    };
  });
  const handleOrderSelection = useCallback((orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  }, []);
  useEffect(() => {
    localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const debounceSearch = useCallback(
    debounce((value) => {
      setSendedVal(value);
    }, 1000),
    []
  );
 const handleSearch = (value) => {
    setSearchTerm(value);
    debounceSearch(value); 
  };

  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);


  const openRecoverModal = () => {
    setModalContext("recover");
    setIsModalOpen(true);
  };

  const openDeleteModal = () => {
    setModalContext("delete");
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (modalContext === "recover") {
      recoverMultipleOrder({ orderIds: selectedOrders });
    } else if (modalContext === "delete") {
      clearTrashAdmin({ orderIds: selectedOrders });
    }
    setIsModalOpen(false);
    setSelectedOrders([]); // Reset selections
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  
  const { ordersCount, orders, filteredOrdersCount } = data || {};
  const totalOrders = filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;
  const handleSelectAll = useCallback(() => {
    setSelectedOrders(
      selectedOrders.length === orders.length ? [] : orders.map((order) => order._id)
    );
  }, [selectedOrders.length, orders]);
  
    if (isLoading) return <p>{t("ordersPage.loadingOrders")}</p>;
    if (error) return <p>{t("ordersPage.error")}</p>;

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">{t("ordersPage.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearch} />
        <StatusFilter status={status} handleStatusChange={(e) => setStatus(e.target.value)} />
        <DateFilter dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />
        <RowsPerPageSelector 
          rowsPerPage={rowsPerPage} 
          handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} 
          ordersCount={ordersCount} 
        />
      </div>

        <div className="flex justify-start items-center gap-x-4">
          <button 
            onClick={openRecoverModal}
            className={`flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md 
              ${selectedOrders.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
              disabled={selectedOrders.length === 0 || isRecovering}
              >
            <MdRecycling className="mr-1" size={25} />
          </button>
          {isAdmin && (
          <button 
            onClick={openDeleteModal}
            className={`flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md 
              ${selectedOrders.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
            disabled={selectedOrders.length === 0 || isDeleting}
          >
            <HiTrash className="mr-1" size={25} />
          </button>
      )}
        </div>

      <OrdersTable 
       handleOrderSelection={handleOrderSelection}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        handleSelectAll={handleSelectAll}
        orders={orders} 
        visibleColumns={visibleColumns} 
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
        toggleColumnVisibility={(column) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))}
      />
      {isModalOpen && (
        <ConfirmationModal
          message={t("confirm_message")}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
          disabled={isRecovering || isDeleting}
        />
      )}
    </div>
  );
};

export default TrashOrders;
