import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { emailPattern, namePattern, phoneNumberValidation } from '../../constants/Validation.constant';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from "moment";
import { setTokenToLocal } from '../../services/Authentication.service';
import store from '../../store';
import { useSelector } from 'react-redux';
import { HOURLY_TYPE } from '../../constants/common.constants';
import Popup from '../Popup';
import { roundToDecimalPlaces } from '../../utils/format.util';
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
function BookingForm() {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange", // Validate on every change
    });
    const userInfo = useSelector(({ userInfo }) => userInfo)
    const navigate = useNavigate()
    const { query } = useParams();
    const [bookingDetails, setBookingDetails] = useState({})
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [sessionId, setSessionId] = useState()
    const [isButtonLoad, setIsButtonLoad] = useState(false)

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [otp, setOtp] = useState()
    // const [otp, setOtp] = useState(Array(6).fill(""));
    const [addressSuggestion, setAdressSugeestion] = useState({
        isOpen: false,
        type: '',
        address: []
    })



    const togglePopup = () => {
        setIsPopupOpen(false);
        setIsOtpSent(false)
    };

    //   const handleChange = (e, index) => {
    //     const value = e.target.value;
    //     const newOtp = [...otp];
    //     if (/^\d*$/.test(value)) {
    //       newOtp[index] = value;
    //       setOtp(newOtp);
    //       if (value.length === 1 && index < 5) {
    //         document.getElementById(`otp-input-${index + 1}`).focus();
    //       }
    //     }
    //   };
    //   const handleKeyDown = (e, index) => {
    //     if (e.key === "Backspace" && otp[index] === "") {
    //       if (index > 0) {
    //         document.getElementById(`otp-input-${index - 1}`).focus();
    //         const newOtp = [...otp];
    //         newOtp[index - 1] = "";
    //         setOtp(newOtp);
    //       }
    //     } else if (e.key === "Backspace") {
    //       const newOtp = [...otp];
    //       newOtp[index] = "";
    //       setOtp(newOtp);
    //     }
    //   };



    const verifyOtp = async () => {
        try {
            setIsButtonLoad(true)
            const { data } = await axios({
                url: '/api/auth/verify-otp',
                method: 'POST',
                data: {
                    otp, sessionId
                }
            })
            if (data.message)
                toast.success(data.message)
            setIsPopupOpen(false)
            if (data.status === 'LOGIN_SUCCESS') {
                setTokenToLocal(data.session.jwtToken);
                store.dispatch({
                    type: "SET_INTO_STORE",
                    payload: { userInfo: data.session },
                });
                navigate(`/payment/${bookingDetails.bookingId}`);
            }
        } catch (error) {
            console.log(error.response.data)
            toast.error(error?.response?.data?.message || 'Something went wrong please try again!')
        } finally {
            setIsButtonLoad(false)
        }
    }


    const signUp = async (formData) => {
        try {
            const { data } = await axios({
                url: '/api/auth/signup',
                method: 'POST',
                data: { userDetails: formData, bookingDetails }
            })
            if (data.status === 'TWO_STEP_AUTHENTICATION') {
                setIsOtpSent(true)
                setIsPopupOpen(true)
                setSessionId(data.sessionId)
                setBookingDetails(old => ({ ...old, bookingId: data.booking_id }))
            } if (data.status === 'SKIP_TWO_STEP_AUTHENTICATION') {
                setTokenToLocal(data.session.jwtToken);
                store.dispatch({
                    type: "SET_INTO_STORE",
                    payload: { userInfo: data.session },
                });
                navigate(`/payment/${data.bookingId}`);
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Something went wrong please try again!')
        }
    }

    const saveBooking = async (formData) => {
        try {
            const { data } = await axios({
                url: '/api/client/booking',
                method: 'POST',
                data: { userDetails: formData, bookingDetails }
            })
            setBookingDetails(old => ({ ...old, bookingId: data.booking_id }))
            navigate(`/payment/${data.booking_id}`);
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Something went wrong please try again!')
        }
    }
    const handleSubmitForm = async (formData) => {
        try {
            if (userInfo) await saveBooking(formData)
            else await signUp(formData)
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        if (userInfo) {
            reset({ name: userInfo.name, email: userInfo.email, phoneNumber: userInfo.primaryPhone }, { keepDefaultValues: true })
        }
        if (query) {
            // decode query   
            const decodedString = decodeURIComponent(atob(query));
            const decodedData = JSON.parse(decodedString);
            setBookingDetails(decodedData)
        }
        else window.location.href = CLIENT_URL
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
            <div className='page-height-mob'>
                <div className="row m-0 col-reverse-sm flex-wrap mt-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 pe-sm2">
                        <div className="car-list-sidebar h-100">
                            <h4 className="title">Booking Form</h4>
                            <div className='p-3 book-form-height'>
                                <div className="client-summery">
                                    <div className="pick-text">
                                        <div className="d-flex justify-content-between">
                                            <p className="font-20 fw-bold">Pick-up</p>
                                            <div className="pt-1">{moment(bookingDetails.pickUpDate).format("DD/MM/YYYY")}, {bookingDetails?.pickUpTime}</div>
                                        </div>
                                    </div>
                                    <div className="fw-bold mb-0" > {bookingDetails?.from?.name}</div>
                                    {['roundTrip'].includes(bookingDetails?.tripType) && <>
                                        {bookingDetails?.to?.filter(li => li._id !== bookingDetails?.from?._id).map((city, index) => (
                                            <div className="round-text">
                                                <div className="round-circle"></div>
                                                <p key={index} className="fw-bold mb-0">
                                                    {city.name}
                                                </p>
                                            </div>
                                        ))}
                                    </>}
                                    <div className="drop-text">Drop-off</div>
                                </div>
                                {['cityCab'].includes(bookingDetails?.tripType) && <div className="ps-4">{bookingDetails?.to?.[0]?.name} </div>}
                                {['oneWay'].includes(bookingDetails?.tripType) && <div className="ps-4">{bookingDetails?.to?.[0]?.name} </div>}
                                {['roundTrip'].includes(bookingDetails?.tripType) && <div className="ps-4">{bookingDetails?.to?.[bookingDetails?.to?.length - 1]?.name} </div>}
                                {bookingDetails?.tripType === 'roundTrip' &&
                                    <p className='ps-4'>{moment(bookingDetails.returnDate).format("DD/MM/YYYY")}</p>
                                }




                                <div className='pt-3 border-top'>
                                    <p>
                                        <strong>Trip type:</strong>{" "}
                                        {bookingDetails?.type}
                                    </p>
                                    {bookingDetails?.tripType === "hourly" &&
                                        <p>
                                            <strong>Hourly type:</strong>{" "}
                                            {HOURLY_TYPE.find(li => li.value === bookingDetails?.hourlyType)?.name}
                                        </p>
                                    }

                                    <p><strong>Car type:</strong> {bookingDetails?.vehicleType}({bookingDetails?.vehicleName}) or similar</p>
                                    <p><strong>Included:</strong> {bookingDetails?.distance} Km</p>
                                    <p><strong>Total Fare:</strong> {roundToDecimalPlaces(bookingDetails?.totalPrice)}</p>
                                </div>
                                <ul>
                                    <li>Your trip comes with a kilometer limit. If you go over this limit, you'll incur additional charges for the extra distance traveled.</li>
                                    <li>If your trip involves hill climbs, the cab's air conditioning may be turned off during those sections.</li>
                                    <li>Your trip covers one pickup in the Pick-up City and one drop-off at the Destination City. It does not include any travel within the city.</li>


                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-md-8 col-sm-12">
                        <section className="car-details fix section-padding">
                            <div className="">
                                <div className="car-details-wrapper">
                                    <div className="">
                                        <div className="col-lg-12 mb-3">
                                            <div className="car-booking-items height-170">
                                                <div className="booking-header">
                                                    <h3>Request for Booking</h3>
                                                    <p>
                                                        Send your requirement to us. We will check email and
                                                        contact you soon.
                                                    </p>
                                                </div>
                                                <form
                                                    onSubmit={handleSubmit(handleSubmitForm)}
                                                    className="contact-form-items"
                                                >
                                                    <div className="row g-4">
                                                        <div className="col-lg-6">
                                                            <div className="form-clt">
                                                                <label className="label-text">
                                                                    Name *
                                                                </label>
                                                                <input
                                                                    {...register("name", {
                                                                        required: "First Name is required",
                                                                        pattern: namePattern,
                                                                    })}
                                                                    type="text"
                                                                    disabled={isOtpSent}
                                                                    placeholder="Enter First name"
                                                                />
                                                                {errors?.name?.message && (
                                                                    <span className='error'>{errors?.name?.message}</span>
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
                                                                    disabled={isOtpSent || userInfo}
                                                                    placeholder="Enter Email "
                                                                />
                                                                {errors?.email?.message && (
                                                                    <span className='error'>{errors?.email?.message}</span>
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
                                                                            phoneNumberValidation
                                                                        )}
                                                                        type="text"
                                                                        disabled={isOtpSent || userInfo}
                                                                        placeholder="Enter Phone Number"
                                                                    />
                                                                    {errors?.phoneNumber?.message && (
                                                                        <span className='error'>{errors?.phoneNumber?.message}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {bookingDetails?.tripType !== 'cityCab' && <div className="col-lg-6">
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
                                                                        {addressSuggestion.address.map((ele, idx) => (<li onClick={() => setValue('pickupAddress', ele)} key={"add" + idx}><p className='mb-0'>{ele}</p></li>))}
                                                                    </ul>}
                                                                {errors?.pickupAddress?.message && (
                                                                    <span className='error'>{errors?.pickupAddress?.message}</span>
                                                                )}
                                                            </div>
                                                        </div>}
                                                        {['oneWay'].includes(bookingDetails?.tripType) && <div className="col-lg-6">
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
                                                                        {addressSuggestion.address.map((ele, idx) => (<li onClick={() => setValue('dropAddress', ele)} key={"address" + idx} ><p className='mb-0'>{ele}</p></li>))}
                                                                    </ul>}
                                                                {errors?.dropAddress?.message && (
                                                                    <span className='error'>{errors?.dropAddress?.message}</span>
                                                                )}
                                                            </div>
                                                        </div>}
                                                        <div className="col-lg-12 d-flex justify-content-end">
                                                            
                                                            <button className="theme-btn-2 d-flex align-items-center" disabled={isSubmitting} type="submit">
                                                                {isSubmitting && <div className="spinner-border spinner-border-sm text-white me-2" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>}
                                                                <p className='mb-0'>{userInfo ? 'Book Now' : 'Send Otp'}</p>
                                                            </button>
                                                        </div>

                                                    </div>
                                                </form>
                                                <div className="d-flex justify-content-end pt-4" >
                                                                <Link
                                                                    to={`/term-condition`}
                                                                    className={`me-3`}
                                                                >
                                                                    <span style={{ color: 'blue' }}>Terms & Conditions</span>
                                                                </Link>
                                                                <Link
                                                                    to={`/refund-policy`}
                                                                    className={``}
                                                                >
                                                                    <span style={{ color: 'blue' }}>Refund Policy</span>
                                                                </Link>
                                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section >
                    </div >
                </div >
            </div>
            {isOtpSent && <div>
                <Popup isOpen={isPopupOpen} handleClose={togglePopup}>
                    <h5 className='border-bottom pb-2'>OTP <span>*</span> </h5>
                    <div className='py-3 text-center'>
                        <input className="cstm-input me-3"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter your OTP"
                        />
                    </div>
                    <div className='d-flex justify-content-end'> <button className="cstm-btn-red" disabled={isButtonLoad} onClick={verifyOtp}>
                        {isButtonLoad && <div className="spinner-border spinner-border-sm text-white me-2" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>}
                        Verify
                    </button>
                    </div>
                </Popup>
            </div>}
        </>
    );
}

export default BookingForm;
