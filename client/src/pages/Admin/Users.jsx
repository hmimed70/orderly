import  { useEffect, useState } from "react";
import { useDeleteUser, useUser } from '../../hooks/useUser';
import UsersTable from "../../components/users/UserTable";
import Pagination from "../../components/shared/Pagination";
import RowsPerPageSelector from "../../components/shared/RowsPage";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import AddUser from "./AddUser";
import MyModal from '../../components/shared/MyModal';
import MetaData from "../../components/MetaData";
const UsersPage = () => {
  const { t } = useTranslation(); // Initialize translation function

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, data, error } = useUser(currentPage, rowsPerPage);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteUser, isDeleting } = useDeleteUser();
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Retrieve saved column visibility from localStorage, or use default values if not available
    const savedColumns = localStorage.getItem("visibleColumnsUsers");
    return savedColumns ? JSON.parse(savedColumns) : {
    id: true,
    fullname: true,
    username: true,
    email: true,
    gender: true,
    state: true,
    role: true,
    confirmed_order: true,
    order_Price: true,
    paidAmount: true,
    availableAmount: true,
    pendingAmount: true,
    handleLimit: true,
    createdAt: false,
    actions: true,
    }
  });
  useEffect(() => {
    localStorage.setItem("visibleColumnsUsers", JSON.stringify(visibleColumns));
  }, [visibleColumns]);


  if (isLoading) return <p>{t('usersPage.loading')}</p>;
  if (error) return <p>{t('usersPage.error', { message: error.message })}</p>;

  const { usersCount, users } = data;


  const totalUsers =  usersCount;
  const totalPages = Math.ceil(totalUsers / rowsPerPage) || 1;

  const handleAddClick = () => {
    setIsModalAddOpen(true);
  };

  const closeModalAdd = () => {
    setIsModalAddOpen(false);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <>
     <MetaData title={t('titles.users')} />
    <div>
    <div className="bg-white dark:bg-gray-800 my-2 p-2 rounded-md">

      <div className="flex flex-col lg:flex-row space-y-4 mt-4 justify-center items-center lg:justify-around">
        <div className="flex items-center space-x-2">
          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={handleRowsPerPageChange} usersCount={usersCount} />
        </div>
        <button onClick={handleAddClick} className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
          {t('usersPage.addUser')}
        </button>
      </div>
      </div>
      <UsersTable onDeleteUser={handleDeleteUser} users={users} visibleColumns={visibleColumns} />
      <Pagination currentPage={currentPage} 
        totalPages={totalPages} 
        handlePageChange={setCurrentPage} 
        totalOrders={totalUsers} 
        ordersCount={usersCount}
        text={t("users")}

       />
      <ColumnVisibilityToggle visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />

      {isModalOpen && (
        <ConfirmationModal 
          disable={isDeleting}
          message={t('usersPage.deleteConfirmation')}
          onConfirm={() => {
            deleteUser(userToDelete);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
          {isModalAddOpen && 
                <MyModal isVisible={isModalAddOpen} onClose={closeModalAdd}>
          <AddUser onClose={closeModalAdd} />
          </MyModal>
          }

    </div>
   </>
  );
};

export default UsersPage;
