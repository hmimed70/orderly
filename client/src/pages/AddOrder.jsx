import { Fragment, useState } from "react";
import FormInput from "../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderSchema } from "../schema/index";
import Wilaya from "../data/Wilaya.json";
import Communes from "../data/Communes.json";

import OrderSummary from "../components/shared/Summary"; 
import { useCreateOrder } from "../hooks/useOrder";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Row from "../components/shared/Row";
import SelectInput from "../components/shared/SelectInput";
import RadioGroup from "../components/shared/RadioGroup";
import TextArea from "../components/shared/TextArea";
import { getWilayaName } from "../utils";
import { HiBuildingOffice } from "react-icons/hi2";
import { HiOutlineHome } from "react-icons/hi";

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
          wilaya: data.wilaya,
          commune: data.commune,
        },
        shipping_price: parseFloat(data.shipping_price), 
        shipping_type: data.shipping_type, 
        note: data.note,
        product_sku: data.product_sku,
        quantity: parseInt(data.quantity, 10),
        price: parseFloat(data.price), 
        status: "pending",
        product_name: data.product_name,
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
  const quantity = watch("quantity") || 0;
  const price = watch("price") || 0;
  const client = watch("client") || '';

  const totalPrice = (Number(quantity) * Number(price)) + Number(shippingPrice);
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
            </Row>

            {/* Wilaya and Commune Fields */}
            <Row>

            <SelectInput label={t('addOrder.wilaya')} name="wilaya" value={selectedWilaya} 
               disabled={isCreating} register={register} errors={errors.wilaya} 
               onChange={(event) =>   { setSelectedWilaya(event.target.value)
                const filteredCommunes = Communes.filter(commune => commune.wilaya_id === event.target.value);
                setMyCommunes(filteredCommunes);
                setSelectedCommune('');} }>
                    <option value="" disabled>{t('addOrder.wilaya')}</option>
                      {Wilaya.map((wilaya) => (
                      <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={wilaya.code} value={wilaya.code}>
                        {wilaya.nom}
                      </option>
                   ))}
            </SelectInput>
 
            <SelectInput label={t('addOrder.commune')} name="commune" value={selectedCommune} disabled={isCreating} register={register} errors={errors.commune} onChange={(event) => setSelectedCommune(event.target.value)}>
            <option value="" disabled className="dark:bg-gray-700 dark:text-gray-200  text-gray-700">
              {t('addOrder.commune')}
            </option>
            {myCommunes.map((commune) => (
              <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" key={commune.code} value={commune.code}>
                {commune.nom}
              </option>
                  ))}
            </SelectInput>
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
                placeholder={t('addOrder.productName')}
                name="product_name"
                register={register}
                errors={errors.product_name}
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
                placeholder={t('addOrder.shippingPrice')}
                name="shipping_price"
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
              disabled={isCreating}
            />
            <TextArea name="note" placeholder={t('addOrder.note')} 
             register={register} errors={errors.note} disabled={isCreating} />

            </Row>
            
            <div className="flex justify-center my-6">
              <button type="submit" className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
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
       shippingType={watch("shipping_type")}
       wilaya={selectedWilaya ? getWilayaName(selectedWilaya) : "Unknown"}
       commune={selectedCommune}
       phone1={watch("phone1")}
       phone2={watch("phone2")}
       productSku={watch("product_sku")}
       productName={watch("product_name")}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default AddOrder;
