import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const StatusFilter = ({ status, handleStatusChange }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <div className="flex items-center space-x-2">
      <span className='px-1'>{t("filterByStatus")}</span>
      <select
        aria-label="Filter by Status"
        value={status}
        onChange={handleStatusChange}
        className="p-2 bg-gray-50 border px-8 md:px-4 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value="">{t("allStatuses")}</option>
        <option value="pending">{t("pending")}</option>
        <option value="in-progress">{t("inProgress")}</option>
        <option value="confirmed">{t("confirmed")}</option>
        <option value="cancelled">{t("cancelled")}</option>
      </select>
    </div>
  );
};
StatusFilter.propTypes = {
  status: PropTypes.string.isRequired,
  handleStatusChange: PropTypes.func.isRequired 
}
export default StatusFilter;
