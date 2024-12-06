import { Fragment } from "react";
import { useGetSingleProduct } from "../../hooks/useProduct"; // Hook for fetching product data
import { useTranslation } from "react-i18next"; // Import useTranslation
import FormInput from "../../components/shared/FormInput";
import Row from "../../components/shared/Row";
import PropTypes from "prop-types";
import TextArea from "../../components/shared/TextArea";
import {  SOCKET_URL } from "../../utils";

const ViewProduct = ({ onClose, id }) => {
  const { data, isLoading } = useGetSingleProduct(id); // Fetching the product data
  const { product } = data || {};
  const { t } = useTranslation(); // Initialize useTranslation

  if (isLoading) return <div>Loading...</div>;

  return (
    <Fragment>
      <div className="mainContainer bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-2">
          {t("viewProduct")}
        </h1>
        <Row>
          <FormInput
            value={product.name}
            type="text"
            placeholder={t("product.name")}
            name="name"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={product.description}
            type="text"
            placeholder={t("product.description")}
            name="description"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={product.selling_price}
            type="text"
            placeholder={t("product.selling_price")}
            name="sellingPrice"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={product.quantity}
            type="text"
            placeholder={t("product.quantity")}
            name="quantity"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </Row>
        <Row>
          <FormInput
            value={product.youtube_url}
            type="text"
            placeholder={t("product.youtube_url")}
            name="youtube_url"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={product.facebook_url}
            type="text"
            placeholder={t("product.facebook_url")}
            name="facebook_url"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={product.product_sku}
            type="text"
            placeholder={t("product.product_sku")}
            name="productSku"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </Row>
        <div className="flex flex-col md:flex-row items-start  justify-start mt-1">
          <TextArea
           
            name="description"
            placeholder={t("product.description")}
            disabled={true}
            value={product.description}
            className="dark:bg-gray-700 dark:text-gray-200 w-full md:w-1/2"
          />
          <div className="w-full md:w-1/2 flex flex-col justify-start items-start mt-4 md:mt-0">
            <span>Image</span>
            <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden ">
              { product.image &&
                <img
                  src={`${SOCKET_URL}/uploads/${product.image}`}
                  alt={product.name}
                  className="object-cover w-full max-h-64"
                />

              }
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-2">
          <button
            type="button"
            className="py-3 px-6 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

ViewProduct.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewProduct;
