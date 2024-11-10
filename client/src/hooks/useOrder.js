import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { editOrderDataUser, getOrderCountByStatusAdmin, getSingleOrder, getSingleOrderUser, newOrder, userStatistics } from "../services/OrderApi";
import { getAllOrders, getMyOrders ,getPendingOrders, editOrderData,deleteOrderFn,assignOrders, confirmOrder, cancelOrder,getOrderCountByStatusUser } from "../services/OrderApi";
import { useTranslation } from 'react-i18next';

export function useAdminOrder(page, limit, status, date) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders",page, limit, status, date],
    queryFn: () => getAllOrders(page, limit, status, date),
  });

  return { isLoading, error, data };
}

export function useMyOrder(page, limit, status,date) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders",page, limit, status, date],
    queryFn: () => getMyOrders(page, limit, status, date),
  });

  return { isLoading, error, data };
}

export function useOrdersPending(page, limit) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders",page, limit],
    queryFn: () => getPendingOrders(page, limit),
  });

  return { isLoading, error, data };
}

export function useGetSingleOrder(id) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getSingleOrder(id),
  });

  return { isLoading, error, data };
}

export function useGetSingleOrderUser(id) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getSingleOrderUser(id),
  });

  return { isLoading, error, data };
}

export function useGetOrderCountsAdmin() {
  const { isLoading, data: dataCount, error } = useQuery({
    queryKey: ["orderCounts"],
    queryFn: getOrderCountByStatusAdmin,
    staleTime: 1 * 60 * 1000, // Cache for 1 minutes to improve performance
  });

  return { isLoading, error, dataCount };
}

export function useGetOrderCountsUser() {
  const { isLoading, data: dataCount, error } = useQuery({
    queryKey: ["orderCountsUser"],
    queryFn: getOrderCountByStatusUser,
  });

  return { isLoading, error, dataCount };
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { isLoading: isDeleting, mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrderFn,
    onSuccess: () => {
      toast.success(t("order.delete.success"));
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isDeleting, deleteOrder };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: createOrder, isLoading: isCreating } = useMutation({
    mutationFn: newOrder,
    onSuccess: () => {
      toast.success(t("order.create.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isCreating, createOrder };
}

export function useEditOrder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: editOrder, isLoading: isEditing } = useMutation({
    mutationFn: ({ orderData, id }) => editOrderData({...orderData}, id),
    onSuccess: () => {
      toast.success(t("order.edit.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isEditing, editOrder };
}

export function useEditOrderUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: editOrderUser, isLoading: isEditing } = useMutation({
    mutationFn: ({ myorder, id }) => editOrderDataUser(myorder, id),
    onSuccess: () => {
      toast.success(t("order.edit.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isEditing, editOrderUser };
}

export function useAssignOrders() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: assignOrder, isLoading: isAssigning } = useMutation({
    mutationFn: () => assignOrders(),
    onSuccess: () => {
      toast.success(t("order.assign.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isAssigning, assignOrder };
}

export function useCancelOrder(id) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: cancelOrd, isLoading: isAssigning } = useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: () => {
      toast.success(t("order.cancel.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isAssigning, cancelOrd };
}

export function useConfirmOrder(id) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: confirmOrd, isLoading: isAssigning } = useMutation({
    mutationFn: (id) => confirmOrder(id),
    onSuccess: () => {
      toast.success(t("order.confirm.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isAssigning, confirmOrd };
}

export function useGetUserStatistics(date) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["userstatistics", date],
    queryFn: () => userStatistics(date),
  });

  return { isLoading, error, data };
}
