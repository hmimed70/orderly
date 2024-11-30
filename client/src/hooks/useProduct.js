import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { deleteProductFn, editProductData, getAllProducts, getSingleProduct, newProduct } from "../services/ProductApi";



export function useProducts(page, limit, date, keyword) {
    const {
      isLoading,
      data,
      error,
    } = useQuery({
      queryKey: ["products",page, limit, date, keyword],
      queryFn: () => getAllProducts(page, limit, date, keyword),
    });
  
    return { isLoading, error, data };
  }

export function useGetSingleProduct(id) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getSingleProduct(id),
  });

  return { isLoading, error, data };
}



export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { isLoading: isDeleting, mutate: deleteProduct } = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: () => {
      toast.success(t("productss.delete.success"));
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isDeleting, deleteProduct };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: createProduct, isLoading: isCreating } = useMutation({
    mutationFn: newProduct,
    onSuccess: () => {
      toast.success(t("productss.create.success"));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isCreating, createProduct };
}
export function useEditProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: editProduct, isLoading: isEditing } = useMutation({
    mutationFn: ({ productData, id }) => editProductData({...productData}, id),
    onSuccess: () => {
      toast.success(t("productss.edit.success"));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isEditing, editProduct };
}
