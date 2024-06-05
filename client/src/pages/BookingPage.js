import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice'

const BookingPage = () => {
  const { user } = useSelector(state => state.user)
  const [doctor, setDoctor] = useState([]);
  const [date, setDate] = useState()
  const [time, setTime] = useState()
  const [isAvailable, setIsAvailable] = useState(false)
  const params = useParams();
  const dispatch = useDispatch()

  // get doctor details via id
  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post("http://localhost:8000/api/doctor/getDoctorById", { doctorId: params.doctorId }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setDoctor(response.data.data)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      showLoading(hideLoading());
      toast.error("Something went wrong");
    }
  }

  // book appointment

  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date and time required")
      }
      dispatch(showLoading())
      const res = await axios.post("http://localhost:8000/api/user/book-appointment",
        { doctorId: params.doctorId, userId: user._id, doctorInfo: doctor, userInfo: user, date: date, time: time },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        });
      dispatch(hideLoading())
      if (res.data.success) {
        toast.success(res.data.message);
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Something went wrong");
    }
  }

  const handleAvailability = async () => {
    try {
      dispatch(showLoading())
      const res = await axios.post("http://localhost:8000/api/user/booking-availability",
        { date, time, doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        });
      dispatch(hideLoading())
      if (res.data.success) {
        setIsAvailable(true);
        toast.success(res.data.message)
      }
      else {
        toast.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Something went wrong");
    }
  }



  useEffect(() => {
    getData();
  }, [])





  return (
    <Layout>
      <h1 className="page-title">Booking Page</h1>
      <div className="container m-2">
        {doctor && (
          <div>
            <h4>
              Dr. {doctor.firstName} {doctor.lastName}
            </h4>
            <h4>
              Fees: {doctor.feePerCunsultation}
            </h4>
            <h4>
              Timings: {doctor.timings && doctor.timings[0]} -{" "}{doctor.timings && doctor.timings[1]}{" "}
            </h4>
            <div className='d-flex flex-column' style={{ width: '50%' }}>
              <DatePicker className='m-2' format="DD-MM-YYYY" onChange={(value) => {
                setDate(moment(value).format("DD-MM-YYYY"))
              }} />
              <TimePicker className='m-2' format="HH:mm" onChange={(value) => {
                setTime(moment(value).format("HH:mm"))
              }} />
              <button className='btn btn-primary mt-4' onClick={handleAvailability}>Check Availablility</button>

              <button className='btn btn-dark mt-4' onClick={handleBooking}>Book Now</button>

            </div>
          </div>
        )}
      </div>
    </Layout >
  )
}

export default BookingPage
