import { Fragment, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Row from "../../components/shared/Row";
import { useTranslation } from "react-i18next";
import TextArea from "../../components/shared/TextArea";
import PropTypes from 'prop-types';
import FormInput from "../../components/shared/FormInput";
import { productSchema } from "../../schema";
import { useEditProduct, useGetSingleProduct } from "../../hooks/useProduct";
import { SOCKET_URL } from "../../utils";

const EditProduct = ({ id, onClose }) => {
  const { t } = useTranslation();
  const { isEditing, editProduct } = useEditProduct();
  const { data, isLoading } = useGetSingleProduct(id);
  const { product } = data || {};
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

  const quantity = watch("quantity", 0); // Watch quantity directly from form
  const addQuantity = watch("addQuantity", 0); // Watch addQuantity directly from form

  useEffect(() => {
    if (product) {
      reset({
        nbr_product: product.nbr_product || "",
        name: product.name || "",
        selling_price: product.selling_price?.toString() || "0",
        quantity: product.quantity?.toString() || "0",
        product_sku: product.product_sku || "",
        facebook_url: product.facebook_url || "",
        youtube_url: product.youtube_url || "",
        description: product.description || "",
        user: product?.user?.name || "",
        image: null,
        addQuantity: "0",
      });
      product.image &&   setImagePreview(`${SOCKET_URL}/uploads/${product.image}`);
    }
  }, [product, reset]);

  if (isLoading) return <p>Loading...</p>;

  const onSubmit = (data, e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("selling_price", data.selling_price);
    formData.append("quantity", (parseInt(quantity, 10) + parseInt(addQuantity, 10)).toString()); // Calculate total quantity
    formData.append("product_sku", data.product_sku);
    formData.append("facebook_url", data.facebook_url);
    formData.append("youtube_url", data.youtube_url);
    if (data.image) {
      formData.append("image", data.image); // Handle image upload
    }

    // Prepare product data
    const productData = {
      name: data.name,
      description: data.description,
      selling_price: data.selling_price,
      quantity: (parseInt(quantity, 10) + parseInt(addQuantity, 10)), // Total updated quantity
      product_sku: data.product_sku,
      facebook_url: data.facebook_url,
      youtube_url: data.youtube_url,
    };

    let newData = { ...productData };
    if (data.image) {
      newData = { ...productData, image: data.image };
    }

    editProduct(
      { productData: { ...newData }, id },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Product update failed", error);
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
              placeholder={t("product.name")}
              name="name"
              disabled={isEditing}
              register={register}
              errors={errors.name}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="number"
              placeholder={t("product.quantity")}
              name="quantity"
              value={quantity} // Directly use watched quantity
              disabled={isEditing}
              register={register}
              errors={errors.quantity}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="number"
              placeholder={t("product.selling_price")}
              name="selling_price"
              disabled={isEditing}
              register={register}
              errors={errors.selling_price}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="text"
              placeholder={t("product.product_sku")}
              name="product_sku"
              disabled={isEditing}
              register={register}
              errors={errors.product_sku}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <Row>
            <FormInput
              disabled={isEditing}
              type="text"
              placeholder={t("product.facebook_url")}
              name="facebook_url"
              register={register}
              errors={errors.facebook_url}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              disabled={isEditing}
              type="text"
              placeholder={t("product.youtube_url")}
              name="youtube_url"
              register={register}
              errors={errors.youtube_url}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="number"
              placeholder={t("addQuantity")}
              name="addQuantity"
              disabled={isEditing}
              register={register}
              errors={errors.addQuantity}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <div className="w-full text-center flex flex-col sm:flex-row justify-center items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
            <div className="w-full md:w-3/4 my-2 py-2 px-4 border-b border-slate-500 text-slate-500 bg-white">
              <Controller
                name="image"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file); // Update the field with the new file or null
                      setImagePreview(file ? URL.createObjectURL(file) : ""); // Update preview
                    }}
                    accept="image/*"
                  />
                )}
              />
              {errors.image && <p className="text-red-600">{errors.image.message}</p>}
              {imagePreview &&product.image && (
                <div className="my-4">
                  <img src={imagePreview} alt="Image Preview" className="max-w-64 max-h-64" />
                </div>
              )}
            </div>
            <TextArea
              name="description"
              placeholder={t("product.description")}
              register={register}
              disabled={isEditing}
              errors={errors.description}
            />
          </div>
          <div className="flex justify-center items-center gap-4">
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
};

export default EditProduct;
