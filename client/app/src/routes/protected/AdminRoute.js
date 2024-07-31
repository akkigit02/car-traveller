import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../../components/admin/Dashboard";
import React from 'react'
import SideNavBar from "../../components/SideNavBar";
import VehiclePricing from "../../components/admin/VehiclePricing";

function AdminRoute() {
  return (
    <>
      <main>
        <SideNavBar />
        <Routes>
          <Route path={`/`} Component={AdminDashboard}  exact />
          <Route path={`/dashboard`} Component={AdminDashboard}  exact />
          <Route path={`/vehicle-pricing`} Component={VehiclePricing}  exact />
        </Routes>
      </main>
    </>
  )
}

export default AdminRoute