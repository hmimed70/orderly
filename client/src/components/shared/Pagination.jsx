import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, handlePageChange, totalOrders, ordersCount }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-300"
        >
          {t("previous")}
        </button>
        <span>
          {t("page")} {currentPage} {t("of")} {totalPages} (
          {t("filteredOrders", { totalOrders, ordersCount })})
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-300"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  totalOrders: PropTypes.number.isRequired,
  ordersCount: PropTypes.number.isRequired
}
export default Pagination;
