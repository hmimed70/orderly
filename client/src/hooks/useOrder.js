import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { changeStatus, getOrderCountByStatusAdmin, getSingleOrder, newOrder, userStatistics, MoveToTrashs, getTrashOrders, recoverFromTrash } from "../services/OrderApi";
import { getAllOrders,clearFromTrash, getMyOrders ,getPendingOrders, editOrderData,deleteOrderFn,assignOrders,getOrderCountByStatusUser } from "../services/OrderApi";
import { useTranslation } from 'react-i18next';

export function useAdminOrder(page, limit, status, date, search) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders",page, limit, status, date,search],
    queryFn: () => getAllOrders(page, limit, status, date,search),
  });

  return { isLoading, error, data };
}
export function useMyOrder(page, limit, status,date, search) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders",page, limit, status, date,search],
    queryFn: () => getMyOrders(page, limit, status, date,search),
  });

  return { isLoading, error, data };
}

export function useClearTrash(){
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: clearTrashAdmin, isLoading: isDeleting } = useMutation({
    mutationFn: clearFromTrash,
    onSuccess: () => {
      toast.success(t("order.recover.recover"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isDeleting, clearTrashAdmin };
}

export function UseRecoverFromTrash(){
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: recoverMultipleOrder, isLoading: isRecovering } = useMutation({
    mutationFn: recoverFromTrash,
    onSuccess: () => {
      toast.success(t("order.recover.recover"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isRecovering, recoverMultipleOrder };
}
export function useTrashOrder (page, limit, status,date, search) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["orders",page, limit, status, date, search],
    queryFn: () => getTrashOrders(page, limit, status, date, search),
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

export function useDeleteMultipleOrder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: deleteMultipleOrder, isLoading: isDeletingsMultiple } = useMutation({
    mutationFn: MoveToTrashs,
    onSuccess: () => {
      toast.success(t("order.create.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isDeletingsMultiple, deleteMultipleOrder };
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

export const useChangeStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: changeStat, isLoading: isChangingStatus } = useMutation({
    mutationFn:( {status, orderId} ) => changeStatus(status, orderId),
    onSuccess: () => {
      toast.success(t("order.changeStatus.success"));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });
   return {changeStat, isChangingStatus}

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
