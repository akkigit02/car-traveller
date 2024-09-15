import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import store from "../store";


export default function SideNavBar() {
  const { pathname } = useLocation();
  return (
    <nav id="sidebarMenu" className="sidebar bg-white">
      <div className="position-sticky">
        <div className="list-group list-group-flush">
          <Link
            to={`/dashboard`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/dashboard` ? 'active' : ''}`}
          >
            <i className="fas fa-th-large fa-fw me-3"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            to={`/vehicle`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle` ? 'active' : ''}`}
          >
            <i className="fas fa-car fa-fw me-3"></i>
            <span>Vehicle</span>
          </Link>
          <Link
            to={`/vehicle-pricing`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle-pricing` ? 'active' : ''}`}
          >
            <i className="fas fa-money-bill fa-fw me-3"></i>
            <span>Pricing</span>
          </Link>
          <Link
            to={`/booking`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/booking` ? 'active' : ''}`}
          >
            <i className="fas fa-taxi fa-fw me-3"></i>
            <span>Booking Info</span>
          </Link>
          <Link
            to={`/enquire-package`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/enquire-package` ? 'active' : ''}`}
          >
            <i className="fas fa-lock fa-fw me-3"></i>
            <span>Enquire Package</span>
          </Link>
          <Link
            to={`/referral`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/referral` ? 'active' : ''}`}
          >
            <i className="fas fa-lock fa-fw me-3"></i>
            <span>Referral Code</span>
          </Link>
          <Link
            to={`/leads`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/leads` ? 'active' : ''}`}
          >
            <i className="fas fa-lock fa-fw me-3"></i>
            <span>Leads</span>
          </Link>
          <Link
            to={`/users`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/users` ? 'active' : ''}`}
          >
            <i className="fas fa-lock fa-fw me-3"></i>
            <span>User</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
