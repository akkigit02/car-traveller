import { useEffect, useState, useRef, Fragment } from "react";
import { HOURLY_TYPE, TRIP_TYPE } from "../../constants/common.constants";
import axios from 'axios';
import generatePDF, { Resolution } from 'react-to-pdf';
import { getDateAndTimeString, roundToDecimalPlaces } from "../../utils/format.util";


const Invoice = ({ bookingId }) => {

    const downloadFileFromBlob = (blob, name = 'download', mimeType) => {
        const bloba = new Blob([blob], { type: mimeType });
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(bloba);
        a.download = name;
        setTimeout(function () { a.dispatchEvent(new MouseEvent('click')); });
    }
    
   
    const getInvoiceInfo = async () => {
        try {
            const { data } = await axios({
                method: 'POST',
                url: '/api/client/invoice/' + bookingId,
                responseType:"blob"
            })
            downloadFileFromBlob(data,"invoice.pdf",'application/pdf')
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getInvoiceInfo()
    }, [])

    return (
        <>
        </>

    )
}


export default Invoice;