import { Fragment, useEffect } from "react";
import FormInput from "../components/shared/FormInput";
import { useForm } from "react-hook-form";
import { useGetSingleOrder, useAddOrderstoDelivry } from "../hooks/useOrder";
import { useTranslation } from "react-i18next";

const AddingTracking = ({ orderId, onClose }) => {

  const { t } = useTranslation();
  const { data, isLoading } = useGetSingleOrder(orderId);
  const { order } = data || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (order) {
      reset({
        client: order.invoice_information.client || "",
        product_name: order.product_name || "",
        tracking_number: "",
      });
    }
  }, [order, reset]);

  if (isLoading) return <p>Loading...</p>;

  const onSubmit = (data) => {

    addOrderstoDelivry(
      { id: orderId, tracking_number: data.tracking_number },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Failed to add tracking number", error);
        },
      }
    );
  };

  return (
    <Fragment>
      <div className="mainContainer bg-white dark:bg-gray-800 my-1 rounded-lg shadow-md p-4 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-xl mb-8">
          {t("addTrackingNumber.title")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Client Name */}
          <FormInput
            type="text"
            name="client"
            disabled
            register={register}
            errors={errors.client}
            className="dark:bg-gray-700 dark:text-gray-200 cursor-default"
          />
          {/* Product Name */}
          <FormInput
            type="text"
            name="product_name"
            disabled
            register={register}
            errors={errors.product_name}
            className="dark:bg-gray-700 dark:text-gray-200 cursor-default"
          />
          {/* Tracking Number */}
          <FormInput
            type="text"
            placeholder={t("addTrackingNumber.trackingPlaceholder")}
            name="tracking_number"
            register={register} // Pass register function directly
            errors={errors.tracking_number}
            className="dark:bg-gray-700 dark:text-gray-200"
          />


          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              type="button"
              className="py-3 px-6 rounded-md bg-red-600 text-white text-sm"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isDelevryMultiple}
              className="py-3 px-6 rounded-md bg-orange-600 text-white text-sm"
            >
              {isDelevryMultiple ? t("addTrackingNumber.saving") : t("addTrackingNumber.save")}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AddingTracking;
