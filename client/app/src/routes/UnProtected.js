import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ClientLogin from '../components/client/ClientLogin'
import AvailableVehicle from '../components/common/AvailableVehicle'
import BookingForm from '../components/common/BookingForm'
import ClientHeaderBar from '../components/client/ClientHeaderBar'
import AdminLogin from '../components/admin/AdminLogin'

function UnProtected() {
  const location=useLocation()
  return (
    <>
      {location.pathname!=='/login'&&<ClientHeaderBar />}
      {/* {location.pathname!=='/admin-login'&&<ClientHeaderBar />} */}
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} exact />
        <Route path="/login" Component={ClientLogin} exact />
        <Route path="/admin-login" Component={AdminLogin} exact />
        {/* <Route path="/forgot-password" Component={Login} exact /> */}
        <Route path="/car-list/:query" Component={AvailableVehicle} exact />
        <Route path="/booking/:query" Component={BookingForm} exact />
        <Route path="/*" element={<Navigate to='/login' />} exact />
      </Routes>
      {location.pathname!=='/login'&&<footer className="p-2 border-top w-100 shadow  d-flex justify-content-center position-absolute bottom-0 bg-grey">
        <p className="mb-0">© Copyright 2024 by dddcabs.com</p>
      </footer>}
      {/* {location.pathname!=='/admin-login'&&<footer className="p-2 border-top w-100 shadow  d-flex justify-content-center position-absolute bottom-0 bg-grey">
        <p className="mb-0">© Copyright 2024 by dddcabs.com</p>
      </footer>} */}
    </>
  )
}

export default UnProtected