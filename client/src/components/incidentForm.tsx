import { useState, useRef, useEffect } from "react"
import { Incident } from "../types/incident-types";
import { createIncident } from "../redux/slices/incidentSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import '../component-css/incidentForm.css'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = 'pk.eyJ1IjoibWpzc2NvdHQiLCJhIjoiY200MmpxOHprMDFsNzJrc2JvY2J4MnoyaCJ9.Lh126FuRrcsE0jo3JGfO8A';
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

  const mapContainerRef = useRef<HTMLDivElement | null>(null); 
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [-0.1278, 51.5074],
        maxBounds: [
          [-8.0, 49.0], 
          [2.0, 60.0] 
        ], 
        zoom: 5, 
      });


      mapRef.current = map;
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl());

      if (incident.location.longitude && incident.location.latitude) {
        const marker = new mapboxgl.Marker()
          .setLngLat([incident.location.longitude, incident.location.latitude])
          .addTo(map);

        // Save the marker reference
        markerRef.current = marker;
      }

      // Event listener for map click to set latitude and longitude
      map.on('click', (event) => {
        const { lng, lat } = event.lngLat; // Get clicked coordinates

        setIncident(prevIncident => ({
          ...prevIncident,
          location: {
            longitude: lng,
            latitude: lat
          }
        }));

        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Create a new marker at the clicked position
        const marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);

        // Save the marker in the ref for future updates
        markerRef.current = marker;
      });
    }
  }, []);

  useEffect(() => {
    if (markerRef.current && incident.location.latitude && incident.location.longitude) {
      markerRef.current.setLngLat([incident.location.longitude, incident.location.latitude]);
    }
  }, [incident.location]);

   console.log(incident.location)

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
        <p><strong>Speak Up, Stay Safe:</strong> Report Flooding to Shield Your Community!</p>
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

        <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '400px' }}></div>

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
            <option value="Coastal Flood">Coastal Flood</option>
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
          <option value="Within Hours">Within 24 Hours</option>
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

        <button className='submitButton' type="submit" disabled={!isFormValid()}>Submit Incident</button>
      </form>
      </div>
    </div>
  )
}

export default IncidentForm