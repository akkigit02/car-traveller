import React, { useState } from 'react';
import style from '../assets/css/style.css';
import logo from '../assets/img/logo.png';

function TopNavBar() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isBodyOverlayOpen, setIsBodyOverlayOpen] = useState(false);

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

  return (
    <div>
      <div className={`fix-area ${isOffcanvasOpen ? 'info-open' : ''}`}>
        <div className={`offcanvas__info ${isOffcanvasOpen ? 'info-open' : ''}`}>
          <div className="offcanvas__wrapper side-nav">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="index.html">
                    <img src={logo} alt="logo-img" />
                  </a>
                </div>
                <div className="offcanvas__close">
                  <button onClick={handleClose}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown active menu-thumb">
                        <a href="index.html">Home</a>
                      </li>
                      <li>
                        <a href="package.html">Packages</a>
                      </li>
                      <li>
                        <a href="#">About Us</a>
                      </li>
                      <li>
                        <a href="#contact">Contact</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="icon-items">
                <div className="content">
                  <p>Call Anytime</p>
                  <h6>
                    <a href="tel:+9288009850">+91 (8800) - 9850</a>
                  </h6>
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
                  <a href="http://127.0.0.1:5500/client/index.html" className="header-logo">
                    <img src={logo} alt="logo-img" />
                  </a>
                </div>
                <div className="mean__menu-wrapper d-none-cstm">
                  <div className="main-menu">
                    <nav id="mobile-menu">
                      <ul>
                        <li className="has-dropdown active menu-thumb">
                          <a href="http://127.0.0.1:5500/client/index.html">Home</a>
                        </li>
                        <li>
                          <a href="car-list.html">Cars</a>
                        </li>
                        <li>
                          <a href="#">About Us</a>
                        </li>
                        <li>
                          <a href="#contact">Contact</a>
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
                    <p>Call Anytime</p>
                    <h6>
                      <a href="tel:+9288009850">+91 (8800) - 9850</a>
                    </h6>
                  </div>
                </div>
                <a href="http://127.0.0.1:3000/">
                  <button className="theme-btn wow fadeInUp padding-signin-btn">
                    Login
                  </button>
                </a>
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
