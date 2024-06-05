import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="card p-2">
        <div className="card-header" onClick={() => navigate(`/doctor/book-appointments/${doctor._id}`)} style={{ cursor: "pointer" }}>
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Specialization</b> {doctor.specialization}
          </p>
          <p>
            <b>Experience</b> {doctor.experience}
          </p>
          <p>
            <b>Fees Per Cunsaltation</b> {doctor.feePerCunsultation}
          </p>
          <p>
            <b>timings</b> {doctor.timings[0]} - {doctor.timings[1]}
          </p>
        </div>
      </div>
    </>
  )
}

export default DoctorList
