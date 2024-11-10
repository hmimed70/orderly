import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
const RowsPerPageSelector = ({ rowsPerPage, handleRowsPerPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <span className="pl-4 px-1">{t("rows")}</span>
      <select
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        className="p-2  px-8 md:px-4 bg-gray-50 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};
RowsPerPageSelector.propTypes = {
  rowsPerPage: PropTypes.number.isRequired,
  handleRowsPerPageChange: PropTypes.func.isRequired
};

export default RowsPerPageSelector;
