import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleOrder } from "../hooks/useOrder";

import { useTranslation } from 'react-i18next'; // Import useTranslation
import Row from "../components/shared/Row";
import { getWilayaName } from "../utils";

const ViewOrder = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleOrder(id);
  const { order } = data || {};
  const { t } = useTranslation(); // Initialize translation function


  if (isLoading) return <p>Loading...</p>;

  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full lg:w-2/3">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('view_order')}</h1>
          <Row>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('client_name')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.invoice_information.client}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left">{t('primary_phone')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.invoice_information.phone1}</p>
            </div>
          </Row>
          <Row>
            <div className="rtl:text-right w-full my-2 py-2 flex justify-center items-center px-2">
              <label className=" text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('secondary_phone')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.invoice_information.phone2}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('address')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.invoice_information.address}</p>
            </div>
          </Row>
          <Row>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('wilaya')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{getWilayaName(order.invoice_information.wilaya)}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('commune')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.invoice_information.commune}</p>
            </div>
          </Row>
          <Row>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('product_sku')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.product_sku}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('product_ref')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.product_ref}</p>
            </div>
          </Row>
          <Row>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('quantity')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.quantity}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('price')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.price}</p>
            </div>
          </Row>
          <Row>
          <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right ">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('discount')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order?.discount || 0}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('shipping_price')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.shipping_price}</p>
            </div>
          </Row>
          <Row>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('shipping_type')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.shipping_type}</p>
            </div>
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('attempt')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order?.attempts[order.attempts.length - 1]?.attempt || " "}</p>
            </div>
          </Row>
          <Row>
         
            <div className="w-full my-2 py-2 flex justify-center items-center px-2 rtl:text-right">
              <label className="text-slate-800 dark:text-gray-100 w-3/5 text-left rtl:text-right">{t('note')}</label>
              <p className="bg-white border rounded-md py-2 px-2 w-3/4 dark:bg-gray-700 dark:text-gray-200">{order.note || ""}</p>
            </div>
          </Row>
          {/* Repeat for other fields */}
        </div>
      </div>
    </Fragment>
  );
};

export default ViewOrder;