import React from "react";
import { Link, useLocation } from "react-router-dom";


export default function SideNavBar() {
  const { pathname } = useLocation();
  const handleLogout = () => {
    localStorage.clear()
  }
  return (
    <nav id="sidebarMenu" className="sidebar bg-white" style={{width:220}}>
      <div className="position-sticky">
        <div className="list-group list-group-flush mx-3 mt-4">
          <Link
            to={`/dashboard`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/dashboard` ? 'active' : ''}`}
          >
            <i className="fas fa-tachometer-alt fa-fw me-3"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            to={`/vehicle`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle` ? 'active' : ''}`}
          >
            <i className="fas fa-chart-area fa-fw me-3"></i>
            <span>Vehicle</span>
          </Link>
          <Link
            to={`/vehicle-pricing`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle-pricing` ? 'active' : ''}`}
          >
            <i className="fas fa-lock fa-fw me-3"></i>
            <span>Pricing</span>
          </Link>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-chart-line fa-fw me-3"></i>
            <span>Analytics</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action py-2 ripple">
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
          </a>
          <div onClick={handleLogout} className="list-group-item list-group-item-action py-2 ripple">
            <i className="fas fa-money-bill fa-fw me-3"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
