import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from '../components/common/LandingPage';
import AvailableVehicle from '../components/common/AvailableVehicle';
import BookingPage from '../components/common/BookingPage';

export default function Common() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" Component={LandingPage} exact/>
        <Route path="/available-vehicle/:city_from/:city_to" Component={AvailableVehicle} exact/>
        <Route path="/booking/:city_from/:city_to/:carId" Component={BookingPage} exact/>
    </Routes>
    </BrowserRouter>
  )
}
