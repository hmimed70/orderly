import { Fragment } from "react";
import { useGetSingleUser } from "../../hooks/useUser";
import { useTranslation } from "react-i18next"; // Import useTranslation
import FormInput from "../../components/shared/FormInput";
import Row from "../../components/shared/Row";

const ViewUser = ({onClose, id}) => {
  const { data, isLoading } = useGetSingleUser(id); // Fetching the user data
  const { user } = data || {};
  const { t } = useTranslation(); // Initialize useTranslation

  if (isLoading) return <div>Loading...</div>;

  return (
    <Fragment>
              <div className="mainContainer bg-white dark:bg-gray-800  rounded-lg shadow-md p-1 w-full">
              <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('viewUser.title')}</h1>
              <Row>
              <FormInput
              value={user.fullname}
                type="text"
                placeholder={t('viewUser.fullname')}
                name="fullname"
                disabled={true}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
               value={user.username}
                type="text"
                placeholder={t('viewUser.username')}
                name="username"
                disabled={true}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                value={user.role}
                type="text"
                placeholder={t('viewUser.role')}
                name="role"
                disabled={true}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              </Row>
              <Row>
              <FormInput
                value={user.phone}
                disabled={true}
                type="text"
                placeholder={t('viewUser.phone')}
                name="phone"
                className="dark:bg-gray-700 dark:text-gray-200"
              />
      
              <FormInput
                 value={user.handleLimit}
                disabled={true}
                type="text"
                placeholder={t('viewUser.handleLimit')}
                name="handleLimit"
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                value={user.orderConfirmedPrice}
                disabled={true}
                type="text"
                placeholder={t('viewUser.orderConfirmedPrice')}
                name="orderConfirmedPrice"
                className="dark:bg-gray-700 dark:text-gray-200"
              />
        
                  </Row>
                  <Row>
              <FormInput
              value={user.state}
           disabled={true}
                type="text"
                placeholder={t('viewUser.state')}
                name="state"
              
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                disabled={true}
                type="text"
                value={user.gender}

                placeholder={t('viewUser.gender')}
                name="gender"
              
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <div className=" flex justify-center items-center gap-4">
            <button
                type="button"
                className="py-3 px-6 rounded-md bg-red-600 text-white text-sm"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
            </div>
        </div>
    </Fragment>
  );
};

export default ViewUser;
