import React, { useState } from 'react'
import '../Layout.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Badge } from 'antd';

const Layout = ({ children }) => {

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useSelector(state => state.user);

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line"
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line"
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line"
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line"
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line"
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: "ri-user-star-fill"
    },
  ];
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line"
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line"
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-heart-line"
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;

  return (
    <div className='main'>
      <div className="d-flex layout">
        <div className='sidebar'>
          <div className="sidebar-header">
            <h1 className='logo'>SH</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path
              return <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                <i className={menu.icon}></i>
                {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
              </div>
            })}
            <div className={`d-flex menu-item `} onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}>
              <i className="ri-logout-box-r-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (<i i className="ri-menu-2-line header-action-icon" onClick={() => setCollapsed(false)}></i>) :
              (<i className="ri-close-line header-action-icon" onClick={() => setCollapsed(true)}></i>)}

            <div className="d-flex align-items-center px-4">
              <Badge count={user?.unseenNotification.length} onClick={() => navigate('/notifications')}>
                <i className="ri-notification-line header-action-icon px-2"></i>
              </Badge>
              <Link className='anchor px-2' to='/profile'>{user?.name}</Link>
            </div>

          </div>
          <div className="body">
            {children}
          </div>
        </div>
      </div>
    </div >
  )
}

export default Layout
