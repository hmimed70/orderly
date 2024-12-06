import { Fragment, useEffect } from "react";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPaymentSchema } from "../../schema/index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import RadioGroup from "../../components/shared/RadioGroup";
import { useRequestPayment } from "../../hooks/usePayment";
import { useAuth } from "../../hooks/useAuth";
import { GiMoneyStack } from "react-icons/gi";
import { HiOutlineCreditCard } from "react-icons/hi2";
import TextArea from "../../components/shared/TextArea";
import { toast } from "react-hot-toast";

const AddPayment = ({ onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { createRequest, isCreating } = useRequestPayment();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newPaymentSchema),
  });

  const method = watch("method"); // Watch the value of the `method` field

  function onError(errors) {
    console.error(errors);
  }

  function onSubmit(data) {
    if(data.amount > user.availableAmount) {
             toast.error("You don't have enough available amount to request payment");
             return
    }
    const paymentData = {
      amount: data.amount,
      method: data.method,
      ccp: data.ccp || "",
      note: data.note,
    };
    createRequest(
      { ...paymentData },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  }

  useEffect(() => {
    if (user) {
      reset({
        amount: user.availableAmount.toString() || "",
      });
    }
  }, [user, reset]);

  return (
    <Fragment>
      <div className="mainContainer bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">
          {t("addPayment.title")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
        <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
        <FormInput
              type="number"
              placeholder={t("addPayment.AmountPlaceholder")}
              name="amount"
              disabled={isCreating}
              register={register}
              errors={errors.amount}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <RadioGroup
              label={t("addPayment.method")}
              name="method"
              watch={watch}
              options={[
                {
                  value: "Cash",
                  label: (
                    <div className="flex flex-col justify-center items-center">
                      <GiMoneyStack size={40} />
                      <span>{t("addPayment.cash")}</span>
                    </div>
                  ),
                },
                {
                  value: "RIB",
                  label: (
                    <div className="flex flex-col justify-center items-center">
                      <HiOutlineCreditCard size={40} />
                      <span>{t("addPayment.baridi")}</span>
                    </div>
                  ),
                },
              ]}
              
              register={register}
              errors={errors.method}
              disabled={isCreating}
            />
          </div>
          <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
            {/* Conditionally display the CCP field */}
              <FormInput
                type="text"
                placeholder={t("addPayment.ccp")}
                name="ccp"
                disabled={isCreating || method !=="RIB"}
                register={register}
                errors={errors.ccp}
                className="dark:bg-gray-700 dark:text-gray-200"
              />

            <TextArea
              name="note"
              label={t("addPayment.note")}
              placeholder={t("addPayment.notePlaceholder")}
              register={register}
              disabled={isCreating}
              errors={errors.note}
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
              {t("addPayment.addButton")}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

AddPayment.propTypes = {
  onClose: PropTypes.func,
};

export default AddPayment;
