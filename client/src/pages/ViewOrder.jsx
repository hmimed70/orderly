import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleOrder } from "../hooks/useOrder";
import { useTranslation } from "react-i18next";
import OrderTimeline from "../components/shared/OrderTimeLine";
import Row from "../components/shared/Row";
import FormInput from "../components/shared/FormInput";
import TextArea from "../components/shared/TextArea";
import { SOCKET_URL } from "../utils";
import MetaData from "../components/MetaData";

const ViewOrder = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleOrder(id);
  const { order } = data || {};
  const { t } = useTranslation();
  if (isLoading) return <p className="text-center mt-10">{t("loading")}</p>;

  return (
    <Fragment>
      <MetaData  title={t('titles.viewOrder')}/>
    <div className="orderContainer flex flex-col lg:flex-row justify-start items-start dark:bg-gray-900 pt-2"> {/* Add pt-16 */}
      <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full lg:w-2/3">
        {/* Order Details Section */}
            <h2 className="text-3xl mb-5 font-bold text-gray-800 dark:text-gray-100 p-2   inline-block text-center">
              {t("order_details")}
            </h2>
  <h3 className="text-xl top-4 font-semibold text-gray-700 dark:text-gray-300 mb-2  px-2">
    {t("client_information")}
  </h3>
  <div className="border border-orange-500 m-4 overflow-hidden rounded-md">
  <Row>
              <FormInput
                type="text"
                placeholder={t("client_name")}
                name="client_name"
                disabled={true}
                value={order?.invoice_information.client}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t("primary_phone")}
                name="primary_phone"
                disabled={true}
                value={order?.invoice_information.phone1}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t("secondary_phone")}
                name="secondary_phone"
                disabled={true}
                value={order?.invoice_information.phone2}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t("wilaya")}
                name="wilaya"
                disabled={true}
                value={order?.invoice_information.wilaya}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t("commune")}
                name="commune"
                disabled={true}
                value={order?.invoice_information.commune}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
          </div>

        {/* Product Information */}
        <div className="mb-6">
        <h3 className="text-xl   font-semibold text-gray-700 dark:text-gray-300 my-2 px-2">
              {t("product_information")}
            </h3>
          <div className="border border-orange-500 m-4 overflow-hidden rounded-md">
            <Row>
              <FormInput
                type="text"
                placeholder={t("product_sku")}
                name="product_sku"
                disabled={true}
                value={order?.product_sku}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t("product_name")}
                name="product_name"
                disabled={true}
                value={order?.product_name}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t("quantity")}
                name="quantity"
                disabled={true}
                value={order?.quantity}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t("price")}
                name="price"
                disabled={true}
                value={order?.price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t("shipping_price")}
                name="shipping_price"
                disabled={true}
                value={order?.shipping_price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t("shipping_type")}
                name="shipping_type"
                disabled={true}
                value={order?.shipping_type}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <div className="flex flex-col md:flex-row items-start  justify-start mt-1">
            <TextArea
                type="text"
                placeholder={t("note")}
                name="note"
                disabled={true}
                value={order?.note || t("no_notes")}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
          <div className="w-full flex flex-col self-centerjustify-center items-center mt-4 md:mt-0">
            <span>{t('product.image')}</span>
             {  order?.product?.image ? (
            <div className="relative max-w-xs max-h-44 flex justify-center items-center aspect-square rounded-lg overflow-hidden ">
               {order.product.image &&
              <img
                src={`${SOCKET_URL}/uploads/${order.product.image}`}
                alt={order?.product_name}
                className="object-cover w-full h-full"
              />
               }
            </div>
             ) : "No Image "}
          </div>
        </div>
        <Row>
  <div className="flex flex-col justify-start w-full items-start  px-2">
    <label className="text-gray-700 dark:text-gray-300">{t("product.youtube_url")}</label>
    {order?.product?.youtube_url ? (
      <a className="bg-orange-500  max-w-40 dark:bg-orange-400 cursor-pointer text-white py-2 px-4 rounded-md outline-none"
      href={order.product.youtube_url}
      target="_blank"
      rel="noopener noreferrer"
      >
        <button >
        {t("rows")}
        </button>
      </a>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">{t("no_url")}</p>
    )}
  </div>
  <div className="flex flex-col justify-start items-start w-full  px-2">
    <label className="text-gray-700 dark:text-gray-300">{t("product.facebook_url")}</label>
    {order?.product?.facebook_url ? (
      <a className="bg-orange-500  max-w-40 dark:bg-orange-400 cursor-pointer text-white py-2 px-4 rounded-md outline-none"
      href={order.product.facebook_url}
        target="_blank"
        rel="noopener noreferrer"
      >
            <button >
        {t("rows")}
      </button>
      </a>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">{t("no_url")}</p>
    )}
  </div>
</Row>

            <Row>
        <TextArea
                type="text"
                placeholder={t("product.description")}
                name="description"
                disabled={true}
                value={order?.product?.description || t("description")}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
        </Row>
          </div>
        </div>
      </div>
      {/* Right Section: Status Timeline */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-4 md:mb-0">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 inline-block text-center mb-4">
          {t("status_changes")}
        </h2>
        <OrderTimeline order={order} />
      </div>
    </div>
  </Fragment>
  );
};

export default ViewOrder;
