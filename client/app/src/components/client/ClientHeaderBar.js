import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/img/logomain.png';
import user from '../../assets/img/user.png';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import store from '../../store';
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL

function TopNavBar() {
  const { pathname } = useLocation();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isBodyOverlayOpen, setIsBodyOverlayOpen] = useState(false);
  const userInfo = useSelector((state) => state.userInfo)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsOffcanvasOpen(true);
    setIsOverlayOpen(true);
  };

  const handleClose = () => {
    setIsOffcanvasOpen(false);
    setIsOverlayOpen(false);
  };

  const handleBodyOverlayClick = () => {
    setIsOffcanvasOpen(false);
    setIsOverlayOpen(false);
    setIsBodyOverlayOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear()
    store.dispatch({ type: 'SET_INTO_STORE', payload: { userInfo: null } })
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className={`fix-area ${isOffcanvasOpen ? 'info-open' : ''}`}>
        <div className={`offcanvas__info ${isOffcanvasOpen ? 'info-open' : ''}`}>
          <div className="offcanvas__wrapper side-nav">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="index.html">
                    <img className='w-100 h-60p' src={logo} alt="logo-img" />
                  </a>
                </div>
                <div className="offcanvas__close" onClick={handleClose}>
                  
                    <i className="fas fa-times"></i>
                  
                </div>
              </div>

              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown active menu-thumb">
                        <a href={CLIENT_URL}>Home</a>
                      </li>
                      {/* <li>
                        <a href="https://www.dddcabs.com/package.html#">Packages</a>
                      </li> */}
                      <li>
                        <a href="https://www.dddcabs.com/about.html">About Us</a>
                      </li>
                      <li>
                        <a href="https://www.dddcabs.com/contactUs.html">Contact</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="icon-items">
                <div className="content">
                  <p>Call Anytime</p>
                  <h6><a href="tel:+919090404005">+91 9090 404005</a></h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`offcanvas__overlay ${isOverlayOpen ? 'overlay-open' : ''}`}
        onClick={handleClose}
      ></div>

      <div
        className={`body-overlay ${isBodyOverlayOpen ? 'opened' : ''}`}
        onClick={handleBodyOverlayClick}
      ></div>

      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <a href={CLIENT_URL} className="header-logo">
                    <img className='w-100 h-60p' src={logo} alt="logo-img" />
                  </a>
                </div>
                <div className="mean__menu-wrapper d-none-cstm">
                  <div className="main-menu">
                    <nav id="mobile-menu">
                      <ul>
                        <li className="has-dropdown active menu-thumb">
                          <a href={CLIENT_URL}>Home</a>
                        </li>
                        <li>
                          <a href="https://www.dddcabs.com/package.html#!">Packages</a>
                        </li>
                        <li>
                          <a href="https://www.dddcabs.com/about.html">About Us</a>
                        </li>
                        <li>
                          <a href="https://www.dddcabs.com/contactUs.html">Contact</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="icon-items d-none-cstm">
                  <div className="icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="content">
                    <p className='mb-0'>Call Anytime</p>
                    <h6><a href="tel:+919090404005">+91 9090 404005</a></h6>
                  </div>
                </div>
                {userInfo ? <>
                <div>

                <div className="dropdown" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="cstm-dropdown-toggle">
                    <img src={user}/>
                  </button>
                  {isOpen && (
                    <div className="dropdown-menu right-0">
                      <Link to={`/profile`} className="dropdown-item" onClick={closeDropdown}>
                        <span>Profile</span>
                      </Link>
                      <Link to={`/booking-list`} className="dropdown-item" onClick={closeDropdown}>
                        <span>Booking List</span>
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                  

                  {/* <Link
                    to={`/profile`}
                  >
                    <span>Profile</span>
                  </Link>
                  <Link
                    to={`/booking-list`}
                  >
                    <span>Booking list</span>
                  </Link>
                  <button onClick={handleLogout} className="theme-btn wow fadeInUp padding-signin-btn">
                    Logout
                  </button> */}


                  </div>
                </> :
                  <>
                    <a href={`${pathname === '/login' ? '/admin-login' : '/login'}`}>
                      <button className="theme-btn wow fadeInUp padding-signin-btn">
                        {pathname === '/login' ? 'Admin' : 'User'} Login
                      </button>
                    </a>
                  </>
                }
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle" onClick={handleSidebarToggle}>
                    <i className="fas fa-bars"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default TopNavBar;
