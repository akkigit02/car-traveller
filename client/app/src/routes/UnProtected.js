import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import AvailableVehicle from '../components/common/AvailableVehicle'

function UnProtected() {
  return (
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/forgot-password" Component={Login} exact />
      <Route path="/car-list/:query" Component={AvailableVehicle} exact />
    </Routes>

  )
}

export default UnProtected