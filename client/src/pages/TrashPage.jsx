import { useCallback, useEffect, useState } from "react";
import {useClearTrash, UseRecoverFromTrash,useTrashOrder } from "../hooks/useOrder";

import { useTranslation } from "react-i18next"; // Importing the translation hook
import SearchBar from "../components/shared/SearchBar";
import RowsPerPageSelector from "../components/shared/RowsPage";
import DateFilter from "../components/shared/DateFilter";
import StatusFilter from "../components/shared/StatusFilter";
import Pagination from "../components/shared/Pagination";
import { useAuth } from "../hooks/useAuth";
import ColumnVisibilityToggle from "../components/shared/ColumnVisibilty";
import OrdersTable from "../components/orders/OrderTable";
import { MdRecycling } from "react-icons/md";
import { debounce } from "lodash";
import { HiTrash } from "react-icons/hi";

const TrashOrders = () => {

  const { t } = useTranslation(); // Initialize the translation hook
   const { isAdmin } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendedVal, setSendedVal] = useState("");
  const { isRecovering, recoverMultipleOrder } = UseRecoverFromTrash();
  const { isDeleting, clearTrashAdmin } = useClearTrash();

  const [selectedOrders, setSelectedOrders] = useState([]);

  const { isLoading, data, error } =  useTrashOrder(currentPage, rowsPerPage, status, dateRange, sendedVal);
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
    };
  });

;

// Save column visibility to localStorage whenever it changes
useEffect(() => {
  localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
}, [visibleColumns]);

const handleRecoverSelected = () => {
  recoverMultipleOrder({ orderIds: selectedOrders });
  console.log(selectedOrders);
};
const handleClearTrash = () => {
  clearTrashAdmin({ orderIds: selectedOrders });
  console.log(selectedOrders);
};

// Handle "select all" functionality

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

const handleDateRangeChange = useCallback((dates) => {
  setDateRange(dates);
}, []);
const { ordersCount, orders, filteredOrdersCount } = data || {};
const handleSelectAll = useCallback(() => {
  setSelectedOrders(
    selectedOrders.length === orders.length ? [] : orders.map((order) => order._id)
  );
}, [selectedOrders.length, orders]);

if (isLoading) return <p>{t('ordersPage.loadingOrders')}</p>;
  if (error) return <p>{t('ordersPage.error')}</p>;


  const totalOrders = filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">{t('ordersPage.title')}</h1>
      <div className="justify-center items-center grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-2">
  {/* Search Bar */}
  <div className="flex justify-center">
        <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch} // Using the new debounced search handler
          />
    </div>

  {/* Status Filter */}
  <div className="flex justify-center">
    <StatusFilter status={status} handleStatusChange={(e) => setStatus(e.target.value)} />
  </div>

  {/* Date Filter */}
  <div className="flex justify-center">
    <DateFilter dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />
  </div>

  {/* Rows Per Page Selector */}
  <div className="flex justify-center">
    <RowsPerPageSelector 
      rowsPerPage={rowsPerPage} 
      handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} 
      ordersCount={ordersCount} 
    />
  </div>

  {/* Recover Selected Button (Admin Only) */}

</div>

{isAdmin && (
    
    <div className="flex justify-start items-center gap-x-4">
      <button 
        onClick={handleRecoverSelected}
      
        className={`flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md 
          ${selectedOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
        disabled={selectedOrders.length === 0 || isRecovering}
      >
        <MdRecycling className="mr-1" size={25} />
      </button>
      <button disabled={isDeleting || selectedOrders.length === 0} onClick={handleClearTrash}
              className={`flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md 
                ${selectedOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
    
      ><HiTrash className="mr-1" size={25}/> </button>
    </div>
  )}
      <OrdersTable 
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
          toggleColumnVisibility={(column) => setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))} 
          />
    </div>
  );
};

export default TrashOrders;
