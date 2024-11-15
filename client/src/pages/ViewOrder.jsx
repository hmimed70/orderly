import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleOrder } from "../hooks/useOrder";
import { useTranslation } from "react-i18next";
import { getWilayaName } from "../utils";

const ViewOrder = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleOrder(id);
  const { order } = data || {};
  const { t } = useTranslation();

  if (isLoading) return <p className="text-center mt-10">{t("loading")}</p>;

  return (
    <Fragment>
      <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Summary Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t("order_summary")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">{t("order_id")}:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">{t("status")}:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                {order?.attempts[order?.attempts.length - 1]?.attempt || t("unknown")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">{t("quantity")}:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">{order?.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">{t("price")}:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">{order?.price}</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {t("order_details")}
          </h2>

          {/* Client Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{t("client_information")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow label={t("client_name")} value={order?.invoice_information.client} />
              <DetailRow label={t("primary_phone")} value={order?.invoice_information.phone1} />
              <DetailRow label={t("secondary_phone")} value={order?.invoice_information.phone2} />
              <DetailRow label={t("address")} value={order?.invoice_information.address} />
              <DetailRow label={t("wilaya")} value={getWilayaName(order?.invoice_information.wilaya)} />
              <DetailRow label={t("commune")} value={order?.invoice_information.commune} />
            </div>
          </div>

          {/* Product Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{t("product_information")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow label={t("product_sku")} value={order?.product_sku} />
              <DetailRow label={t("product_name")} value={order?.product_name} />
              <DetailRow label={t("quantity")} value={order?.quantity} />
              <DetailRow label={t("price")} value={order?.price} />
              <DetailRow label={t("shipping_price")} value={order?.shipping_price} />
              <DetailRow label={t("shipping_type")} value={order?.shipping_type} />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{t("additional_information")}</h3>
            <DetailRow label={t("note")} value={order?.note || t("no_notes")} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Component for displaying a single row of label and value
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}:</span>
    <span className="font-semibold text-gray-900 dark:text-gray-200">{value}</span>
  </div>
);

export default ViewOrder;
