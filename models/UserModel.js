import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatarUrl: {
    type: String,
    default: ""
  },
}, { timestamps: true });

userSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

export default mongoose.model("User", userSchema);