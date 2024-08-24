import React from 'react'
import style from '../assets/css/style.css'

 const logo = require('../assets/img/logo.png');

function TopNavBar() {
  return (
    <div>
        {/* <div class="fix-area ">
    <div class="offcanvas__info">
      <div class="offcanvas__wrapper side-nav">
        <div class="offcanvas__content">
          <div class="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
            <div class="offcanvas__logo">
              <a href="index.html">
                <img src="assets/img/logo.png" alt="logo-img" />
              </a>
            </div>
            <div class="offcanvas__close">
              <button>
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div class="mean__menu-wrapper">
            <div class="main-menu">
              <nav id="mobile-menu">
                <ul>
                  <li class="has-dropdown active menu-thumb">
                    <a href="index.html"> Home </a>
                  </li>

                  <li>
                    <a href="package.html"> Packages </a>
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
          <div class="icon-items">
            
            <div class="content">
              <p>Call Anytime</p>
              <h6><a href="tel:+9288009850">+91 (8800) - 9850</a></h6>
            </div>
          </div>


          
        </div>
      </div>
    </div>
  </div>
  <div class="offcanvas__overlay"></div>

   */}
        <header id="header-sticky" className="header-1">
        <div className="container-fluid">
            <div className="mega-menu-wrapper">
                <div className="header-main">
                    <div className="header-left">
                        <div className="logo">
                            <a href="http://127.0.0.1:5500/client/index.html" className="header-logo">
                                <img src={logo} alt="logo-img"/>
                            </a>
                        </div>
                        <div className="mean__menu-wrapper">
                            <div className="main-menu">
                                <nav id="mobile-menu">
                                    <ul>
                                        <li className="has-dropdown active menu-thumb">
                                            <a href="http://127.0.0.1:5500/client/index.html">
                                                Home
                                            </a>
                                        </li>
                                        
                                        <li>
                                            <a href="car-list.html">
                                                Cars
                                            </a>
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
                        <div className="icon-items">
                            <div className="icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div className="content">
                                <p>Call Anytime</p>
                                <h6><a href="tel:+9288009850">+91 (8800) - 9850</a></h6>
                            </div>
                        </div>
                        {/* <a href="#0" className="search-trigger search-icon"><i
                                className="fa-regular fa-magnifying-glass"></i></a> */}
                    <a href="http://127.0.0.1:3000/">
                        <button class="theme-btn wow fadeInUp padding-signin-btn">
                            Login
                        </button>
                            </a>
                        {/* <button class="btn-signup" type="button" id="submitSuttom">
                            Login
                        </button> */}
                        
                        <div className="header__hamburger d-xl-none my-auto">
                            <div className="sidebar__toggle">
                                <i className="fas fa-bars"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </header>
        
    </div>
  )
}

export default TopNavBar