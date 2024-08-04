import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../../components/admin/Dashboard";
import React from 'react'
import SideNavBar from "../../components/SideNavBar";
import VehiclePricing from "../../components/admin/VehiclePricing";
import Demo from "../../components/admin/Demo";
import Vehicle from "../../components/admin/Vehicle";
import Booking from "../../components/admin/Booking";

function AdminRoute() {
  return (
    <>
      <main>
        <SideNavBar />
        <Routes>
          <Route path={`/`} Component={AdminDashboard}  exact />
          <Route path={`/dashboard`} Component={AdminDashboard}  exact />
          <Route path={`/vehicle`} Component={Vehicle}  exact />
          <Route path={`/vehicle-pricing`} Component={VehiclePricing}  exact />
          <Route path={`/booking`} Component={Booking}  exact />
          <Route path={`/demo`} Component={Demo}  exact />
        </Routes>
      </main>
    </>
  )
}

export default AdminRoute