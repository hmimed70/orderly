import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserFn, editUserData, getAllUsers, getSingleUser, updatePassword, newUser, updateMe, logoutUser } from "../services/UserApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import t

export function useUser(page, limit, role) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["users", page, limit, role],
    queryFn: () => getAllUsers(page, limit, role),
  });
  
  return { isLoading, error, data };
}
export function useGetSingleUser(id) {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["users"], // Include page and limit in the query key
    queryFn: () => getSingleUser(id), // Pass page and limit to the fetch function
  });
  return { isLoading, error, data };
  
  }
export function useCreateUser() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { mutate: createUser, isLoading: isCreating } = useMutation({
    mutationFn: newUser,
    onSuccess: () => {
      toast.success(t('user.createSuccess')); // Use t to get the translation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.response.data.message || t('user.error')),
  });
  return { isCreating, createUser };
}

export function useDeleteUser() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { mutate: deleteUser, isLoading: isDeleting } = useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      toast.success(t('user.deleteSuccess')); // Use t to get the translation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.response.data.message || t('user.error')),
  });

  return { isDeleting, deleteUser };
}

export function useEditUser() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { mutate: editUser, isLoading: isEditing } = useMutation({
    mutationFn: ({ userData, id }) => editUserData({ ...userData }, id),
    onSuccess: () => {
      toast.success(t('user.editSuccess')); // Use t to get the translation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.response.data.message || t('user.error')),
  });

  return { isEditing, editUser };
}

export function useUpdateMe() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { mutate: editMe, isLoading: isEditing } = useMutation({
    mutationFn: (userData) => updateMe({ ...userData }),
    onSuccess: () => {
      toast.success(t('user.profileEditSuccess')); // Use t to get the translation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.response.data.message || t('user.error')),
  });

  return { isEditing, editMe };
}

export function useUpdatePassword() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: editPassword, isLoading: isEditing } = useMutation({
    mutationFn: (userData) => updatePassword({ ...userData }),
    onSuccess: () => {
      toast.success(t('user.passwordEditSuccess')); // Use t to get the translation
      queryClient.invalidateQueries({ queryKey: ["myauthuser"] });
    },
    onError: () => {
        
        toast.error("old password is incorrect");
    }
  });

  return { isEditing, editPassword };
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // Use t for translation

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      localStorage.clear();
      toast.success(t('user.logoutSuccess')); // Use t to get the translation
      queryClient.removeQueries();
      navigate('/login', { replace: true });
    },

    onError: (err) => toast.error(err.response.data.message || t('user.error')),
  });

  return { logout, isLoading };
}