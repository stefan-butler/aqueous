import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import '../component-css/responderPage.css'

function UserPage () {
  const { user, isResponder, responderType } = useAppSelector((state: RootState) => state.auth);
  console.log(user)
  return (
    <div className='pageContainer'>
      <div className='profileInfo'>
        <div className='profilePicture'>
          <img src='https://cdn-icons-png.flaticon.com/128/3899/3899618.png' alt='Profile Picture' className='profilePicture' />
        </div>
        <div className='fullName'>
          <p>{user?.firstName} {user?.lastName}</p>
        </div>
        <div className='contactDetails'>
          <p><strong>Email</strong>: {user?.email}</p>
        </div>
        {isResponder && 
        <div className='responderType'>
          <p><strong>Responder</strong>: {responderType}</p>
        </div>}
      </div>

      <div className='chatContainer'>

      </div>
    </div>
  )
}

export default UserPage