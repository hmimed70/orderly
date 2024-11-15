import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const OrderSummary = ({ 
  totalPrice, 
  client, 
  quantity, 
  price, 
  shippingPrice, 
  shippingType, 
  wilaya, 
  commune, 
  phone1, 
  phone2, 
  productSku, 
  productName 
}) => {
  const { t } = useTranslation();

  return (
    <div className="order-summary bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center border-b pb-4">{t('orderSummary')}</h2>
      
      {/* Product Details Section */}
      <div className="mb-6 border border-orange-300 dark:border-orange-500 rounded-lg p-4 bg-orange-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">{t('productDetails')}</h3>
        <p><strong>{t('sku')}:</strong> {productSku}</p>
        <p><strong>{t('reference')}:</strong> {productName}</p>
        <p><strong>{t('quantity')}:</strong> {quantity}</p>
        <p><strong>{t('pricePerUnit')}:</strong> {price} {t('currency')}</p>
      </div>

      {/* Delivery Details Section */}
      <div className="mb-6 border border-blue-300 dark:border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">{t('deliveryDetails')}</h3>
        <p><strong>{t('shippingType')}:</strong> {shippingType}</p>
        <p><strong>{t('shippingPrice')}:</strong> {shippingPrice} {t('currency')}</p>
        <p><strong>{t('wilaya')}:</strong> {wilaya}</p>
        <p><strong>{t('commune')}:</strong> {commune}</p>
      </div>

      {/* Invoice Details Section */}
      <div className="mb-6 border border-green-300 dark:border-green-500 rounded-lg p-4 bg-green-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">{t('invoiceDetails')}</h3>
        <p><strong>{t('clientName')}:</strong> {client}</p>
        <p><strong>{t('phone1')}:</strong> {phone1}</p>
        {phone2 && <p><strong>{t('phone2')}:</strong> {phone2}</p>}
      </div>

      {/* Total Price */}
      <div className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
        <p>{t('totalPrice')}: <span className="text-orange-600">{totalPrice.toFixed(2)} {t('currency')}</span></p>
      </div>
    </div>
  );
};


OrderSummary.propTypes = {
  totalPrice: PropTypes.number.isRequired,
  client: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  shippingPrice: PropTypes.number.isRequired,
  shippingType: PropTypes.string.isRequired,
  wilaya: PropTypes.string.isRequired,
  commune: PropTypes.string.isRequired,
  phone1: PropTypes.string.isRequired,
  phone2: PropTypes.string,
  productSku: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
};

export default OrderSummary;


