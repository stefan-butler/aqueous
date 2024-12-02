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
          <div className='loginContainer'>
          <p>Welcome {user.firstName}</p>
          <img src='https://cdn-icons-png.flaticon.com/128/3899/3899618.png' alt='Profile icon' className='profileIcon'/>
          <button
            className='loginLogoutButton'
            onClick={handleLogout}
          >
            LOG OUT
          </button>
          </div>
          :
          <div>
          <button className='loginLogoutButton'
            onClick={handleLogin}
          >
            LOG IN
          </button>
          </div>
      }
      </div>
    </nav>
  )
}

export default Navbar;