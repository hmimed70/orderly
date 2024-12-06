
import { useTranslation } from "react-i18next";
import SearchBar from "../shared/SearchBar";
import StatusFilter from "../shared/StatusFilter";
import DateFilter from "../shared/DateFilter";
import RowsPerPageSelector from "../shared/RowsPage";
import { NavLink } from "react-router-dom";
import ColumnVisibilityToggle from "../shared/ColumnVisibilty";
import OrdersTable from "./OrderTable";
import Pagination from "../shared/Pagination";
import ConfirmationModal from "../shared/ConfirmationModal";

const OrderLayout = ({
  title,
  isLoading,
  error,
  ordersData,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  status,
  setStatus,
  date,
  setDate,
  searchTerm,
  setSearchTerm,
  visibleColumns,
  setVisibleColumns,
  selectedOrders,
  handleOrderSelection,
  handleSelectAll,
  handleDeleteSelected,
  handleDeleteOrder,
  handleChangeStatus,
  isDeleting,
  isModalOpen,
  setIsModalOpen,
  orderToDelete,
  t,
}) => {
  const { ordersCount, orders, filteredOrdersCount } = ordersData || {};
  const filteredOrders = orders?.filter(order => (
    order.nbr_order.toString().includes(searchTerm) ||
    order.invoice_information.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.confirmatrice?.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  )) || [];

  const totalOrders = searchTerm ? filteredOrders.length : filteredOrdersCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  if (isLoading) return <p>{t('ordersPage.loadingOrders')}</p>;
  if (error) return <p>{t('ordersPage.error')}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-col space-y-4 mt-1 justify-center items-center lg:justify-around">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          onClick={handleDeleteSelected}
          className={`bg-red-600 text-white px-4 py-2 rounded-md ${selectedOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
          disabled={selectedOrders.length === 0}
        >
          {t('deleteSelectedOrders')}
        </button>
        <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-10">
          <StatusFilter status={status} handleStatusChange={setStatus} />
          <DateFilter day={date} handleDayChange={setDate} />
          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={setRowsPerPage} ordersCount={ordersCount} />
          <button className="py-3 px-6 rounded-md bg-orange-600 text-white">
            <NavLink to="/admin/orders/create">{t('ordersPage.createOrderButton')}</NavLink>
          </button>
        </div>
      </div>
      <ColumnVisibilityToggle visibleColumns={visibleColumns} toggleColumnVisibility={setVisibleColumns} />
      <OrdersTable
        selectedOrders={selectedOrders}
        handleOrderSelection={handleOrderSelection}
        handleSelectAll={handleSelectAll}
        orders={filteredOrders}
        visibleColumns={visibleColumns}
        onDeleteOrder={handleDeleteOrder}
        onChangeStatus={handleChangeStatus}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage}
              text={t("orders")}
              />
      {isModalOpen && (
        <ConfirmationModal
          disable={isDeleting}
          message={t('ordersPage.deleteConfirmation')}
          onConfirm={() => { handleDeleteOrder(orderToDelete); setIsModalOpen(false); }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderLayout;
