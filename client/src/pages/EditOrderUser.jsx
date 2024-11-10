import { Fragment, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  updatedOrderSchema } from "../schema/index";
import Wilaya from "../data/Wilaya.json";
import Communes from "../data/Communes.json";

import { useGetSingleOrderUser, useEditOrderUser, useCancelOrder, useConfirmOrder } from "../hooks/useOrder";
import {  useParams } from "react-router-dom";

import FormInput from "../components/shared/FormInput";

import ConfirmationModal from "../components/shared/ConfirmationModal";
import { useTranslation } from "react-i18next";
import Row from "../components/shared/Row";

const EditOrderUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [myCommunes, setMyCommunes] = useState([]);
  const { isEditing, editOrderUser } = useEditOrderUser();
  const { data, isLoading } = useGetSingleOrderUser(id);
  const { order } = data || {};
  const [selectedCommune, setSelectedCommune] = useState("");
  const { isConfirming, confirmOrd } = useConfirmOrder(); 
  const { isCanceling, cancelOrd } = useCancelOrder(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(updatedOrderSchema),
  });

  useEffect(() => {
    if (order) {
      reset({
        client: order.invoice_information.client || "",
        phone1: order.invoice_information.phone1 || "",
        phone2: order.invoice_information.phone2 || "",
        address: order.invoice_information.address || "",
        wilaya: order.invoice_information.wilaya || "",
        commune: order.invoice_information.commune || "",
        note: order.note || "",
        shipping_type: order.shipping_type || "home",
        orderId: order._id || "",
      });

      setSelectedWilaya(order.invoice_information.wilaya);
      setSelectedCommune(order.invoice_information.commune);

      const filteredCommunes = Communes.filter(
        (commune) => commune.wilaya_id === order.invoice_information.wilaya
      );
      setMyCommunes(filteredCommunes);
    }
  }, [order, reset]);

  const onSubmit = (data) => {
    // Prepare the order data
    const orderData = {
      invoice_information: {
        client: data.client,
        phone1: data.phone1,
        phone2: data.phone2,
        address: data.address,
        wilaya: data.wilaya,
        commune: data.commune,
      },
      shipping_type: data.shipping_type,
      note: data.note,
      attempt: parseInt(data.attempt),
      quantity: parseInt(data.quantity, 10),
    };
  
    // Only updating allowed fields
    editOrderUser({ myorder: { ...orderData }, id }, {
      onSuccess: () => {
        // Handle success if necessary
      },
      onError: (error) => {
        console.error("Order update failed", error);
      },
    });
  };
  

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const handleConfirmOrder = () => {
    setModalAction("confirm");
    setIsModalOpen(true);
  };

  const handleCancelOrder = () => {
    setModalAction("cancel");
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (modalAction === "confirm") {
      confirmOrd(id);
    } else if (modalAction === "cancel") {
      cancelOrd(order._id);
    }
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('editOrder')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Row>
              <FormInput
                type="text"
                placeholder={t('clientName')}
                name="client"
                disabled={isEditing}
                register={register}
                errors={errors.client}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('primaryPhone')}
                name="phone1"
                disabled={isEditing}
                register={register}
                errors={errors.phone1}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t('secondaryPhone')}
                name="phone2"
                disabled={isEditing}
                register={register}
                errors={errors.phone2}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('address')}
                name="address"
                disabled={isEditing}
                register={register}
                errors={errors.address}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <div className="text-left rtl:text-right w-full flex justify-center items-center my-2">
                <label htmlFor="wilaya" className="text-slate-800 dark:text-gray-100 w-3/5 px-2 rtl:text-right">{t('wilaya')}</label>
                <select
                  name="wilaya"
                  value={selectedWilaya}
                  disabled={isEditing}
                  {...register("wilaya", { required: t('wilayaRequired') })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                  onChange={(event) => {
                    setSelectedWilaya(event.target.value);
                    const filteredCommunes = Communes.filter(commune => commune.wilaya_id === event.target.value);
                    setMyCommunes(filteredCommunes);
                    setSelectedCommune('');
                  }}
                >
                  <option value="" disabled>{t('chooseWilaya')}</option>
                  {Wilaya.map((wilaya) => (
                    <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={wilaya.code} value={wilaya.code}>
                      {wilaya.nom}
                    </option>
                  ))}
                </select>
                {errors.wilaya && <p className="text-red-600">{errors.wilaya.message}</p>}
              </div>

              <div className=" text-left rtl:text-right w-full flex justify-center items-center my-2">
                <label htmlFor="commune" className="text-slate-800 dark:text-gray-100 px-2 w-3/5 rtl:text-right">{t('commune')}</label>
                <select
                  disabled={isEditing}
                  name="commune"
                  value={selectedCommune}
                  {...register("commune", { required: t('communeRequired') })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                  onChange={(event) => setSelectedCommune(event.target.value)}
                >
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="" disabled>{t('chooseCommune')}</option>
                  {myCommunes.map((commune) => (
                    <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={commune.code} value={commune.code}>
                      {commune.nom}
                    </option>
                  ))}
                </select>
                {errors.commune && <p className="text-red-600">{errors.commune.message}</p>}
              </div>
            </Row>
            <Row>
              <div className={` text-left rtl:text-right w-full my-2 py-2 flex justify-center items-center px-2 ${errors?.note?.message ? 'border-red-600 bg-red-200' : ''}`}>
                <label htmlFor="note" className="text-slate-800 dark:text-gray-100 w-3/5 rtl:text-right">{t('note')}</label>
                <textarea
                  disabled={isEditing}
                  id="note"
                  placeholder={t('notePlaceholder')}
                  {...register("note")}
                  className={`outline-none bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200${errors?.note?.message ? 'border-red-600 bg-red-200' : ''}`}
                ></textarea>
                {errors.note && <p className="text-red-600">{errors.note.message}</p>}
              </div>
              <div className={`text-left rtl:text-right w-full my-2 py-2 flex justify-center items-center px-2 ${errors?.attempt?.message ? 'border-red-600 bg-red-200' : ''}`}>
    <label htmlFor="attempt" className="text-slate-800 dark:text-gray-100 w-3/5 rtl:text-right">{t('attempt')}</label>
    <select
  disabled={isEditing}
  id="attempt"
  defaultValue={(0).toString()}
  {...register("attempt")}
  className={`outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200 ${errors?.attempt?.message ? 'border-red-600 bg-red-200' : ''}`}
>
  <option value={(0).toString()} selected={true} className="dark:bg-gray-700 dark:text-gray-200  text-gray-700">
    {t('chooseAttempt')}
  </option>
  
  {[0, 1, 2, 3, 4].map((attemptValue) => {
    const attemptDisabled = attemptValue !== order?.attempts?.length;

    return (
      <option key={attemptValue} className="dark:bg-gray-700 dark:text-gray-200  text-gray-700"
         value={attemptDisabled ? (0).toString() : (attemptValue + 1).toString()}
        disabled={attemptDisabled}>
        {t(`didntAnswer${attemptValue + 1}`)}
      </option>
    );
  })}
</select>

{errors.attempt && <p className="text-red-600">{errors.attempt.message}</p>}
</div>

            </Row>
            <div className="flex justify-between items-center my-4">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">{t('updateOrder')}</button>
              <button type="button" onClick={handleConfirmOrder} className="bg-green-500 text-white py-2 px-4 rounded-md">{t('confirmOrder')}</button>
              <button type="button" onClick={handleCancelOrder} className="bg-red-500 text-white py-2 px-4 rounded-md">{t('cancelOrder')}</button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          message={modalAction === "confirm" ? t('confirm_modal') : t('cancel_message')}
          disabled={isCanceling || isConfirming}
          isOpen={isModalOpen}
          onConfirm={handleModalConfirm}
          onCancel={() => setIsModalOpen(false)}
          action={modalAction}
        />
      )}
    </Fragment>
  );
};

export default EditOrderUser;
