import express from 'express'
import User from '../models/userModels.js'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js'
import Doctor from '../models/doctorModels.js'
import AppointmentModel from '../models/appointmentModel.js'
import moment from 'moment/moment.js';


const router = express.Router();

router.post('/register', async (req, res) => {

  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      res.status(200).send({ message: "User Already exist", success: false })
    }

    const password = req.body?.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({ message: "User created Successfully", success: true })


  } catch (error) {
    res.status(400).send({ message: "Error while creating user", success: false, error })
  }

})
router.post('/login', async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).send({ message: "User does not exist", success: false })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res.status(200).send({ message: "Incorrect Password", success: false });
    }
    else {
      const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
      res.status(200).send({ message: "Login Successfully", success: true, data: token });
    }
  } catch (error) {
    res.status(400).send({ message: "Error while Login user", success: false, error });
  }

})
router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: "User does not exist", success: false });

    }
    else {
      return res.status(200).send({
        success: true,
        data: user
      });
    }
  } catch (error) {
    res.status(404).send({ message: "Error getting user info", success: false, error });
  }
})
router.post('/apply-doctor-account', authMiddleware, async (req, res) => {

  try {

    const newDoctor = new Doctor({ ...req.body, status: 'Pending' });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotification = adminUser.unseenNotification;

    unseenNotification.push({
      type: 'new-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for the doctor post`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName
      },
      onclickPath: "/admin/doctors"
    })
    await User.findByIdAndUpdate(adminUser._id, { unseenNotification })
    res.status(200).send({ success: true, message: "Doctor Account applied successfully!" });

  } catch (error) {
    res.status(400).send({ message: "Error while creating user", success: false, error })
  }

})
router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {

  try {

    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotification = user.unseenNotification;
    const seenNotification = user.seenNotification;
    seenNotification.push(...unseenNotification);
    user.unseenNotification = []
    user.seenNotification = seenNotification;
    const updatedUser = await user.save();
    updatedUser.password = undefined
    res.status(200).send({ message: "All notification marked as seen!", success: true, data: updatedUser });

  } catch (error) {
    res.status(400).send({ message: "Error while creating user", success: false, error })
  }

})
router.post('/delete-all-notifications', authMiddleware, async (req, res) => {

  try {

    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotification = []
    user.unseenNotification = []
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send({ message: "All notification are deleted!", success: true, data: updatedUser });

  } catch (error) {
    res.status(400).send({ message: "Error while creating user", success: false, error })
  }

})
router.get("/getAllDoctors", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.find({ status: "Approved" });
    res.status(200).send({ success: true, message: "doctors lits", data: doctor });
  } catch (error) {
    res.status(400).send({ success: false, message: "Error while fetching the doctors data", error })
  }
})
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "Pending"
    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId })
    user.unseenNotification.push({
      type: 'New Appointment Request',
      message: `A new appointment from ${req.body.userInfo.name}`,
      onclickPath: "/doctor/appointments"
    })
    await user.save();
    res.status(200).send({ success: true, message: "Appointment Request", data: newAppointment })
  } catch (error) {
    res.status(400).send({ success: true, message: "error while book appointment", error })
  }
})
// booking availability

router.post("/booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointment = await AppointmentModel.findOneAndDelete({
      doctorId, date,
      time: {
        $gte: fromTime, $lte: toTime
      }
    })
    if (appointment?.length > 0) {
      return res.status(200).send({ success: true, message: "Appointments not available at this time" });
    }
    else {
      return res.status(200).send({ success: true, message: "Appointment Available" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error while checking availability", error })
  }
})

// get user Appointments

router.get("/user-appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({ userId: req.body.userId });
    res.status(200).send({ success: true, message: "User Appointments fetch Successfully", data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'error while fetching the user appointment list', error })
  }
})

export default router;