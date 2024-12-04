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
        <h2 className="text-2xl font-semibold mb-4 text-light">Incidents Reported</h2>
        {userIncidnets.list.length === 0 ? (
          <p className="text-center text-gray-400">No incidents reported yet.</p>
        ) : (
          <div className="space-y-8">
            {userIncidnets.list.map((incident, index) => (
              <div
                key={index}
                className="bg-primary p-6 rounded-lg shadow-md flex flex-col space-y-4"
              >
                {/* Incident Details */}
                <div>
                  <h3 className="text-lg font-bold text-light">
                    {index + 1}. {incident.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    <strong>Type:</strong> {incident.floodType}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Severity:</strong> {incident.severity}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Urgency:</strong> {incident.urgency}
                  </p>
                  <p className="text-sm text-gray-300">
                    Reported on: <strong>{dateTimeDisplay(incident.incidentDate)}</strong>
                  </p>
                </div>
  
                {/* Map */}
                <div
                  className="rounded-lg overflow-hidden border border-gray-700"
                  ref={(el) => (mapRefs.current[index] = el)}
                  style={{ width: "100%", height: "300px" }}
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

export default ReporterPage