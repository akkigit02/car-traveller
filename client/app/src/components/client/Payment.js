import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOURLY_TYPE, TRIP_TYPE, VEHICLE_TYPE } from "../../constants/common.constants";
import { toast } from "react-toastify";
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
function Payment() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState({});
  const [advancePercentage, setAdvancePercentage] = useState(25)
  const [payblePrice, setPayblePrice] = useState(0)
  const [coupon, setCopouns] = useState({
    code: '',
    error: '',
    isApply: false,
    discountPercent: 0,
    maxDiscountAmount: 0,
    discountAmount: 0,
  })


  const calculatePayablePrice = (bookingDetails) => {
    let discountPrice = 0
    if (coupon?.isApply) {
      discountPrice = bookingDetails.totalPrice - coupon.discountAmount || 0
    } else discountPrice = bookingDetails.totalPrice || 0
    setPayblePrice((discountPrice * advancePercentage) / 100)
  }

  useEffect(() => {
    if (bookingDetails)
      calculatePayablePrice(bookingDetails)
  }, [advancePercentage, coupon])


  const getBookingDetails = async () => {
    try {
      console.log("bookingId", bookingId);
      const { data } = await axios({
        url: `/api/client/booking/${bookingId}`,
      });
      setBookingDetails(data?.bookingDetails);
      calculatePayablePrice(data?.bookingDetails)
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong please try again!");
    }
  };

  const applyCopoun = async () => {
    try {
      if (!coupon.code) {
        setCopouns(old => ({ ...old, error: 'Coupon is required' }))
        return
      }
      const { data } = await axios({
        url: `/api/client/apply-coupon/${bookingId}/${coupon.code}`,
      })
      if (data?.message)
        toast.success(data?.message);
      setCopouns((old) => ({ ...old, isApply: true, ...data.discountDetails }))

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong please try again!");
    }
  }

  const submitForPayment = async () => {
    try {
      const { data } = await axios({
        url: '/api/client/initiate-payment',
        method: 'POST',
        data: {
          bookingId,
          coupon,
          advancePercentage
        }
      })
      if (data.paymentUrl)
        window.location.href = data.paymentUrl
    } catch (error) {
      console.log(error)
    }
  }


  const resetCoupon = () => {
    setCopouns({
      code: '',
      isApply: false,
      discountPercent: '',
      maxDiscountAmount: '',
      discountAmount: '',
    })
  }

  useEffect(() => {
    if (bookingId) {
      getBookingDetails();
    } else window.location.href = CLIENT_URL;
  }, []);
  return (
    <>
      <div className="row m-0 col-reverse-sm flex-wrap">
        <div className={['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) ? "col-lg-4 col-md-4 col-sm-12 pe-0" : "col-lg-4 col-md-4 col-sm-12 pe-0 mb-5"}>
          <div className={['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) ? "car-list-sidebar h-100" : "car-list-sidebar mt-0 h-100"}>
            <h4 className="title">Booking Summary</h4>

            <div className="p-3 height-300c">
              <div className="col-lg-12 col-md-12 col-12 pe-0">
                <label>Name</label>
                <p className="mb-3 desti-details-2 text-center">
                  {bookingDetails?.name}
                </p>
              </div>
              {!['cityCab'].includes(bookingDetails?.trip?.tripType) && <div className=" mb-4">
                <p className="mb-0 destination-details">
                  {bookingDetails?.pickUpCity?.name}
                </p>
                {['oneWay', 'roundTrip'].includes(bookingDetails?.trip?.tripType) && 
                 
                 <div>
                  {bookingDetails?.dropCity?.map((item, index) => (
                    <div>
                       <div className='d-flex justify-content-center py-2'><i class="fas fa-long-arrow-alt-down font-30 text-blue"></i></div>
                    <p key={index} className="mb-0 destination-details">
                      {item.name}
                    </p>
                    </div>
                  ))}
                </div>}
              </div>}
              {<div className="d-flex align-items-center justify-content-between mb-4">
                <p> Pickup Address:- <p className="mb-0 desti-details-2 me-2">{bookingDetails?.pickupLocation}</p></p>
                {['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) && <p> Drop Address:- <p className="mb-0 desti-details-2">{bookingDetails?.dropoffLocation}</p></p>}
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
                  <p>
                    <strong>Hourly type:</strong>{" "}
                    {HOURLY_TYPE.find(li => li.value === bookingDetails?.trip?.hourlyType)?.name}
                  </p>
                }
                <p>
                  <strong>Car type:</strong>{" "}
                  {bookingDetails?.vehicleId?.vehicleType}(
                  {bookingDetails?.vehicleId?.vehicleName}) or similar
                </p>
                {/* <p>
                  <strong>Car type:</strong>{" "}
                  {bookingDetails?.vehicleId?.vehicleType}(
                  {bookingDetails?.vehicleId?.vehicleName}) or similar
                </p> */}
                <p>
                  <strong>Included:</strong> {bookingDetails?.totalDistance} Km
                </p>
                <p>
                  <strong>Total Fare:</strong> {Math.ceil(bookingDetails?.totalPrice)}
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
          {bookingDetails?.paymetStatus === 'pending' &&
            <>
              <div className="mb-5">
                <p className="border-bottom pb-2"> <b>Flexible Payment Options:</b> Choose from Various Percentage Breakdown</p>
                <div className="d-flex mb-3">
                  {[10, 25, 50, 100].map(ele => (
                    <div className="payment-percentage">
                      <input type="radio" name="advancePayment" value={advancePercentage} checked={advancePercentage === ele} onChange={() => setAdvancePercentage(ele)} >
                      </input>
                      <label>{ele === 100 ? 'Full Payment' : ele + '%'}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="d-flex align-content-end flex-wrap-reverse form-group">
                  <div className=" col-md-4">
                    <label htmlFor="">Coupon</label>
                    <input className="form-control" disabled={coupon.isApply} type="text" value={coupon.code} onChange={(event) => {
                      setCopouns(old => ({ ...old, error: '', code: event.target.value || '' }))
                    }} />
                    {coupon.error && <p> {coupon.error}</p>}
                  </div>
                  {!coupon.isApply ? <button className="cstm-btn ms-2" onClick={() => applyCopoun(true)}>Apply</button> :
                    <>
                      <button className="cstm-btn ms-2" onClick={() => resetCoupon()}>Reset</button>
                      <div>
                        coupon discount price: {coupon.discountAmount}
                      </div>
                    </>}
                </div>
              </div>
              <div className="d-flex flex-column align-items-end pt-5">
                <div className="mb-2 font-bold">
                  Total Payment amount: {payblePrice}
                </div>
              </div>
              <div className="d-flex flex-column align-items-end pt-5">
                <button className="cstm-btn" onClick={submitForPayment}>
                  Proceed to pay
                </button>
              </div>
            </>
          }
          {bookingDetails.paymentStatus === 'advanced' && bookingDetails.bookingStatus !== 'cancelled' &&
            <div className="mb-5">
              <div className="d-flex mb-3">

              </div>
              <div className="d-flex flex-column align-items-end pt-5">
                <div className="mb-2 font-bold">
                  Pending Payment amount: {bookingDetails?.payablePrice - ((bookingDetails?.payablePrice * bookingDetails.advancePercent) /100 )}
                </div>
              </div>
              <div className="d-flex flex-column align-items-end pt-5">
                <button className="cstm-btn" onClick={submitForPayment}>
                  Proceed to pay
                </button>
              </div>
            </div>}

        </div>
      </div >
    </>
  );
}

export default Payment;
