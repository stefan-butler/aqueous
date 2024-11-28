import { fetchGlobalIncidents } from "../redux/slices/incidentSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router";
import '../component-css/incidentPage.css'

function Incidents () {
//I have focused entirely on the functionality for the moment
  const dispatch = useDispatch<AppDispatch>();
  const global = useSelector((state: RootState) => state.incident.global)
  const navigate = useNavigate(); 

  useEffect(() => {
    dispatch(fetchGlobalIncidents())
  },[])

const handleChatIconClick = (incidentId: string) => {
  navigate('/chat')
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
          <div className='reportingPersonDetails'>
            <p>{incident.name}: {incident.phone}  </p>
            <p>{incident.phone}    {incident.email}</p>
          </div>
          <div className='chatIcon'>
                <img onClick={() => handleChatIconClick(incident._id)} src="https://cdn-icons-png.flaticon.com/128/3621/3621438.png" alt="Venue icon" className="icon" />
          </div>
        </div>
      );
    })}
  </div>
    
  )
}

export default Incidents;