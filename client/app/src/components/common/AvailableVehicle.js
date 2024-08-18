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
  const [decodedQuery, setDecodedQuery] = useState(null);
  const taxImage = require("../../assets/img/tax.png");
  const doorImage = require("../../assets/img/download");

  const getCarList = async () => {
    try {
      const { data } = await axios({
        url: "/api/client/car-list",
        params: { search: decodedQuery },
      });
      console.log(data.bookingDetails);
      setBookingDetails({
        ...data.bookingDetails,
        type: TRIP_TYPE.find((ty) => ty.value === decodedQuery.tripType)?.name,
      });
      setCarList(data.cars);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (query) {
      const decodedString = atob(query);
      let decodedData = JSON.parse(decodedString);
      if (decodedData?.tripType === "hourly") {
        decodedData["hourlyType"] = "8hr80km";
      }
      setDecodedQuery(decodedData);
    } else window.location.href = "http:127.0.0.1:5500";
  }, []);

  useEffect(() => {
    if (decodedQuery) getCarList();
  }, [decodedQuery]);

  const book = (car) => {
    if (!bookingDetails) return;
    const jsonString = JSON.stringify({
      vehicleId: car._id,
      totalPrice: car.totalPrice,
      ...bookingDetails,
    });
    const encodedString = btoa(jsonString);
    navigate(`/signup/${encodedString}`);
  };

  const toggleDetails = (index) => {
    const updatedItems = [...carList];
    updatedItems[index].isShowDetail = !updatedItems[index].isShowDetail;
    setCarList(updatedItems);
  };

  return (
    <>
      <div>
        <TopNavBar />
        <div className="row m-0">
          <div className="col-lg-3 col-md-3 col-12 pe-0">
            <div className="height-car-list mt-3 car-list-items">
              <div className="d-flex p-3 justify-content-center mb-2 bg-blue-light">
                <h5>
                  {bookingDetails?.from?.name}{" "}
                  {bookingDetails?.to?.map((city) => (
                    <span> - {city.name}</span>
                  ))}{" "}
                  ({bookingDetails.type || "One Way"})
                </h5>
              </div>
              <div className="p-3">
                <div className="me-3 col-12 mb-3">
                  <p className="mb-0">Pickup Date</p>
                  <div className="highlight-data">
                    {moment(bookingDetails.pickUpDate).format("DD/MM/YYYY")}
                  </div>
                </div>
                {bookingDetails.type === "roundTrip" && (
                  <div className="me-3 col-12 mb-3">
                    <p className="mb-0">Return Date</p>
                    <div className="highlight-data">
                      {moment(bookingDetails.returnDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                )}
                <div className="me-3 col-12 mb-3">
                  <p className="mb-0">Time</p>
                  <div className="highlight-data">
                    {bookingDetails.pickUpTime}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <a href="http://127.0.0.1:5501/client/index.html">
                    <button className="cstm-btn-red">Change</button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-12 mt-3">
            <div className="d-flex justify-content-between w-100 mb-3 hour-nav bg-blue-light align-items-center border rounded">
              {bookingDetails?.hourlyDetails?.map((list, idx) => (
                <div
                  className="text-center w-100"
                  key={"key_" + idx}
                  onClick={() =>
                    setDecodedQuery({
                      ...decodedQuery,
                      hourlyType: list.type,
                    })
                  }
                >
                  {list.hour} Hours| {list.distance} Km
                </div>
              ))}
            </div>
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
                            {/* <span>2 Reviews</span> */}
                          </div>
                          {item?.similar?.length > 0 && (
                            <div>or Similar to ({item?.similar?.join()})</div>
                          )}
                        </div>

                        <div className="icon-items">
                          <div className="icon">
                            <img src={doorImage} alt="img" />
                          </div>
                          <div className="content">
                            <h6>Passengers:</h6>
                            <p className="mb-0 pb-0">
                              {item?.capacity?.totalNumberOfSeats} +{" "}
                              {item?.capacity?.reservedNumberOfSeats} Seats
                            </p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                          <div className=" me-3 d-flex flex-column align-items-center">
                            <p className="mb-0 pb-0">Distance: </p>
                            <p className="mb-0 pb-0 ">
                              {bookingDetails.distance}Km
                            </p>
                          </div>
                          <div>
                            <p className="mb-0 pb-0 pe-3 text-cut font-20 font-bold">
                              &#8377; {Math.ceil(item.totalPrice)}
                            </p>
                          </div>
                          <button
                            className="border-0 bg-unset"
                            onClick={() => {
                              book(item);
                            }}
                          >
                            <h6 className="price mb-0">
                              &#8377; {Math.ceil(item.totalPrice)}
                            </h6>
                          </button>
                        </div>
                      </div>
                      <div className="p-1 d-flex flex-column ">
                        <div
                          className="d-flex justify-content-end pe-3 py-2 cursor-pointer align-items-center"
                          onClick={() => toggleDetails(idx)}
                        >
                          <p className="mb-0">Details</p>
                          <i
                            className={
                              item?.isShowDetail
                                ? "fa fa-angle-up ms-2"
                                : "fa fa-angle-down ms-2"
                            }
                          ></i>
                        </div>
                        {item?.isShowDetail && (
                          <div className="d-flex ps-2">
                            <div className="d-flex ">
                              <div className="d-flex align-items-center">
                                <p className="mb-0 h6 ps-2 notch_content">
                                  Excluded
                                </p>
                                <div className="notch-point"></div>
                              </div>
                              <div className="d-flex align-items-center pe-4">
                                <img className="w-40" src={taxImage} />
                                <p className="mb-0 font-14">
                                  Toll, State Tax & GST, Parking
                                </p>
                              </div>
                              <div className="d-flex align-items-center pe-4">
                                <p className="mb-0 font-14">
                                  ₹{item?.upToCostPerKm} per km after the first{" "}
                                  {bookingDetails.distance} km
                                </p>
                              </div>
                              {decodedQuery?.hourlyType && (
                                <div className="d-flex align-items-center">
                                  <p className="mb-0 font-14">
                                    ₹{item?.upToCostPerHour} per hour after the{" "}
                                    {item.hour} hour
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
