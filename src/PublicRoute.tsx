import React from 'react';
import { Navigate, Outlet, NavigateProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const PublicRoute: React.FC<NavigateProps> = (props) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.exp !== null && state.auth.exp > Date.now(),
  );

  if (isAuthenticated) {
    return <Navigate {...props} to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
