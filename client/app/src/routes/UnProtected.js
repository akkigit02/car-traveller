import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import AvailableVehicle from '../components/common/AvailableVehicle'
import Signup from '../components/Signup'

function UnProtected() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to='/login' />} exact />
      <Route path="/login" Component={Login} exact />
      <Route path="/forgot-password" Component={Login} exact />
      <Route path="/car-list/:query" Component={AvailableVehicle} exact />
      <Route path="/signup/:query" Component={Signup} exact />
      <Route path="/*" element={<Navigate to='/login' />} exact />
    </Routes>

  )
}

export default UnProtected