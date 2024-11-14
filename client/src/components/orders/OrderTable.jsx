import {  HiRefresh } from 'react-icons/hi';
import { HiEye, HiTrash } from 'react-icons/hi2';
import { NavLink, useLocation } from 'react-router-dom';
import MyModal from '../shared/MyModal';
import { formattedDate, getWilayaName } from '../../utils';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import EditOrder from '../../pages/EditOrder';
 const statuses = ['pending', 'inProgress', 'confirmed', 'cancelled', 'didntAnswer1', 'didntAnswer2', 'didntAnswer3', 'didntAnswer4','phoneOff', 'duplicate', 'wrongNumber', 'wrongOrder']
 const statusStyles = {
  pending: "text-yellow-600  px-3 py-2 text-md",
  inProgress: "text-blue-600  px-4 py-2 text-md",
  confirmed: "text-green-600 px-3 py-1 text-md",
  cancelled: "text-red-600  px-2 py-1 text-md",
  didntAnswer1: "text-purple-600  px-3 py-1 text-md",
  didntAnswer2: "text-purple-700  px-4 py-2 text-md",
  didntAnswer3: "text-purple-800  px-3 py-2 text-md",
  didntAnswer4: "text-purple-900  px-2 py-2 text-md",
  phoneOff: "text-gray-500 px-3 py-1 text-md",
  duplicate: "text-gray-600  px-2 py-2 text-md",
  wrongNumber: "text-red-700  px-4 py-1 text-md",
  wrongOrder: "text-red-800  px-3 py-2 text-md",
};

const statusStyles2 = {
  pending: "bg-yellow-600",
  inProgress: "bg-blue-600 ",
  confirmed: "bg-green-600 ",
  cancelled: "bg-red-600  ",
  didntAnswer1: "bg-purple-600 ",
  didntAnswer2: "bg-purple-700  ",
  didntAnswer3: "bg-purple-800 ",
  didntAnswer4: "bg-purple-900 ",
  phoneOff: "bg-gray-500 ",
  duplicate: "bg-gray-600  ",
  wrongNumber: "bg-red-700 ",
  wrongOrder: "bg-red-800",
};
 const OrdersTable = ({ orders, visibleColumns, onDeleteOrder, selectedOrders, handleOrderSelection, handleSelectAll, onChangeStatus, isChangingStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleEditClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };
  const { t } = useTranslation(); // useTranslation hook
  const { isLoading, isAdmin, isUser } = useAuth();

  if (isLoading) return <p>{t('loading')}</p>;

  return (
    <div className="max-h-[30rem] overflow-y-scroll custom-scrollbar mt-2">

      <table className="mt-5 w-full text-sm text-left text-gray-900 dark:text-gray-400">
        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-200">
          <tr>
            {isAdmin && (
            <th className="px-4 py-3">
            <input
                type="checkbox"
                checked={selectedOrders?.length === orders.length}
                onChange={handleSelectAll}
              />
            </th>
            )}
            {visibleColumns.id && <th className="px-4 py-3">{t('orderNumber')}</th>}
            {visibleColumns.client && <th className="px-4 py-3">{t('client')}</th>}
            {visibleColumns.product_sku && <th className="px-4 py-3">{t('productSKU')}</th>}
            {visibleColumns.phone && <th className="px-4 py-3">{t('phone')}</th>}
            {visibleColumns.attempt && <th className="px-4 py-3">{t('attempt')}</th>}
            {visibleColumns.cancelledAt && <th className="px-4 py-3">{t('cancelledAt')}</th>}
            {visibleColumns.confirmedAt && <th className="px-4 py-3">{t('confirmedAt')}</th>}
            {visibleColumns.wilaya && <th className="px-4 py-3">{t('wilaya')}</th>}
            {visibleColumns.commune && <th className="px-4 py-3">{t('commune')}</th>}
            {isAdmin && visibleColumns.confirmatrice && <th className="px-4 py-3">{t('confirmatrice')}</th>}
            {visibleColumns.price && <th className="px-4 py-3">{t('price')}</th>}
            {visibleColumns.status && <th className="px-4 py-3"></th>}
            {visibleColumns.total && <th className="px-4 py-3">{t('total')}</th>}
            {(isAdmin || isUser) && visibleColumns.actions && <th className="px-4 py-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                className={`bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  order.status === 'confirmed'
                    ? 'text-green-600 dark:text-green-700'
                    : order.status === 'cancelled'
                    ? 'text-red-600 dark:text-red-700'
                    : order.status === 'inProgress'
                    ? 'text-blue-600 dark:text-blue-700'
                    : order.status === 'pending'
                    ? 'text-yellow-600 dark:text-yellow-700'
                    : 'dark:text-gray-800'
                }`}
              >
                {isAdmin && (
                        <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders?.includes(order._id)}
                          onChange={() => handleOrderSelection(order._id)}
                        />
                        </td>
                    )}
         
                {visibleColumns.id && <td className="px-4 py-4">{order.nbr_order}</td>}
                {visibleColumns.client && <td className="px-4 py-4">{order.invoice_information.client}</td>}
                {visibleColumns.product_sku && <td className="px-4 py-4">{order.product_sku}</td>}
                {visibleColumns.phone && <td className="px-4 py-4">{order.invoice_information.phone1}</td>}
                {visibleColumns.attempt && (
                  <td className="px-4 py-4">
                <select
                  onChange={(e) => onChangeStatus(e.target.value, order._id)}
                  id="attempt"
                  value={order?.status}
                  className={`outline-none ${statusStyles2[order?.status] || ''} text-gray-800 border rounded-full py-2 px-2 w-full dark:text-gray-200 focus:ring-2 focus:ring-orange-500`}
                  >
                  {statuses.map((attemptValue, index) => (
                    <option
                    key={index}
                      value={attemptValue}
                      disabled={isChangingStatus}
                      className={`${statusStyles[attemptValue]}`}
                    >
                      {t(`${attemptValue}`)}
                    </option>
                  ))}
                </select>

                  </td>
                )}
                {visibleColumns.cancelledAt && <td className="px-4 py-4">{order.cancelledAt ? formattedDate(order.cancelledAt) : 'N/A'}</td>}
                {visibleColumns.confirmedAt && <td className="px-4 py-4">{order.confirmedAt ? formattedDate(order.confirmedAt) : 'N/A'}</td>}
                {visibleColumns.wilaya && <td className="px-4 py-4">{getWilayaName(order.invoice_information.wilaya)}</td>}
                {visibleColumns.commune && <td className="px-4 py-4">{order.invoice_information.commune}</td>}
                {isAdmin && visibleColumns.confirmatrice && <td className="px-4 py-4">{order.confirmatrice ? order.confirmatrice.fullname : 'N/A'}</td>}
                {visibleColumns.price && <td className="px-4 py-4">{order.price}</td>}
                {visibleColumns.status && <td className="px-4 py-4">{order.status}</td>}
                {visibleColumns.total && <td className="px-4 py-4">{order.total.toFixed(2)}</td>}
                {(isAdmin || isUser ) && visibleColumns.actions && (
                  <td className="py-4 flex gap-4 right-1">
                    <NavLink to={`/orders/view/${order._id}`} className="text-orange-600 hover:text-orange-400">
                      <HiEye className="text-2xl" />
                    </NavLink>
                    <button onClick={() => handleEditClick(order._id)} className="text-green-600 hover:text-green-400">
                      <HiRefresh className="text-2xl" />
                    </button>
                    <button onClick={() => onDeleteOrder(order._id)} className="text-red-600 hover:text-red-400">
                      <HiTrash className="text-2xl" />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="100%" className="py-4 text-center text-gray-500">{t('noData')}</td>
            </tr>
          )}
        </tbody>
      </table>
      <MyModal isVisible={isModalOpen} onClose={closeModal}>
        {selectedOrderId && <EditOrder orderId={selectedOrderId} closeModal={closeModal} />}
      </MyModal>
    </div>
  );
};


OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  onDeleteOrder: PropTypes.func,
  onChangeStatus: PropTypes.func,
  isChangingStatus: PropTypes.bool,
  selectedOrders: PropTypes.array,
  handleOrderSelection: PropTypes.func,
  handleSelectAll: PropTypes.func,
  setSelectedOrders: PropTypes.func
};

export default OrdersTable;
