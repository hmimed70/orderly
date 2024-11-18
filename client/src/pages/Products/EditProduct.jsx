import { Fragment, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Row from "../../components/shared/Row";
import { useTranslation } from "react-i18next";

import TextArea from "../../components/shared/TextArea";
import PropTypes from 'prop-types';
import FormInput from "../../components/shared/FormInput";
import { productSchema } from "../../schema";
import { useEditProduct, useGetSingleProduct } from "../../hooks/useProduct";
const EditProduct = ({id, onClose}) => {
  const { t } = useTranslation();
  const { isEditing, editOrder } = useEditProduct();
  const { data, isLoading } = useGetSingleProduct(id);
  const { product } = data || {};

  const { register, handleSubmit,watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

      


  if(isLoading) return <p>Loading...</p>;

  const onSubmit = (data) => {
    const orderData = {
      invoice_information: {
        client: data.client,
        phone1: data.phone1,
        phone2: data.phone2,
        wilaya: data.wilaya,
        commune: data.commune,
      },
      shipping_price: parseFloat(data.shipping_price),
      shipping_type: data.shipping_type,
      note: data.note,
      product_sku: data.product_sku,
      quantity: parseInt(data.quantity, 10),
      price: parseFloat(data.price),
      product_name: data.product_name,
    };

    editOrder(
      { orderData: { ...orderData }, id },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Order update failed", error);
        },
      }
    );
  };

  return (
    <Fragment>
        <div className="mainContainer bg-white dark:bg-gray-800 my-1 rounded-lg shadow-md p-4 w-full">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-xl mb-8">
            {t('editOrder1.title')}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Row>
              <FormInput
                type="text"
                placeholder={t('editOrder1.clientPlaceholder')}
                name="client"
                disabled={isEditing}
                register={register}
                errors={errors.client}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
        
       
              <FormInput
                type="text"
                placeholder={t('editOrder1.productSkuPlaceholder')}
                name="product_sku"
                disabled={isEditing}
                register={register}
                errors={errors.product_sku}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('editOrder1.productNamePlaceholder')}
                name="product_name"
                disabled={isEditing}
                register={register}
                errors={errors.product_name}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="number"
                placeholder={t('editOrder1.quantityPlaceholder')}
                name="quantity"
                disabled={isEditing}
                register={register}
                errors={errors.quantity}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t('product.facebook_url')}
                name="facebook_url"
                disabled={isEditing}
                register={register}
                errors={errors.facebook_url}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
       
              <FormInput
                type="text"
                placeholder={t('product.youtube_url')}
                name="youtube_url"
                disabled={isEditing}
                register={register}
                errors={errors.youtube_url}
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
              <button disabled={isEditing}
               type="submit" className="py-3 px-6 rounded-md bg-orange-600 text-white text-sm">
              {isEditing ? t('editOrder1.saving') : t('editOrder1.save')}

              </button>
            </div>
          </form>
        </div>
    </Fragment>
  );
};
EditProduct.propTypes = {
    id: PropTypes.string.isRequired,
   onClose: PropTypes.func.isRequired
}
export default EditProduct;
