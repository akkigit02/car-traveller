import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import AvailableVehicle from '../components/common/AvailableVehicle'
import Signup from '../components/Signup'

function UnProtected() {
  return (
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/forgot-password" Component={Login} exact />
      <Route path="/car-list/:query" Component={AvailableVehicle} exact />
      <Route path="/signup" Component={Signup} exact />
    </Routes>

  )
}

export default UnProtected