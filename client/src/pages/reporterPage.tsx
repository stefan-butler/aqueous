import { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {fetchReporterIncidents} from "../redux/slices/incidentSlice";
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';


function ReporterPage () {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isResponder, responderType } = useSelector((state: RootState) => state.auth);
 
  const userIncidnets = useSelector((state: RootState) => state.incident.user)
  const navigate = useNavigate(); 
  console.log(user?.id)
  console.log(userIncidnets)

  useEffect(() => {
    dispatch(fetchReporterIncidents(user?.id))
  }, [])


  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    if (userIncidnets.list.length > 0) {
      userIncidnets.list.forEach((chat, index) => {
        const mapContainer = mapRefs.current[index];
        if (mapContainer && chat.location) {
          const { longitude, latitude } = chat.location;
          const map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 8, 
          });

          map.addControl(new mapboxgl.NavigationControl());
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
        }
      });
    }
  }, [userIncidnets.list]); 

  function dateTimeDisplay (incidentDate) {
    const date =  format(new Date(incidentDate), 'do, MMM yyyy')
    const time = format(new Date(incidentDate), 'HH:mm')
    return `${date} at ${time}`
  }

  function handleClick (chatId) {
    navigate(`/chat?chatId=${chatId}`);
  }

  
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
          <p>Incidents Reported:</p>
        </div>
        {userIncidnets.list.map((incident, index) => (
          <div className='openChat' key={index}>
            <div className='incidentTitle'>
              <p id='incidentTitle'>{index + 1}. {incident.title}</p>
            </div>
            <div className='incidentInfo'>
              <p><strong>Type</strong>: {incident.floodType}</p>
              <p><strong>Severity</strong>: {incident.severity}</p>
              <p><strong>Urgency</strong>: {incident.urgency} </p>
              {/* <p>Assigned responder: <strong>{incident.responderId.firstName} {chat.responderId.lastName}</strong></p> */}
              <p>Reported on the <strong>{dateTimeDisplay(incident.incidentDate)}</strong></p>
            </div>
            <div
              id='map'
              ref={(el) => (mapRefs.current[index] = el)} 
              style={{ width: '400px', height: '300px' }}
            ></div>
            <div className='chat'>
              <p>Return to chat:</p> 
              <img onClick={() => handleClick(incident._id)}src='https://cdn-icons-png.flaticon.com/128/724/724715.png' alt='Chat Icon' className='chatIcon'/>
            </div> 
          </div>
        ))
        }
      </div>
    </div>

  )
}

export default ReporterPage