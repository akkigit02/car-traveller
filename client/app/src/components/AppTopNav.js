import React, { useRef, useState } from 'react'
import style from '../assets/css/header.css'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import store from '../store'
import logo from '../assets/img/logomain.png';
import user from '../assets/img/user.png';

function AppTopNav() {

  const userInfo = useSelector((state) => state.userInfo)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalExpanded, setModalExpanded] = useState(false);
  

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear()
    store.dispatch({ type: 'SET_INTO_STORE', payload: { userInfo: null } })
  }


  const toggleDropdown2 = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleExpand = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setModalExpanded(true);
    }, 100); 
  };

  const closeModal = () => {
    setModalExpanded(false);
  };

  return (
    <>
    <div className='p-3 d-flex justify-content-between align-items-center border-bottom shadow'>
        <div className='d-flex align-items-center'>
          <div className="offcanvas__logo">
            <a href="index.html">
              <img className='w-100 h-60p' src={logo} alt="logo-img" />
            </a>
          </div>
          {/* <Link to={`/profile`}>
            <p className='ms-3 mb-0'>{userInfo?.modules?.userType}</p>
          </Link> */}
        </div>
        <div className='d-flex'>



        <div className="header-cstm">
          <div className="notification-cstm">
            <span className="notification-cstm-icon" onClick={toggleDropdown2}>
              &#128276;
            </span>
            {isDropdownOpen && (
              <div className={`dropdown-cstm ${isDropdownOpen ? 'transitioning' : ''}`}>
                <ul>
                  <li>Message 1</li>
                  <li>Message 2</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                </ul>
                <button id="expandButton" onClick={handleExpand}>
                  Expand
                </button>
              </div>
            )}
          </div>
        </div>




        <div className="dropdown" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="cstm-dropdown-toggle">
            <img src={user}/>
          </button>
          {isOpen && (
            <div className="dropdown-menu">
              <Link to={`/profile`} className="dropdown-item" onClick={closeDropdown}>
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>)}
        </div>
        </div>
    </div>

    {isModalExpanded && <div className="modal-overlay-cstm"></div>}

      {isModalExpanded && (
        <div className={`modal-content-expanded ${isModalExpanded ? 'active' : ''}`}>
          <span className="close-cstm" onClick={closeModal}>&times;</span>
          <h2>Expanded Notification Details</h2>
          <p>This is the expanded modal with more content...</p>
          <ul>
                  <li>Message 1</li>
                  <li>Message 2</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                  <li>Message 3</li>
                </ul>
        </div>
      )}
    </>
  )
}

export default AppTopNav