import { fetchGlobalIncidents } from "../redux/slices/incidentSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router";
import axios from "axios";
import '../component-css/incidentPage.css'

function Incidents () {
//I have focused entirely on the functionality for the moment
  const dispatch = useDispatch<AppDispatch>();
  const global = useSelector((state: RootState) => state.incident.global)
  const navigate = useNavigate(); 
  console.log(global)
  useEffect(() => {
    dispatch(fetchGlobalIncidents())
  },[])

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  console.log(`userId: ${userId}`);
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
                  <p className="titleInc">{index +1}.{incident.title}</p>
                  <p><strong>Reported at</strong>: {incident.incidentDate}</p>
                </div>
                <div className='floodType'>
                  <p><strong>Type</strong>: {incident.floodType}</p>
                </div>
                <div className="personDetails">
                  <div className="person">
                    <p><strong>Contact incident's reporter</strong>:</p>
                    <p>{incident.name}</p>
                  </div>
                  <div>
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
                    <p className="titleInc">{index +1}.{incident.title}</p>
                    <p><strong>Reported at</strong>: {incident.incidentDate}</p>
                  </div>
                  <div className='floodType'>
                    <p><strong>Type</strong>: {incident.floodType}</p>
                  </div>
                  <div className="personDetails">
                    <div className="person">
                      <p><strong>Contact incident's reporter</strong>:</p>
                      <p>{incident.name}</p>
                    </div>
                    <div>
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
                    <p className="titleInc">{index +1}.{incident.title}</p>
                    <p><strong>Reported at</strong>: {incident.incidentDate}</p>
                  </div>
                  <div className='floodType'>
                    <p><strong>Type</strong>: {incident.floodType}</p>
                  </div>
                  <div className="personDetails">
                    <div className="person">
                      <p><strong>Contact incident's reporter</strong>:</p>
                      <p>{incident.name}</p>
                    </div>
                    <div>
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