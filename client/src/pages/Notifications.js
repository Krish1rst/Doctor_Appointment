import React from 'react'
import Layout from '../components/Layout'
import { Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { setUser } from '../redux/userSlice'

const Notifications = () => {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post("http://localhost:8000/api/user/mark-all-notifications-as-seen", { userId: user._id }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data))
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  }

  const deleteAllNotification = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post("http://localhost:8000/api/user/delete-all-notifications", { userId: user._id }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data))
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  }
  return (
    <Layout>
      <h1 className="page-layout">Notifications</h1>

      <Tabs>
        <Tabs.TabPane tab='Unseen' key={1}>
          <div className="d-flex justify-content-end">
            <h2 className="anchor" onClick={() => markAllAsSeen()}>Mark all as seen</h2>
          </div>

          {user?.unseenNotification.map((notification) => {
            return <div className='card p-2' onClick={() => navigate(notification.onclickPath)}>
              <div className="card-text">{notification.message}</div>
            </div>
          })}
        </Tabs.TabPane>
        <Tabs.TabPane tab='Seen' key={2}>
          <div className="d-flex justify-content-end">
            <h2 className="anchor" onClick={() => deleteAllNotification()}>Delete All</h2>
          </div>
          {user?.seenNotification.map((notification) => {
            return <div className='card p-2' onClick={() => navigate(notification.onclickPath)}>
              <div className="card-text">{notification.message}</div>
            </div>
          })}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  )
}

export default Notifications
