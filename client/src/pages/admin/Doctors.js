import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';
import { Button, Table } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctors = async () => {
    try {
      dispatch(showLoading)
      const res = await axios.get("http://localhost:8000/api/admin/getAllDoctors", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      dispatch(hideLoading)
      if (res.data.success) {
        toast.success(res.data.message)
        setDoctors(res.data.data);
      }
      else {
        toast.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading)
    }
  }

  // handle Account Status

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post("http://localhost:8000/api/admin/changeAccountStatus", { doctorId: record._id, userId: record.userId, status: status }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
      else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error("Something went Wrong");
    }
  }

  useEffect(() => {
    getDoctors();
  }, []);


  const column = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>{record.firstName} {record.lastName}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber"
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'Pending' ? <Button className='btn btn-success' onClick={() => handleAccountStatus(record, "Approved")}>Approve</Button> : <Button className='btn btn-danger'>Reject</Button>}
        </div>
      )
    }
  ]

  return (
    <Layout >
      <h1 className='page-title'>Doctors List</h1>
      <Table columns={column} dataSource={doctors}></Table>
    </Layout>
  )
}

export default Doctors
