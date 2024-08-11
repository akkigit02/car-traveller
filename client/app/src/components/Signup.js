import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { emailPattern, namePattern, phoneNumberValidation } from '../constants/Validation.constant';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TopNavBar from './TopNavBar';
function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { query } = useParams();
  const [bookingDetails, setBookingDetails] = useState()
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [sessionId, setSessionId] = useState()
  const [otp, setOtp] = useState()


  const verifyOtp = async () => {
    try {
      const { data } = await axios({
        url: '/api/auth/verify-otp',
        method: 'POST',
        data: {
          otp, sessionId
        }
      })
    } catch (error) {
      console.log(error.response.data)
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
      console.log(error.response.data)
    }
  }
  useEffect(() => {
    if (query) {
      // decode query   
      const decodedString = atob(query);
      const decodedData = JSON.parse(decodedString);
      setBookingDetails(decodedData)
    }
    else window.location.href = 'http:127.0.0.1:5500'
  }, [])


  return (
    <>
      <TopNavBar />
      <div className="row m-0">
        <div className="col-lg-4 col-md-4 col-12 pe-0 mb-5">
          <div className="car-list-sidebar mt-30 h-100">
            <h4 className="title">Booking Form</h4>

            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


              Where does it come from?
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from </p>

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
                            <div className="form-clt">
                              <label className="label-text">
                                Pick up Address
                              </label>
                              <input
                                type="text"
                                {...register("pickupAddress", {
                                  required: "Pick up address is required",
                                })}
                                disabled={isOtpSent}
                                placeholder="Address"
                              />
                              {errors?.pickupAddress?.message && (
                                <span>{errors?.pickupAddress?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-clt">
                              <label className="label-text">
                                Drop Address
                              </label>
                              <input
                                type="text"
                                {...register("dropAddress", {
                                  required: "Drop address is required",
                                })}
                                disabled={isOtpSent}
                                placeholder="Address"
                              />
                              {errors?.dropAddress?.message && (
                                <span>{errors?.dropAddress?.message}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 d-flex justify-content-end">
                            <button className="theme-btn" type="submit">
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
          </section>
        </div>
      </div>
    </>
  );
}

export default Signup;
