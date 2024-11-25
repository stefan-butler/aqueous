import { useState } from "react"

function IncidentForm () {
  interface Incident {
    title: string;
    incidentDate: string;
    location: string; //we migth need to change this - depnding on how we will extract the location
    severity: string;
    floodType: string;
    injuries: string; // maybe boolean
    urgency: string;
    name: string;
    phone: string;
    email:string;
    additionalComments: string;
  }
  const [incident, setIncident] = useState<Incident>({
    title:'',
    incidentDate:'',
    location:'',
    severity:'',
    floodType: '',
    injuries: '',
    urgency:'',
    name:'',
    phone:'',
    email:'',
    additionalComments: ''
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name , value} = event.target;

    setIncident ({...incident,
      [name]: value
    })
  }

  return (
    <form className="flex flex-col">
      <label htmlFor='title' >Incident Title::</label>
      <input type='text' name="title" id="title" placeholder="Incident Title" value={incident.title} onChange={handleChange}/>

      <label htmlFor='incidentDate'>Date & Time of Incident:</label>
      <input type="datetime-local" name="incidentDate" id="incidentDate" value={incident.incidentDate} onChange={handleChange}/>

      <label htmlFor="location">Location</label>
      <input type="text" name="location" id="location" placeholder="Location" value={incident.location} onChange={handleChange}/>

      <label htmlFor="severity">Severity of Flooding:</label>
      <select name="severity" id="severity" value={incident.severity} onChange={handleChange}>
        <option value='minor'>Minor</option>
        <option value='moderate'>Moderate</option>
        <option value='severe'>Severe</option>
        <option value='critical'>Critical</option>
      </select>

      <label htmlFor="floodType">Type of Flood:</label>
      <select name="floodType" id="floodType" value={incident.floodType} onChange={handleChange}>
        <option value="riverFlood">River Flood</option>
        <option value="urbanFlood">Urban Flood</option>
        <option value="flashFlood">Flash Flood</option>
        <option value="coastalFlood">Coastal Flood</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="injuries">Injuries:</label>
      <div>
        <label htmlFor="injuriesYes">Yes</label>
        <input type="radio" name="injuries" id="injuriesYes" value="Yes" checked={incident.injuries === "Yes"} onChange={handleChange}/>

        <label htmlFor="injuriesNo">No</label>
        <input type="radio" name="injuries" id="injuriesNo" value="No" checked={incident.injuries === "No"} onChange={handleChange}/>
      </div>

      <label htmlFor="urgency">Urgency Level:</label>
      <select name="urgency" id="urgency" value={incident.urgency} onChange={handleChange}>
        <option value="immediate">Immediate</option>
        <option value="withinHours">Within Hours</option>
        <option value="within24Hours">Immediate</option>
        <option value="low">Low</option>
      </select>

      <label htmlFor="name">Reporting Person's Name:</label>
      <input type="text" name="name" id="name" value={incident.name} onChange={handleChange}/>

      <label htmlFor="phone">Phone Number:</label>
      <input type="tel" name="phone" id="phone" value={incident.phone} onChange={handleChange}/>

      <label htmlFor="email">Email Address:</label>
      <input type="email" name="email" id="email" value={incident.email} onChange={handleChange}/>

      <label htmlFor="additionalComments">Additional Comments:</label>
      <textarea name="additionalComments" id="additionalComments" value={incident.additionalComments} onChange={handleChange}></textarea>

      <button type="submit">Submit Incident</button>
    </form>
  )
}

export default IncidentForm