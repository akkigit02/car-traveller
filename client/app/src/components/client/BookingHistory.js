import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isSchedulabel, getDateAndTimeString, formatDateAndTime, roundToDecimalPlaces } from '../../utils/format.util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import { useForm } from 'react-hook-form';
import Tooltip from '../Tooltip';

function BookingHistory() {
  const navigate = useNavigate();
  const [skip, setSkip] = useState(0);
  const [limit] = useState(15);
  const [bookingList, setBookingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [tripData, setTripData] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [isConfirmSubmit, setIsConfirmSubmit] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    mode: "onChange",
  });

  const submitReshedule = async (data) => {
    try {
      const res = await axios.post(`/api/client/reshedule/${tripData._id}`, data);
      setBookingList(bookingList.map((li) => {
        if (li._id === tripData._id) {

          li['pickupDate'] = res?.data?.booking?.pickupDate;
          li['pickupTime'] = res?.data?.booking?.pickupTime;
          if (res?.data?.booking?.trip?.tripType === 'roundTrip') {
            li['dropDate'] = res?.data?.booking?.dropDate;
            li['payableAmount'] = res?.data?.booking?.payableAmount
            li['totalPrice'] = res?.data?.booking?.totalPrice
            li['dueAmount'] = res?.data?.booking?.dueAmount
          }
        }
        return li;
      }));
      reset({});
      setIsOpen(false);
      setTripData(null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookingHistory = async (isScroll = false, filter = 'all') => {
    try {
      setIsLoading(true);
      const { data } = await axios({
        url: '/api/client/booking',
        params: {
          skip: isScroll ? skip : 0,
          limit,
          filter
        }
      });

      const list = data.list.map(ele => {
        ele['isCancelable'] = isSchedulabel(ele.pickupDate, ele.pickupTime) || ['none', 'cancelled'].includes(ele.rideStatus);
        return ele;
      });

      if (isScroll) {
        setBookingList((old) => [...old, ...list]); // Append new data to the old data
      } else {
        setBookingList(list); // Reset the booking list
      }

      // Update whether there are more items to load
      setHasMore(list.length === limit);
      setSkip((old) => old + list.length); // Increase skip value by the number of items received
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setIsConfirmSubmit(true);
      if (!reason?.length) {
        setReasonError('Reason is required');
        return;
      }

      if (reason?.length < 50) {
        setReasonError('Minimum 50 characters.');
        return;
      }
      const { data } = await axios.put(`/api/client/cancel-booking/${bookingId}`, { reason });

      setSelectedBookingId(null);
      setReasonError('');
      setReason('');

      if (data?.message) toast.success(data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong, please try again!");
    } finally {
      setIsConfirmSubmit(false);
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  const confirmCancel = async () => {
    if (selectedBookingId) {
      await cancelBooking(selectedBookingId);
    }
  };

  const resheduleData = (data) => {
    try {
      const date = new Date();
      setTripData(data);
      let pickupDate = `${data.pickupDate.year}-${data.pickupDate.month.padStart(2, '0')}-${data.pickupDate.date.padStart(2, '0')}`;
      setValue('reshedulePickupDate', pickupDate);
      setValue('reshedulePickupTime', data.pickupTime);
      setIsOpen(true);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setMinDate(`${year}-${month}-${day}`);

      setTimeOtion(pickupDate);
    } catch (error) {
      console.log(error);
    }
  };

  const setTimeOtion = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const timeInterval = [];
    while (start.getHours() < 24) {
      start.setMinutes(start.getMinutes() + 15);
      timeInterval.push(new Date(start));
      if (start.getHours() === 23 && start.getMinutes() === 45) break;
    }
    setTimeOptions(timeInterval);
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setValue('reshedulePickupDate', e.target.value);
    date.setHours(0, 0, 0, 0);
    setTimeOtion(date);
    setValue('reshedulePickupTime', '00:15 AM');
  };

  useEffect(() => {
    fetchBookingHistory(false, filter);
  }, [filter]);

  return (
    <>
      <div>
        <div className='d-flex align-items-center justify-content-between'>
          <h4>Booking List</h4>
          <div className="mb-3 col-3">
            <select className="cstm-select-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="past">Past</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <InfiniteScroll
          dataLength={bookingList.length}
          next={() => fetchBookingHistory(true, filter)}
          hasMore={hasMore}
          loader={<h6>Loading...</h6>}
          endMessage={<p className='py-2'>No more bookings to show.</p>}
          scrollableTarget="scrollableDiv"
        >
          <div style={{ height: '300px', overflowY: 'auto' }} id="scrollableDiv">
            <table className='cstm-table '>
              <thead>
                <tr>
                  <th>Booking No.</th>
                  <th>Name</th>
                  <th>Pick Up Date</th>
                  <th>Booking Amount</th>
                  <th>Due Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookingList.length > 0 ? bookingList.map(item => (
                  <tr key={item._id}>
                    <td className='text-capitalize'>{item.bookingNo}</td>
                    <td className='text-capitalize'>{item.name}</td>
                    <td>{getDateAndTimeString(item.pickupDate, item.pickupTime)}</td>
                    <td> &#8377; {roundToDecimalPlaces(item?.payableAmount) || roundToDecimalPlaces(item?.totalPrice) || '0'}</td>
                    <td>&#8377; {(item?.rideStatus === 'none' ? roundToDecimalPlaces(item?.totalPrice) : roundToDecimalPlaces(item?.dueAmount)) || '0'}</td>
                    <td className='text-capitalize'>{item.rideStatus}</td>
                    <td className='d-flex'>
                      <Tooltip message={'View Details'} direction='bottom'>
                        <button className='icon-btn me-2' onClick={() => navigate(`/payment/${item._id}`)}>
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </button>
                      </Tooltip>
                      <Tooltip message={'Reschedule'} direction='bottom'>
                        <button
                          className={`icon-btn me-2 ${item.isCancelable ? 'disabled' : ''}`}
                          onClick={() => resheduleData(item)}
                          disabled={item.isCancelable}
                        >
                          <i className="fa fa-clock" aria-hidden="true"></i>
                        </button>
                      </Tooltip>
                      <Tooltip message={'Cancel Ride'} direction='bottom'>
                        <button
                          className={`icon-btn me-2 ${item.isCancelable ? 'disabled' : ''}`}
                          onClick={() => handleCancelClick(item._id)}
                          disabled={item.isCancelable}
                        >
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className='text-center'>
                      {isLoading ? 'Loading' : 'No data found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      </div>

      {/* Reschedule Modal */}
      <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(submitReshedule)}>
          <div className='row'>
            <div className="col-6 mb-3">
              <label className="form-label">Reschedule Date</label>
              <input type="date"
                min={minDate}
                className={`form-control ${errors.reshedulePickupDate ? 'is-invalid' : ''}`}
                {...register('reshedulePickupDate', { required: "Date is required" })}
                onChange={handleDateChange}
              />
              {errors?.reshedulePickupDate && <small className='text-danger'>{errors.reshedulePickupDate?.message}</small>}
            </div>

            <div className="col-6 mb-3">
              <label className="form-label">Reschedule Time</label>
              <select
                className={`form-select ${errors?.reshedulePickupTime ? 'is-invalid' : ''}`}
                {...register('reshedulePickupTime', { required: "Time is required" })}
              >
                {timeOptions.map(time => (
                  <option value={formatDateAndTime(time, 'time')}>{formatDateAndTime(time, 'time')}</option>
                ))}
              </select>
              {errors?.reshedulePickupTime && <small className='text-danger'>{errors.reshedulePickupTime?.message}</small>}
            </div>
          </div>

          <button type='submit' className="btn btn-primary w-100" disabled={isSubmitting}>Reschedule</button>
        </form>
      </Modal>

      {/* Cancellation Reason Modal */}
      {selectedBookingId && (
        <Modal isOpen={selectedBookingId} handleClose={() => setSelectedBookingId(null)}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <h5 className='text-center mb-4'>Are you sure you want to cancel?</h5>
              <textarea
                rows={3}
                placeholder="Please enter the reason for cancellation"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className={`form-control ${reasonError.length ? 'is-invalid' : ''}`}
              />
              {reasonError && <small className='text-danger'>{reasonError}</small>}
            </div>

            <div className='d-flex justify-content-center'>
              <button className="btn btn-secondary me-3" onClick={() => setSelectedBookingId(null)}>No</button>
              <button className="btn btn-danger" onClick={confirmCancel} disabled={isConfirmSubmit}>Yes</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default BookingHistory;
