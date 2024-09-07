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

  return (
    <div className='p-3 d-flex justify-content-between align-items-center border-bottom shadow'>
        <div className='d-flex align-items-center'>
          <div className="offcanvas__logo">
            <a href="index.html">
              <img className='w-100 h-60p' src={logo} alt="logo-img" />
            </a>
          </div>
          <Link to={`/profile`}>
            <p className='ms-3 mb-0'>{userInfo?.modules?.userType}</p>
          </Link>
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
  )
}

export default AppTopNav