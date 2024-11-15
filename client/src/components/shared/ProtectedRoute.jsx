
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from 'prop-types';
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children, forAdmin }) {
  const navigate = useNavigate();
  const { isLoading, isAdmin, isUser } = useAuth();
  useEffect(() => {
    if(!isLoading) {
      if(!isAdmin && !isUser) {
        navigate('/login', { replace: true });
      }
       if (isUser && forAdmin) {

        navigate('/login', { replace: true });
      }
    }
     
  }, [isLoading, isAdmin, isUser, navigate, forAdmin]);

  // Show a spinner while loading
  if (isLoading) {
    return (
      <div className="flex justify-center py-10 h-screen bg-grey">
        <Spinner />
      </div>
    );
  }

  // Render children if the user has appropriate access
    return children;
  }
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    forAdmin: PropTypes.bool
  }
export default ProtectedRoute;
