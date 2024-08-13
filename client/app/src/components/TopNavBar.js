import React from 'react'
import style from '../assets/css/style.css'

 const logo = require('../assets/img/logo.png');

function TopNavBar() {
  return (
    <header id="header-sticky" className="header-1">
    <div className="container-fluid">
        <div className="mega-menu-wrapper">
            <div className="header-main">
                <div className="header-left">
                    <div className="logo">
                        <a href="index.html" className="header-logo">
                            <img src={logo} alt="logo-img"/>
                        </a>
                    </div>
                    <div className="mean__menu-wrapper">
                        <div className="main-menu">
                            <nav id="mobile-menu">
                                <ul>
                                    <li className="has-dropdown active menu-thumb">
                                        <a href="index.html">
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
                     <button class="theme-btn wow fadeInUp padding-signin-btn">
                        Sign in
                    </button>
                    <button class="btn-signup" type="button" id="submitSuttom">
                        SignUp
                    </button>
                    
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
  )
}

export default TopNavBar