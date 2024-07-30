import React from "react";
import { getUserRoute } from "../services/Authentication.service";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SESSION_INFO } from "../services/store/slice/userInfoSlice";

export default function SideNavBar() {
  const userType = useSelector(
    (state) => state.userInfo.userInfo.modules.userType
  );
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userRoute = getUserRoute(userType);
  const { pathname } = useLocation();
  const handleLogout = () => {
    localStorage.clear()
    dispatch(SESSION_INFO({}))
    navigate('/')
    window.location.reload()
  }
  return (
    <div>
         <header>
        <nav id="sidebarMenu" className="sidebar bg-white">
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4">
              <Link
                to={`${userRoute}/dashboard`}
                className={`list-group-item list-group-item-action py-2 ripple ${pathname === `${userRoute}/dashboard` ? 'active' : ''}`}
              >
                <i className="fas fa-tachometer-alt fa-fw me-3"></i>
                <span>Dashboard</span>
              </Link>
              <Link
                to={`${userRoute}/vehicle`}
                className={`list-group-item list-group-item-action py-2 ripple ${pathname === `${userRoute}/vehicle` ? 'active' : ''}`}
              >
                <i className="fas fa-chart-area fa-fw me-3"></i>
                <span>Vehicle</span>
              </Link>
              <Link
                to={`${userRoute}/vehicle-pricing`}
                className={`list-group-item list-group-item-action py-2 ripple ${pathname === `${userRoute}/vehicle-pricing` ? 'active' : ''}`}
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

        {/* <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
          <div className="container-fluid">
            <button
              data-mdb-button-init
              className="navbar-toggler"
              type="button"
              data-mdb-collapse-init
              data-mdb-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button>

            <a className="navbar-brand" href="#">
              <img
                src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
                height="25"
                alt="MDB Logo"
                loading="lazy"
              />
            </a>

            <ul className="navbar-nav ms-auto d-flex flex-row">
              <li className="nav-item dropdown">
                <a
                  data-mdb-dropdown-init
                  className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-bell"></i>
                  <span className="badge rounded-pill badge-notification bg-danger">1</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                  <li><a className="dropdown-item" href="#">Some news</a></li>
                  <li><a className="dropdown-item" href="#">Another news</a></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link me-3 me-lg-0" href="#"><i className="fas fa-fill-drip"></i></a>
              </li>
              <li className="nav-item me-3 me-lg-0">
                <a className="nav-link" href="#"><i className="fab fa-github"></i></a>
              </li>
              <li className="nav-item dropdown">
                <a
                  data-mdb-dropdown-init
                  className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="united kingdom flag m-0"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#"><i className="united kingdom flag"></i>English <i className="fa fa-check text-success ms-2"></i></a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-poland flag"></i>Polski</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-china flag"></i>中文</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-japan flag"></i>日本語</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-germany flag"></i>Deutsch</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-france flag"></i>Français</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-spain flag"></i>Español</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-russia flag"></i>Русский</a></li>
                  <li><a className="dropdown-item" href="#"><i className="flag-portugal flag"></i>Português</a></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  data-mdb-dropdown-init
                  className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
                    className="rounded-circle"
                    height="22"
                    alt="Avatar"
                    loading="lazy"
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                  <li><a className="dropdown-item" href="#">My profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><a className="dropdown-item" href="#">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav> */}
      </header>
    </div>
  );
}
