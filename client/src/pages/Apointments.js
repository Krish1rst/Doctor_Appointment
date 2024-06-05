import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import moment from 'moment'
import { Table } from 'antd';

const Apointments = () => {
  const [appointments, setAppointments] = useState([]);


  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/user-appointments",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
          }
        })
      if (res.data.success) {
        toast.success(res.data.message)
        setAppointments(res.data.data)
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    getAppointments()
  }, [])


  const columns = [
    {
      title: "ID",
      dataIndex: "_id"
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorInfo.firstName} {record.doctorInfo.lastName}
    //     </span>
    //   )
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phoneNumber",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorInfo.phoneNumber}
    //     </span>
    //   )
    // },
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
    }
  ]

  return (
    <Layout>

      <h1 className="page-title">Appointments List</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default Apointments
