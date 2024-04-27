import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';

const PublicRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  // TODO: 画面切り替え時のちらつきを抑える
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return user ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicRoute;
