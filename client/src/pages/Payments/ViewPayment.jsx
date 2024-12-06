import { Fragment } from "react";
import { useGetSinglePayment } from "../../hooks/usePayment";
import { useTranslation } from "react-i18next";
import FormInput from "../../components/shared/FormInput";
import TextArea from "../../components/shared/TextArea";
import { HiOutlineCreditCard } from "react-icons/hi";
import { GiMoneyStack } from "react-icons/gi";
import PropTypes from "prop-types";
import { SOCKET_URL } from "../../utils";

const ViewPayment = ({ onClose, id }) => {
  const { data, isLoading } = useGetSinglePayment(id);
  const { payment } = data || {};
  const { t } = useTranslation();

  if (isLoading) return <div>{t("loading")}</div>;

  const options = [
    {
      value: "Cash",
      label: (
        <div className="flex flex-col justify-center items-center">
          <GiMoneyStack size={25} />
          <span>{t("viewPayment.cash")}</span>
        </div>
      ),
    },
    {
      value: "RIB",
      label: (
        <div className="flex flex-col justify-center items-center">
          <HiOutlineCreditCard size={25} />
          <span>{t("viewPayment.baridi")}</span>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="mainContainer bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">
          {t("viewPayment.title")}
        </h1>
        {/* First Section */}
        <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200">
          <FormInput
            value={payment?.userId?.fullname}
            type="text"
            placeholder={t("viewPayment.userId")}
            name="userId"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={payment?.paymentHandle?.fullname}
            type="text"
            placeholder={t("viewPayment.paymentHandle")}
            name="paymentHandle"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
          <FormInput
            value={payment.amount}
            type="text"
            placeholder={t("viewPayment.amount")}
            name="amount"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </div>


        {/* Payment Method Section */}
        <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full text-left">
            <label className="text-slate-800 dark:text-gray-100 w-full px-2 mb-1">
              {t("viewPayment.method")}
            </label>
            <div className="flex flex-wrap justify-start items-center w-full">
              {options.map((option) => {
                const isChecked = payment.method === option.value;
                return (
                  <div
                    key={option.value}
                    className={`flex items-center mx-2 border ${
                      isChecked ? "border-orange-500" : "border-gray-300"
                    } p-4 rounded-md`}
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="method"
                      value={option.value}
                      checked={isChecked}
                      disabled
                      className={`form-radio ${
                        isChecked ? "bg-orange-500" : "bg-white"
                      } dark:bg-gray-700 dark:text-gray-200`}
                    />
                    <label
                      htmlFor={option.value}
                      className={`px-2 ${
                        isChecked ? "text-orange-500" : "text-slate-800"
                      } dark:text-gray-200`}
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note Section */}
          <TextArea
            value={payment.note}
            type="text"
            placeholder={t("viewPayment.note")}
            name="note"
            disabled={true}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Second Section - Removed extra margin/padding */}
        <div className="w-full text-center flex flex-col sm:flex-row justify-start items-start px-4 text-slate-500 bg-white dark:bg-gray-700 dark:text-gray-200 space-y-4 sm:space-y-0 sm:space-x-4">
          {payment.method === "RIB" && (
            <>
              <FormInput
                value={payment.ccp}
                type="text"
                placeholder={t("viewPayment.ccp")}
                name="ccp"
                disabled={true}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
                <div className="w-full max-h-64 md:w-1/2 flex flex-col justify-start items-start mt-4 md:mt-0">
            <span>Image</span>
            <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden ">
              <img
                src={`${SOCKET_URL}/uploads/${payment.image}`}
                alt={"ccp"}
                className="object-cover w-full max-h-64"
              />
            </div>
          </div>
            </>
          )}
        </div>
        {/* Cancel Button */}
        <div className="flex justify-center items-center gap-4 ">
          <button
            type="button"
            className="py-3 px-6 rounded-md bg-red-600 text-white text-sm"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

ViewPayment.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default ViewPayment;
