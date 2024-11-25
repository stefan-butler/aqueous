

function IncidentForm () {
  return (
    <form className="flex flex-col">
      <label htmlFor='title' >Incident Title::</label>
      <input type='text' name="title" id="title" placeholder="Incident Title"/>

      <label htmlFor='incidentDate'>Date & Time of Incident:</label>
      <input type="datetime-local" name="incidentDate" id="incidentDate"/>

      <label htmlFor="location">Location</label>
      <input type="text" name="location" id="location" placeholder="Location"/>

      <label htmlFor="severity">Severity of Flooding:</label>
      <select name="severity" id="severity">
        <option value='minor'>Minor</option>
        <option value='moderate'>Moderate</option>
        <option value='severe'>Severe</option>
        <option value='critical'>Critical</option>
      </select>

      <label htmlFor="floodType">Type of Flood:</label>
      <select name="floodType" id="floodType">
        <option value="riverFlood">River Flood</option>
        <option value="urbanFlood">Urban Flood</option>
        <option value="flashFlood">Flash Flood</option>
        <option value="coastalFlood">Coastal Flood</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="injuries">Injuries:</label>
      <div>
        <label htmlFor="injuriesYes">Yes</label>
        <input type="radio" name="injuries" id="injuriesYes" value="Yes"/>

        <label htmlFor="injuriesNo">No</label>
        <input type="radio" name="injuries" id="injuriesNo" value="No"/>
      </div>

      <label htmlFor="urgency">Urgency Level:</label>
      <select name="urgency" id="urgency">
        <option value="immediate">Immediate</option>
        <option value="withinHours">Within Hours</option>
        <option value="within24Hours">Immediate</option>
        <option value="low">Low</option>
      </select>

      <label htmlFor="name">Reporting Person's Name:</label>
      <input type="text" name="name" id="name"/>

      <label htmlFor="phone">Phone Number:</label>
      <input type="tel" name="phone" id="phone"/>

      <label htmlFor="email">Email Address:</label>
      <input type="email" name="email" id="email"/>

      <label htmlFor="additionalComments">Additional Comments:</label>
      <textarea name="additionalComments" id="additionalComments"></textarea>

      <button type="submit">Submit Incident</button>
    </form>
  )
}

export default IncidentForm