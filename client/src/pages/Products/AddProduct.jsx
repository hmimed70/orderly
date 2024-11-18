import { Fragment, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { productSchema } from "../../schema";
import { useCreateProduct } from "../../hooks/useProduct";
import FormInput from "../../components/shared/FormInput";
import Row from "../../components/shared/Row";
import TextArea from "../../components/shared/TextArea";
import PropTypes from "prop-types";

const AddProduct = ({ onClose }) => {
  const { t } = useTranslation();
  const { isCreating, createProduct } = useCreateProduct();
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  function onError(errors) {
  }

  function onSubmit(data, e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("selling_price", data.selling_price);
    formData.append("quantity", data.quantity);
    formData.append("product_sku", data.product_sku);
    formData.append("facebook_url", data.facebook_url);
    formData.append("youtube_url", data.youtube_url);
    formData.append("image", data.image); // Assuming image is an array of files
    const productData = {
      name: data.name,
      description: data.description,
      selling_price: data.selling_price,
      quantity: data.quantity,
      product_sku: data.product_sku,
      facebook_url: data.facebook_url,
      youtube_url: data.youtube_url,
      image: data.image, // Use the first file in the array
    };
    createProduct(
      { ...productData },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  }

  return (
    <Fragment>
      <div className="mainContainer bg-white dark:bg-gray-800  rounded-lg shadow-md p-1 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">
          {t("product.title")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
          <Row>
            <FormInput
              type="text"
              placeholder={t("product.name")}
              name="name"
              disabled={isCreating}
              register={register}
              errors={errors.name}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="number"
              placeholder={t("product.quantity")}
              name="quantity"
              disabled={isCreating}
              register={register}
              errors={errors.quantity}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="number"
              placeholder={t("product.selling_price")}
              name="selling_price"
              disabled={isCreating}
              register={register}
              errors={errors.selling_price}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="text"
              placeholder={t("product.product_sku")}
              name="product_sku"
              disabled={isCreating}
              register={register}
              errors={errors.product_sku}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <Row>
            <FormInput
              disabled={isCreating}
              type="text"
              placeholder={t("product.facebook_url")}
              name="facebook_url"
              register={register}
              errors={errors.facebook_url}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              disabled={isCreating}
              type="text"
              placeholder={t("product.youtube_url")}
              name="youtube_url"
              register={register}
              errors={errors.youtube_url}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <div className=" w-full  text-center flex flex-col sm:flex-row justify-center items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
          <div className="w-full md:w-3/4 my-2 py-2 px-4 border-b border-slate-500 text-slate-500 bg-white">


 <Controller
  name="image"
  {...register("image")}
  control={control}
  defaultValue={null}
  render={({ field }) => (
    <input
    type="file"
    onChange={(e) => {
      const file = e.target.files[0]; // Access the first file
      field.onChange(file); // Update the field value in react-hook-form
      setImagePreview(URL.createObjectURL(file)); // Set the preview
    }}
  />
  )}
/>
              {errors.image && <p className="text-red-600">{errors.image.message}</p>}
            {imagePreview && (
              <div className="my-4 ">
                <img src={imagePreview} alt="Image Preview" className="max-w-64 max-h-64" />
              </div>
            )}
            </div>
            <TextArea
              name="description"
              placeholder={t("product.description")}
              register={register}
              disabled={isCreating}
              errors={errors.description}
            />
          </div>
          <div className="flex justify-center items-center gap-4">
            <button
              type="button"
              className="py-3 px-6 rounded-md bg-red-600 text-white text-sm"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              {t("product.addButton")}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

AddProduct.propTypes = {
  onClose: PropTypes.func,
};

export default AddProduct;
