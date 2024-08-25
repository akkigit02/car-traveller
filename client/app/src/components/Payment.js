import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
function Payment() {
    const { paymentId: bookingId } = useParams();
    const [bookingDetails, setBookingDetails] = useState()

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
        <div>Payment</div>
    )
}

export default Payment