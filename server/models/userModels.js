import mongoose from 'mongoose'


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  isDoctor: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  seenNotification: {
    type: Array,
    default: []
  },
  unseenNotification: {
    type: Array,
    default: []
  },
}, {
  timestamps: true
})



const userModel = mongoose.model("user", userSchema);

export default userModel;