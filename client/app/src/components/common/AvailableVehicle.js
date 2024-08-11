import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavBar from "../TopNavBar";
import { TRIP_TYPE } from "../../constants/common.constants";
import moment from 'moment'
// import { icon } from "../../assets/css/icon.css";

export default function AvailableVehicle() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState('')
  const [carList, setCarList] = useState([])
  const carImage = require("../../assets/img/car-list-1.webp");

  const getCarList = async (query) => {
    try {
      const { data } = await axios({
        url: "/api/client/car-list",
        params: { search: query },
      });
      setBookingDetails({...data.bookingDetails, type: TRIP_TYPE.find(ty => ty.value === query.type)?.name, time: query.pickupTime, date: query.pickupDate})
      setCarList(data.cars)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      // decode query   
      const decodedString = atob(query);
      const decodedData = JSON.parse(decodedString);
      setBookingDetails(decodedData)
      // getCarList();
      console.log(decodedData,"======---------")
      getCarList(decodedData)
    }
    else window.location.href = 'http:127.0.0.1:5500'

  }, []);


  const book = () => {
    navigate(`/signup/${query}`)
  }



  return (
    <>
      <div>
        <TopNavBar />
        <div className="bg-grey p-4 mb-3">
          <div className="container">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h6>{bookingDetails.from} - {bookingDetails.to} ({bookingDetails.type || 'One Way'})</h6>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <p className="mb-0">Pickup Date</p>
                  <div className="highlight-data">{moment(bookingDetails.date).format('DD/MM/YYYY')}</div>
                </div>
                <div className="me-3">
                  <p className="mb-0">Time</p>
                  <div className="highlight-data">{bookingDetails.time}</div>
                </div>
                <a href="http://127.0.0.1:5500/client/index.html">
                
                <button className="cstm-btn-red">Change</button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="col-lg-12">
            {carList.map((item, idx) => (<div className="car-list-items" key={idx}>
            
              <div className="car-image bg-cover">
                <img src={item.vehicleImageUrl} />
              </div>
              <div className="car-content">
                <button onClick={() => { book('carId',) }}>
                  <h6 className="price">
                    {Math.ceil(item.totalPrice)} <span>Rs</span>
                  </h6>
                </button>
                <h6>
                  <span>
                    {item.vehicleName}
                  </span>
                </h6>
                <div className="star">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <span>2 Reviews</span>
                </div>
                <h6>
                  Distance: {bookingDetails.distance}
                </h6>
              </div>
            </div>))}
          </div>
        </div>
      </div>
    </>
  );
}
