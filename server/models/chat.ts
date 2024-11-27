import mongoose from "mongoose";
const { Document, Schema } = mongoose;

export interface IChat extends Document {
  incidentId: mongoose.Schema.Types.ObjectId;
  responderId: mongoose.Schema.Types.ObjectId;
  reporterId: mongoose.Schema.Types.ObjectId;
  messages: mongoose.Schema.Types.ObjectId[];
}

const ChatSchema = new Schema <IChat> ({
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  responderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
}, {timestamps: true});

export default mongoose.model<IChat>('chat', ChatSchema);