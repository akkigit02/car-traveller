import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function PaymentRedirect() {
    const { transactionId } = useParams();
    const navigate = useNavigate()
    const updatePaymentState = async () => {
        try {
            const { data } = await axios({
                url: `/api/client/payment-status/${transactionId}`,
                method: 'put'
            })
            if (data.message)
                toast.success(data.message)
            // if (data.bookingId)
            //     navigate(`/payment/${data.bookingId}`)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong please try again!");
        }
    }

    useEffect(() => {
        if (transactionId)
            updatePaymentState()
    }, [])


    return (
        <>
        <div>
            Loader ...
        </div>
        </>
    )
}

export default PaymentRedirect