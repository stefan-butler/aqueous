import mongoose, { Schema, Document} from "mongoose";

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IFloodLocation extends Document {
  id: string;
  description: string;
  fwdCode: string;
  location: ILocation;
}

const floodLocationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  description: { type: String },
  fwdCode: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
});

floodLocationSchema.index({ location: "2dsphere" });  

const FloodLocation = mongoose.model<IFloodLocation>("FloodLocation", floodLocationSchema);
export default FloodLocation;