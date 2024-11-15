import PropTypes from 'prop-types';

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
  return (
    <div className="order-summary bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center border-b pb-4">Order Summary</h2>
      
      {/* Product Details Section */}
      <div className="mb-6 border border-orange-300 dark:border-orange-500 rounded-lg p-4 bg-orange-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">Product Details</h3>
        <p><strong>SKU:</strong> {productSku}</p>
        <p><strong>Reference:</strong> {productName}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Price per unit:</strong> {price} DA</p>
      </div>

      {/* Delivery Details Section */}
      <div className="mb-6 border border-blue-300 dark:border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Delivery Details</h3>
        <p><strong>Shipping Type:</strong> {shippingType}</p>
        <p><strong>Shipping Price:</strong> {shippingPrice} DA</p>
        <p><strong>Wilaya:</strong> {wilaya}</p>
        <p><strong>Commune:</strong> {commune}</p>
      </div>

      {/* Invoice Details Section */}
      <div className="mb-6 border border-green-300 dark:border-green-500 rounded-lg p-4 bg-green-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">Invoice Details</h3>
        <p><strong>Client Name:</strong> {client}</p>
        <p><strong>Phone 1:</strong> {phone1}</p>
        {phone2 && <p><strong>Phone 2:</strong> {phone2}</p>}
      </div>

      {/* Total Price */}
      <div className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
        <p>Total Price: <span className="text-orange-600">{totalPrice.toFixed(2)} DA</span></p>
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
