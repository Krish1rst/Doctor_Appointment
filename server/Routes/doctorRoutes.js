import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import doctorModel from '../models/doctorModels.js';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModels.js';

const router = express.Router();

// get single goc info
router.post("/getDoctorInfo", authMiddleware, async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({ success: true, message: "Doctor Data", data: doctor })
  } catch (error) {
    res.status(400).send({ success: false, message: "Error occurs during fetching the doctor data", error })
  }
})


router.post("/updateProfile", authMiddleware, async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
    res.status(200).send({ success: true, message: "Updated doctor data", data: doctor });
  } catch (error) {
    res.status(400).send({ success: false, message: "Error occurs during updating the doctor data", error })
  }
})

// get single docInfo
router.post("/getDoctorById", authMiddleware, async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
    res.status(200).send({ success: true, message: "Doctor details ", data: doctor })
  } catch (error) {
    res.status(400).send({ success: false, message: "error while fetching the doctor info by id", error })
  }
})

// get doctor appointments


router.get("/doctor-appointments", authMiddleware, async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId })
    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({ success: true, message: "Doctor appointments fetch Successfully", data: appointments })
  } catch (error) {
    res.status(400).send({ success: false, message: "Error while fetching doctor appointments", error })
  }
})

// update Appointment status

router.post("/update-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentId, { status })
    const user = await userModel.findOne({ _id: appointments.userId });
    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      type: "Updated Status",
      message: `Your Appointment status has been ${status}`,
      onclickPath: "/doctor/appointments"
    });
    await user.save();
    res.status(200).send({ success: true, message: "Appointment Status Updated" })
  } catch (error) {
    res.status(400).send({ success: false, message: "error while updating the status", error })
  }
})


export default router;