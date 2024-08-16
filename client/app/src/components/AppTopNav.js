import React from 'react'
import style from '../assets/css/header.css'

function AppTopNav() {

  return (
    <div className='p-3 d-flex justify-content-between align-items-center border-bottom shadow'>
        <div className='d-flex align-items-center'>
            <div>LOgo</div>
            <p className='ms-3 mb-0'>Source -name</p>
        </div>
        <div className='d-flex align-items-center'>
            <p className='mb-0'>User-Name</p>
            <div className='profile-circle ms-3'>A</div>
        </div>
    </div>
  )
}

export default AppTopNav