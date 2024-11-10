import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";  // Import the translation hook

const OrderSummary = ({ client, shippingPrice, discount, quantity, price,totalPrice }) => {
  const { t } = useTranslation();  // Initialize the translation hook

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(amount);
  };

  return (
    <div className="order-summary p-6 border rounded-md shadow-lg dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">{t('orderSummary.title')}</h2>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>{t('orderSummary.clientName')}:</strong> {client}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>{t('orderSummary.quantity')}:</strong> {quantity}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>{t('orderSummary.pricePerItem')}:</strong> {formatCurrency(price)}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>{t('orderSummary.discount')}:</strong> {discount}%
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>{t('orderSummary.shippingPrice')}:</strong> {formatCurrency(shippingPrice)}
      </p>
      <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
        <strong>{t('orderSummary.totalPrice')}:</strong> {formatCurrency(totalPrice)}
      </p>
    </div>
  );
};

 OrderSummary.propTypes = {
  client: PropTypes.string.isRequired,
  shippingPrice: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

export default OrderSummary;
