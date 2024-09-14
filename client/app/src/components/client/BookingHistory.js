import React, { useEffect, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';
import { isSchedulabel, getDateAndTimeString, formatDateAndTime } from '../../utils/format.util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../Modal'
import { useForm } from 'react-hook-form';
function BookingHistory() {
  const navigate = useNavigate()
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(15)
  const [bookingList, setBookingList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [minDate, setMinDate] = useState(null)
  const [timeOptions, setTimeOptions] = useState([]);
  const [tripData, setTripData] = useState(null)
  const { register, handleSubmit, setValue, watch, reset,formState: { errors } } = useForm({
    mode: "onChange",
  });

  const submitReshedule = async (data) => {
    try {
      console.log(data)
      const res = await axios({
        url: '/api/client/reshedule/'+tripData._id,
        method: 'POST',
        data: data
      })

      setBookingList(bookingList.map((li) => {
        if(li._id === data._id) {
          li['pickupDate'] = res?.data?.booking?.pickupDate
          li['pickupTime'] = res?.data?.booking?.pickupTime
          if(data?.trip?.tripType === 'roundTrip') {
            li['dropDate'] = res?.data?.booking?.dropDate
          }
        }
        return li
      }))
      reset({})
      setIsOpen(false)
      setTripData(null)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchBookingHistory = async (isScroll) => {
    try {
      if (!isScroll)
        setSkip(0)
      setIsLoading(true)
      const { data } = await axios({
        url: '/api/client/booking',
        params: {
          skip: isScroll ? skip : 0,
          limit,
        }
      })

      const list = data.list.map(ele => {
        ele['isCancelable'] = isSchedulabel(ele.pickupDate, ele.pickupTime)
        return ele
      })

      if (isScroll) {
        setBookingList(old => old.concat(list));
      }
      else {
        setBookingList(list)
      }
      setHasMore(list.length === limit);
      setSkip(old => old + limit);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios({
        url: `/api/client/cancel-booking/${bookingId}`
      })
      if (data?.message)
        toast.success(data?.message);
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong please try again!");
    }
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    fetchBookingHistory()
  }, [])

  const resheduleData = (data) => {
    try {
      const date = new Date()
      setTripData(data)
      let pickupDate = `${data.pickupDate.year}-${data.pickupDate.month.padStart(2, '0')}-${data.pickupDate.date.padStart(2, '0')}`
      if(data.trip.tripType === 'roundTrip') {
        let dropDate = `${data.dropDate.year}-${data.dropDate.month.padStart(2, '0')}-${data.dropDate.date.padStart(2, '0')}`
        setValue('resheduleReturnDate',dropDate)
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setMinDate(`${year}-${month}-${day}`)

      setTimeOtion(pickupDate)
      setValue('reshedulePickupDate',pickupDate)
      setValue('reshedulePickupTime',data.pickupTime)
      setIsOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const setTimeOtion = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0); // Start at 12:00 AM
    const timeInterval = []
    while (start.getHours() < 24) {
      start.setMinutes(start.getMinutes() + 15); // Add 15 minutes
      timeInterval.push(new Date(start));
      if (start.getHours() === 23 && start.getMinutes() === 45)
        break;
    }
    setTimeOptions(timeInterval)
  }

  const handleDateChange = (e) => {
    const date = new Date(e.target.value)
    setValue('reshedulePickupDate',e.target.value)
    if(tripData?.trip?.tripType === 'roundTrip') {
      setValue('resheduleReturnDate',e.target.value)
    }
    date.setHours(0, 0, 0, 0)
    setTimeOtion(date)
    setValue('reshedulePickupTime','00:15 AM')

  }

  return (
    <>
      <div>
        <InfiniteScroll
          dataLength={bookingList.length}
          next={() => fetchBookingHistory(true)}
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
                {bookingList?.map(item => (<tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{getDateAndTimeString(item.pickupDate, item.pickupTime)}</td>
                  <td>{item.totalPrice}</td>
                  <td>{item.advancePayment}</td>
                  <td>{item.bookingStatus}</td>
                  <td className='d-flex'>
                    <button className='icon-btn me-2' onClick={() => navigate(`/payment/${item._id}`)} ><i className="fa fa-eye" aria-hidden="true"></i></button>
                    <button className='icon-btn me-2' onClick={() => resheduleData(item)}
                      disabled={item.isCancelable}
                    ><i className="fa fa-retweet" aria-hidden="true"></i></button>
                    <button className='icon-btn' disabled={item.isCancelable} onClick={()=>cancelBooking(item._id)}><i className="fa fa-trash" aria-hidden="true"></i></button>
                  </td>
                </tr>))
                }
              </tbody>
          </table>
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
                    placeholder="Enter coupon code"
                    min={minDate}
                    onChange={(e) => handleDateChange(e)}
                  />
                  {errors?.reshedulePickupDate && <span className="text-danger">{errors.reshedulePickupDate.message}</span>}
                </div>
                { tripData?.trip?.tripType === 'roundTrip' &&
                  <div className="form-group col-lg-6 col-md-6 col-12">
                    <label for="session-date">Return Date</label>
                    <input
                      type="date"
                      id="session-date" name="session-date"
                      {...register("resheduleReturnDate", { required: "Date is required" })}
                      className="cstm-select-input"
                      placeholder="Enter coupon code"
                      min={watch('reshedulePickupDate')}
                    />
                    {errors?.resheduleReturnDate && <span className="text-danger">{errors.resheduleReturnDate.message}</span>}
                  </div>
                }
                <div className="form-group col-lg-6 col-md-6 col-12">
                  <label>Pickup Time</label>
                  <select {...register('reshedulePickupTime', { required: 'Time is required' })}>
                    {timeOptions.map((option, index) => (
                      <>{
                        option > new Date().setMinutes(new Date().getMinutes() + 90) && <option key={index} value={formatDateAndTime(option, 'hh:mm A')}>
                          {formatDateAndTime(option, 'hh:mm A')}
                        </option>}
                      </>
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
      </div>
    </>
  )
}

export default BookingHistory