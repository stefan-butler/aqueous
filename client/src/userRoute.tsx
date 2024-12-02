import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from './redux/hooks';

function UserRoute () {
  const {user, isResponder, token} = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!token) {
    return <Navigate to="/unauthorized" />;
  }

  if (!isResponder) {
    return <Outlet />;
  } 
}

export default UserRoute;