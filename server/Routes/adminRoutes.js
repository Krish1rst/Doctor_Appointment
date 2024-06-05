import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModels.js';
import doctorModel from '../models/doctorModels.js';


const router = express.Router();


router.get("/getAllUsers", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ success: true, message: "Users data", data: users });
  } catch (error) {
    res.status(400).send({ success: false, message: "error while getting users data", error })
  }
})
router.get("/getAllDoctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({ success: true, message: "Doctors data", data: doctors });
  } catch (error) {
    res.status(400).send({ success: false, message: "error while getting doctors data", error })
  }
})

router.post("/changeAccountStatus", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await User.findOne({ _id: doctor.userId });
    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      type: "doctor_account_request_approval",
      message: `Your doctor account request is ${status}`,
    });
    user.isDoctor = status === "Approved" ? true : false;
    await user.save();
    res.status(200).send({ success: true, message: "Your doctor account approval is accepted", data: doctor })
  } catch (error) {
    res.status(400).send({ success: false, message: "Error while updating the Status of Doctor", error })
  }
})



export default router;