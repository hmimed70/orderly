import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {  useGetUserPaymentHistory } from "../../hooks/usePayment";
import { useAuth } from "../../hooks/useAuth";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import PaymentTable from "../../components/payments/paymentTable";
import Pagination from "../../components/shared/Pagination";
import CardStat from "../../components/orders/CardStat";
import Modal from "../../components/shared/MyModal";
import AddPayment from "./AddPayment";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/MetaData";

const Payments = () => {
  const { t } = useTranslation();
  const {user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null); 
 const [currentPage, setCurrentPage] = useState(1);

const navigate = useNavigate();
const { data, isLoading } = useGetUserPaymentHistory(
  currentPage,
  20);
  const { payments, paymentsCount, filteredPaymentsCount } = data || {};

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsPayment");
    return savedColumns
      ? JSON.parse(savedColumns)
      : {
          nbr_payment: true,
          user: true,
          receipt: true,
          method: true,
          amount: true,
          admin: true,
          actions: true,

          createdAt: true,
        };
  });

  const closeModalAdd = () => setIsModalAddOpen(false);
  const handleAddClick = () => setIsModalAddOpen(true);
  const toggleColumnVisibility = useCallback((column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  }, []);

  useEffect(() => {
    localStorage.setItem("visibleColumnsPayment", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    if (user.role === "confirmatrice") {
      setSelectedUser(user); 
    }else {
      navigate('/admin/payment', {replace: true})
    }
  }, [user, navigate]);



  const totalPayments = filteredPaymentsCount || 0;
  const totalPages = Math.ceil(totalPayments / 20) || 1;
  if (isLoading ) return <p>{t("paymentsPage.loadingPayments")}</p>;

  return (
    <>
    <MetaData title={t('titles.payments')} />
    <div>
      <h1 className="text-2xl font-bold">{t("paymentsPage.title")}</h1>
      <div className="bg-white dark:bg-gray-800 my-2 p-2 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CardStat
            statutColor="#ea810a"
            statutText={t('usersTable.availableAmount')}
            statut={selectedUser?.availableAmount || 0}
            currency={t("currency")}
          />
          <CardStat
            statutColor="#d7d7d8"
            statutText={t('usersTable.pendingAmount')}
            statut={selectedUser?.pendingAmount || 0}
            currency={t("currency")}

          />
          <CardStat
            statutColor="#3b82f6"
            statutText={t('usersTable.paidAmount')}
            statut={selectedUser?.paidAmount || 0}
            currency={t("currency")}

          />
        </div>

        <div className="flex justify-end items-center gap-x-4">
          { selectedUser?.availableAmount > 0 &&
            <button
              type="button"
              onClick={handleAddClick}
              className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              {t('paymentsPage.addPayment')}
            </button>
}
        </div>
      </div>

      <PaymentTable payments={payments} visibleColumns={visibleColumns} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
        totalOrders={totalPayments}
        ordersCount={paymentsCount}
        text={t("payments")}
      />

      <ColumnVisibilityToggle
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
      />

      {isModalAddOpen && (
        <Modal isVisible={isModalAddOpen} onClose={closeModalAdd}>
          <AddPayment onClose={closeModalAdd} />
        </Modal>
      )}
    </div>
  </>
  );
};

export default Payments;
