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

  console.log(global)
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

    <div className="incidentContainer">
      <div className="criticalSeverity">
        <p id='criticaltitle'>Critical Incidents</p>
        <div className='criticalIncidents'>
            {global.list
            .filter((incident) => incident.severity === 'Critical')
            .map((incident, index) => (
              <div className="incidentDetails" key={index}>
                <div className="incidentTitle">
                  <p className="titleInc">{index +1}. {incident.title}</p>
                </div>
                <div className='floodType'>
                  <p><strong>Type</strong>: {incident.floodType}</p>
                  <p><strong>Reported at</strong>: {incident.incidentDate}</p>
                  <p><strong>Urgency</strong>: {incident.urgency}</p>
                  <p><strong>Injuries Involved</strong>: {incident.injuries}</p>
                </div>
                <div
              id='map'
              ref={(el) => (mapRefs.current[incident._id] = el)} 
              style={{ width: '400px', height: '300px' }}
            ></div>
                <div className="personDetails">
                  <div className="person">
                    <p><strong>Contact incident's reporter</strong>: {user?.firstName} {user?.lastName}</p>
                  </div>
                  <div className='incidentContactDetails'>
                    <div>
                      <p>{incident.phone}</p>
                      <p>{incident.email}</p>
                    </div>
                    <div>
                      <p>OR</p>
                    </div>
                    <img onClick={() => handleChatIconClick(incident._id, userId)} src="https://cdn-icons-png.flaticon.com/128/724/724715.png" alt="Venue icon" className="icon" />
                  </div>
                </div>
              </div>
            )
            )}
        </div>
      </div>

      <div className="moderateSeverity">
        <p id='moderateltitle'>Moderate Incidents</p>
        <div className='moderateIncidents'>
            {global.list
              .filter((incident) => incident.severity === 'Moderate')
              .map((incident, index) => (
                <div className="incidentDetails" key={index}>
                  <div className="incidentTitle">
                    <p className="titleInc">{index +1}. {incident.title}</p>
                  </div>
                  <div className='floodType'>
                    <p><strong>Type</strong>: {incident.floodType}</p>
                    <p><strong>Reported at</strong>: {incident.incidentDate}</p>
                  </div>
                  <div
                id='map'
                ref={(el) => (mapRefs.current[incident._id] = el)} 
                style={{ width: '400px', height: '300px' }}
              ></div>
                  <div className="personDetails">
                    <div className="person">
                      <p><strong>Contact incident's reporter</strong>: {user?.firstName} {user?.lastName}</p>
                    </div>
                    <div className='incidentContactDetails'>
                      <div>
                        <p>{incident.phone}</p>
                        <p>{incident.email}</p>
                      </div>
                      <div>
                        <p>OR</p>
                      </div>
                      <img onClick={() => handleChatIconClick(incident._id, userId)} src="https://cdn-icons-png.flaticon.com/128/724/724715.png" alt="Venue icon" className="icon" />
                    </div>
                  </div>
                </div>
              )
              )}
        </div>
      </div>
      <div className='minorSeverity'>
        <p id='minortitle'>Minor Incidents</p>
        <div className='minorIncidents'>
            {global.list
              .filter((incident) => incident.severity === 'Minor')
              .map((incident, index) => (
                <div className="incidentDetails" key={index}>
                  <div className="incidentTitle">
                    <p className="titleInc">{index +1}. {incident.title}</p>
                  </div>
                  <div className='floodType'>
                    <p><strong>Type</strong>: {incident.floodType}</p>
                    <p><strong>Reported at</strong>: {incident.incidentDate}</p>
                  </div>
                  <div
                id='map'
                ref={(el) => (mapRefs.current[incident._id] = el)} 
                style={{ width: '400px', height: '300px' }}
              ></div>
                  <div className="personDetails">
                    <div className="person">
                      <p><strong>Contact incident's reporter</strong>: {user?.firstName} {user?.lastName}</p>
                    </div>
                    <div className='incidentContactDetails'>
                      <div>
                        <p>{incident.phone}</p>
                        <p>{incident.email}</p>
                      </div>
                      <div>
                        <p>OR</p>
                      </div>
                      <img onClick={() => handleChatIconClick(incident._id, userId)} src="https://cdn-icons-png.flaticon.com/128/724/724715.png" alt="Venue icon" className="icon" />
                    </div>
                  </div>
                </div>
              )
              )}
          </div>
      </div>
  </div>
    
  )
}

export default Incidents;