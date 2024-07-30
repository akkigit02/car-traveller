import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'

function Authetication() {
  return (
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/forgot-password" Component={Login} exact />
    </Routes>
  
  )
}

export default Authetication