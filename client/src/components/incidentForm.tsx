import { useState } from "react"
import { Incident } from "../types/incident-types";
import { createIncident } from "../redux/slices/incidentSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import '../component-css/incidentForm.css'

//I have focused entirely on the functionality for the moment
function IncidentForm () {

  const dispatch = useDispatch<AppDispatch>();

  const [incident, setIncident] = useState<Incident>({
    title:'',
    incidentDate:'',
    location: {
      longitude: undefined,
      latitude: undefined, 
    },
    severity:'',
    floodType: '',
    injuries: '',
    urgency:'',
    name:'',
    phone:'',
    email:'',
    additionalComments: '',
    user_id: ''
  })

  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name , value} = event.target;

    setIncident ({...incident,
      [name]: value
    })
  }

  const handleLocationChange =  (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    if (name === 'longitude') {
      setIncident({...incident,
        location: {
          ...incident.location,
          [name] : parseFloat(value),
      }})
    } else {
      setIncident({...incident,
        location: {
          ...incident.location,
          [name] : parseFloat(value)
        }
      })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(createIncident(incident))

    setIncident({
      title:'',
      incidentDate:'',
      location: {
        longitude: undefined,
        latitude: undefined, 
      },
      severity:'',
      floodType: '',
      injuries: '',
      urgency:'',
      name:'',
      phone:'',
      email:'',
      additionalComments: '',
      user_id: ''
    })
  }

  const isFormValid = () => {
    const {title, incidentDate, location, severity, floodType, injuries, urgency, name, phone, email} = incident;
    return (
      title && incidentDate && location.longitude && location.latitude &&
      severity && floodType && injuries && urgency && name && phone && email
    );
  }

  return (
    <div className="formContainer">
      <div id="formTitle">
        <p>Report an Incident</p>
      </div>

      <div className="createIncident">
      <form onSubmit={handleSubmit}>
        <div className="formElement">
          <label htmlFor='title' >Incident Title:</label>
          <input className="formElementInput" type='text' name="title" id="title" placeholder="e.g., Flash Flood in Downtown" value={incident.title} onChange={handleChange}/>
        </div>

        <div className="formElement">
          <label htmlFor='incidentDate'>Date & Time of Incident:</label>
          <input className="formElementInput"  type="datetime-local" name="incidentDate" id="incidentDate" value={incident.incidentDate} onChange={handleChange}/>
        </div>

        <div className="formElement">
          <label htmlFor="longitude">Incident's Longitude:</label>
          <input className="formElementInput"  type="number" name="longitude" id="longitude" placeholder="e.g., -0.1276" value={incident.location.longitude} onChange={handleLocationChange}/>
        </div>

        <div className="formElement">
          <label htmlFor="latitude">Incident's Latitude:</label>
          <input className="formElementInput"  type="number" name="latitude" id="latitude" placeholder="e.g., 51.5072" value={incident.location.latitude} onChange={handleLocationChange}/>
        </div>

        <div className="formElement">
          <label htmlFor="severity">Severity of Flooding:</label>
          <select className="formElementInput"  name="severity" id="severity" value={incident.severity} onChange={handleChange}>
            <option value=''>Specify incident's severity:</option>
            <option value='Minor'>Minor</option>
            <option value='Moderate'>Moderate</option>
            <option value='Severe'>Severe</option>
            <option value='Critical'>Critical</option>
          </select>
        </div>

        <div className="formElement">
          <label htmlFor="floodType">Type of Flood:</label>
          <select className="formElementInput"  name="floodType" id="floodType" value={incident.floodType} onChange={handleChange}>
            <option value=''>Please specify incident's type:</option>
            <option value="River Flood">River Flood</option>
            <option value="Urban Flood">Urban Flood</option>
            <option value="Flash Flood">Flash Flood</option>
            <option value="CoastalFlood">Coastal Flood</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="formElement">
          <label htmlFor="injuries">Injuries:</label>
          <div>
            <label id='yes' htmlFor="injuriesYes">Yes</label>
            <input className="formElementInput"  type="radio" name="injuries" id="injuriesYes" value="Yes" checked={incident.injuries === "Yes"} onChange={handleChange}/>

            <label id='no' htmlFor="injuriesNo">No</label>
            <input  className="formElementInput" type="radio" name="injuries" id="injuriesNo" value="No" checked={incident.injuries === "No"} onChange={handleChange}/>
          </div>
        </div>

        <div className="formElement">
        <label htmlFor="urgency">Urgency Level:</label>
        <select className="formElementInput"  name="urgency" id="urgency" value={incident.urgency} onChange={handleChange}>
          <option value=''>Please specicy incident's urgency:</option>
          <option value="Immediate">Immediate</option>
          <option value="Within Hours">Within Hours</option>
          <option value="Low">Low</option>
        </select>
        </div>

        <div className="formElement">
        <label htmlFor="name">Reporting Person's Name:</label>
        <input className="formElementInput"  type="text" name="name" id="name" placeholder='e.g., John Smith' value={incident.name} onChange={handleChange}/>
        </div>

        <div className="formElement">
        <label htmlFor="phone">Phone Number:</label>
        <input  className="formElementInput" type="tel" name="phone" id="phone" placeholder='e.g., +44 7123 456789'value={incident.phone} onChange={handleChange}/>
        </div>

        <div className="formElement">
        <label htmlFor="email">Email Address:</label>
        <input  className="formElementInput" type="email" name="email" id="email" placeholder='e.g., example@domain.com'value={incident.email} onChange={handleChange}/>
        </div>

        <div className="formElement">
        <label htmlFor="additionalComments">Additional Comments:</label>
        <textarea className="formElementInput" name="additionalComments" id="additionalComments" placeholder='Provide any other relevant information...' value={incident.additionalComments} onChange={handleChange}></textarea>
        </div>

        <button type="submit" disabled={!isFormValid()}>Submit Incident</button>
      </form>
      </div>
    </div>
  )
}

export default IncidentForm