import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isSchedulabel, getDateAndTimeString, formatDateAndTime } from '../../utils/format.util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import ConfirmationModal from '../common/ConfirmationModal'; // Import the ConfirmationModal component
import { useForm } from 'react-hook-form';

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

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const submitReshedule = async (data) => {
    try {
      const res = await axios.post(`/api/client/reshedule/${tripData._id}`, data);

      setBookingList(bookingList.map((li) => {
        if (li._id === data._id) {
          li['pickupDate'] = res?.data?.booking?.pickupDate;
          li['pickupTime'] = res?.data?.booking?.pickupTime;
          if (data?.trip?.tripType === 'roundTrip') {
            li['dropDate'] = res?.data?.booking?.dropDate;
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
        ele['isCancelable'] = isSchedulabel(ele.pickupDate, ele.pickupTime);
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
      const { data } = await axios.put(`/api/client/cancel-booking/${bookingId}`);
      if (data?.message)
        toast.success(data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong please try again!");
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setConfirmationOpen(true);
  };

  const confirmCancel = async () => {
    if (selectedBookingId) {
      await cancelBooking(selectedBookingId);
      setConfirmationOpen(false);
      setSelectedBookingId(null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeConfirmationModal = () => {
    setConfirmationOpen(false);
    setSelectedBookingId(null);
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
        <div className="mb-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="past">Past</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <InfiniteScroll
          dataLength={bookingList.length}
          next={() => fetchBookingHistory(true, filter)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p className='py-2'>No more bookings to show.</p>}
        >
          <table className='cstm-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Pick Up Date</th>
                <th>Booking Price</th>
                <th>Advance Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{getDateAndTimeString(item.pickupDate, item.pickupTime)}</td>
                  <td>{item.totalPrice}</td>
                  <td>{item.advancePayment}</td>
                  <td>{item.bookingStatus}</td>
                  <td className='d-flex'>
                    <button className='icon-btn me-2' onClick={() => navigate(`/payment/${item._id}`)}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      className='icon-btn me-2'
                      onClick={() => resheduleData(item)}
                      disabled={item.isCancelable}
                    >
                      <i className="fa fa-retweet" aria-hidden="true"></i>
                    </button>
                    <button
                      className='icon-btn'
                      disabled={item.isCancelable}
                      onClick={() => handleCancelClick(item._id)}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>

        <Modal isOpen={isOpen} onClose={closeModal} title={'Reshedule'}>
          <form onSubmit={handleSubmit(submitReshedule)}>
            <div className="h-100 scroll-body">
              <div className="row m-0">
                <div className="form-group col-lg-6 col-md-6 col-12">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    {...register("reshedulePickupDate", { required: "Date is required" })}
                    className="cstm-select-input"
                    min={minDate}
                    onChange={(e) => handleDateChange(e)}
                  />
                  {errors?.reshedulePickupDate && <span className="text-danger">{errors.reshedulePickupDate.message}</span>}
                </div>
                {tripData?.trip?.tripType === 'roundTrip' &&
                  <div className="form-group col-lg-6 col-md-6 col-12">
                    <label>Return Date</label>
                    <input
                      type="date"
                      {...register("resheduleReturnDate", { required: "Date is required" })}
                      className="cstm-select-input"
                      min={watch('reshedulePickupDate')}
                    />
                    {errors?.resheduleReturnDate && <span className="text-danger">{errors.resheduleReturnDate.message}</span>}
                  </div>
                }
                <div className="form-group col-lg-6 col-md-6 col-12">
                  <label>Pickup Time</label>
                  <select {...register('reshedulePickupTime', { required: 'Time is required' })}>
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
              <button type="submit" className="btn btn-primary">
                Reshedule
              </button>
            </div>
          </form>
        </Modal>

        <ConfirmationModal
          isOpen={confirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmCancel}
          message="Are you sure you want to cancel this booking?"
        />
      </div>
    </>
  );
}

export default BookingHistory;
