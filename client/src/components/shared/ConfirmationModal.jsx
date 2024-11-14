import { useTranslation } from 'react-i18next';
import PropTypes  from 'prop-types';
const ConfirmationModal = ({ message, onConfirm, onCancel, disabled,  children}) => {
  const {t} = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full text-center">
        <p className="text-lg mb-4 text-gray-950 dark:text-white">{message}</p>
        <div className="flex justify-center gap-4">
          {children}
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            disabled={disabled}
            onClick={onConfirm}
          >
            {t('confirmer')}
          </button>
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={onCancel}
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,

}
export default ConfirmationModal;
