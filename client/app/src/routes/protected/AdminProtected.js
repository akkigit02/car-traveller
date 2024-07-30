import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Vehicle from "../../components/admin/Vehicle";
import AdminDashboard from "../../components/admin/Dashboard";
import VehiclePricing from "../../components/admin/VehiclePricing";
import Login from "../../components/Login";
import SideNavBar from "../../components/SideNavBar";
function Protected({userRoute, userType}) {
  return (
    <div>
    <BrowserRouter>
    <div>
    <SideNavBar userType={userType} />
    </div>
    <div>
      <Routes>
        <Route path={`${userRoute}/vehicle`} Component={Vehicle} name="VEHICLE" exact/>
        <Route path={`${userRoute}/dashboard`} Component={AdminDashboard} name="ADMIN_DASHBOARD" exact/>
        <Route path={`${userRoute}/vehicle-pricing`} Component={VehiclePricing} name="VEHICLE_PRICING" exact/>
        <Route path={`/`} Component={Login} exact/>
      </Routes>

    </div>
    </BrowserRouter>
    </div>
  );
}

export default Protected;
