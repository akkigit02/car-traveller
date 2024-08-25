import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import moment from 'moment';
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
function Payment() {
    const { bookingId } = useParams();
    const [bookingDetails, setBookingDetails] = useState({})

    const getBookingDetails = async () => {
        try {
            const { data } = await axios({ url: `/api/client/booking-details/${bookingId}` })
            console.log(data)
            setBookingDetails(data?.bookingDetails)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (bookingId) {
            getBookingDetails()
        }
        else window.location.href = CLIENT_URL
    }, [])
    return (
        <>
            <div class="booking-details">
                <h2>Booking details</h2>

                <div class="time-place">
                    <h3>Time and place</h3>
                    <p><strong>Pick-up:</strong></p>
                    <p> Time:- 19-01-2017 07:00 AM</p>
                    <p> Address:- Walton Street, London</p>
                    <p><strong>Drop Address:</strong></p>
                    <p> Time:- 20-01-2017 10:00 PM</p>
                    <p> Address:- Walton Street, London</p>
                    <p><strong>Rental Type:</strong> One way</p>
                </div>

                <div class="car-type">
                    <h3>Car type</h3>
                    <p><strong>Large: Luxury</strong></p>
                    <p>(Example of this range: Audi S8)</p>
                </div>
            </div>

            <div class="payment-summary">
                <h2>Payment Summary</h2>

                <div class="rental-duration">
                    <p><strong>Rental Duration:</strong> 1 day 15 hours</p>
                </div>

                <div class="price-per-hour">
                    <p><strong>Price per hour:</strong> 39 hours x € 10</p>
                </div>

                <div class="car-rental-fee">
                    <p><strong>CAR RENTAL FEE:</strong> € 390</p>
                </div>

                <div class="extras-price">
                    <p><strong>Extras price:</strong> € 0</p>
                </div>

                <div class="sub-total">
                    <p><strong>SUB-TOTAL:</strong> € 390</p>
                </div>

                <div class="vat">
                    <p><strong>VAT:</strong> € 78</p>
                </div>

                <div class="total-price">
                    <p><strong>TOTAL PRICE:</strong> € 468</p>
                </div>

                <div class="required-deposit">
                    <p><strong>Required deposit:</strong> 10% of € 468</p>
                    <p>€ 47</p>
                </div>
            </div>

            <button class="continue-button">Continue</button>

        </>
    )
}

export default Payment