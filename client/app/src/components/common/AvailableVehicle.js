import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavBar from "../TopNavBar";
import { TRIP_TYPE } from "../../constants/common.constants";
import moment from "moment";
// import { icon } from "../../assets/css/icon.css";

export default function AvailableVehicle() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState("");
  const [carList, setCarList] = useState([]);
  const taxImage = require("../../assets/img/tax.png");
  const doorImage = require("../../assets/img/download");

  const getCarList = async (query) => {
    try {
      const { data } = await axios({
        url: "/api/client/car-list",
        params: { search: query },
      });
      setBookingDetails({
        ...data.bookingDetails,
        type: TRIP_TYPE.find((ty) => ty.value === query.type)?.name,
        time: query.pickupTime,
        date: query.pickupDate,
      });
      setCarList(data.cars);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      // decode query
      const decodedString = atob(query);
      const decodedData = JSON.parse(decodedString);
      setBookingDetails(decodedData);
      // getCarList();
      console.log(decodedData, "======---------");
      getCarList(decodedData);
    } else window.location.href = "http:127.0.0.1:5500";
  }, []);

  const book = () => {
    navigate(`/signup/${query}`);
  };

  return (
    <>
      <div>
        <TopNavBar />
        <div className="row m-0">
          <div className="col-lg-3 col-md-3 col-12">
            <div className="height-car-list mt-3 car-list-items">
                <div className="d-flex p-3 justify-content-center mb-2 bg-blue-light">
                  <h5>
                    {bookingDetails.from} - {bookingDetails.to} (
                    {bookingDetails.type || "One Way"})
                  </h5>
                </div>
                <div className="p-3">
                  <div className="me-3 col-12 mb-3">
                    <p className="mb-0">Pickup Date</p>
                    <div className="highlight-data">
                      {moment(bookingDetails.date).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div className="me-3 col-12 mb-3">
                    <p className="mb-0">Time</p>
                    <div className="highlight-data">{bookingDetails.time}</div>
                  </div>
                  
                
                <div className="d-flex justify-content-end">
                  <a href="http://127.0.0.1:5500/client/index.html">
                      <button className="cstm-btn-red">Change</button>
                    </a>
                  </div>
                  </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-12 mt-3">
            <div className="col-lg-12 cstm-calHeight">
              {carList.map((item, idx) => (
                <div className="car-list-items mb-3" key={idx}>
                  <div className="d-flex">
                    <div className="car-image bg-cover">
                      <img src={item.vehicleImageUrl} />
                    </div>
                    <div className="w-100 border-start">
                      <div className="car-content d-flex justify-content-between align-items-center border-bottom">
                        <div>
                          <h6>
                            <span>{item.vehicleName}</span>
                          </h6>
                          <div className="star">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <span>2 Reviews</span>
                          </div>
                        </div>

                        <div class="icon-items">
                          <div class="icon">
                            <img src={doorImage} alt="img" />
                          </div>
                          <div class="content">
                            <h6>Passengers:</h6>
                            <p className="mb-0 pb-0">4 + 1 Seats</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                          <div className=" me-3 d-flex flex-column align-items-center">
                          <p className="mb-0 pb-0">Distance: </p>
                            <p className="mb-0 pb-0 ">
                              {bookingDetails.distance}KM
                            </p>
                          </div>
                          <div>
                            <p className="mb-0 pb-0 pe-3 text-cut font-20 font-bold">&#8377; 3400</p>
                          </div>
                          <button
                            className="border-0 bg-unset"
                            onClick={() => {
                              book("carId");
                            }}
                          >
                            <h6 className="price mb-0">
                              &#8377; {Math.ceil(item.totalPrice)}
                            </h6>
                          </button>
                        </div>
                      </div>
                      <div className="p-1 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img className="w-40" src={taxImage} />
                          <p className="mb-0 font-14">
                            Includes Toll, State Tax & GST
                          </p>
                        </div>
                        <div className="pe-3">
                          <i className="fa fa-angle-down cursor-pointer"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="border-top p-3 minHeight_150">
                    yadfaso
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
