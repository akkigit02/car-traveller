import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import store from "../store";


export default function SideNavBar() {
  const { pathname } = useLocation();
  const handleLogout = () => {
    localStorage.clear()
    store.dispatch({ type: 'SET_INTO_STORE', payload: { userInfo: null } })
  }
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
            to={`/demo`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/demo` ? 'active' : ''}`}
          >
            <i className="fas fa-lock fa-fw me-3"></i>
            <span>Demo</span>
          </Link>
          {/* <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-chart-pie fa-fw me-3"></i>
            <span>SEO</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-chart-bar fa-fw me-3"></i>
            <span>Orders</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-globe fa-fw me-3"></i>
            <span>International</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-building fa-fw me-3"></i>
            <span>Partners</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-calendar fa-fw me-3"></i>
            <span>Calendar</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-users fa-fw me-3"></i>
            <span>Users</span>
          </a> */}
          <div onClick={handleLogout} className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-sign-out fa-fw me-3"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
