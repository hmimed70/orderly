import { HiRefresh } from 'react-icons/hi';
import { HiEye, HiTrash } from "react-icons/hi2";
import { NavLink } from 'react-router-dom';
import { formattedDate } from '../../utils';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
const UsersTable = ({ users, visibleColumns, onDeleteUser }) => {
  const { t } = useTranslation(); // Get the translation function

  return (
    <div className="max-h-[30rem] overflow-y-scroll custom-scrollbar mt-2">
      <table className=" mt-5 w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {visibleColumns.id && <th className="px-4 py-3">{t('usersTable.userId')}</th>}
            {visibleColumns.fullname && <th className="px-4 py-3">{t('usersTable.fullname')}</th>}
            {visibleColumns.email && <th className="px-4 py-3">{t('usersTable.email')}</th>}
            {visibleColumns.username && <th className="px-4 py-3">{t('usersTable.username')}</th>}
            {visibleColumns.gender && <th className="px-4 py-3">{t('usersTable.gender')}</th>}
            {visibleColumns.earnings && <th className="px-4 py-3">{t('usersTable.earnings')}</th>}
            {visibleColumns.role && <th className="px-4 py-3">{t('usersTable.role')}</th>}
            {visibleColumns.confirmedOrders && <th className="px-4 py-3">{t('usersTable.confirmedOrders')}</th>}
            {visibleColumns.orderConfirmedPrice && <th className="px-4 py-3">{t('usersTable.orderConfirmedPrice')}</th>}
            {visibleColumns.state && <th className="px-4 py-3">{t('usersTable.state')}</th>}
            {visibleColumns.handleLimit && <th className="px-4 py-3">{t('usersTable.handleLimit')}</th>}
            {visibleColumns.createdAt && <th className="px-4 py-3">{t('usersTable.createdAt')}</th>}
            {visibleColumns.actions && <th className="px-4 py-3">{t('usersTable.actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {visibleColumns.id && <td className="px-4 py-4">{user.userId}</td>}
                {visibleColumns.fullname && <td className="px-4 py-4">{user.fullname}</td>}
                {visibleColumns.email && <td className="px-4 py-4">{user.email}</td>}
                {visibleColumns.username && <td className="px-4 py-4">{user.username}</td>}
                {visibleColumns.gender && <td className="px-4 py-4">{user.gender}</td>}
                {visibleColumns.earnings && <td className="px-4 py-4">{user.earnings}</td>}
                {visibleColumns.role && <td className="px-4 py-4">{user.role}</td>}
                {visibleColumns.confirmedOrders && <td className="px-4 py-3">{user.confirmedOrders}</td>}
                {visibleColumns.orderConfirmedPrice && <td className="px-4 py-3">{user.orderConfirmedPrice}</td>}
                {visibleColumns.state && <td className="px-4 py-4">{user.state}</td>}
                {visibleColumns.handleLimit && <td className="px-4 py-4">{user.handleLimit}</td>}
                {visibleColumns.createdAt && <td className="px-4 py-4">{formattedDate(user.createdAt)}</td>}
                {visibleColumns.actions && (
                  <td className="py-4 flex gap-4">
                    <NavLink to={`/admin/users/view/${user._id}`} className="flex items-center text-xl text-indigo-600 hover:text-indigo-400 transition-colors duration-200">
                      <HiEye className="text-2xl" />
                    </NavLink>
                    <NavLink to={`/admin/users/edit/${user._id}`} className="flex items-center text-xl text-green-600 hover:text-green-400 transition-colors duration-200">
                      <HiRefresh className="text-2xl" />
                    </NavLink>
                    <button
                      onClick={() => onDeleteUser && onDeleteUser(user._id)}
                      className="flex items-center text-xl text-red-600 hover:text-red-400 transition-colors duration-200"
                    >
                      <HiTrash className="text-2xl" />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center py-4">{t('usersTable.noUsersFound')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  onDeleteUser: PropTypes.func,
}
export default UsersTable;
