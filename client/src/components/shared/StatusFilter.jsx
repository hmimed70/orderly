import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const StatusFilter = ({ status, handleStatusChange }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <div className="w-[180px] my-1 py-1 flex flex-col justify-start items-start px-2">
      <label 
        htmlFor="status" 
        className="text-slate-800 dark:text-gray-100 w-full text-left rtl:text-right"
      >
        {t("filterByStatus")}
      </label>
      <select
        id="status"
        aria-label={t("filterByStatus")}
        value={status}
        onChange={handleStatusChange}
        className="outline-none focus:border-orange-600 bg-white border border-gray-300 rounded-md py-2 px-2 w-full dark:bg-gray-700 dark:text-gray-200 rtl:text-right"
      >
        <option value="">{t("allStatuses")}</option>
        <option value="pending">{t("pending")}</option>
        <option value="inProgress">{t("inProgress")}</option>
        <option value="confirmed">{t("confirmed")}</option>
        <option value="cancelled">{t("cancelled")}</option>
      </select>
    </div>
  );
};

StatusFilter.propTypes = {
  status: PropTypes.string.isRequired,
  handleStatusChange: PropTypes.func.isRequired 
};

export default StatusFilter;
