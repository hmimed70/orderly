import { useState, useEffect } from "react";
import { useAdminOrder, useChangeStatus, useDeleteOrder, useDeleteMultipleOrder } from '../../hooks/useOrder';
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils";

const useOrderPage = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsOrder");
    return savedColumns ? JSON.parse(savedColumns) : {
      id: true, client: true, product_sku: true, wilaya: true, commune: true,
      confirmatrice: true, price: false, status: true, total: true, attempt: true,
      phone: true, actions: true, cancelledAt: false,
    };
  });

  const { isLoading, data, error } = useAdminOrder(currentPage, rowsPerPage, status, date);
  const { deleteOrder, isDeleting } = useDeleteOrder();
  const { deleteMultipleOrder, isDeletingMultiple } = useDeleteMultipleOrder();
  const { changeStat, isChangingStatus } = useChangeStatus();
  const queryClient = useQueryClient();
  const socket = io(SOCKET_URL);

  useEffect(() => {
    socket.on("newOrder", () => queryClient.invalidateQueries("orders"));
    return () => socket.off("newOrder");
  }, [queryClient, socket]);

  useEffect(() => {
    localStorage.setItem("visibleColumnsOrder", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter(id => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === data?.orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(data.orders.map(order => order._id));
    }
  };

  const handleDeleteSelected = () => deleteMultipleOrder({ orderIds: selectedOrders });
  const handleChangeStatus = (status, orderId) => changeStat({ status, orderId });

  return {
    isLoading,
    error,
    ordersData: data,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    status,
    setStatus,
    date,
    setDate,
    searchTerm,
    setSearchTerm,
    visibleColumns,
    setVisibleColumns,
    selectedOrders,
    handleOrderSelection,
    handleSelectAll,
    handleDeleteSelected,
    handleChangeStatus,
    isDeleting,
    isChangingStatus,
  };
};

export default useOrderPage;
