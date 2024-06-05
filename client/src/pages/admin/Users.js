import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { Table } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch()

  const getUsers = async () => {
    try {
      dispatch(showLoading)
      const res = await axios.get("http://localhost:8000/api/admin/getAllUsers", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      dispatch(hideLoading)
      if (res.data.success) {
        setUsers(res.data.data);
        toast.success(res.data.message)
      }
      else {
        toast.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading)
    }
  }

  useEffect(() => {
    getUsers();
  }, [])


  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: "Email",
      dataIndex: 'email'
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => (<span>{record.isDoctor ? "Yes" : "No"}</span>)
    },
    {
      title: "Action",
      dataIndex: 'action',
      render: (text, record) => (
        <div className='d-flex'><button className='btn btn-danger'>Block</button></div>
      ),
    }
  ]

  return (
    <Layout>
      <h1 className='page-title'>User List</h1>
      <Table columns={column} dataSource={users}></Table>
    </Layout>
  )
}

export default Users
