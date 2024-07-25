import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../components/Login'

function Authetication() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/forgot-password" Component={Login} />
      </Routes>
    </BrowserRouter>
  )
}

export default Authetication