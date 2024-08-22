import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
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
        else window.location.href = 'http:127.0.0.1:5500'
    }, [])
    return (
        <div>Payment</div>
    )
}

export default Payment