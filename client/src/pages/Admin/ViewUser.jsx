import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleUser } from "../../hooks/useUSer";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ViewUser = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleUser(id); // Fetching the user data
  const { user } = data || {};
  const { t } = useTranslation(); // Initialize useTranslation

  if (isLoading) return <div>Loading...</div>;

  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full md:w-2/3 lg:w-2/3">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('viewUser.title')}</h1>
          <div className="w-full">
            {/* Each Row now has the FormInput-like styling */}
            {[
              { label: t('viewUser.fullname'), value: user.fullname },
              { label: t('viewUser.username'), value: user.username },
              { label: t('viewUser.email'), value: user.email },
              { label: t('viewUser.phone'), value: user.phone },
              { label: t('viewUser.role'), value: user.role },
              { label: t('viewUser.state'), value: user.state },
              { label: t('viewUser.gender'), value: user.gender },
              { label: t('viewUser.handleLimit'), value: user.handleLimit },
              { label: t('viewUser.orderConfirmedPrice'), value: user.orderConfirmedPrice },
            ].map((item, index) => (
              <div key={index} className="flex text-left rtl:text-right justify-between my-2 py-2 px-2 border-b border-gray-300 dark:border-gray-600">
                <label className="text-slate-800 dark:text-gray-100 w-3/5 ttext-left rtl:text-right">{item.label}:</label>
                <span className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ViewUser;
