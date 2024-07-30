import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../../components/admin/Dashboard";
import React from 'react'
import SideNavBar from "../../components/SideNavBar";

function AdminRoute() {
  return (
    <>
    <main>
      <SideNavBar />
      {/* <Routes>
        <Route path={`/`} Component={AdminDashboard} name="ADMIN_DASHBOARD" exact />
        <Route path={`/dashboard`} Component={AdminDashboard} name="ADMIN_DASHBOARD" exact />
      </Routes> */}
      </main>
    </>
  )
}

export default AdminRoute