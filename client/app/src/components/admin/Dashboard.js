import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserRoute } from "../../services/Authentication.service";

export default function AdminDashboard() { 
  const userType = useSelector((state) => state.userInfo.userInfo.modules.userType)
  const userRoute = getUserRoute(userType)

  return (
    <div>
      <div>
        <Link to={`${userRoute}/dashboard`}>
          <h3>DashBoard</h3>
        </Link>
      </div>
      <div>
        <Link to={`${userRoute}/vehicle`}>
          <h3>Vehicle</h3>
        </Link>
      </div>
      <div>
        <Link to={`${userRoute}/vehicle-pricing`}>
          <h3>Pricing</h3>
        </Link>
      </div>
    </div>
  );
}
