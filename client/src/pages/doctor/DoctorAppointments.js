import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertsSlice'
import toast from 'react-hot-toast'
import { Button, Table } from 'antd'
import moment from 'moment'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getDoctorAppointments = async () => {
    try {
      dispatch(showLoading())
      const res = await axios.get("http://localhost:8000/api/doctor/doctor-appointments",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        });
      dispatch(hideLoading())
      if (res.data.success) {
        toast.success(res.data.message)
        setAppointments(res.data.data)
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Something went Wrong!")
    }
  }



  useEffect(() => {
    getDoctorAppointments()
  }, []);

  const handleStatus = async (record, status) => {
    try {
      dispatch(showLoading())
      const res = await axios.post("http://localhost:8000/api/doctor/update-status", { appointmentId: record._id, status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        })
      dispatch(hideLoading())
      if (res.data.success) {
        toast.success(res.data.message)
        getDoctorAppointments()
      }
      else {
        toast.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Something went Wrong!")
    }

  }




  const columns = [
    {
      title: "ID",
      dataIndex: "_id"
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span>
          {record.status}
        </span>
      )
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'Pending' && (
            <div className='d-flex'>
              <Button className='btn btn-success mx-2' onClick={() => handleStatus(record, "Approved")}>Approve</Button>
              <Button className='btn btn-danger' onClick={() => handleStatus(record, "Reject")}>Reject</Button>
            </div>)}
        </div>
      )
    }
  ]


  return (
    <Layout>
      <h1 className="page-title">Doctor Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default DoctorAppointments
