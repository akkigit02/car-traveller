import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HOURLY_TYPE, TRIP_TYPE, VEHICLE_TYPE } from "../../constants/common.constants";
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
function Payment() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState({});

  const getBookingDetails = async () => {
    try {
      console.log("bookingId", bookingId);
      const { data } = await axios({
        url: `/api/client/booking-details/${bookingId}`,
      });
      console.log(data, "-------------");
      setBookingDetails(data?.bookingDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const advancePaymentOnPercentage = (percentage) => {
    try {
      const price = (parseFloat(bookingDetails?.totalPrice) / 100) * percentage;
      return price;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (bookingId) {
      getBookingDetails();
    } else window.location.href = CLIENT_URL;
  }, []);
  return (
    <>
      <div className="row m-0 col-reverse-sm flex-wrap">
        <div className="col-lg-4 col-md-4 col-sm-12 pe-0 mb-5">
          <div className="car-list-sidebar mt-30 h-100">
            <h4 className="title">Booking Summary</h4>
            
            <div className="p-3">
            <div className="col-lg-6 col-md-6 col-12 pe-0">
                  <label>Name</label>
                  <p className="mb-0 desti-details-2">
                    {bookingDetails?.name}
                  </p>
                </div>
              {!['cityCab'].includes(bookingDetails?.trip?.tripType) && <div className="d-flex align-items-center justify-content-between mb-4">
                <p className="mb-0 desti-details">
                  {bookingDetails?.pickUpCity?.name}
                </p>
                {['oneWay','roundTrip'].includes(bookingDetails?.trip?.tripType) && <div>
                { bookingDetails?.dropCity?.map((item, index) => (
                  <p key={index} className="mb-0 desti-details">
                    {item.name}
                  </p>
                ))}
                </div>}
              </div>}
              {<div className="d-flex align-items-center justify-content-between mb-4">
                <p> Pickup Address:- <p className="mb-0 desti-details">{bookingDetails?.pickupLocation}</p></p>
                {['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) && <p> Drop Address:- <p className="mb-0 desti-details">{bookingDetails?.dropoffLocation}</p></p>}
              </div>}
              <div className="row m-0 pb-5">
                <div className="col-lg-6 col-md-6 col-12 ps-0">
                  <label>Pickup Date</label>
                  <p className="mb-0 desti-details-2">
                    {bookingDetails?.pickupDate?.date?.padStart(2, "0")}/
                    {bookingDetails?.pickupDate?.month?.padStart(2, "0")}/
                    {bookingDetails?.pickupDate?.year}
                  </p>
                </div>
                {bookingDetails?.trip?.tripType === "roundTrip" && (
                  <div className="col-lg-6 col-md-6 col-12 ps-0">
                    <label>Return Date</label>
                    <p className="mb-0 desti-details-2">
                      {bookingDetails?.dropDate?.date?.padStart(2, "0")}/
                      {bookingDetails?.dropDate?.month?.padStart(2, "0")}/
                      {bookingDetails?.dropDate?.year}
                    </p>
                  </div>
                )}
                <div className="col-lg-6 col-md-6 col-12 pe-0">
                  <label>Time</label>
                  <p className="mb-0 desti-details-2">
                    {bookingDetails?.pickupTime}
                  </p>
                </div>
              </div>
              <div>
              <p>
                  <strong>Trip type:</strong>{" "}
                  {
                    TRIP_TYPE.find(
                      (li) => li.value === bookingDetails?.trip?.tripType
                    )?.name
                  }
                </p>
                {bookingDetails?.trip?.tripType === "hourly" && 
                    <p>HOURLY_TYPE
                    <strong>Hourly type:</strong>{" "}
                    {HOURLY_TYPE.find(li => li.value === bookingDetails?.trip?.hourlyType)?.name}
                  </p>
                }
                <p>
                  <strong>Car type:</strong>{" "}
                  {bookingDetails?.vehicleId?.vehicleType}(
                  {bookingDetails?.vehicleId?.vehicleName}) or similar
                </p>
                <p>
                  <strong>Car type:</strong>{" "}
                  {bookingDetails?.vehicleId?.vehicleType}(
                  {bookingDetails?.vehicleId?.vehicleName}) or similar
                </p>
                <p>
                  <strong>Included:</strong> {bookingDetails?.totalDistance} Km
                </p>
                <p>
                  <strong>Total Fare:</strong> {bookingDetails?.totalPrice}
                </p>
              </div>
              <ul>
                <li>
                  Your trip comes with a kilometer limit. If you go over this
                  limit, you'll incur additional charges for the extra distance
                  traveled.
                </li>
                <li>
                  If your trip involves hill climbs, the cab's air conditioning
                  may be turned off during those sections.
                </li>
                <li>
                  Your trip covers one pickup in the Pick-up City and one
                  drop-off at the Destination City. It does not include any
                  travel within the city.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-8 col-sm-12">
          <section className="car-details fix section-padding">
            <div className="d-flex justify-content-between">
              <div style={{ backgroundColor: "blue", borderRadius: "10px" }}>
                <input type="radio" name="advancePayment" />
                <label htmlFor="">
                  {bookingDetails?.totalPrice} of 20%{" "}
                  {advancePaymentOnPercentage(20)}
                </label>
              </div>
              <div style={{ backgroundColor: "blue", borderRadius: "10px" }}>
                <input type="radio" name="advancePayment" />
                <label htmlFor="">
                  {bookingDetails?.totalPrice} of 40%{" "}
                  {advancePaymentOnPercentage(20)}
                </label>
              </div>
              <div style={{ backgroundColor: "blue", borderRadius: "10px" }}>
                <input type="radio" name="advancePayment" />
                <label htmlFor="">
                  {bookingDetails?.totalPrice} of 60%{" "}
                  {advancePaymentOnPercentage(20)}
                </label>
              </div>
              <div style={{ backgroundColor: "blue", borderRadius: "10px" }}>
                <input type="radio" name="advancePayment" />
                <label htmlFor="">
                  {bookingDetails?.totalPrice} of 80%{" "}
                  {advancePaymentOnPercentage(20)}
                </label>
              </div>
              <div style={{ backgroundColor: "blue", borderRadius: "10px" }}>
                <input type="radio" name="advancePayment" />
                <label htmlFor="">
                  {bookingDetails?.totalPrice} of 100%{" "}
                  {advancePaymentOnPercentage(20)}
                </label>
              </div>
            </div>
            <button>
                Continue
            </button>
          </section>
        </div>
      </div>
    </>
  );
}

export default Payment;
