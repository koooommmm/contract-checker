import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';

const PrivateRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return user ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
