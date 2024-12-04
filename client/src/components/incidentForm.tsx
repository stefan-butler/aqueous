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
    <div className="bg-dark min-h-screen flex items-center justify-center">
      <div className="bg-light p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-dark">
          Speak Up, Stay Safe: Report Flooding to Shield Your Community!
        </h1>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-dark">
              Incident Title
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="title"
              id="title"
              placeholder="e.g., Flash Flood in Downtown"
              value={incident.title}
              onChange={handleChange}
            />
          </div>
  
          {/* Incident Date */}
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-semibold text-dark">
              Date & Time of Incident
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="datetime-local"
              name="incidentDate"
              id="incidentDate"
              value={incident.incidentDate}
              onChange={handleChange}
            />
          </div>
  
          {/* Map Section */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Select Location on Map
            </label>
            <div
              id="map"
              ref={mapContainerRef}
              className="w-full h-64 rounded-lg border border-gray-300"
            ></div>
          </div>
  
          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-semibold text-dark">
              Severity of Flooding
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="severity"
              id="severity"
              value={incident.severity}
              onChange={handleChange}
            >
              <option value="">Select severity level</option>
              <option value="Minor">Minor</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
  
          {/* Flood Type */}
          <div>
            <label htmlFor="floodType" className="block text-sm font-semibold text-dark">
              Type of Flood
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="floodType"
              id="floodType"
              value={incident.floodType}
              onChange={handleChange}
            >
              <option value="">Select flood type</option>
              <option value="River Flood">River Flood</option>
              <option value="Urban Flood">Urban Flood</option>
              <option value="Flash Flood">Flash Flood</option>
              <option value="Coastal Flood">Coastal Flood</option>
              <option value="Other">Other</option>
            </select>
          </div>
  
          {/* Reporter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-dark">
                Reporting Person's Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="name"
                id="name"
                placeholder="e.g., John Smith"
                value={incident.name}
                onChange={handleChange}
              />
            </div>
  
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-dark">
                Phone Number
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="tel"
                name="phone"
                id="phone"
                placeholder="e.g., +44 7123 456789"
                value={incident.phone}
                onChange={handleChange}
              />
            </div>
          </div>
  
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-dark">
              Email Address
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              id="email"
              placeholder="e.g., example@domain.com"
              value={incident.email}
              onChange={handleChange}
            />
          </div>
  
          {/* Additional Comments */}
          <div>
            <label htmlFor="additionalComments" className="block text-sm font-semibold text-dark">
              Additional Comments
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="additionalComments"
              id="additionalComments"
              placeholder="Provide any other relevant information..."
              value={incident.additionalComments}
              onChange={handleChange}
            ></textarea>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200 ${
              !isFormValid() && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isFormValid()}
          >
            Submit Incident
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncidentForm