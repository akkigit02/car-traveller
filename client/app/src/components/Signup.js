import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { emailPattern, namePattern, phoneNumberValidation } from '../constants/Validation.constant';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import { toast } from 'react-toastify';
function Signup() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { query } = useParams();
  const [bookingDetails, setBookingDetails] = useState()
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [sessionId, setSessionId] = useState()
  const [otp, setOtp] = useState()
  const [addressSuggestion, setAdressSugeestion] = useState({
    isOpen: false,
    type: '',
    address: []
  })


  const verifyOtp = async () => {
    try {
      const { data } = await axios({
        url: '/api/auth/verify-otp',
        method: 'POST',
        data: {
          otp, sessionId
        }
      })
      if (data.message)
        toast.error(data.message)

    } catch (error) {
      console.log(error.response.data)
      toast.error(error?.response?.data?.message || 'Something went wrong please try again!')
    }
  }


  const signUp = async (formData) => {
    try {
      console.log(34)
      const { data } = await axios({
        url: '/api/auth/signup',
        method: 'POST',
        data: { userDetails: formData, bookingDetails }
      })
      if (data.status === 'TWO_STEP_AUTHENTICATION') {
        setIsOtpSent(true)
        setSessionId(data.sessionId)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong please try again!')
    }
  }
  useEffect(() => {
    if (query) {
      // decode query   
      const decodedString = atob(query);
      const decodedData = JSON.parse(decodedString);
      setBookingDetails(decodedData)
      console.log(decodedData)

    }
    else window.location.href = 'http:127.0.0.1:5500'
  }, [])

  const getAddressSuggestion = async (search, type) => {

    try {
      const cityId = type === 'pickupAddress' ? bookingDetails?.from : bookingDetails?.to
      const { data } = await axios({
        url: '/api/client/address-suggestion',
        params: {
          search, cityId
        }
      })
      setAdressSugeestion({
        isOpen: true,
        type,
        address: data.address
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <TopNavBar />
      <div className="row m-0">
        <div className="col-lg-4 col-md-4 col-12 pe-0 mb-5">
          <div className="car-list-sidebar mt-30 h-100">
            <h4 className="title">Booking Form</h4>
            <div className='p-3'>
            <div className='d-flex align-items-center justify-content-between mb-4'>
              <p className='mb-0 desti-details'>Pune sjlsd</p>
              <p className='mb-0 border-bottom'>(One Way)</p>
              <p className='mb-0 desti-details'>Mumbai</p>
            </div>
            <div className='row m-0 pb-5'>
              <div className='col-lg-6 col-md-6 col-12 ps-0'>
              <label>Date</label>
              <p className='mb-0 desti-details-2'>18-08-24</p>
              </div>
              <div className='col-lg-6 col-md-6 col-12 pe-0'>
              <label>Time</label>
              <p className='mb-0 desti-details-2'>06:00PM</p>
              </div>
            </div>
            <div>
              <p><strong>Car type:</strong> Wagon R</p>
              <p><strong>KMs Included:</strong> 240KM</p>
              <p><strong>Total Fare:</strong> 3434Rs</p>
            </div>
            <ul>
            <li>Your trip comes with a kilometer limit. If you go over this limit, you'll incur additional charges for the extra distance traveled.</li>
            <li>If your trip involves hill climbs, the cab's air conditioning may be turned off during those sections.</li>
            <li>Your trip covers one pickup in the Pick-up City and one drop-off at the Destination City. It does not include any travel within the city.</li>


            </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-8 col-md-8 col-12">
          <section className="car-details fix section-padding">
            <div className="">
              <div className="car-details-wrapper">
                <div className="">
                  <div className="col-lg-12 mb-3">
                    <div className="car-booking-items">
                      <div className="booking-header">
                        <h3>Request for Booking</h3>
                        <p>
                          Send your requirement to us. We will check email and
                          contact you soon.
                        </p>
                      </div>
                      <form
                        onSubmit={handleSubmit(signUp)}
                        className="contact-form-items"
                      >
                        <div className="row g-4">
                          <div className="col-lg-6">
                            <div className="form-clt">
                              <label className="label-text">
                                First Name *
                              </label>
                              <input
                                {...register("firstName", {
                                  required: "First Name is required",
                                  pattern: namePattern,
                                })}
                                type="text"
                                disabled={isOtpSent}
                                placeholder="Enter First name"
                              />
                              {errors?.firstName?.message && (
                                <span>{errors?.firstName?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-clt">
                              <label className="label-text">Last Name</label>
                              <input
                                {...register("lastName", {
                                  required: "Last Name is required",
                                  pattern: namePattern,
                                })}
                                type="text"
                                disabled={isOtpSent}
                                placeholder="Enter Last name"
                              />
                              {errors?.lastName?.message && (
                                <span>{errors?.lastName?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-clt">
                              <label className="label-text">Email *</label>
                              <input
                                type="text"
                                {...register("email", {
                                  required: "Email is required",
                                  pattern: emailPattern,
                                })}
                                disabled={isOtpSent}
                                placeholder="Enter Email "
                              />
                              {errors?.email?.message && (
                                <span>{errors?.email?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-clt">
                              <label className="label-text">
                                Phone Number
                              </label>
                              <div className="position-relative">
                                <span className="position-absolute number-code">
                                  +91
                                </span>
                                <input
                                  className="p-60"
                                  {...register(
                                    "phoneNumber",
                                    // phoneNumberValidation
                                  )}
                                  type="text"
                                  disabled={isOtpSent}
                                  placeholder="Enter Phone Number"
                                />
                                {errors?.phoneNumber?.message && (
                                  <span>{errors?.phoneNumber?.message}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-clt position-relative">
                              <label className="label-text">
                                Pick up Address
                              </label>
                              <input
                                type="text"
                                {...register("pickupAddress", {
                                  required: "Pick up address is required",
                                })}
                                onFocus={(ele) => getAddressSuggestion(ele.target.value, 'pickupAddress')}
                                onChange={(ele) => getAddressSuggestion(ele.target.value, 'pickupAddress')}
                                onBlur={() => setTimeout(() => {
                                  setAdressSugeestion({ isOpen: false, type: '', address: [] })
                                }, 250)}
                                disabled={isOtpSent}
                                placeholder="Address"
                              />
                              {addressSuggestion.isOpen && addressSuggestion.type === 'pickupAddress' &&
                                <ul className='suggestion-list'>
                                  {addressSuggestion.address.map(ele => (<li onClick={() => setValue('pickupAddress', ele)}><p className='mb-0'>{ele}</p></li>))}
                                </ul>}
                              {errors?.pickupAddress?.message && (
                                <span>{errors?.pickupAddress?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-clt position-relative">
                              <label className="label-text">
                                Drop Address
                              </label>
                              <input
                                type="text"
                                {...register("dropAddress", {
                                  required: "Drop address is required",
                                })}
                                onFocus={(ele) => getAddressSuggestion(ele.target.value, 'dropAddress')}
                                onChange={(ele) => getAddressSuggestion(ele.target.value, 'dropAddress')}
                                onBlur={() => setTimeout(() => {
                                  setAdressSugeestion({ isOpen: false, type: '', address: [] })
                                }, 250)}
                                disabled={isOtpSent}
                                placeholder="Address"
                              />
                              {addressSuggestion.isOpen && addressSuggestion.type === 'dropAddress' &&
                                <ul className='suggestion-list'>
                                  {addressSuggestion.address.map(ele => (<li onClick={() => setValue('dropAddress', ele)}><p className='mb-0'>{ele}</p></li>))}
                                </ul>}
                              {errors?.dropAddress?.message && (
                                <span>{errors?.dropAddress?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 d-flex justify-content-end">
                            <button className="theme-btn-2" type="submit">
                              Send Request
                            </button>
                          </div>
                        </div>
                      </form>
                      {isOtpSent && (
                        <div>
                          <input className="cstm-input me-3"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter your OTP"
                          />
                          <button className="cstm-btn-red" onClick={verifyOtp}>verify</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section >
        </div >
      </div >
    </>
  );
}

export default Signup;
