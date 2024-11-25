import mongoose, { Document, Schema } from "mongoose";

interface  IFloodWarning extends Document {
  id: string;
  severity: number;
  message: string;
  floodArea: string;
}

const floodWarningSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true }, // Unique ID for the polygon
  severity: { type: Number, required: true }, // Severity level (e.g., 1-5)
  message: { type: String, required: true }, // Message associated with the warning
  floodAreaId: { type: String, require: true},
});

const FloodWarning = mongoose.model<IFloodWarning>('FloodWarning', floodWarningSchema);

export default FloodWarning;