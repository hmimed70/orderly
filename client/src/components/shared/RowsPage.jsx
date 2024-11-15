import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const RowsPerPageSelector = ({ rowsPerPage, handleRowsPerPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="w-[180px] my-1 py-1 flex flex-col justify-start items-start px-2">
      <label 
        htmlFor="rowsPerPage" 
        className="text-slate-800 dark:text-gray-100 w-full text-left rtl:text-right"
      >
        {t("rows")}
      </label>
      <select
        id="rowsPerPage"
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        className="outline-none focus:border-orange-600 bg-white border border-gray-300 rounded-md py-2 px-2 w-full dark:bg-gray-700 dark:text-gray-200 rtl:text-right"
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
