import mongoose, {Schema, Document, model}  from "mongoose";

interface IUser extends Document {
_id: string;
firstName: string;
lastName: string;
email: string;
password: string;
isResponder: boolean;
responderType?: string;
}

const userSchema: Schema = new Schema <IUser> ({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  isResponder: {type: Boolean, default: false},
  responderType: {type: String, required: false}
});

const User = model <IUser>('User', userSchema);
export default User;