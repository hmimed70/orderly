import { useState } from "react";
import {  HiPencilAlt, HiEye } from "react-icons/hi";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "../shared/MyModal";
import EditPayment from "../../pages/Payments/EditPayments";
import ViewPayment from "../../pages/Payments/ViewPayment";
import { useAuth } from "../../hooks/useAuth";

const PaymentTable = ({
  payments,
  visibleColumns,
   // New prop
}) => {
  const { t } = useTranslation();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const { isAdmin} = useAuth();
  const handleEditClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsModalEditOpen(true);
  };

  const closeModalEdit = () => {
    setIsModalEditOpen(false);
    setSelectedPaymentId(null);
  };

  const handleViewClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsModalViewOpen(true);
  };

  const closeModalView = () => {
    setIsModalViewOpen(false);
    setSelectedPaymentId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {visibleColumns.nbr_payment && <th className="px-4 py-2">{t("ID")}</th>}
            {visibleColumns.user && <th className="px-4 py-2">{t("User")}</th>}
            {visibleColumns.amount && <th className="px-4 py-2">{t("Amount")}</th>}
            {visibleColumns.method && <th className="px-4 py-2">{t("Method")}</th>}
            {visibleColumns.statut && <th className="px-4 py-2">{t("Status")}</th>}
            {visibleColumns.paymentHandle && <th className="px-4 py-2">{t("Handled By")}</th>}
            {visibleColumns.createdAt && <th className="px-4 py-2">{t("Created At")}</th>}
            {visibleColumns.actions && <th className="px-4 py-2">{t("Actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment, index) => {
              // Determine row text color based on payment status
              const rowClass = (() => {
                switch (payment.status) {
                  case "pending":
                    return "text-yellow-600 dark:text-yellow-500";
                  case "refused":
                    return "text-red-600 dark:text-red-500";
                  case "accepted":
                    return "text-green-600 dark:text-green-500";
                  default:
                    return "text-gray-700 dark:text-gray-400";
                }
              })();

              return (
                <tr
                  key={payment._id}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${rowClass}`}
                >
                  {visibleColumns.nbr_payment && (
                    <td className="px-4 py-2">
                      {isAdmin ? payment.nbr_payment : index + 1}
                    </td>
                  )}
                  {visibleColumns.user && (
                    <td className="px-4 py-2">{payment.userId ? payment.userId.fullname : "N/A"}</td>
                  )}
                  {visibleColumns.amount && <td className="px-4 py-2">{payment.amount}</td>}
                  {visibleColumns.method && <td className="px-4 py-2">{payment.method}</td>}
                  {visibleColumns.statut && <td className="px-4 py-2">{payment.status}</td>}
                  {visibleColumns.paymentHandle && (
                    <td className="px-4 py-2">
                      {payment.paymentHandle ? payment.paymentHandle.fullname : "N/A"}
                    </td>
                  )}
                  {visibleColumns.createdAt && (
                    <td className="px-4 py-2">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="text-orange-600 hover:text-orange-800"
                        onClick={() => handleViewClick(payment._id)}
                      >
                        <HiEye className="text-2xl" />
                      </button>                   
                        {isAdmin && (             
                        <button
                        disabled={payment.status !== "pending"}
                        className={`text-blue-600 hover:text-blue-800 ${
                          payment.status !== "pending" && "opacity-50 cursor-not-allowed"
                          }`}
                        onClick={() => handleEditClick(payment._id)}
                        >
                        <HiPencilAlt className="text-2xl" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="100%" className="px-4 py-2 text-center">
                {t("No payments found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalEditOpen && (
        <Modal isVisible={isModalEditOpen} onClose={closeModalEdit}>
          <EditPayment id={selectedPaymentId} onClose={closeModalEdit} />
        </Modal>
      )}
      {isModalViewOpen && (
        <Modal isVisible={isModalViewOpen} onClose={closeModalView}>
          <ViewPayment id={selectedPaymentId} onClose={closeModalView} />
        </Modal>
      )}
    </div>
  );
};

PaymentTable.propTypes = {
  payments: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  onDeletePayment: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired, // Add the new prop
};

export default PaymentTable;
