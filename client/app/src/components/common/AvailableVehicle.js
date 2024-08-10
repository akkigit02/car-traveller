import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavBar from "../TopNavBar";
// import { icon } from "../../assets/css/icon.css";

export default function AvailableVehicle() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState('')
  const carImage = require("../../assets/img/car-list-1.webp");

  const getCarList = async () => {
    try {
      const { data } = await axios({
        url: "/api/client/car-list",
        params: { search: bookingDetails },
      });
      console.log(data);
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
                <h6>Pune - Nashik (one way)</h6>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <p className="mb-0">Pickup Date</p>
                  <div className="highlight-data">10-08-2024</div>
                </div>
                <div className="me-3">
                  <p className="mb-0">Time</p>
                  <div className="highlight-data">07:00 PM</div>
                </div>
                <button className="cstm-btn-red">Modify</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="col-lg-12">
            <div className="car-list-items">
              <div className="car-image bg-cover">
                <img src={carImage} />
              </div>
              <div className="car-content">
                <button onClick={() => { book('carId',) }}>
                  <h6 className="price">
                    7000.00 <span>/ Day</span>
                  </h6>
                </button>
                <h6>
                  <a href="#">Hyundai Accent Limited</a>
                </h6>
                <div className="star">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <span>2 Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
