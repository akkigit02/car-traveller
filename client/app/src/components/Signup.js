import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { emailPattern, namePattern, phoneNumberValidation } from '../constants/Validation.constant';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
            console.log(data)
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const sendOtp = async (formData) => {
        try {
            const { data } = await axios({
                url: '/api/auth/send-otp',
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
        <section className="car-details fix section-padding">
            <div className="container">
                <div className="car-details-wrapper">
                    <div className="">
                        <div className="col-lg-12 mb-3">
                            <div className="car-booking-items">
                                <div className="booking-header">
                                    <h3>Request for Booking</h3>
                                    <p>
                                        Send your requirement to us. We will check email and contact you
                                        soon.
                                    </p>
                                </div>
                                {!isOtpSent ? <form onSubmit={handleSubmit(sendOtp)} className="contact-form-items">
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <div className="form-clt">
                                                <label className="label-text">First Name *</label>
                                                <input
                                                    {...register("firstName", {
                                                        required: "First Name is required",
                                                        pattern: namePattern,
                                                    })}
                                                    type="text"
                                                    placeholder="Enter First name"
                                                />
                                                {errors?.firstName?.message && <span>{errors?.firstName?.message}</span>}
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
                                                    placeholder="Enter Last name"
                                                />
                                                {errors?.lastName?.message && <span>{errors?.lastName?.message}</span>}
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
                                                    placeholder="Enter Email "
                                                />
                                                {errors?.email?.message && <span>{errors?.email?.message}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-clt">
                                                <label className="label-text">Phone Number</label>
                                                <div>
                                                    <span>
                                                        +91
                                                    </span>
                                                    <input
                                                        {...register("phoneNumber", phoneNumberValidation)}
                                                        type="text"
                                                        placeholder="Enter Phone Number"
                                                    />
                                                    {errors?.phoneNumber?.message && <span>{errors?.phoneNumber?.message}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-clt">
                                                <label className="label-text">Pick up Address</label>
                                                <input
                                                    type="text"
                                                    {...register("pickupAddress", {
                                                        required: 'Pick up address is required'
                                                    })}
                                                    placeholder="Address"
                                                />
                                                {errors?.pickupAddress?.message && <span>{errors?.pickupAddress?.message}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-clt">
                                                <label className="label-text">Drop Address</label>
                                                <input
                                                    type="text"
                                                    {...register("dropAddress", {
                                                        required: 'Drop address is required'
                                                    })}
                                                    placeholder="Address"
                                                />
                                                {errors?.dropAddress?.message && <span>{errors?.dropAddress?.message}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <button className="theme-btn" type="submit">
                                                Send Request
                                            </button>
                                        </div>
                                    </div>
                                </form> :
                                    <div>
                                        <input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <button onClick={verifyOtp}>
                                            verify
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

    )
}

export default Signup