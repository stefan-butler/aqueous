import { RootState } from '../redux/store';
import { logoutUser } from '../redux/actions/authActions';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import '../component-css/navBar.css'
import Logo from './logo';

function Navbar () {
  const { user, isResponder } = useAppSelector((state: RootState) => state.auth);
  // console.log(user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout () {
    dispatch(logoutUser());
    navigate('/')
  };

  function handleLogin () {
    navigate('/login')
  }

  return (
    <nav className="navBarContainer">
      <Logo/>
      <div className="navigationOptions">
        <div className='navOption'>
          <Link to="/">HOME</Link>
        </div>

        {user && !isResponder && (
          <div className='navOption'>
            <Link to="/report">REPORT</Link>
          </div>
        )}
     
        {user && isResponder && (
          <div className='navOption'>
            <Link to="/incidents">INCIDENTS</Link>
          </div>
        )}
      </div>
      <div className='login'>
      {user ?
          <button
            className='loginButton'
            onClick={handleLogout}
          >
            LOG OUT
          </button>
          :
          <button className='loginButton'
            onClick={handleLogin}
          >
            LOG IN
          </button>
      }
      </div>
    </nav>
  )
}

export default Navbar;