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

  useEffect(() => {
    dispatch(fetchGlobalIncidents())
  },[])

  const responderId = useSelector((state: RootState) => state.auth.user?.id);
  const handleChatIconClick = async (incidentId: string, responderId: string | undefined ) => {
    // Find the incident from global.list
    const incident = global.list.find((item) => item.user_id === incidentId);
    if (!incident) {
      console.error('Incident not found');
      return;
    }
    // get responder and reporterId
    const reporterId = incident.user_id;
    // create new chat 
    const response = await axios.post('/api/chat/', {
      incidentId,
      reporterId, 
      responderId
    });

    const { _id: chatId } = response.data;
    navigate(`/chat?chatId=${chatId}`)
  }

  console.log(global)
  return (

    <div className="incidentContainer">
    {global.list.map((incident, index) => {
      return (
        <div className="incident" key={index}> 
          <div className="incidentTitle">
            <p>{incident.title}</p>
          </div>
          <div>
            <p>{incident.floodType}</p>
          </div>
          <div>
            <p>{incident.urgency}</p>
          </div>
          <div className='chatIcon'>
                <img onClick={() => handleChatIconClick(incident.user_id, responderId)} src="https://cdn-icons-png.flaticon.com/128/3621/3621438.png" alt="Venue icon" className="icon" />
          </div>
        </div>
      );
    })}
  </div>
    
  )
}

export default Incidents;