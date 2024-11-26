import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from './redux/hooks';

const ResponderRoute: React.FC = () => {
  const { user, isResponder } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isResponder) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ResponderRoute;