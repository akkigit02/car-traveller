import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isSchedulabel, getDateAndTimeString, formatDateAndTime, roundToDecimalPlaces } from '../../utils/format.util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import ConfirmationModal from '../common/ConfirmationModal'; // Import the ConfirmationModal component
import { useForm } from 'react-hook-form';
import Tooltip from '../Tooltip';

function BookingHistory() {
  const navigate = useNavigate();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [bookingList, setBookingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [tripData, setTripData] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // For confirmation
  const [filter, setFilter] = useState('all');
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [isConfirmSubmit, setIsConfirmSubmit] = useState(false)

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
      if(res.data.message)
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong please try again!");
    }
  };

  const fetchBookingHistory = async (isScroll, filter = 'all') => {
    try {
      if (!isScroll) setSkip(0); // Reset skip if not scrolling
      setIsLoading(true);

      // Fetch booking data from the server
      const { data } = await axios({
        url: '/api/client/booking',
        params: {
          skip: isScroll ? skip : 0,
          limit,
          filter
        }
      });

      // Process the list of bookings
      const list = data.list.map(ele => {
        ele['isCancelable'] = isSchedulabel(ele.pickupDate, ele.pickupTime) || ['none', 'cancelled'].includes(ele.rideStatus);
        return ele;
      });

      // Update booking list state
      if (isScroll) {
        setBookingList(old => old.concat(list));
      } else {
        setBookingList(list);
      }

      // Update state for whether there are more items to load
      setHasMore(list.length === limit);
      setSkip(old => old + limit);
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const cancelBooking = async (bookingId) => {
    try {
      setIsConfirmSubmit(true)
      if (!reason?.length) {
        setReasonError('Reason is required')
        return;
      }

      if (reason?.length < 50) {
        setReasonError('Minimum 50 character.')
        return;
      }
      const { data } = await axios.put(`/api/client/cancel-booking/${bookingId}`, { reason });

      setConfirmationOpen(false);
      setSelectedBookingId(null);
      setReasonError('')
      setReason('')

      if (data?.message)
        toast.success(data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong please try again!");
    } finally {
      setIsConfirmSubmit(false)
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setConfirmationOpen(true);
  };

  const confirmCancel = async () => {
    if (selectedBookingId) {
      await cancelBooking(selectedBookingId);
    }
  };


  const closeConfirmationModal = () => {
    setConfirmationOpen(false);
    setSelectedBookingId(null);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    fetchBookingHistory(false, filter);
  }, [filter]);

  const resheduleData = (data) => {
    try {
      const date = new Date();
      setTripData(data);
      let pickupDate = `${data.pickupDate.year}-${data.pickupDate.month.padStart(2, '0')}-${data.pickupDate.date.padStart(2, '0')}`;
      if (data.trip.tripType === 'roundTrip') {
        let dropDate = `${data.dropDate.year}-${data.dropDate.month.padStart(2, '0')}-${data.dropDate.date.padStart(2, '0')}`;
        setValue('resheduleReturnDate', dropDate);
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setMinDate(`${year}-${month}-${day}`);

      setTimeOtion(pickupDate);
      setValue('reshedulePickupDate', pickupDate);
      setValue('reshedulePickupTime', data.pickupTime);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const setTimeOtion = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0); // Start at 12:00 AM
    const timeInterval = [];
    while (start.getHours() < 24) {
      start.setMinutes(start.getMinutes() + 15); // Add 15 minutes
      timeInterval.push(new Date(start));
      if (start.getHours() === 23 && start.getMinutes() === 45)
        break;
    }
    setTimeOptions(timeInterval);
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setValue('reshedulePickupDate', e.target.value);
    if (tripData?.trip?.tripType === 'roundTrip') {
      setValue('resheduleReturnDate', e.target.value);
    }
    date.setHours(0, 0, 0, 0);
    setTimeOtion(date);
    setValue('reshedulePickupTime', '00:15 AM');
  };


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
        >
          <div style={{height:'430px', overflowY:'auto'}}>
          <table className='cstm-table '>
            <thead>
              <tr>
                <th>#Booking No</th>
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
                  <td>#{item?.bookingNo}</td>
                  <td className='text-capitalize'>{item.name}</td>
                  <td>{getDateAndTimeString(item.pickupDate, item.pickupTime)}</td>
                  <td> &#8377; {roundToDecimalPlaces(item?.payableAmount) || roundToDecimalPlaces(item?.totalPrice) || '0'}</td>
                  <td >&#8377; {(item?.rideStatus === 'none' ? roundToDecimalPlaces(item?.totalPrice) : roundToDecimalPlaces(item?.dueAmount)) || '0'}</td>
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
                        <i className="fa fa-retweet" aria-hidden="true"></i>
                      </button>
                    </Tooltip>
                    <Tooltip message={'Cancel'} direction='bottom'>
                      <button
                        className={`icon-btn ${(item.isCancelable) ? 'disabled' : ''}`}
                        disabled={item.isCancelable}
                        onClick={() => handleCancelClick(item._id)}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              )) :
                <tr className='no-data'>
                  <td colSpan="100%">
                    <div className='d-flex align-items-center justify-content-center'><div className='no-data-content'></div></div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          </div>
        </InfiniteScroll>

        <Modal isOpen={isOpen} onClose={closeModal} title={'Reshedule'}>
          <form onSubmit={handleSubmit(submitReshedule)}>
            <div className="scroll-body">
              <div className="row m-0">
                <div className="form-group col-lg-6 col-md-6 col-12">
                  <label for="session-date">Pickup Date</label>
                  <input
                    type="date"
                    id="session-date" name="session-date"
                    {...register("reshedulePickupDate", { required: "Date is required" })}
                    className="cstm-select-input"
                    min={minDate}
                    onChange={(e) => handleDateChange(e)}
                  />
                  {errors?.reshedulePickupDate && <span className="text-danger">{errors.reshedulePickupDate.message}</span>}
                </div>
                {tripData?.trip?.tripType === 'roundTrip' &&
                  <div className="form-group col-lg-6 col-md-6 col-12">
                    <label for="session-date">Return Date</label>
                    <input
                      type="date"
                      id="session-date" name="session-date"
                      {...register("resheduleReturnDate", { required: "Date is required" })}
                      className="cstm-select-input"
                      min={watch('reshedulePickupDate')}
                    />
                    {errors?.resheduleReturnDate && <span className="text-danger">{errors.resheduleReturnDate.message}</span>}
                  </div>
                }
                <div className="form-group col-lg-6 col-md-6 col-12">
                  <label>Pickup Time</label>
                  <select className="cstm-select-input" {...register('reshedulePickupTime', { required: 'Time is required' })}>
                    {timeOptions.map((option, index) => (
                      option > new Date().setMinutes(new Date().getMinutes() + 90) && (
                        <option key={index} value={formatDateAndTime(option, 'hh:mm A')}>
                          {formatDateAndTime(option, 'hh:mm A')}
                        </option>
                      )
                    ))}
                  </select>
                  {errors?.reshedulePickupTime && <span className="text-danger">{errors.reshedulePickupTime.message}</span>}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end border-top mt-3 pt-2">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting && <div class="spinner-border text-primary" role="status">
                  <span class="sr-only"></span>
                </div>}
                Reshedule
              </button>
            </div>
          </form>
        </Modal>
        <Modal isOpen={confirmationOpen} onClose={closeConfirmationModal} title={'Cancel Booking'}>
          <div className="row m-0">
            <div className="form-group col-lg-6 col-md-6 col-12">
              <label for="session-date">Reason</label>
              <input
                type="text"
                className="cstm-select-input"
                onChange={(e) => setReason(e.target.value)}
              />
              {reasonError?.length > 0 && <span className="text-danger">{reasonError}</span>}
            </div>
          </div>
          <div className="d-flex justify-content-end border-top mt-3 pt-2">
            <button type="button" className="cstm-btn-trans me-2" onClick={closeConfirmationModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" disabled={isConfirmSubmit} onClick={() => confirmCancel()}>
            {isConfirmSubmit && <div class="spinner-border text-primary" role="status">
              <span class="sr-only"></span>
            </div>}
              Confirm
            </button>
          </div>
        </Modal>
        {/* <ConfirmationModal
          isOpen={confirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmCancel}
          message="Are you sure you want to cancel this booking?"
        /> */}
      </div>
    </>
  );
}

export default BookingHistory;
