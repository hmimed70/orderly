import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const UserFilter = ({ users, handleUserChange }) => {
  const { t } = useTranslation();
  
  if (!users || users.length === 0) return <div>{t('userFilter.noUsers')}</div>;

  return (
    <div className="text-left rtl:text-right flex flex-col justify-start items-start px-2 my-2">
      <label htmlFor="filterUser" className="text-left rtl:text-right text-slate-800 dark:text-gray-100 w-full px-2 mb-1">
        {t('users')}
      </label>
      <select
        name="filterUser"
        className="outline-none bg-white border border-gray-300 rounded-md py-2 px-2 w-full dark:bg-gray-700 dark:text-gray-200"
        onChange={(e) => handleUserChange(e.target.value)} // Pass the value (usr._id) instead of the whole object
      >
        <option value="" >{t('all')}</option>
        {users.map((usr) => (
          <option key={usr._id} value={usr._id}> {/* Use _id as the value */}
            {usr.userId} - {usr.fullname}
          </option>
        ))}
      </select>
    </div>
  );
};

UserFilter.propTypes = {
  users: PropTypes.array.isRequired,  // Ensure users is an array
  handleUserChange: PropTypes.func.isRequired,  // Ensure this is a function
};

export default UserFilter;
