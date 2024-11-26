import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logoutUser } from '../redux/actions/authActions';
import { Link, useNavigate } from 'react-router';

function Navbar () {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout () {
    dispatch(logoutUser());
  };

  function handleLogin () {
    navigate('/login')
  }

  return (
    <nav className="flex bg-dark text-gray-200 p-4 items-center justify-between">
          <h1 className="text-xl font-bold mx-5">AQUEOUS</h1>
      <ul className="flex mr-auto">
        <li className="mx-4">
          <Link to="/">HOME</Link>
        </li>
         <li className="mx-4">
         <Link to="/report">REPORT</Link>
       </li> 
        <li className="mx-4">
        <Link to="/incidents">INCIDENTS</Link>
      </li>
        <li className="mx-4">
          <Link to="/chat">CHAT</Link>
        </li>
      </ul>
        {user ?
          <button
            className="bg-light text-dark p-2 rounded-lg shadow-emerald-50 "
            onClick={handleLogout}
          >
            LOG OUT
          </button>
          :
          <button
            className="bg-light text-dark p-2 rounded-lg shadow-emerald-50 "
            onClick={handleLogin}
          >
            LOG IN
          </button>

        
      }
    </nav>
  )
}

export default Navbar;