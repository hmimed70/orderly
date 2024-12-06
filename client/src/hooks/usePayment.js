import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { getMyPaymentHistory, getUserPaymentHistory, handlePayment, requestPayment, getSinglePayment } from "../services/PaymentApi";

export function useGetMyPaymentHistory() {
    const {
      isLoading,
      data,
      error,
    } = useQuery({
      queryKey: ["payments"],
      queryFn: () => getMyPaymentHistory(),
    });
  
    return { isLoading, error, data };
  }
export const useGetSinglePayment = (id) => {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getSinglePayment(id),
  });
  return { isLoading, error, data };

}

  export function useGetUserPaymentHistory(page, limit, id) {
    const {
      isLoading,
      data,
      error,
    } = useQuery({
      queryKey: ["payments", page, limit, id],
      queryFn: () => getUserPaymentHistory(page, limit, id),
    });
  
    return { isLoading, error, data };
  }

  export function useRequestPayment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { mutate: createRequest, isLoading: isCreating } = useMutation({
      mutationFn: requestPayment,

      onSuccess: () => {
        toast.success(t("payment.create.success"));
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["myauthuser"] });
      },
      onError: (err) => toast.error(err.response.data.message),
    });
  
    return { isCreating, createRequest };
  }

  export function useHandlePayment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { mutate: paymentHandling, isLoading: isEditing } = useMutation({
      mutationFn: ({ paymentData, id }) => handlePayment({...paymentData}, id),
      onSuccess: () => {
        toast.success(t("payment.edit.success"));
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });

      },
      onError: (err) => toast.error(err.response.data.message),
    });
  
    return { isEditing, paymentHandling };
  }