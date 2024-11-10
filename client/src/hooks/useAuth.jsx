import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/AuthApi";

const useAuth = () => {

  const { isLoading, data } = useQuery({
    queryKey: ["myauthuser"],
    queryFn: getCurrentUser,
    retry: false, 
    onError: (err) => {
      if (err.response && err.response.status === 401) {
        //navigate('/login', { replace: true });
      }
    },
  });
  return {
    user: data?.user,
    isLoading,
    isAdmin: data?.user?.role === "admin",
    isUser: data?.user?.role === "confirmatrice",
  };
}
export { useAuth}