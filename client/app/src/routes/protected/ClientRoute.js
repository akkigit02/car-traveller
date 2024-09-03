import React from 'react'
import Payment from '../../components/client/Payment'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from '../../components/admin/Dashboard'
import ClientHeaderBar from '../../components/ClientHeaderBar'
import AvailableVehicle from '../../components/common/AvailableVehicle'
import BookingForm from '../../components/common/BookingForm'
import BookingHistory from '../../components/client/BookingHistory'
import Profile from '../../components/common/Profile'

export default function ClientRoute() {
  return (
    <main className="position-relative h-100vh">
      <ClientHeaderBar />
      <div className="row mx-0 mt-3">
        <div className="col-lg-12 col-md-12 col-12">
          <div className="border rounded shadow p-3 h-100">
            <Routes>
              <Route path={`/`} element={<Navigate to="/dashboard" />} exact />
              <Route path={`/dashboard`} Component={AdminDashboard} exact />
              <Route path="/car-list/:query" Component={AvailableVehicle} exact />
              <Route path="/booking/:query" Component={BookingForm} exact />
              <Route path={`/payment/:bookingId`} Component={Payment} exact />
              <Route path={`/booking-list`} Component={BookingHistory} exact />
              <Route path={`/profile`} Component={Profile} exact />
              <Route path={`/*`} element={<Navigate to="/dashboard" />} exact />
            </Routes>
          </div>
        </div>
      </div>
      <footer className="p-3 border-top w-100 shadow  d-flex justify-content-center position-absolute bottom-0">
        <p className="mb-0">© Copyright 2024 by dddcabs.com</p>
      </footer>
    </main>
  )
}
