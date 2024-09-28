import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { VEHICLE_TYPE } from "../../constants/common.constants";
import axios from "axios";
import Tooltip from "../Tooltip";
import ConfirmationModal from "../common/ConfirmationModal";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Notifiaction() {
  const [notificationList, setNotificationList] = useState([])
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const limit = 15
  useEffect(() => {
    getNotification()
  }, [])
  const getNotification = async (isScroll) => {
    try {
      setIsLoading(true)
      const { data } = await axios({
        url: '/api/admin/notification',
        method: 'GET',
        params: {
          skip: isScroll ? skip : 0,
          limit
        }
      })
      const list = data.notification
      if (isScroll) {
        setNotificationList(old => old.concat(list));
      } else {
        setNotificationList(list);
      }
      setHasMore(list.length === limit);
      setSkip(old => old + limit);
    } catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'NEW_LEAD':
        return `New Lead Generated: Lead ID #${notification.data.bookingId}. Review the lead details and initiate follow-up actions to convert it into a confirmed booking.`

      case 'NEW_BOOKING':
        return `New Booking Received: Booking ID #${notification.data.bookingId}. Please schedule the driver and proceed with the necessary booking workflows.`

      case 'DUE_PAYMENT_RECEIVED':
        return `Payment Received: Booking ID #${notification.data.bookingId} has a pending payment of ${notification.data.duePayment} successfully completed. Update the booking status accordingly.`

      case 'BOOKING_CANCEL':
        return `Booking Canceled: Booking ID #${notification.data.bookingId} has been canceled. Verify the details and initiate any required refund or cancellation procedures.`
      case 'BOOKING_RESCHEDULED':
        return `Booking Rescheduled: Booking ID #${notification.data.bookingId} has been rescheduled. Check the updated schedule and make the necessary adjustments in the system.`
      default:
        return ``
    }
  }


  return (
    <>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">Notification</p>
        </div>
      </div>
      <div style={{width:'100%',height:'68vh'}}>
        <InfiniteScroll
          dataLength={notificationList.length}
          next={() => getNotification(true)}
          hasMore={hasMore}
          loader={<h6>Loading...</h6>}
          endMessage={<p className='py-2'>No more bookings to show.</p>}
        >
          {notificationList.map((item, index) => <div style={{ border: '1px solid black' }}>
            <p className="font-20">{index + 1}:{item.title}</p>
            <p>{getNotificationText(item)}</p>
          </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
}
