import { HiCheck, HiRefresh } from 'react-icons/hi';
import { HiEye, HiTrash } from 'react-icons/hi2';
import { NavLink, useLocation } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { formattedDate, getWilayaName } from '../../utils';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
const OrdersTable = ({ orders, visibleColumns, onDeleteOrder, onConfirmOrder, onCancelOrder }) => {
  const { t } = useTranslation(); // useTranslation hook



  const { isLoading, isAdmin, isUser } = useAuth();
  const location = useLocation();
  const isMyOrders = location.pathname.includes('/my_orders');
  
  if (isLoading) return <p>{t('loading')}</p>;

  return (
    <div className="max-h-[30rem] overflow-y-scroll custom-scrollbar mt-2">
      <table className="mt-5 w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {visibleColumns.id && <th className="px-4 py-3">{t('orderNumber')}</th>}
            {visibleColumns.client && <th className="px-4 py-3">{t('client')}</th>}
            {visibleColumns.product_sku && <th className="px-4 py-3">{t('productSKU')}</th>}
            {visibleColumns.phone && <th className="px-4 py-3">{t('phone')}</th>}
            {visibleColumns.attempt && <th className="px-4 py-3">{t('attempt')}</th>}
            {visibleColumns.cancelledAt && <th className="px-4 py-3">{t('cancelledAt')}</th>}
            {visibleColumns.confirmedAt && <th className="px-4 py-3">{t('confirmedAt')}</th>}
            {visibleColumns.wilaya && <th className="px-4 py-3">{t('wilaya')}</th>}
            {visibleColumns.commune && <th className="px-4 py-3">{t('commune')}</th>}
            {visibleColumns.address && <th className="px-4 py-3">{t('address')}</th>}
            {isAdmin && visibleColumns.confirmatrice && <th className="px-4 py-3">{t('confirmatrice')}</th>}
            {visibleColumns.price && <th className="px-4 py-3">{t('price')}</th>}
            {visibleColumns.status && <th className="px-4 py-3">{t('status')}</th>}
            {visibleColumns.total && <th className="px-4 py-3">{t('total')}</th>}
            {(isAdmin || (isUser && isMyOrders)) && visibleColumns.actions && <th className="px-4 py-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {visibleColumns.id && <td className="px-4 py-4">{order.nbr_order}</td>}
                {visibleColumns.client && <td className="px-4 py-4">{order.invoice_information.client}</td>}
                {visibleColumns.product_sku && <td className="px-4 py-4">{order.product_sku}</td>}
                {visibleColumns.phone && <td className="px-4 py-4">{order.invoice_information.phone1}</td>}
                {visibleColumns.attempt && <td className="px-4 py-4">{order&& order.attempts && order?.attempts[order.attempts.length - 1]?.attempt}</td>}
                {visibleColumns.cancelledAt && <td className="px-4 py-4">{ order.cancelledAt ? formattedDate(order.cancelledAt) : "N/A"}</td>}
                {visibleColumns.confirmedAt && <td className="px-4 py-4">{order.confirmedAt ? formattedDate(order.confirmedAt) : "N/A"}</td>}
                {visibleColumns.wilaya && (
                  <td className="px-4 py-4">{getWilayaName(order.invoice_information.wilaya)}</td>
                )}
                {visibleColumns.commune && <td className="px-4 py-4">{order.invoice_information.commune}</td>}
                {visibleColumns.address && <td className="px-4 py-4">{order.invoice_information.address}</td>}
                {isAdmin && visibleColumns.confirmatrice && (
                  <td className="px-4 py-4">
                    {order.confirmatrice ? order.confirmatrice.fullname : "N/A"}
                  </td>
                )}
                {visibleColumns.price && <td className="px-4 py-4">{order.price}</td>}
                {visibleColumns.status && <td className="px-4 py-4">{order.status}</td>}
                {visibleColumns.total && <td className="px-4 py-4">{order?.total.toFixed(2)}</td>}
                {(isAdmin || (isUser && isMyOrders)) && visibleColumns.actions && (
                  <td className="py-4 flex gap-4 right-1">
                    {isAdmin ? (
                      <>
                        <NavLink to={`/admin/orders/view/${order._id}`} className="text-indigo-600 hover:text-indigo-400">
                          <HiEye className="text-2xl" />
                        </NavLink>
                        <NavLink to={`/admin/orders/edit/${order._id}`} className="text-green-600 hover:text-green-400">
                          <HiRefresh className="text-2xl" />
                        </NavLink>
                        <button onClick={() => onDeleteOrder(order._id)} className="text-red-600 hover:text-red-400">
                          <HiTrash className="text-2xl" />
                        </button>
                      </>
                    ) : (
                      isMyOrders && (
                        <>
                          <NavLink to={`/edit/${order._id}`} className="text-green-600 hover:text-green-400">
                            <HiRefresh className="text-2xl" />
                          </NavLink>
                          <button onClick={() => onConfirmOrder(order._id)} className="text-blue-600 hover:text-blue-400">
                            <HiCheck className="text-2xl" />
                          </button>
                          <button onClick={() => onCancelOrder(order._id)} className="text-red-600 hover:text-red-400">
                            <MdOutlineCancel />
                          </button>
                        </>
                      )
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center py-4">{t('noOrdersFound')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  onConfirmOrder: PropTypes.func,
  onCancelOrder: PropTypes.func,
  onDeleteOrder: PropTypes.func,
  isUser: PropTypes.bool,
  isMyOrders: PropTypes.bool,
  isAdmin: PropTypes.bool
};

export default OrdersTable;
