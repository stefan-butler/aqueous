import mongoose, { Schema, Document} from "mongoose";

interface IFLloodLocation extends Document {
  id: string;
  description: string;
  fwdCode: string;
  lat: number; 
  long: number;
}

const floodLocationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  description: { type: String},
  fwdCode: { type: String, required: true},
  lat: { type: Number, required: true },
  long: { type: Number, required: true},
});

const FloodLocation = mongoose.model<IFLloodLocation>("FloodLocation", floodLocationSchema);
export default FloodLocation;