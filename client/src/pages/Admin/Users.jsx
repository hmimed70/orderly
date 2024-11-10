import  { useEffect, useState } from "react";
import { useDeleteUser, useUser } from '../../hooks/useUser';
import UsersTable from "../../components/users/UserTable";
import Pagination from "../../components/shared/Pagination";
import RowsPerPageSelector from "../../components/shared/RowsPage";
import SearchBar from "../../components/shared/SearchBar";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import { NavLink } from "react-router-dom";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const UsersPage = () => {
  const { t } = useTranslation(); // Initialize translation function

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, data, error } = useUser(currentPage, rowsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteUser, isDeleting } = useDeleteUser();

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
    earnings: true,
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
  const filteredUsers = users.filter(user => (
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.state.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const totalUsers = searchTerm !== "" ? filteredUsers.length : usersCount;
  const totalPages = Math.ceil(totalUsers / rowsPerPage) || 1;

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
    <div>
      <h1 className="text-2xl font-bold">{t('usersPage.title')}</h1>
      <div className="flex flex-col lg:flex-row space-y-4 mt-4 justify-center items-center lg:justify-around">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center space-x-2">
          <RowsPerPageSelector rowsPerPage={rowsPerPage} handleRowsPerPageChange={handleRowsPerPageChange} usersCount={usersCount} />
        </div>
        <button className="py-3 px-6 rounded-md bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
          <NavLink to="/admin/users/create">{t('usersPage.addUser')}</NavLink>
        </button>
      </div>

      <UsersTable onDeleteUser={handleDeleteUser} users={filteredUsers} visibleColumns={visibleColumns} />
      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} totalOrders={totalUsers} ordersCount={usersCount} />
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
    </div>
  );
};

export default UsersPage;
