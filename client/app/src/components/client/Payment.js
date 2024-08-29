import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
function Payment() {
    const { bookingId } = useParams();
    const [bookingDetails, setBookingDetails] = useState({
        "_id": "66cb80dce3e02c4623c39414",
        "vehicleId": null,
        "passengerId": "66cb80dce3e02c4623c39411",
        "dropCity": [],
        "pickupLocation": "Thane West, Mumbai, Maharashtra, India",
        "dropoffLocation": "Thane West, Mumbai, Maharashtra, India",
        "pickupDate": {
            "date": "26",
            "month": "7",
            "year": "2024"
        },
        "pickupTime": "12:30 AM",
        "trip": {
            "tripType": "cityCab"
        },
        "bokkingStatus": "pending",
        "rideStatus": null,
        "__v": 0,
        "totalDistance": 1,
        "totalPrice": "600"
    })

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
                    <p> Time:- {`${bookingDetails?.pickupDate?.date}/${bookingDetails?.pickupDate?.month}/${bookingDetails?.pickupDate?.year} ${bookingDetails.pickupTime}`} </p>
                    <p> Address:- {bookingDetails?.pickupLocation}</p>
                    <p><strong>Drop Address:</strong></p>
                    <p> Time:- {`${bookingDetails?.dropCity?.date}/${bookingDetails?.dropCity?.month}/${bookingDetails?.dropCity?.year}`}</p>
                    <p> Address:- {bookingDetails?.dropoffLocation}</p>
                    <p><strong>Rental Type:</strong> {bookingDetails?.trip?.tripType}</p>
                </div>
                <div class="car-type">
                    <h3>Car type</h3>
                    <p><strong></strong></p>
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