import React from 'react';
import { Link, useLocation } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <div>
        <Link to="/dashboard">
          <h3>DashBoard</h3>
        </Link>
      </div>
      <div>
        <Link to="/vehicle">
          <h3>Vehicle</h3>
        </Link>
      </div>
      <div>
        <Link to="/vehicle-pricing">
          <h3>Pricing</h3>
        </Link>
      </div>
      <div>
        <Link to="/admin-login">
          <h3>Admin Login</h3>
        </Link>
      </div>
    </div>
  )
}
