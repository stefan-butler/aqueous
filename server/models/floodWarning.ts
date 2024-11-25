import mongoose, { Document, Schema } from "mongoose";

interface  IFloodWarning extends Document {
  polygon_id: string;
  severity: number;
  message: string;
  polygon: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

const floodWarningSchema: Schema = new Schema({
  polygon_id: { type: String, required: true, unique: true }, // Unique ID for the polygon
  severity: { type: Number, required: true }, // Severity level (e.g., 1-5)
  message: { type: String, required: true }, // Message associated with the warning
  polygon: {
    type: { type: String, enum: ['Polygon'], required: true }, // GeoJSON type for Polygon
    coordinates: { type: [[Number]], required: true }
  }
});

const FloodWarning = mongoose.model<IFloodWarning>('FloodWarning', floodWarningSchema);

export default FloodWarning;