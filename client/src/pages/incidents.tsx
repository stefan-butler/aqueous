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
      <div className="criticalSeverity">
        <p id='criticaltitle'>Critical Incidents</p>
        <div className='criticalIncidents'>
          <div className="incident">
            {global.list
            .filter((incident) => incident.severity === 'Critical')
            .map((incident, index) => (
              <div className="incident" key={index}>
              <div className="incidentTitle">
                <p>{incident.title} - {incident.incidentDate}</p>
              </div>
              <div className='floodType'>
                <p>Type: {incident.floodType}</p>
              </div>
              <div className="personDetails">
                <p>{incident.name}</p>
                <p>Contact deatils:{incident.phone} & {incident.email}</p>
                <img onClick={() => handleChatIconClick(incident._id)} src="https://cdn-icons-png.flaticon.com/128/4096/4096208.png" alt="Venue icon" className="icon" />
              </div>
              </div>
            )
            )}
          </div>
        </div>
      </div>

      <div className="moderateSeverity">
        <p id='moderateltitle'>Moderate Incidents</p>
        <div className='moderateIncidents'>
          <div className="incident">
            {global.list
              .filter((incident) => incident.severity === 'Moderate')
              .map((incident, index) => (
                <div className="incident" key={index}>
                <div className="incidentTitle">
                  <p>{incident.title} - {incident.incidentDate}</p>
                </div>
                <div className='floodType'>
                  <p>Type: {incident.floodType}</p>
                </div>
                <div className="personDetails">
                  <p>{incident.name}</p>
                  <p>Contact deatils:{incident.phone} & {incident.email}</p>
                  <img onClick={() => handleChatIconClick(incident._id)} src="https://cdn-icons-png.flaticon.com/128/4096/4096208.png" alt="Venue icon" className="icon" />
                </div>
                </div>
              )
              )}
          </div>
        </div>
      </div>

      <div className='minorSeverity'>
        <p id='minortitle'>Minor Incidents</p>
        <div className='minorIncidents'>
          <div className="incident">
            {global.list
                .filter((incident) => incident.severity === 'Minor')
                .map((incident, index) => (
                  <div className="incident" key={index}>
                  <div className="incidentTitle">
                    <p>{incident.title} - {incident.incidentDate}</p>
                  </div>
                  <div className='floodType'>
                    <p>Type: {incident.floodType}</p>
                  </div>
                  <div className="personDetails">
                    <p>{incident.name}</p>
                    <p>Contact deatils:{incident.phone} & {incident.email}</p>
                    <img onClick={() => handleChatIconClick(incident._id)} src="https://cdn-icons-png.flaticon.com/128/4096/4096208.png" alt="Venue icon" className="icon" />
                  </div>
                  </div>
                )
                )}
          </div>
        </div>
      </div>
  </div>
    
  )
}

export default Incidents;