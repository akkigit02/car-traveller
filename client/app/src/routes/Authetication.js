import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import NotFound from './NotFound'

function Authetication() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} exact/>
        <Route path="/forgot-password" Component={Login} exact/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Authetication