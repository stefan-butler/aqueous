import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from './redux/hooks';

function ResponderRoute () {
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