import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from 'react-redux'
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctors from "./pages/ApplyDoctors";
import Notifications from "./pages/Notifications";
import Users from "./pages/admin/Users";
import Doctors from "./pages/admin/Doctors";
import Profile from "./pages/doctor/Profile";
import BookingPage from "./pages/BookingPage";
import Appointments from "./pages/Apointments"
import DoctorAppointments from "./pages/doctor/DoctorAppointments";

function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <Router>
      {loading && (<div className="spinner-parent">
        <div class="spinner-border" role="status">
        </div>
      </div>)}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctors /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/doctor/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/doctor/book-appointments/:doctorId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;