import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import store from "../store";
import logo from '../assets/img/logomain.png';


export default function SideNavBar() {
  const { pathname } = useLocation();
  return (
    <>
    {/* dasktop responsive */}
    <nav id="sidebarMenu" className="sidebar bg-white  border-top_LR d-none-R">
      <div className="position-sticky">
        <div className="list-group list-group-flush">
          <Link
            to={`/dashboard`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/dashboard` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-th-large fa-fw me-3"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            to={`/vehicle`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-car fa-fw me-3"></i>
            <span>Vehicle</span>
          </Link>
          <Link
            to={`/vehicle-pricing`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle-pricing` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-money-bill fa-fw me-3"></i>
            <span>Pricing</span>
          </Link>
          <Link
            to={`/booking-info`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/booking-info` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-taxi fa-fw me-3"></i>
            <span>Booking Info</span>
          </Link>
          <Link
            to={`/enquire-package`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/enquire-package` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-suitcase fa-fw me-3"></i>
            <span>Enquire Package</span>
          </Link>
          <Link
            to={`/referral`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/referral` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-people-arrows me-3"></i>
            <span>Referral Code</span>
          </Link>
          <Link
            to={`/leads`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/leads` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-tasks fa-fw me-3"></i>
            <span>Leads</span>
          </Link>
          <Link
            to={`/users`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/users` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-users fa-fw me-3"></i>
            <span>Users</span>
          </Link>
          <Link
            to={`/notification`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/notification` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-users fa-fw me-3"></i>
            <span>Users</span>
          </Link>
        </div>
      </div>
    </nav>

{/* MObile responsive */}
    <nav id="sidebarMenu" className="sidebar border-top_LR d-none-M sidenav-mobile ">
      <div className="bg-white h-100 w-75">
        <div className="d-flex justify-content-between p-3">
        <a href="index.html">
              <img className='w-100 h-60p' src={logo} alt="logo-img" />
            </a>
          <i className="fas fa-times close-btn"></i>
          </div>
        <div className="list-group list-group-flush">
          <Link
            to={`/dashboard`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/dashboard` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-th-large fa-fw me-3"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            to={`/vehicle`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-car fa-fw me-3"></i>
            <span>Vehicle</span>
          </Link>
          <Link
            to={`/vehicle-pricing`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/vehicle-pricing` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-money-bill fa-fw me-3"></i>
            <span>Pricing</span>
          </Link>
          <Link
            to={`/booking`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/booking` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-taxi fa-fw me-3"></i>
            <span>Booking Info</span>
          </Link>
          <Link
            to={`/enquire-package`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/enquire-package` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-suitcase fa-fw me-3"></i>
            <span>Enquire Package</span>
          </Link>
          <Link
            to={`/referral`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/referral` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-people-arrows me-3"></i>
            <span>Referral Code</span>
          </Link>
          <Link
            to={`/leads`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/leads` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-tasks fa-fw me-3"></i>
            <span>Leads</span>
          </Link>
          <Link
            to={`/users`}
            className={`list-group-item list-group-item-action py-2 ripple ${pathname === `/users` ? 'active-admin' : ''}`}
          >
            <i className="fas fa-users fa-fw me-3"></i>
            <span>Users</span>
          </Link>
        </div>
      </div>
    </nav>
    </>
  );
}
