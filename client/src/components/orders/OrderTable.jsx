import { HiRefresh } from 'react-icons/hi';
import { HiEye, HiTrash } from 'react-icons/hi2';
import { NavLink, useLocation } from 'react-router-dom';
import MyModal from '../shared/MyModal';
import { formattedDate, getWilayaName } from '../../utils';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import EditOrder from '../../pages/EditOrder';

const statuses = [
  'pending', 'inProgress', 'confirmed', 'cancelled', 'didntAnswer1', 
  'didntAnswer2', 'didntAnswer3', 'didntAnswer4', 'phoneOff', 
  'duplicate', 'wrongNumber', 'wrongOrder'
];

const statusStyles = {
  pending: "text-yellow-500 px-3 py-2 text-md ",      // Bright yellow for pending
  inProgress: "text-blue-500 px-4 py-2 text-md",      // Sky blue for in-progress
  confirmed: "text-green-500 px-3 py-1 text-md",      // Fresh green for confirmed
  cancelled: "text-red-500 px-2 py-1 text-md",        // Vibrant red for cancelled
  didntAnswer1: "text-amber-500 px-3 py-1 text-md",  // Soft amber for didn't answer 1
  didntAnswer2: "text-amber-600 px-4 py-2 text-md",  // Medium amber for didn't answer 2
  didntAnswer3: "text-amber-700 px-3 py-2 text-md",  // Rich amber for didn't answer 3
  didntAnswer4: "text-amber-800 px-2 py-2 text-md",  // Dark amber for didn't answer 4
  phoneOff: "text-gray-600 px-3 py-1 text-md",        // Neutral gray for phone off
  duplicate: "text-orange-700 px-2 py-2 text-md",      // Warm orange for duplicate
  wrongNumber: "text-pink-700 px-4 py-1 text-md",     // Bold pink for wrong number
  wrongOrder: "text-red-500 px-3 py-2 text-md",        // Deep red for wrong order
};




const OrdersTable = ({ orders, visibleColumns, onDeleteOrder, selectedOrders, handleOrderSelection, handleSelectAll, onChangeStatus, isChangingStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const location = useLocation();
  const isTrash = location.pathname.includes('trash');
  const { t } = useTranslation(); // useTranslation hook
  const { isLoading, isAdmin, isUser } = useAuth();

  // Handle modal open and close
  const handleEditClick = (orderId) => {
    console.log("is edit click")
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };
  console.log(isModalOpen);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  // Loading state
  if (isLoading) return <p>{t('loading')}</p>;

  return (
    <div className="max-h-[30rem] overflow-y-scroll custom-scrollbar mt-2">
      <table className="mt-5 w-full text-sm text-left text-gray-900 dark:text-gray-400">
        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-200">
          <tr>
          {(isAdmin || isTrash)&& (
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
            {visibleColumns.product_name && <th className="px-4 py-3">{t('addOrder.productName')}</th>}
            {visibleColumns.phone && <th className="px-4 py-3">{t('phone')}</th>}
            {visibleColumns.status && <th className="px-4 py-3">{t('status')}</th>}
            {visibleColumns.cancelledAt && <th className="px-4 py-3">{t('cancelledAt')}</th>}
            {visibleColumns.deletedAt && <th className="px-4 py-3">{t('deletedAt')}</th>}
            {visibleColumns.confirmedAt && <th className="px-4 py-3">{t('confirmedAt')}</th>}
            {visibleColumns.wilaya && <th className="px-4 py-3">{t('wilaya')}</th>}
            {visibleColumns.commune && <th className="px-4 py-3">{t('commune')}</th>}
            {isAdmin && visibleColumns.confirmatrice && <th className="px-4 py-3">{t('confirmatrice')}</th>}
            {visibleColumns.price && <th className="px-4 py-3">{t('price')}</th>}
            {visibleColumns.total && <th className="px-4 py-3">{t('total')}</th>}
            {(isAdmin || isUser) && visibleColumns.actions && <th className="px-4 py-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                className={` font-semibold bg-white  dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                  ${order?.status && statusStyles[order?.status]}`} // Corrected the style application
              >
                 {(isAdmin || isTrash)&& (
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
                {visibleColumns.product_name && <td className="px-4 py-4">{order.product_name}</td>}
                {visibleColumns.phone && <td className="px-4 py-4">{order.invoice_information.phone1}</td>}
                {visibleColumns.status && (
                  <td className="px-4 py-4">
                    <select
                    
                      onChange={(e) => onChangeStatus(e.target.value, order._id)}
                      value={order?.status}
                      disabled={isChangingStatus || isTrash}
                      className="outline-none border rounded-full py-2 px-2 w-full focus:ring-2 focus:ring-orange-500"
                    >
                      {statuses.map((statusValue, index) => (
                        <option
                          key={index}
                          value={statusValue}
                          className={statusStyles[statusValue]}
                        >
                          {t(statusValue)}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                {visibleColumns.cancelledAt && <td className="px-4 py-4">{order.cancelledAt ? formattedDate(order.cancelledAt) : 'N/A'}</td>}
                {visibleColumns.deletedAt && <td className="px-4 py-4">{order.deletedAt ? formattedDate(order.deletedAt) : 'N/A'}</td>}

                {visibleColumns.confirmedAt && <td className="px-4 py-4">{order.confirmedAt ? formattedDate(order.confirmedAt) : 'N/A'}</td>}
                {visibleColumns.wilaya && <td className="px-4 py-4">{getWilayaName(order.invoice_information.wilaya)}</td>}
                {visibleColumns.commune && <td className="px-4 py-4">{order.invoice_information.commune}</td>}
                {isAdmin && visibleColumns.confirmatrice && <td className="px-4 py-4">{order.confirmatrice ? order.confirmatrice.fullname : 'N/A'}</td>}
                {visibleColumns.price && <td className="px-4 py-4">{order.price}</td>}
                {visibleColumns.total && <td className="px-4 py-4">{order.total.toFixed(2)}</td>}
                {(isAdmin || isUser) && visibleColumns.actions && (
                  <td className="py-4 flex gap-4">
                    <NavLink to={`/orders/view/${order._id}`} className="text-orange-600 hover:text-orange-400">
                      <HiEye className="text-2xl" />
                    </NavLink>
                    {!isTrash && (
                      <>
                    <button onClick={() => handleEditClick(order._id)} className="text-green-600 hover:text-green-400">
                      <HiRefresh className="text-2xl" />
                    </button>
                      <button onClick={() => onDeleteOrder(order._id)} className="text-red-600 hover:text-red-400">
                        <HiTrash className="text-2xl" />
                      </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr className="bg-white border-b dark:border-gray-700">
              <td colSpan="12" className="text-center py-4">{t('noOrdersFound')}</td>
            </tr>
          )}
        </tbody>
      </table>

      <MyModal isVisible={isModalOpen} onClose={closeModal}>
        <EditOrder orderId={selectedOrderId} onClose={closeModal} />
      </MyModal>
    </div>
  );
};

OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  onDeleteOrder: PropTypes.func.isRequired,
  selectedOrders: PropTypes.array.isRequired,
  handleOrderSelection: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  isChangingStatus: PropTypes.bool.isRequired,
};

export default OrdersTable;
