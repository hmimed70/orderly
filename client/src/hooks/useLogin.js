import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as apiLogin } from '../services/AuthApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => apiLogin({ email, password }),

    onSuccess: (response) => {
      const { token, user } = response; // Destructure token and user from the response
      if (token) {
        localStorage.setItem('token', token);
        queryClient.setQueryData(['myauthuser'], user);

        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (user.role === 'confirmatrice') {
          navigate('/dashboard', { replace: true });
        }
      } else {
        console.error('Token is missing in the response');
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Provided email or password are incorrect');
    },
  });

  return { login, isLoading };
}
