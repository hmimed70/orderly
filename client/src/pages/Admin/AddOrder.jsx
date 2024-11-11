import { Fragment, useState } from "react";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderSchema } from "../../schema/index";
import Wilaya from "../../data/Wilaya.json";
import Communes from "../../data/Communes.json";

import OrderSummary from "../../components/shared/Summary"; 
import { useCreateOrder } from "../../hooks/useOrder";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Row from "../../components/shared/Row";

const AddOrder = () => {
  const { t } = useTranslation(); // Initialize translation hook

  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [myCommunes, setMyCommunes] = useState([]);
  const { isCreating, createOrder } = useCreateOrder();
  const navigate = useNavigate();
  const [selectedCommune, setSelectedCommune] = useState("");

  const { register, handleSubmit, reset , watch, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
  });
  function onSubmit(data) {
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
        discount: parseFloat(data.discount) || 0,
        status: "pending",
        product_ref: data.product_ref,
      };
      createOrder(
        { ...orderData },
        {
          onSuccess: () => {
            reset();
            navigate('/admin/orders');
          },
        }
      );
  };

  const shippingPrice = watch("shipping_price") || 0;
  const discount = watch("discount") || 0;
  const quantity = watch("quantity") || 0;
  const price = watch("price") || 0;
  const client = watch("client") || '';

  const totalPrice = ((Number(quantity) * Number(price)) + Number(shippingPrice)) - (Number(quantity) * Number(price) * (Number(discount) / 100));
  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full lg:w-2/3">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('addOrder.addOrderBtn')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Row>
              <FormInput
                type="text"
                placeholder={t('addOrder.client')}
                name="client"
                disabled={isCreating}
                register={register}
                errors={errors.client}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('addOrder.phone1')}
                name="phone1"
                disabled={isCreating}
                register={register}
                errors={errors.phone1}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t('addOrder.phone2')}
                name="phone2"
                disabled={isCreating}
                register={register}
                errors={errors.phone2}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('addOrder.address')}
                name="address"
                disabled={isCreating}
                register={register}
                errors={errors.address}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>

            {/* Wilaya and Commune Fields */}
            <Row>
              <div className=" text-left rtl:text-right w-full flex justify-center items-center  my-2">
                <label htmlFor="wilaya" className=" text-left rtl:text-right text-slate-800 dark:text-gray-100 w-3/5 px-2">{t('addOrder.wilaya')}</label>
                <select
                  name="wilaya"
                  value={selectedWilaya}
                  disabled={isCreating}
                  {...register("wilaya", { required: "Wilaya is required" })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                  onChange={(event) => {
                    setSelectedWilaya(event.target.value);
                    const filteredCommunes = Communes.filter(commune => commune.wilaya_id === event.target.value);
                    setMyCommunes(filteredCommunes);
                    setSelectedCommune('');
                  }}
                >
                  <option value="" disabled>{t('addOrder.wilaya')}</option>
                  {Wilaya.map((wilaya) => (
                    <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={wilaya.code} value={wilaya.code}>
                      {wilaya.nom}
                    </option>
                  ))}
                </select>
                {errors.wilaya && <p className="text-red-600">{errors.wilaya.message}</p>}
              </div>

              <div className="text-left rtl:text-right w-full flex justify-center items-center my-2">
  <label
    htmlFor="commune"
    className="text-slate-800 dark:text-gray-100 px-2 w-3/5 text-left rtl:text-right"
  >
    {t('addOrder.commune')}
  </label>
  <select
    disabled={isCreating}
    name="commune"
    value={selectedCommune}
    {...register("commune", { required: "Commune is required" })}
    className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200 rtl:text-right"
    onChange={(event) => setSelectedCommune(event.target.value)}
  >
    <option value="" disabled className="dark:bg-gray-700 dark:text-gray-200  text-gray-700">
      {t('addOrder.commune')}
    </option>
    {myCommunes.map((commune) => (
      <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={commune.code} value={commune.code}>
        {commune.nom}
      </option>
    ))}
  </select>
  {errors.commune && (
    <p className="text-red-600">{errors.commune.message}</p>
  )}
</div>

            </Row>

            {/* Other Inputs */}
            <Row>
              <FormInput
                disabled={isCreating}
                type="text"
                placeholder={t('addOrder.productSKU')}
                name="product_sku"
                register={register}
                errors={errors.product_sku}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                disabled={isCreating}
                type="text"
                placeholder={t('addOrder.productRef')}
                name="product_ref"
                register={register}
                errors={errors.product_ref}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                disabled={isCreating}
                type="number"
                placeholder={t('addOrder.quantity')}
                name="quantity"
                register={register}
                errors={errors.quantity}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                disabled={isCreating}
                type="number"
                placeholder={t('addOrder.price')}
                name="price"
                register={register}
                errors={errors.price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                disabled={isCreating}
                type="number"
                placeholder={t('addOrder.discount')}
                name="discount"
                register={register}
                errors={errors.discount}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                disabled={isCreating}
                type="number"
                placeholder={t('addOrder.shippingPrice')}
                name="shipping_price"
                register={register}
                errors={errors.shipping_price}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
            <div className="text-left rtl:text-right w-full flex justify-center items-center my-2">
  <label htmlFor="shipping_type" className="text-slate-800 dark:text-gray-100 w-3/5 px-2">{t('addOrder.shippingType')}</label>
  <div className="flex justify-start items-center w-4/5">
    {/* Desk option */}
    <div className="flex items-center mx-2">
      <input
        type="radio"
        id="desk"
        name="shipping_type"
        value="desk"
        disabled={isCreating}
        {...register("shipping_type", { required: "Shipping type is required" })}
        className="form-radio text-primary dark:bg-gray-700 dark:text-gray-200"
      />
      <label htmlFor="desk" className=" px-2 text-slate-800 dark:text-gray-200">{t('addOrder.desk')}</label>
    </div>

    {/* Home option */}
    <div className="flex items-center mx-2">
      <input
        type="radio"
        id="home"
        name="shipping_type"
        value="home"
        disabled={isCreating}
        {...register("shipping_type", { required: "Shipping type is required" })}
        className="px-1 form-radio text-primary dark:bg-gray-700 dark:text-gray-200"
      />
      <label htmlFor="home" className=" px-2 text-slate-800 dark:text-gray-200">{t('addOrder.home')}</label>
    </div>
  </div>
  {errors.shipping_type && (
    <p className="text-red-600">{errors.shipping_type.message}</p>
  )}
</div>

              <FormInput
                disabled={isCreating}
                type="text"
                placeholder={t('addOrder.note')}
                name="note"
                register={register}
                errors={errors.note}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>

            {/* Add other fields similarly using t() */}
            
            <div className="flex justify-center my-6">
              <button type="submit" className="py-3 px-6 rounded-md bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                {t('addOrder.addOrderBtn')}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-container  m-8 md:m-2 rounded-lg p-4 w-full md:w-1/2 lg:w-1/3 self-center">
          <OrderSummary  
            totalPrice={totalPrice}
            client={client}
            quantity={quantity}
            price={price}
            shippingPrice={shippingPrice}
            discount={discount}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default AddOrder;
