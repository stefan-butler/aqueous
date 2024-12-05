import { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {fetchResponderChats} from "../redux/slices/chatSlice";
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../component-css/responderPage.css'

function UserPage () {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isResponder, responderType } = useSelector((state: RootState) => state.auth);
  const chats = useSelector((state: RootState) => state.chat)
  const navigate = useNavigate(); 
  console.log(chats)
  useEffect(() => {
    dispatch(fetchResponderChats(user?.id))
  }, [])

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
            center: [longitude as number, latitude as number],
            zoom: 8, 
          });

          map.addControl(new mapboxgl.NavigationControl());
          new mapboxgl.Marker()
            .setLngLat([longitude as number, latitude as number])
            .addTo(map);
        }
      });
    }
    console.log(chats.list)
  }, [chats.list]); 

  function dateTimeDisplay (chatDate : string) {
    const date =  format(new Date(chatDate), 'do, MMM yyyy')
    const time = format(new Date(chatDate), 'HH:mm')
    return `${date} at ${time}`
  }

  function handleClick (chatId : string) {
    navigate(`/chat?chatId=${chatId}`);
  }

return (
  <div className="bg-dark min-h-screen p-8 text-light">
    {/* Profile Section */}
    <div className="bg-primary p-6 rounded-lg shadow-lg mb-8">
      <div className="flex items-center space-x-6">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3899/3899618.png"
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>
        {/* User Info */}
        <div>
          <p className="text-2xl font-bold">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-300 mt-1">
            <strong>Email:</strong> {user?.email}
          </p>
          {isResponder && (
            <p className="text-sm text-gray-300 mt-1">
              <strong>Responder:</strong> {responderType}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Chats Section */}
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-light">Open Incidents</h2>
      {chats.list.length === 0 ? (
        <p className="text-center text-gray-400">No open incidents to display.</p>
      ) : (
        <div className="space-y-8">
          {chats.list.map((chat, index) => (
            <div
              key={index}
              className="bg-primary p-6 rounded-lg shadow-md flex flex-col space-y-4"
            >
              {/* Incident Details */}
              <div>
                <h3 className="text-lg font-bold text-light">{index + 1}. {chat.incidentId.title}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  <strong>Type:</strong> {chat.incidentId.floodType}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Severity:</strong> {chat.incidentId.severity}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Urgency:</strong> {chat.incidentId.urgency}
                </p>
                <p className="text-sm text-gray-300">
                  Reported by <strong>{chat.reporterId.firstName} {chat.reporterId.lastName}</strong>
                </p>
                <p className="text-sm text-gray-300">
                  Reported on <strong>{dateTimeDisplay(chat.incidentId.incidentDate)}</strong>
                </p>
              </div>

              {/* Map */}
              <div
                className="rounded-lg overflow-hidden border border-gray-700"
                ref={(el) => (mapRefs.current[index] = el)}
                style={{ width: '100%', height: '300px' }}
              ></div>

              {/* Chat Icon */}
              <div className="flex items-center space-x-4">
                <p className="text-sm text-light">Return to chat:</p>
                <img
                  onClick={() => handleClick(chat._id)}
                  src="https://cdn-icons-png.flaticon.com/128/724/724715.png"
                  alt="Chat Icon"
                  className="w-8 h-8 cursor-pointer hover:scale-110 transition transform"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default UserPage