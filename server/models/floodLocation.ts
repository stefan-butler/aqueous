import mongoose, { Schema, Document} from "mongoose";


export interface IFloodLocation extends Document {
  title: string;
  latitude: number;
  longitude: number;
}

const floodLocationSchema: Schema = new Schema({
  title: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});


const FloodLocation = mongoose.model<IFloodLocation>("FloodLocation", floodLocationSchema);
export default FloodLocation;