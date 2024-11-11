import { Fragment, useState, useEffect } from "react";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderSchema } from "../../schema/index";
import Wilaya from "../../data/Wilaya.json";
import Communes from "../../data/Communes.json";
import Row from "../../components/shared/Row";
import { useGetSingleOrder, useEditOrder } from "../../hooks/useOrder";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditOrder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [myCommunes, setMyCommunes] = useState([]);
  const { isEditing, editOrder } = useEditOrder();
  const { data, isLoading } = useGetSingleOrder(id);
  const { order } = data || {};
  const navigate = useNavigate();
  const [selectedCommune, setSelectedCommune] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
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
        product_sku: order.product_sku || "",
        product_ref: order.product_ref || "PRD_10",
        quantity: order.quantity?.toString() || "0",
        price: order.price?.toString() || "0.0",
        discount: order.discount?.toString() || "0.0",
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
        address: data.address,
        wilaya: data.wilaya,
        commune: data.commune,
      },
      shipping_price: parseFloat(data.shipping_price),
      shipping_type: data.shipping_type,
      note: data.note,
      product_sku: data.product_sku,
      quantity: parseInt(data.quantity, 10),
      price: parseFloat(data.price),
      discount: parseFloat(data.discount),
      product_ref: data.product_ref,
    };

    editOrder(
      { orderData: { ...orderData }, id },
      {
        onSuccess: () => {
          navigate('/admin/orders');
        },
        onError: (error) => {
          console.error("Order update failed", error);
        },
      }
    );
  };

  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full lg:w-2/3">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">
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
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t('editOrder1.phone2Placeholder')}
                name="phone2"
                disabled={isEditing}
                register={register}
                errors={errors.phone2}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('editOrder1.addressPlaceholder')}
                name="address"
                disabled={isEditing}
                register={register}
                errors={errors.address}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <div className="w-full flex justify-center items-center my-2  rtl:text-right">
                <label htmlFor="wilaya" className="text-slate-800 dark:text-gray-100 w-3/5 px-2 text-left rtl:text-right">
                  {t('editOrder1.wilayaLabel')}
                </label>
                <select
                  name="wilaya"
                  value={selectedWilaya}
                  disabled={isEditing}
                  {...register("wilaya", { required: t('editOrder1.wilayaRequired') })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                  onChange={(event) => {
                    setSelectedWilaya(event.target.value);
                    const filteredCommunes = Communes.filter(commune => commune.wilaya_id === event.target.value);
                    setMyCommunes(filteredCommunes);
                    setSelectedCommune('');
                  }}
                >
                  <option value="" disabled>{t('editOrder1.chooseWilaya')}</option>
                  {Wilaya.map((wilaya, index) => (
                    <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={index} value={wilaya.code}>
                      {wilaya.nom}
                    </option>
                  ))}
                </select>
                {errors.wilaya && <p className="text-red-600">{errors.wilaya.message}</p>}
              </div>
              <div className="w-full flex justify-center items-center my-2 rtl:text-right">
                <label htmlFor="commune" className="text-slate-800 dark:text-gray-100 px-2 w-3/5 text-left rtl:text-right">
                  {t('editOrder1.communeLabel')}
                </label>
                <select
                  name="commune"
                  value={selectedCommune}
                  disabled={isEditing}
                  {...register("commune", { required: t('editOrder1.communeRequired') })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                  onChange={(event) => setSelectedCommune(event.target.value)}
                >
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700"  value="" disabled>{t('editOrder1.chooseCommune')}</option>
                  {myCommunes.map((commune, index) => (
                    <option  className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={index} value={commune.code}>
                      {commune.nom}
                    </option>
                  ))}
                </select>
                {errors.commune && <p className="text-red-600">{errors.commune.message}</p>}
              </div>
            </Row>
            <Row>
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
                placeholder={t('editOrder1.productRefPlaceholder')}
                name="product_ref"
                disabled={isEditing}
                register={register}
                errors={errors.product_ref}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="number"
                placeholder={t('editOrder1.quantityPlaceholder')}
                name="quantity"
                disabled={isEditing}
                register={register}
                errors={errors.quantity}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="number"
                placeholder={t('editOrder1.pricePlaceholder')}
                name="price"
                disabled={isEditing}
                register={register}
                errors={errors.price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="number"
                placeholder={t('editOrder1.discountPlaceholder')}
                name="discount"
                disabled={isEditing}
                register={register}
                errors={errors.discount}
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
            <div className="w-full text-left rtl:text-right flex justify-center items-center my-2">
              <label htmlFor="shipping_type" className="text-slate-800 dark:text-gray-100 px-2 text-left rtl:text-right w-3/5">
                {t('editOrder1.shippingTypeLabel')}
              </label>
              <select
                name="shipping_type"
                disabled={isEditing}
                {...register("shipping_type", { required: t('editOrder1.shippingTypeRequired') })}
                className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
              >
                <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700"  value="home">{t('editOrder1.shippingHome')}</option>
                <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="desk">{t('editOrder1.shippingPickup')}</option>
              </select>
              </div>
              {errors.shipping_type && <p className="text-red-600">{errors.shipping_type.message}</p>}
              <FormInput
                type="text"
                placeholder={t('editOrder1.notePlaceholder')}
                name="note"
                disabled={isEditing}
                register={register}
                errors={errors.note}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <div className=" my-6 w-1/2 mx-auto">
              <button disabled={isEditing}
               type="submit" className="py-3 px-6 rounded-md bg-indigo-600 text-white text-sm w-5/6">
              {isEditing ? t('editOrder1.saving') : t('editOrder1.save')}

              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditOrder;
