import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOURLY_TYPE, TRIP_TYPE, VEHICLE_TYPE } from "../../constants/common.constants";
import { toast } from "react-toastify";
import Invoice from "./Invoice";
import Modal from "../Modal";
import { roundToDecimalPlaces } from "../../utils/format.util";
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
function Payment() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState({});
  const [advancePercentage, setAdvancePercentage] = useState(25)
  const [payblePrice, setPayblePrice] = useState(0)
  const [isButtonLoad, setIsButtonLoad] = useState('')
  const [isApplyCoupon, setIsApplyCoupon] = useState(false)
  const [isInvoicePreview, setIsInvoicePreview] = useState()
  const [coupon, setCopouns] = useState({
    code: '',
    error: '',
    isApply: false,
    discountPercent: 0,
    maxDiscountAmount: 0,
    discountAmount: 0,
  })

  // const carImg = require('../../assets/img/12.mp4');

  const calculatePayablePrice = (bookingDetails) => {
    let discountPrice = 0
    if (coupon?.isApply) {
      discountPrice = bookingDetails.totalPrice - coupon.discountAmount || 0
    } else discountPrice = bookingDetails.totalPrice || 0
    setPayblePrice((discountPrice * advancePercentage) / 100)
  }

  useEffect(() => {
    if (bookingDetails.rideStatus === 'none')
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
      setIsApplyCoupon(true)
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
    } finally {
      setIsApplyCoupon(false)
    }
  }

  const submitForPayment = async (isPayLater) => {
    try {
      setIsButtonLoad(isPayLater ? 'paylater' : 'payment')
      const { data } = await axios({
        url: '/api/client/initiate-payment',
        method: 'POST',
        data: {
          isPayLater,
          bookingId,
          coupon,
          advancePercentage: isPayLater ? null : advancePercentage
        }
      })
      if (data.paymentUrl)
        window.location.href = data.paymentUrl
      if (isPayLater) {
        getBookingDetails()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsButtonLoad(null)
    }
  }
  const submitForDuePayment = async () => {
    try {
      setIsButtonLoad('duePayment')
      const { data } = await axios({
        url: '/api/client/initiate-due-payment',
        method: 'POST',
        data: {
          bookingId,
        }
      })
      if (data.message)
        toast.success(data?.message);
      if (data.paymentUrl)
        window.location.href = data.paymentUrl
    } catch (error) {
      console.log(error)
    } finally {
      setIsButtonLoad(null)
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
        <div className={['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) ? "col-lg-4 col-md-4 col-sm-12 " : "col-lg-4 col-md-4 col-sm-12 mb-5"}>
          <div className={['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) ? "car-list-sidebar h-100" : "car-list-sidebar mt-0 h-100"}>
            <h4 className="title">Booking Summary</h4>

            <div className="p-3 height-300c">
              {/* <div className="col-lg-12 col-md-12 col-12 pe-0 d-flex">
                <label>Name: </label>
                <p className="mb-3 ps-2">
                  {bookingDetails?.name}
                </p>
              </div> */}
              <div className="client-summery">

                <div className="pick-text">
                  <div className="d-flex justify-content-between">
                    <p className="font-20 fw-bold">Pick-up</p>
                    <div className="pt-1"> {bookingDetails?.pickupDate?.date?.padStart(2, "0")}/
                      {bookingDetails?.pickupDate?.month?.padStart(2, "0")}/
                      {bookingDetails?.pickupDate?.year} , {bookingDetails?.pickupTime}</div>
                  </div>
                </div>
                {['cityCab'].includes(bookingDetails?.trip?.tripType) && <p>{bookingDetails?.pickupLocation}</p>}
                {!['cityCab'].includes(bookingDetails?.trip?.tripType) && <div className="">
                  <p className="fw-bold">
                    {bookingDetails?.pickUpCity?.name}
                  </p>
                  <p>{bookingDetails?.pickupLocation}</p>
                  {['roundTrip'].includes(bookingDetails?.trip?.tripType) && <>
                    {bookingDetails?.dropCity?.filter(li => li._id !== bookingDetails?.pickUpCity?._id).map((city, index) => (
                      <div className="round-text">
                        <div className="round-circle"></div>
                        <p key={index} className="fw-bold mb-0">
                          {city.name}
                        </p>
                      </div>
                    ))}
                  </>}
                </div>}
                <div className="drop-text">Drop-off</div>
              </div>
              {['cityCab'].includes(bookingDetails?.trip?.tripType) && <div className="ps-4">{bookingDetails?.dropCity?.[0]?.name} </div>}
              {['oneWay'].includes(bookingDetails?.trip?.tripType) && <div className="ps-4">{bookingDetails?.dropCity?.[0]?.name} </div>}
              {['roundTrip'].includes(bookingDetails?.trip?.tripType) && <div className="ps-4">{bookingDetails?.dropCity?.[bookingDetails?.dropCity?.length - 1]?.name} </div>}
              {bookingDetails?.trip?.tripType === "roundTrip" && (
                <div className="ps-4">
                  {bookingDetails?.dropDate?.date?.padStart(2, "0")}/
                  {bookingDetails?.dropDate?.month?.padStart(2, "0")}/
                  {bookingDetails?.dropDate?.year}
                </div>
              )}
              {<div className="mb-4">
                {/* <p>{bookingDetails?.pickupLocation}</p> */}
                {['cityCab', 'oneWay'].includes(bookingDetails?.trip?.tripType) && <p className="ps-4">{bookingDetails?.dropoffLocation}</p>}
              </div>}

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
                <p>
                  <strong>Included:</strong> {bookingDetails?.totalDistance} Km
                </p>
                <p>
                  <strong>Total Fare:</strong> {roundToDecimalPlaces(bookingDetails?.totalPrice)}
                </p>
              </div>

            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-8 col-sm-12 p-sm-0">
          {
            <div className="border rounded">
              <div className="mb-3">
                <p className="border-bottom p-3 fw-bold h5">Payment Summary</p>
                <div className="row m-0">
                  <div className="col-12">
                    {/* <h4 className="mb-2"><b>Flexible Payment Options:</b></h4>
                    <p className=" pb-2">Moreover, companies can implement these flexible payment models seamlessly through various online
                      payment gateways, ensuring a smooth and secure transaction process for the customer.</p> */}
                    {bookingDetails?.isInvoiceGenerate && 
                    <div className="text-center mt-2 pb-5">
                      <div className="pt-1">
                      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                      </div>
                      {/* <img src={carImg} /> */}
                      <h3 className="text-success fw-bold">Car Rental <br></br>Successfully Booked</h3>
                      <p className="px-5">Thank you for booking with us! Your car rental is confirmed, and details will be emailed shortly. Contact our support team with any questions. We look forward to serving you. Safe travels!</p>
                      </div>}
                    <div className="border p-2 rounded">
                      <div className="d-flex justify-content-between border-bottom py-2">
                        <div>Estimated KM</div>
                        <div className="fw-bold">{roundToDecimalPlaces(bookingDetails?.totalDistance)} Km</div>
                      </div>
                      <div className="d-flex justify-content-between border-bottom py-2">
                        <div>Total Fare</div>
                        <div className="fw-bold">&#x20b9;  {roundToDecimalPlaces(bookingDetails?.totalPrice)}</div>
                      </div>
                      <div className="d-flex justify-content-between border-bottom py-2">
                        <div>Due Amount</div>
                        <div className="fw-bold">&#x20b9;  {roundToDecimalPlaces(bookingDetails?.paymentId?.dueAmount)}</div>
                      </div>
                      {bookingDetails?.isInvoiceGenerate && <div className="d-flex justify-content-end mt-2"><button onClick={() => setIsInvoicePreview(true)} className="cstm-btn-trans">
                      Preview Invoice
                    </button></div>}
                      {bookingDetails?.rideStatus === 'none' && <>
                        <div className="row m-0 py-2 border-bottom">
                          <div className="col-lg-2 col-md-3 col-12 align-items-center d-flex">Coupan listing</div>
                          <div className="col-lg-10 col-md-9 col-12 row m-0">
                            <div className="col-lg-3 col-md-3 col-12 mb-2"><div className="coupan-card">Coupon-1</div></div>
                            <div className="col-lg-3 col-md-3 col-12 mb-2"><div className="coupan-card">Coupon-1</div></div>
                            <div className="col-lg-3 col-md-3 col-12 mb-2"><div className="coupan-card">Coupon-1</div></div>
                            <div className="col-lg-3 col-md-3 col-12 mb-2"><div className="coupan-card">Coupon-1</div></div>
                          </div>
                        </div>


                        <div className="py-2">
                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <p className="mb-0">Coupon Code</p>
                            <div className="d-flex align-items-end">
                              <div className="">
                                <input className="cstm-select-input" placeholder="Enter coupan code" disabled={coupon.isApply} type="text" value={coupon.code} onChange={(event) => {
                                  setCopouns(old => ({ ...old, error: '', code: event.target.value || '' }))
                                }} />
                                {coupon.error && <p> {coupon.error}</p>}
                              </div>
                              {!coupon.isApply ?
                                <button className="cstm-btn-trans ms-2" disabled={isApplyCoupon} onClick={() => applyCopoun(true)}>Apply</button> :
                                <>
                                  <button className="cstm-btn ms-2" onClick={() => resetCoupon()}>Reset</button>
                                </>}
                            </div>
                          </div>
                        </div>
                        {coupon.isApply && <div className="d-flex justify-content-between py-2 border-bottom">
                          <p className="mb-0">coupon discount price:</p>
                          <div className="fw-bold ">
                            {coupon.discountAmount}
                          </div></div>}

                        {/* <div className="d-flex flex-column align-items-end mb-sm pt-2">
                        <button className="cstm-btn" disabled={isButtonLoad} onClick={() => { submitForPayment(true) }}>
                          {isButtonLoad === 'isPaylater' && <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>}
                          Pay Later
                        </button>
                      </div> */}
                      </>}
                    </div>

                  </div>
                </div>
              </div>

              {!['completed'].includes(bookingDetails?.rideStatus) && <div className="border rounded mx-3 mb-3">
                <div className="row m-0 py-2">
                  {[0, 10, 25, 50, 100].map((ele, index) => (
                    <div key={'pay'+index} className="col-lg-3 col-md-6 col-12">
                      <div className={`payment-percentage ${advancePercentage === ele ? 'active' : ''}`}>
                        <label className="d-flex align-items-center p-2">
                          <input
                            type="radio"
                            name="advancePayment"
                            value={ele}
                            checked={advancePercentage === ele}
                            onChange={() => setAdvancePercentage(ele)}
                          />
                          <span className="ps-2">{ele === 100 ? 'Full Payment' : ele + '%'}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between-mob border-top align-items-center flex-wrap">
                  <div className="d-flex flex-column align-items-end mb-sm pt-2 ps-2">
                    <div className="mb-2 font-bold pe-2">
                      Payable amount:<span className="font-22"> &#x20b9;  {roundToDecimalPlaces(bookingDetails?.totalPrice)}</span>
                    </div>
                    {/* <button className="cstm-btn-trans" disabled={isButtonLoad} onClick={() => { submitForPayment(true) }}>
                      {isButtonLoad === 'isPaylater' && <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>}
                      Pay Later
                    </button> */}



                  </div>
                  <div className="d py-3 justify-content-end pe-2 ">
                    <div className="d-flex flex-column align-items-end pt-2 pe-3">
                      <div className="mb-2 font-bold">
                        Advance amount:<span className="font-22"> &#x20b9;  {payblePrice}</span>
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end mb-sm pt-2">
                      {advancePercentage === 0 ?
                        <button className="cstm-btn-trans" disabled={isButtonLoad} onClick={() => { submitForPayment(true) }}>
                          {isButtonLoad === 'isPaylater' && <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>}
                          Pay Later
                        </button> :
                        <button className="cstm-btn" disabled={isButtonLoad} onClick={() => { submitForPayment() }}>
                          {isButtonLoad === 'payment' && <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>}
                          Proceed to pay
                        </button>}
                    </div>
                  </div>
                </div>
              </div>}

            </div>
          }
          {
            !bookingDetails?.rideStatus === 'booked' && <>
              <div>
                <div className="d-flex flex-column align-items-end border-top pt-2">
                  <div className="mb-2 font-bold">
                    Due amount:<span className="font-22"> &#x20b9;  {roundToDecimalPlaces(bookingDetails.paymentId.dueAmount)}</span>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end mb-sm">
                  <button className="cstm-btn" disabled={isButtonLoad} onClick={submitForDuePayment}>
                    {isButtonLoad === 'duePayment' && <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>}
                    Proceed to pay
                  </button>
                </div>

              </div>
            </>
          }
          <div className="col-12">
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
      </div >
      {
        isInvoicePreview && <Modal isOpen={isInvoicePreview} onClose={() => setIsInvoicePreview(false)} title="Invoice">
          <div className="invoice-width">
            <Invoice bookingId={bookingDetails._id} />
          </div>
        </Modal>
      }
    </>
  );
}

export default Payment;
