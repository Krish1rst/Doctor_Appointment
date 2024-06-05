import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  feePerCunsultation: {
    type: Number,
    required: true
  },
  timings: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    default: "Pending"
  },
}, {
  timestamps: true
});


const doctorModel = mongoose.model('doctors', doctorSchema);

export default doctorModel;