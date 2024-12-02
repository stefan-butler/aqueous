import { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {fetchGlobalChats} from "../redux/slices/chatSlice";
import '../component-css/responderPage.css'

function UserPage () {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isResponder, responderType } = useSelector((state: RootState) => state.auth);
  const chats = useSelector((state: RootState) => state.chat)
  console.log(user.id)

 
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