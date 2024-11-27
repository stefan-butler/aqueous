import mongoose, {Schema, Document, model} from "mongoose"

interface IIncident extends Document {
  title: string;
  incidentDate: string;
  location: {
    longitude: number,
    latitude: number
  }; //we migth need to change this - depnding on how we will extract the location
  severity: string;
  floodType: string;
  injuries: string; // maybe boolean
  urgency: string;
  name: string;
  phone: string;
  email:string;
  additionalComments?: string;
  user_id: string;
}

const incidentSchema: Schema = new Schema <IIncident> ({
  title: { type: String, required: true },
  incidentDate: { type: String, required: true },
  location: {
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
  },
  severity: { type: String, required: true },
  floodType: { type: String, required: true },
  injuries: { type: String, required: true },
  urgency: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  additionalComments: { type: String, required: false },
  user_id: {type: String, required: true}
});

const Incident = model <IIncident> ('Incident', incidentSchema);
export default Incident;