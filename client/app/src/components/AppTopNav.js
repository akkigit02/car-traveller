import React from 'react'
import style from '../assets/css/header.css'
import { useSelector } from 'react-redux'

function AppTopNav() {
  const userInfo = useSelector((state) => state.userInfo)

  return (
    <div className='p-3 d-flex justify-content-between align-items-center border-bottom shadow'>
        <div className='d-flex align-items-center'>
            <div>LOgo</div>
            <p className='ms-3 mb-0'>{userInfo?.modules?.userType}</p>
        </div>
        <div className='d-flex align-items-center'>
            <p className='mb-0'>{userInfo?.name}</p>
            <div className='profile-circle ms-3'>{userInfo?.name?.charAt(0)?.toUpperCase()}</div>
        </div>
    </div>
  )
}

export default AppTopNav