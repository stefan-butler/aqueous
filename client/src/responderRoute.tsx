import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from './redux/hooks';

function ResponderRoute () {
  const { user, isResponder, token } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!token) {
    return <Navigate to="/unauthorized" />;
  }

  if (isResponder) {
    return <Outlet />;
  } else {
    return <h1>hello world</h1>
  }

};

export default ResponderRoute;