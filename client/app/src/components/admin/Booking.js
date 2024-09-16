import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { getDateAndTimeString, isSchedulabel } from "../../utils/format.util";
import { TRIP_TYPE } from "../../constants/common.constants";
import Tooltip from "../Tooltip";
import { toast } from 'react-toastify';

export default function BookingManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [previewData, setPreviewData] = useState(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // For confirmation
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookings"
  });

  useEffect(() => {
    getBookings();
  }, []);

  const saveBooking = async (data) => {
    try {
      const res = await axios.post("/api/admin/bookings", data);
      setList([res.data.booking, ...list]);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get("/api/admin/bookings");
      const list = res.data.bookings.map(ele => {
        ele['isCancelable'] = isSchedulabel(ele.pickupDate, ele.pickupTime);
        return ele;
      });
      setList(list);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
    setPreviewData(null)
  };

  const cancelBooking = async (bookingId) => {
    try {
      if(!reason?.length) {
        setReasonError('Reason is required')
        return;
      }

      if(reason?.length < 50) {
        setReasonError('Minimum 50 character.')
        return;
      }
      const { data } = await axios.put(`/api/client/cancel-booking/${bookingId}`,{reason});

      setConfirmationOpen(false);
      setSelectedBookingId(null);
      setReasonError('')
      setReason('')
      
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
    }
  };

  
  const closeConfirmationModal = () => {
    setConfirmationOpen(false);
    setSelectedBookingId(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">Booking Management</p>
        </div>
        <div>
          <button
            className="cstm-btn"
            onClick={() => {
              reset({});
              setIsOpen(true);
            }}
          >
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
      <div className="table-responsive">
      <table className="cstm-table table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Booking Type</th>
            <th>Mobile Number</th>
            <th>Booking Date</th>
            <th>Total Price</th>
            <th>Advance Payment</th>
            <th>Action</th>
          </tr>
        </thead>
        {list.length > 0 && (
          <tbody>
            {list.map((li, index) => (
              <tr key={index}>
                <td>{li.name}</td>
                <td>{TRIP_TYPE.find(ele => ele.value === li.trip.tripType)?.name}</td>
                <td>{li?.userId?.primaryPhone}</td>
                <td>{getDateAndTimeString(li.pickupDate)}</td>
                <td>{li.totalPrice}</td>
                <td>{li.advancePayment}</td>
                <td className="d-flex align-items-center">
                  <Tooltip message={'View More'} direction="bottom">
                  <button
                    // onClick={() => deleteVehiclePrice(li._id)}
                    onClick={() => setPreviewData(li)}
                    className="icon-btn me-2"
                    type="button"
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  </Tooltip>
                  <Tooltip message={'Cancel'} direction='bottom'>
                    <button
                      className={`icon-btn ${li.isCancelable ? 'disabled' : ''}`}
                      disabled={li.isCancelable}
                      onClick={() => handleCancelClick(li._id)}
                    >
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    </Tooltip>

                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table></div>
      <Modal isOpen={isOpen} onClose={closeModal} title="Add Booking">
        <form onSubmit={handleSubmit(saveBooking)}>
          <div className="scroll-body">
            <div className="form-row row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="bookingType">Booking Type</label>
                <select
                  {...register("bookingType", { required: 'Booking Type is Required' })}
                  className="cstm-select-input"
                >
                  <option value="">Select booking type</option>
                  <option value="oneWay">One Way</option>
                  <option value="hourly">Hourly</option>
                  <option value="roundTrip">Round Trip</option>
                  <option value="cityCab">City Cab</option>
                </select>
                {errors?.bookingType && (
                  <span className="text-danger">{errors.bookingType.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="clientName">Client Name</label>
                <input
                  type="text"
                  {...register("name", { required: 'Client Name is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter client name"
                />
                {errors?.name && (
                  <span className="text-danger">{errors.name.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="primaryPhone">Mobile Number</label>
                <input
                  type="text"
                  {...register("primaryPhone", { required: 'Mobile Number is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter mobile number"
                />
                {errors?.primaryPhone && (
                  <span className="text-danger">{errors.primaryPhone.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="pickupCity">Pickup City</label>
                <input
                  type="text"
                  {...register("pickupCity", { required: 'Pickup City is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter pickup city"
                />
                {errors?.pickupCity && (
                  <span className="text-danger">{errors.pickupCity.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="dropCity">Drop City</label>
                <input
                  type="text"
                  {...register("dropCity", { required: 'Drop City is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter drop city"
                />
                {errors?.dropCity && (
                  <span className="text-danger">{errors.dropCity.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="pickupLocation">Pickup Location</label>
                <input
                  type="text"
                  {...register("pickupLocation", { required: 'Pickup Location is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter pickup location"
                />
                {errors?.pickupLocation && (
                  <span className="text-danger">{errors.pickupLocation.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="dropLocation">Drop Location</label>
                <input
                  type="text"
                  {...register("dropLocation", { required: 'Drop Location is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter drop location"
                />
                {errors?.dropLocation && (
                  <span className="text-danger">{errors.dropLocation.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="bookingDate">Booking Date</label> 
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("bookingDate", { required: 'Booking Date is Required' })}
                  className="cstm-select-input"
                />
                {errors?.bookingDate && (
                  <span className="text-danger">{errors.bookingDate.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="pickupTime">Pickup Time</label>
                <input
                  type="time"
                  {...register("pickupTime", { required: 'Pickup Time is Required' })}
                  className="cstm-select-input"
                />
                {errors?.pickupTime && (
                  <span className="text-danger">{errors.pickupTime.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="totalPrice">Total Price</label>
                <input
                  type="text"
                  {...register("totalPrice", { required: 'Total Price is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter total price"
                />
                {errors?.totalPrice && (
                  <span className="text-danger">{errors.totalPrice.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="advancePayment">Advance Payment</label>
                <input
                  type="text"
                  {...register("advancePayment", { required: 'Advance Payment is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter advance payment"
                />
                {errors?.advancePayment && (
                  <span className="text-danger">{errors.advancePayment.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end pt-2">
            <button type="submit" className="cstm-btn">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {previewData && <Modal isOpen={previewData} onClose={closeModal} title="Booking Detail">
        <div className="row m-0">
        <div className="col-lg-6 col-md-6 col-12">
            <label>Client Name</label>
            <div className="mb-0 desti-details-2">
              {previewData.name}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <label>Pickup Date</label>
            <div className="mb-0 desti-details-2">
              {getDateAndTimeString(previewData.pickupDate)}
            </div>
          </div>
          {previewData?.trip?.tripType !== 'cityCab' && <div className="col-lg-6 col-md-6 col-12">
            <label>Pickup City</label>
            <div className="mb-0 desti-details-2">
              {previewData?.pickUpCity}
            </div>
          </div>}
          <div className="col-lg-6 col-md-6 col-12">
            <label>Pickup Address</label>
            <div className="mb-0 desti-details-2">
              {previewData?.pickupLocation}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <label>Drop Address</label>
            <div className="mb-0 desti-details-2">
              {previewData?.dropoffLocation ? <> {previewData?.dropoffLocation} </> :'-'}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <label>Total Amount</label>
            <div className="mb-0 desti-details-2">
              {previewData?.totalPrice}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <label>Advance Amount</label>
            <div className="mb-0 desti-details-2">
             {previewData?.advancePayment ? <> {previewData?.advancePayment} </> :'-'}
            </div>
          </div>
        </div>
      </Modal>}

      {confirmationOpen && <Modal isOpen={confirmationOpen} onClose={closeConfirmationModal} title={'Cancel Booking'}>
          <div className="row m-0">
            <div className="form-group col-lg-12 col-md-12 col-12">
              <label for="session-date">Reason</label>
              <textarea
                type="textarea"
                className="cstm-select-input mxh-300"
                onChange={(e) => setReason(e.target.value)}
              />
              {reasonError?.length > 0 && <span className="text-danger">{reasonError}</span>}
            </div>
          </div>
          <div className="d-flex justify-content-end border-top mt-3 pt-2">
            <button type="button" className="cstm-btn-trans me-2" onClick={closeConfirmationModal}>
                Cancel
            </button>
            <button type="button" className="cstm-btn" onClick={() => confirmCancel()}>
                Confirm
            </button>
          </div>
        </Modal>}
    </div>
  );
}
