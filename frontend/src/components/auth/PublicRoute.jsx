import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';

const PublicRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return user ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicRoute;
