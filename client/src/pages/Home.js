import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout.js"
import toast from 'react-hot-toast'
import { Row } from 'antd'
import DoctorList from '../components/DoctorList.js'
// import { showLoading, hideLoading } from '../redux/alertsSlice.js'

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      });
      if (response?.data.success) {
        setDoctors(response.data.data)
      }
      else {
        toast.error(response.data.data)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getData();

  }, [])


  return (
    <Layout>
      <h1 className='text-center'>Homepage</h1>
      <Row>
        {doctors && doctors.map(doctor => (
          <DoctorList key={doctor._id} doctor={doctor} />
        ))}
      </Row>
    </Layout>
  )
}

export default Home
