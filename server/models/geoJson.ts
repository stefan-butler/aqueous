import mongoose, { Schema, Document } from "mongoose";

interface IGeoJSONFeature extends Document {
  type: string;
  geometry: {
    type: string; // e.g., "Point"
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    description: string;
    fwdCode: string;
  };
}

const geoJSONFeatureSchema: Schema = new Schema({
  type: { type: String, required: true, default: "Feature" },
  geometry: {
    type: {
      type: String,
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  properties: {
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    fwdCode: { type: String, required: true },
  },
});

const GeoJSONFeature = mongoose.model<IGeoJSONFeature>("GeoJSONFeature", geoJSONFeatureSchema);
export default GeoJSONFeature;
