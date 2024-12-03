import { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {fetchGlobalChats} from "../redux/slices/chatSlice";
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../component-css/responderPage.css'

function UserPage () {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isResponder, responderType } = useSelector((state: RootState) => state.auth);
  const chats = useSelector((state: RootState) => state.chat)
  console.log(chats.list)

  useEffect(() => {
    dispatch(fetchGlobalChats(user?.id))
  }, [])

  function dateTimeDisplay (chatDate) {
    const date =  format(new Date(chatDate), 'do, MMM yyyy')
    const time = format(new Date(chatDate), 'HH:mm')
    return `${date} at ${time}`
  }


  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  

  useEffect(() => {
    if (chats.list.length > 0) {
      chats.list.forEach((chat, index) => {
        const mapContainer = mapRefs.current[index];
        if (mapContainer && chat.incidentId.location) {
          const { longitude, latitude } = chat.incidentId.location;
          const map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 8, 
          });

         
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
        }
      });
    }
  }, [chats.list]); 

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
        <div className='title'>
          <p>Open Incidents</p>
        </div>
        {chats.list.map((chat, index) => (
          <div className='openChat' key={index}>
            <div className='incidentInfo'>
              <p>{chat.incidentId.title}</p>
              <p>Reported by {chat.reporterId.firstName} {chat.reporterId.lastName}</p>
              <p>Opened: {dateTimeDisplay(chat.createdAt)}</p>
            </div>
            <div
              id={`map-${index}`}
              ref={(el) => (mapRefs.current[index] = el)} // Assign ref for this map
              style={{ width: '250px', height: '250px' }}
            ></div>
            <div className='chat'>
              <p>Jump back to chat</p> 
              <img src='https://cdn-icons-png.flaticon.com/128/724/724715.png' alt='Chat Icon' className='chatIcon'/>
            </div> 
          </div>
        ))
        }
      </div>
    </div>
  )
}

export default UserPage