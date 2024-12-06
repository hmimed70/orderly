import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetUserPaymentHistory } from "../../hooks/usePayment";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import PaymentTable from "../../components/payments/paymentTable";
import Pagination from "../../components/shared/Pagination";
import CardStat from "../../components/orders/CardStat";
import UserFilter from "../../components/users/UserFilter";
import { useUser } from "../../hooks/useUser";
import MetaData from "../../components/MetaData";

const AdminPayment = () => {
  const { t } = useTranslation();
  const [selectedUserId, setSelectedUserId] = useState(null); // To hold the selected user ID
  const [selectedUser, setSelectedUser] = useState(null); // To hold the selected user
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch payment history
  const { data: adminPay, isLoading } = useGetUserPaymentHistory(
    currentPage,
    20,
    selectedUserId || null // Null for all payments if no user is selected
  );

  // Fetch user data for admin
  const { data: userData, isLoading: userLoading } = useUser(1, 1000, 'confirmatrice');
  const { users } = userData || {};

  const { payments = [], paymentsCount = 0, filteredPaymentsCount = 0 } = adminPay || {};

  // Local state for column visibility
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsPayment");
    return savedColumns
      ? JSON.parse(savedColumns)
      : {
          nbr_payment: true,
          user: true,
          paymentHandle: true,
          method: true,
          statut: true,
          amount: true,
          admin: true,
          createdAt: true,
          actions: true
        };
  });

  const toggleColumnVisibility = useCallback((column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  }, []);

  useEffect(() => {
    localStorage.setItem("visibleColumnsPayment", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Handle user change
  const handleUsersChange = (userId) => {
    setSelectedUserId(userId);
    const user = users?.find((user) => user._id === userId);
    setSelectedUser(user || null);
    setCurrentPage(1); // Reset to first page when user changes
  };

  if (isLoading || userLoading) return <p>{t("paymentsPage.loadingPayments")}</p>;
  // Calculate total amounts for cards
  const totalAvailable = selectedUser
    ? selectedUser.availableAmount
    : users.reduce((acc, user) => acc + (user.availableAmount || 0), 0);
  const totalPending = selectedUser
    ? selectedUser.pendingAmount
    : users.reduce((acc, user) => acc + (user.pendingAmount || 0), 0);
  const totalPaid = selectedUser
    ? selectedUser.paidAmount
    : users.reduce((acc, user) => acc + (user.paidAmount || 0), 0);

  const totalPayments = filteredPaymentsCount || 0;
  const totalPages = Math.ceil(totalPayments / 20) || 1;


  return (
    <>
     <MetaData  title={t("titles.payments")}/>
    <div>
      <h1 className="text-2xl font-bold">{t("paymentsPage.title")}</h1>
      <div className="bg-white dark:bg-gray-800 my-2 p-2 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CardStat
            statutColor="#ea810a"
            statutText={selectedUser ? t("usersTable.availableAmount") :  t("paymentsPage.allAvailableAmount")}
            statut={totalAvailable}
            currency={t("currency")}

          />
          <CardStat
            statutColor="#d7d7d8"
            statutText={selectedUser ? t("usersTable.pendingAmount") :  t("paymentsPage.allPendingAmount")}
            statut={totalPending}
            currency={t("currency")}

          />
          <CardStat
            statutColor="#3b82f6"
            statutText={selectedUser ? t("usersTable.paidAmount") :  t("paymentsPage.allPaidAmount") }
            statut={totalPaid}
            currency={t("currency")}
          />
        </div>

        <div className="flex justify-end items-center gap-x-4">
          <UserFilter users={users} handleUserChange={handleUsersChange} />
        </div>
      </div>

      <PaymentTable
        payments={payments}
        visibleColumns={visibleColumns}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
        totalOrders={totalPayments}
        text={t("payments")}

        ordersCount={paymentsCount}
      />

      <ColumnVisibilityToggle
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
      />
    </div>
    </>

  );
};

export default AdminPayment;
