import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../../components/admin/Dashboard";
import React from "react";
import SideNavBar from "../../components/SideNavBar";
import VehiclePricing from "../../components/admin/VehiclePricing";
import Demo from "../../components/admin/Demo";
import Vehicle from "../../components/admin/Vehicle";
import Booking from "../../components/admin/Booking";
import AppTopNav from "../../components/AppTopNav";

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
          <div className="col-lg-10 col-md-10 col-12">
            <div className="border rounded shadow p-3 h-100">
              <Routes>
                <Route path={`/`} Component={AdminDashboard} exact />
                <Route path={`/dashboard`} Component={AdminDashboard} exact />
                <Route path={`/vehicle`} Component={Vehicle} exact />
                <Route
                  path={`/vehicle-pricing`}
                  Component={VehiclePricing}
                  exact
                />
                <Route path={`/booking`} Component={Booking} exact />
                <Route path={`/demo`} Component={Demo} exact />
              </Routes>
            </div>
          </div>
        </div>
        <footer className="p-3 border-top w-100 shadow  d-flex justify-content-center position-absolute bottom-0">
          <p className="mb-0">© Copyright 2024 by dddcabs.com</p>
        </footer>
      </main>
    </>
  );
}

export default AdminRoute;
