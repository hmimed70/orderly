import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/AuthApi";

const useAuth = () => {

  const { isLoading, data } = useQuery({
    queryKey: ["myauthuser"],
    queryFn: getCurrentUser,
    retry: false,
    
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
      if (err.response && err.response.status === 401) {
        // Attempt to refetch the user
        //refetch();
        
        // Redirect to the login page after refetch (if necessary)
      }
    },
  });

  return {
    user: data?.user,
    isLoading,
    isAdmin: data?.user?.role === "admin",
    isUser: data?.user?.role === "confirmatrice",
  };
};

export { useAuth };
