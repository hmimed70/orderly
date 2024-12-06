import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatedPaymentSchema } from "../../schema";
import { useGetSinglePayment, useHandlePayment } from "../../hooks/usePayment";
import FormInput from "../../components/shared/FormInput";
import TextArea from "../../components/shared/TextArea";
import Row from "../../components/shared/Row";
import {  SOCKET_URL } from "../../utils";
import RadioGroup from "../../components/shared/RadioGroup";
import { MdDoneOutline, MdOutlineCancel } from "react-icons/md";

const EditPayment = ({ id, onClose }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSinglePayment(id);
  const { payment } = data || {};
  const { isEditing, paymentHandling } = useHandlePayment();
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatedPaymentSchema),
  });
  useEffect(() => {
    if (payment) {
      reset({
        userId: payment.userId._id,
        amount: payment.amount?.toString() || 0,
        ccp: payment.ccp || "",
        note: payment.note || "",
      });
     if(payment.image) setImagePreview(  `${SOCKET_URL}/uploads/${payment.image}`);

    }
  }, [payment, reset]);

  const onSubmit = (data) => {
    const paymentData = {
      ccp: data.ccp,
      note: data.note,
      userId: payment.userId._id,
      status: data.status,
    };

    let newData = { ...paymentData };
    if (data.image) {
      newData = { ...paymentData, image: data.image };
    }
    paymentHandling({ paymentData: {... newData }, id }, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Payment update failed", error);
      }
    });
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <Fragment>
      <div className="mainContainer bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">
          {t("editPayment.title")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Row>
          <FormInput
            value={payment?.userId?.fullname}
            type="text"
            placeholder={t("viewPayment.userID")}
            name="userId"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
            <FormInput
            value={payment?.paymentHandle?.fullname || "N/A"}
            type="text"
            placeholder={t("viewPayment.paymentHandle")}
            name="paymentHandle"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
            <FormInput
              value={payment.amount}
              disabled={true}
              type="number"
              placeholder={t("editPayment.amount")}
              name="amount"
              register={register}
              errors={errors.amount}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              value={payment.method}
              disabled={true}
              type="number"
              placeholder={t("editPayment.amount")}
              name="amount"
              register={register}
              errors={errors.amount}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
          <FormInput
              value={payment.method}
              disabled={true}
              type="number"
              placeholder={t("editPayment.amount")}
              name="amount"
              register={register}
              errors={errors.amount}
              className="dark:bg-gray-700 dark:text-gray-200"
            />

              <FormInput
                type="text"
                placeholder={payment.method==="Cash" ? t("editPayment.Cash") : t("editPayment.baridi")}
                name="method"
                disabled={true}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
          
          <RadioGroup  
              label={t('editPayment.status')}
              name="status"
              watch={watch}
              options={[
                { value: 'accepted', label: <div className="flex flex-col justify-center items-center"><MdDoneOutline size={30} /><span>{t('accepted')}</span></div>  },
                { value: 'refused', label: <div className="flex flex-col justify-center items-center"><MdOutlineCancel size={30} /><span>{t('refused')}</span></div>  },
              ]}
              register={register}
              errors={errors.status}
              disabled={isEditing}
              />
              </div>
            <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
            { payment.method === 'RIB' &&
           <>
              <div className="w-full md:w-3/4 my-2 py-2 px-4 border-b border-slate-500 text-slate-500 bg-white">
                <Controller
                  name="image"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <input
                      type="file"
                      disabled={payment.method !== 'RIB'}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                        setImagePreview(file ? URL.createObjectURL(file) : "");
                      }}
                      accept="image/*"
                    />
                  )}
                />
                {errors.image && <p className="text-red-600">{errors.image.message}</p>}
                {imagePreview && (
                  <div className="my-4">
                      <a
                        href={imagePreview || null} // The image URL will be used as the download source
                        download // This attribute triggers the download
                        className="cursor-pointer"
                      >
                    <img src={imagePreview}  alt="Image Preview" className="max-w-64 max-h-64" />
                    </a>
                  </div>
                )}
              </div>
              </>
              }

            <TextArea
              placeholder={t("editPayment.note")}
              name="note"
              watch={watch}
              register={register}
              errors={errors.note}
              className="dark:bg-gray-700 dark:text-gray-200"
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
            <button type="submit" className="py-3 px-6 rounded-md bg-orange-600 text-white text-sm">
              {isEditing ? t("editPayment.saving") : t("editPayment.save")}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default EditPayment;
