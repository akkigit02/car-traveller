import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TRIP_TYPE } from "../../constants/common.constants";
import moment from "moment";
import { useSelector } from "react-redux";
import Loader from "../Loader";
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
// import { icon } from "../../assets/css/icon.css";

export default function AvailableVehicle() {
  const { query } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo)
  const [bookingDetails, setBookingDetails] = useState("");
  const [carList, setCarList] = useState([]);
  const [decodedQuery, setDecodedQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const taxImage = require("../../assets/img/tax.png");
  const doorImage = require("../../assets/img/download");

  const getCarList = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios({
        url: "/api/client/car-list",
        params: { search: decodedQuery },
      });
      setBookingDetails({
        ...data.bookingDetails,
        type: TRIP_TYPE.find((ty) => ty.value === decodedQuery.tripType)?.name,
      });
      setCarList(data.cars);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
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
    } else window.location.href = CLIENT_URL;
  }, []);

  useEffect(() => {
    if (decodedQuery) getCarList();
  }, [decodedQuery]);

  const book = (car) => {
    if (!bookingDetails) return;
    const jsonString = JSON.stringify({
      vehicleId: car._id,
      vehicleType: car.vehicleType,
      vehicleName: car.vehicleName,
      totalPrice: car.totalPrice,
      tripType: decodedQuery?.tripType,
      hourlyType: decodedQuery?.hourlyType,
      ...bookingDetails,
    });
    const encodedString = btoa(encodeURIComponent(jsonString));
    navigate(`/booking/${encodedString}`);
  };

  const toggleDetails = (index) => {
    const updatedItems = [...carList];
    updatedItems[index].isShowDetail = !updatedItems[index].isShowDetail;
    setCarList(updatedItems);
  };

  return (
    <>
      <div>
        {isLoading ? <div>
          <Loader />
        </div> :
        <div className="row m-0 flex-wrap">
          <div className="col-lg-3 col-md-3 col-sm-12 pe-0">
            <div className="height-car-list mt-3 car-list-items">
              <div className=" bg-blue d-flex justify-content-between  text-center fw-bold text-light brd_radius-t">
                <span className="p-3"> {bookingDetails.type || "One Way"}</span>
                <a href={CLIENT_URL}>
                    <div className="bg-red p-3 brd_radius-tr text-white"><i className="far fa-edit pe-2"></i>Modify</div>
                </a>
              </div>
              <div className="book-form-height-2">
              <div className="d-flex p-3 justify-content-center mb-2">
                <div className="w-100">
                  
                  <div className="mb-0 destination-details"> {bookingDetails?.from?.name}</div>
                  {bookingDetails.type == "Hourly" || <div className="d-flex justify-content-center py-2"><i className="fas fa-long-arrow-alt-down font-30 text-blue"></i></div>}
                  {/* {bookingDetails?.to?.map((city) => (
                    <div className="mb-0 destination-details mb-2">{city.name}</div>
                  ))} */}
                  {bookingDetails?.to?.map((city, index) => (
                    <div key={index}>
                      <div className="mb-0 destination-details mb-2">{city.name}</div>
                      {bookingDetails?.to?.length > 1 && index > 0 && index < bookingDetails?.to?.length - 1 && (
                        <div className="d-flex justify-content-center py-2"><i className="fas fa-long-arrow-alt-down font-30 text-blue"></i></div>
                      )}
                    </div>
                  ))}
                  
                  
                </div>
              </div>
              <div className="px-3 pb-3">
                <div className="me-3 col-12 mb-3">
                  <p className="mb-0">Pickup Date</p>
                  <div className="highlight-data">
                    {moment(bookingDetails.pickUpDate).format("DD/MM/YYYY")}
                  </div>
                </div>
                {decodedQuery?.tripType === "roundTrip" && (
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

                {/* <div className="d-flex justify-content-end">
                  <a href={CLIENT_URL}>
                    <button className="cstm-btn-red">Change</button>
                  </a>
                </div> */}
              </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-12 mt-3 p-sm">
            {bookingDetails?.hourlyDetails?.length > 0 && <div className="d-flex justify-content-between w-100 mb-3 hour-nav bg-blue-light align-items-center border rounded">
              {bookingDetails?.hourlyDetails?.map((list, idx) => (
                <div
                  className={`text-center w-100 ${decodedQuery?.hourlyType === list.type ? 'bg-active-blue' : ''}`}
                  key={"key_" + idx}
                  onClick={() =>
                    setDecodedQuery({
                      ...decodedQuery,
                      hourlyType: list.type,
                    })
                  }
                >
                  {console.log(list)}
                 <h6 className="mb-0">{list.hour} Hours| {list.distance} Km</h6> 
                </div>
              ))}
            </div>}
            <div className="col-lg-12 cstm-calHeight">
              {carList.map((item, idx) => (
                <div className="car-list-items mb-3" key={idx}>
                  <div className="d-flex flex-column-sm">
                    <div className="car-image bg-cover justify-content-center">
                      <img src={item.vehicleImageUrl} />
                    </div>
                    <div className="w-100 border-start">
                      <div className="car-content cstm-row d-flex justify-content-between border-bottom">
                        <div className="col-lg-4 col-md-6 col-sm-6 mb-sm">
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

                        <div className="icon-items col-lg-3 col-md-6 col-sm-6">
                          <div className="icon">
                            <img src={doorImage} alt="img" />
                          </div>
                          <div className="content">
                            <h6>Passengers:</h6>
                            <p className="mb-0 pb-0">
                              {item?.capacity?.totalNumberOfSeats - item?.capacity?.reservedNumberOfSeats} +{" "}
                              {item?.capacity?.reservedNumberOfSeats} Seats
                            </p>
                          </div>
                        </div>
                        <div className="d-flex car-list-button align-items-center col-lg-5 col-md-12 col-sm-12">
                          <div className=" me-3 d-flex flex-column align-items-center">
                            <p className="mb-0 pb-0">Distance: </p>
                            <p className="mb-0 pb-0 ">
                              {bookingDetails.distance}Km
                            </p>
                            up to {item?.showDistance}
                          </div>
                          <div>
                            <p className="mb-0 pb-0 pe-3 text-cut font-20 font-bold">
                              &#8377; {Math.ceil(item.showPrice)}
                            </p>
                            <p className="mb-0 pb-0 pe-3 font-20 font-bold">
                              &#8377; {item?.discount} %
                            </p>
                          </div>
                          {decodedQuery?.tripType !== 'cityCab' && !bookingDetails?.from?.isMetroCity ? <button
                            className="cstm-btn-trans"
                          >
                            <h6 className="mb-0">
                              Coming Soon
                            </h6>
                          </button> :<button
                            className="border-0 bg-unset"
                            onClick={() => {
                              book(item);
                            }}
                          >
                            <h6 className="price mb-0">
                              &#8377; {Math.ceil(item.totalPrice)}
                            </h6>
                          </button>}
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
                            <div className="d-flex flex-column-sm">
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
                                  {item?.showDistance} km
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
        </div>}
      </div>
    </>
  );
}
