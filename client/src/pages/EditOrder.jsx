import { Fragment, useState, useEffect } from "react";
import FormInput from "../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderSchema } from "../schema/index";
import Wilaya from "../data/Wilaya.json";
import Communes from "../data/Communes.json";
import Row from "../components/shared/Row";
import { useGetSingleOrder, useEditOrder } from "../hooks/useOrder";
import { useTranslation } from "react-i18next";
import SelectInput from "../components/shared/SelectInput";
import RadioGroup from "../components/shared/RadioGroup";
import { HiBuildingOffice } from "react-icons/hi2";
import { HiOutlineHome } from "react-icons/hi";
import TextArea from "../components/shared/TextArea";

const EditOrder = ({orderId, onClose}) => {
  const { t } = useTranslation();
  const  id  = orderId;
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [myCommunes, setMyCommunes] = useState([]);
  const { isEditing, editOrder } = useEditOrder();
  const { data, isLoading } = useGetSingleOrder(id);
  const { order } = data || {};
  const [selectedCommune, setSelectedCommune] = useState("");

  const { register, handleSubmit,watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
  });
  useEffect(() => {
    if (order) {
      reset({
        client: order.invoice_information.client || "",
        phone1: order.invoice_information.phone1 || "",
        phone2: order.invoice_information.phone2 || "",
        wilaya: order.invoice_information.wilaya || "",
        commune: order.invoice_information.commune || "",
        product_sku: order.product_sku || "",
        product_name: order.product_name || "PRD_10",
        quantity: order.quantity?.toString() || "0",
        price: order.price?.toString() || "0.0",
        shipping_price: order.shipping_price?.toString() || "0.0",
        shipping_type: order.shipping_type || "home",
        note: order.note || "",
      });
      
      setSelectedWilaya(order.invoice_information.wilaya);
      setSelectedCommune(order.invoice_information.commune);
      
      const filteredCommunes = Communes.filter(
        (commune) => commune.wilaya_id === order.invoice_information.wilaya
      );
      setMyCommunes(filteredCommunes);
    }
  }, [order, reset]);
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
                placeholder={t('editOrder1.phone1Placeholder')}
                name="phone1"
                disabled={isEditing}
                register={register}
                errors={errors.phone1}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('editOrder1.phone2Placeholder')}
                name="phone2"
                disabled={isEditing}
                register={register}
                errors={errors.phone2}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <SelectInput
                name="wilaya"  onChange={(event) => {
                  setSelectedWilaya(event.target.value);
                  const filteredCommunes = Communes.filter(commune => commune.wilaya_id === event.target.value);
                  setMyCommunes(filteredCommunes);
                  setSelectedCommune('');
                     }} 
                label={t('editOrder1.wilayaLabel') } value={selectedWilaya} disabled={isEditing} register={register} errors={errors.wilaya}>
                  {Wilaya.map((wilaya, index) => (
                    <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={index} value={wilaya.code}>
                      {wilaya.nom}
                    </option>
                  ))}
                </SelectInput>
            </Row>
            <Row>
                <SelectInput name="commune" label={t('editOrder1.communeLabel')} onChange={(event) => setSelectedCommune(event.target.value)} value={selectedCommune} disabled={isEditing} register={register} errors={errors.commune}>
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700"  value="" disabled>{t('editOrder1.chooseCommune')}</option>
                   {myCommunes.map((commune, index) => (
                    <option  className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={index} value={commune.code}>
                      {commune.nom}
                    </option>
                   ))}
                </SelectInput>
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
                type="number"
                placeholder={t('editOrder1.pricePlaceholder')}
                name="price"
                disabled={isEditing}
                register={register}
                errors={errors.price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
       
              <FormInput
                type="number"
                placeholder={t('editOrder1.shippingPricePlaceholder')}
                name="shipping_price"
                disabled={isEditing}
                register={register}
                errors={errors.shipping_price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <RadioGroup watch={watch}
              name="shipping_type"
              label={t('addOrder.shippingType')}
              options={[
                { value: 'desk', label: <div className="flex flex-col justify-center items-center"><HiBuildingOffice size={30} /><span>{t('addOrder.desk')}</span></div>  },
                { value: 'home', label: <div className="flex flex-col justify-center items-center"><HiOutlineHome size={30} /><span>{t('addOrder.home')}</span></div>  },
              ]}
              register={register}
              errors={errors.shipping_type}
              disabled={isEditing}
               />
              <TextArea
                 placeholder={t('editOrder1.notePlaceholder')}
                name="note"
                disabled={isEditing}
                register={register}
                errors={errors.note}
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

export default EditOrder;
