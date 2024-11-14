import PropTypes from 'prop-types';

const OrderSummary = ({ totalPrice, client, quantity, price, shippingPrice, discount, shippingType, wilaya, commune, phone1, phone2, productSku, productRef }) => {
  return (
    <div className="order-summary bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-100 mb-4">Order Summary</h2>
      
      {/* Product Details Section */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400">Product Details</h3>
        <p><strong>SKU:</strong> {productSku}</p>
        <p><strong>Reference:</strong> {productRef}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Price per unit:</strong> {price} DA</p>
        <p><strong>Discount:</strong> {discount}%</p>
      </div>

      {/* Delivery Details Section */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400">Delivery Details</h3>
        <p><strong>Shipping Type:</strong> {shippingType}</p>
        <p><strong>Shipping Price:</strong> {shippingPrice} DA</p>
        <p><strong>Wilaya:</strong> {wilaya}</p>
        <p><strong>Commune:</strong> {commune}</p>
      </div>

      {/* Invoice Details Section */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400">Invoice Details</h3>
        <p><strong>Client Name:</strong> {client}</p>
        <p><strong>Phone 1:</strong> {phone1}</p>
        <p><strong>Phone 2:</strong> {phone2}</p>
      </div>

      {/* Total Price */}
      <div className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
        <p>Total Price: <span className='text-orange-600 '>{totalPrice.toFixed(2)} DA</span></p>
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
  discount: PropTypes.number,
  shippingType: PropTypes.string.isRequired,
  wilaya: PropTypes.string.isRequired,
  commune: PropTypes.string.isRequired,
  phone1: PropTypes.string.isRequired,
  phone2: PropTypes.string,
  productSku: PropTypes.string.isRequired,
  productRef: PropTypes.string.isRequired,
};

export default OrderSummary;
