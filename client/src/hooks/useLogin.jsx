import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as apiLogin } from '../services/AuthApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => apiLogin({ email, password }),


    onSuccess: (user) => {
      queryClient.setQueryData(['myauthuser'], user.user);
        if(user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        }
        if(user.role === 'confirmatrice') {
          navigate('/dashboard', { replace: true });
        }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Provided email or password are incorrect');
    },
  });

  return { login, isLoading };
}
