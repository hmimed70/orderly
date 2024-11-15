import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, handlePageChange, totalOrders, ordersCount }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full my-1 py-2 flex justify-center items-center px-2 dark:text-gray-100">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          aria-label={t("previous")}
        >
          {t("previous")}
        </button>
        <span className="text-gray-800 dark:text-gray-100">
          {t("page")} {currentPage} {t("of")} {totalPages} - {t("filteredOrders", { totalOrders, ordersCount })}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          aria-label={t("next")}
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
  ordersCount: PropTypes.number.isRequired,
};

export default Pagination;
