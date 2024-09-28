import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "../../components/admin/Dashboard";
import React from "react";
import SideNavBar from "../../components/SideNavBar";
import VehiclePricing from "../../components/admin/VehiclePricing";
import Vehicle from "../../components/admin/Vehicle";
import Booking from "../../components/admin/Booking";
import AppTopNav from "../../components/AppTopNav";
import EnquirePackage from "../../components/admin/EnquirePackage";
import ReferralCode from "../../components/admin/ReferralCode";
import Profile from "../../components/common/Profile";
import Leads from "../../components/admin/Leads"
import Users from "../../components/admin/User"

function AdminRoute() {
  return (
    <>
      <main className="position-relative h-100vh">
        <AppTopNav />
        <div className="row mx-0 mt-3">
          <div className="col-lg-2 col-md-2 col-12 pe-0">
            <div className="border rounded shadow side-nav-h">
              <SideNavBar />
            </div>
          </div>
          <div className="col-lg-10 col-md-10 col-12 page-height-admin">
            <div className="border rounded shadow p-3">
              <Routes>
                <Route path={`/`} element={<Navigate to="/dashboard" />} exact />
                <Route path={`/dashboard`} Component={AdminDashboard} exact />
                <Route path={`/vehicle`} Component={Vehicle} exact />
                <Route
                  path={`/vehicle-pricing`}
                  Component={VehiclePricing}
                  exact
                />
                <Route path={`/booking-info`} Component={Booking} exact />
                <Route path={`/enquire-package`} Component={EnquirePackage} exact />
                <Route path={`/referral`} Component={ReferralCode} exact />
                <Route path={`/profile`} Component={Profile} exact />
                <Route path={`/leads`} Component={Leads} exact />
                <Route path={`/users`} Component={Users} exact />
                <Route path={`/*`} element={<Navigate to="/dashboard" />} exact />
              </Routes>
            </div>
          </div>
        </div>
        <footer className="p-2 border-top w-100 shadow  d-flex justify-content-center position-absolute bottom-0 bg-grey">
          <p className="mb-0">© Copyright 2024 by dddcabs.com</p>
        </footer>
      </main>
    </>
  );
}

export default AdminRoute;
