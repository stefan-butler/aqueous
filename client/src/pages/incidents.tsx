import { fetchGlobalIncidents } from "../redux/slices/incidentSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router";
import axios from "axios";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../component-css/incidentPage.css'




function Incidents () {
//I have focused entirely on the functionality for the moment
  const dispatch = useDispatch<AppDispatch>();
  const global = useSelector((state: RootState) => state.incident.global)
  const navigate = useNavigate(); 
  useEffect(() => {
    dispatch(fetchGlobalIncidents())
  },[])

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(`userId: ${userId}`);
  console.log(user)
  const handleChatIconClick = async (incidentId: string, responderId: string | undefined) => {
    try {

      
      // Find the incident from global.list
      const incident = global.list.find((item) => item._id === incidentId);
      if (!incident) {
        console.error('Incident not found');
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing');
        return;
      }
  
      // check if there is already a chat with this incident ID
      const chatCheckResponse = await axios.get(
        `http://localhost:3000/api/chat/check?incidentId=${incidentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const existingChat = await chatCheckResponse.data.chat
 

      // if no existing chat, create one
      if (!existingChat) {
        console.log('No existing chat found, creating a new one.');
        const reporterId = incident.user_id;
        const createChatResponse = await axios.post(
          'http://localhost:3000/api/chat/',
          {
            incidentId,
            reporterId,
            responderId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { _id: chatId } = await createChatResponse.data;
        console.log('New chat created:', chatId);
        navigate(`/chat?chatId=${chatId}`);
        return;
      }
  
      // if chat exists, check if responderId or reporterId matches
      console.log('Existing chat found:', existingChat);
      if ((existingChat.responderId === userId) || (existingChat.reporterId === userId)) {
        // open chat
        console.log('Credentials match. Opening chat.');
        navigate(`/chat?chatId=${existingChat._id}`);
      } else {
        // chat already has a different responder
        console.error('Incident already has a responder');
        alert('This incident already has a responder assigned.'); // replace this alert when the feature works 
      }
    } catch (error) {
      console.error('Error handling chat icon click:', error);
    }
  };

  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (global.list.length > 0) {
      global.list.forEach((incident) => {
        const mapContainer = mapRefs.current[incident._id];
        if (mapContainer && incident.location) {
          const { longitude, latitude } = incident.location;
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
  }, [global.list]);
  return (
    <div className="bg-dark min-h-screen p-8 text-light">
      <h1 className="text-3xl font-bold text-center mb-8 text-light">Incident Dashboard</h1>
  
      {/* Critical Incidents */}
      {global.list.filter((incident) => incident.severity === 'Critical').length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Critical Incidents</h2>
          <div className="flex space-x-6 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
            {global.list
              .filter((incident) => incident.severity === 'Critical')
              .map((incident) => (
                <div
                  key={incident._id}
                  className="bg-primary flex-none w-80 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-light mb-2">{incident.title}</h3>
                  <p className="text-sm text-light mb-2">
                    <strong>Reported at:</strong> {incident.incidentDate}
                  </p>
                  <p className="text-sm text-light mb-4">
                    <strong>Type:</strong> {incident.floodType}
                  </p>
                  {/* Map */}
                  <div
                    ref={(el) => (mapRefs.current[incident._id] = el)}
                    className="w-full h-48 rounded-lg overflow-hidden border border-gray-300"
                  ></div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-sm text-light">
                        <strong>Contact:</strong> {incident.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleChatIconClick(incident._id, userId)}
                      className="bg-light text-primary p-2 rounded-lg shadow hover:bg-lighter hover:text-light transition"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/724/724715.png"
                        alt="Chat Icon"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
  
      {/* Moderate Incidents */}
      {global.list.filter((incident) => incident.severity === 'Moderate').length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Moderate Incidents</h2>
          <div className="flex space-x-6 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
            {global.list
              .filter((incident) => incident.severity === 'Moderate')
              .map((incident) => (
                <div
                  key={incident._id}
                  className="bg-primary flex-none w-80 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-light mb-2">{incident.title}</h3>
                  <p className="text-sm text-light mb-2">
                    <strong>Reported at:</strong> {incident.incidentDate}
                  </p>
                  <p className="text-sm text-light mb-4">
                    <strong>Type:</strong> {incident.floodType}
                  </p>
                  {/* Map */}
                  <div
                    ref={(el) => (mapRefs.current[incident._id] = el)}
                    className="w-full h-48 rounded-lg overflow-hidden border border-gray-300"
                  ></div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-sm text-light">
                        <strong>Contact:</strong> {incident.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleChatIconClick(incident._id, userId)}
                      className="bg-light text-primary p-2 rounded-lg shadow hover:bg-lighter hover:text-light transition"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/724/724715.png"
                        alt="Chat Icon"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
  
      {/* Minor Incidents */}
      {global.list.filter((incident) => incident.severity === 'Minor').length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Minor Incidents</h2>
          <div className="flex space-x-6 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
            {global.list
              .filter((incident) => incident.severity === 'Minor')
              .map((incident) => (
                <div
                  key={incident._id}
                  className="bg-primary flex-none w-80 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-light mb-2">{incident.title}</h3>
                  <p className="text-sm text-light mb-2">
                    <strong>Reported at:</strong> {incident.incidentDate}
                  </p>
                  <p className="text-sm text-light mb-4">
                    <strong>Type:</strong> {incident.floodType}
                  </p>
                  {/* Map */}
                  <div
                    ref={(el) => (mapRefs.current[incident._id] = el)}
                    className="w-full h-48 rounded-lg overflow-hidden border border-gray-300"
                  ></div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-sm text-light">
                        <strong>Contact:</strong> {incident.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleChatIconClick(incident._id, userId)}
                      className="bg-light text-primary p-2 rounded-lg shadow hover:bg-lighter hover:text-light transition"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/724/724715.png"
                        alt="Chat Icon"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Incidents;