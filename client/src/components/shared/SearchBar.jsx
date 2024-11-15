import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const { t } = useTranslation();

  return (
    <div className="w-[180px] my-1 py-1 flex flex-col justify-start items-start px-2">
      <label 
        htmlFor="search" 
        className="text-slate-800 dark:text-gray-100 w-full text-left rtl:text-right"
      >
        {t("searchOrders")}
      </label>
      <input
        id="search"
        type="text"
        placeholder={t("searchOrders")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="outline-none focus:border-orange-600 bg-white border border-gray-300 rounded-md py-2 px-2 w-full dark:bg-gray-700 dark:text-gray-200 rtl:text-right"
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired
};

export default SearchBar;
