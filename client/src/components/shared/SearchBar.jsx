import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
 const { t } = useTranslation();
  return (
    <input
      type="text"
      placeholder={t("searchOrders")}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="block p-2 ps-10 md:ps-6 text-sm text-gray-950 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
    />
  );
};
SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired
}


export default SearchBar;
