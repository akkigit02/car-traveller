import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function BookingManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
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
      setList(res.data.bookings);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
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
            <th>Booking Type</th>
            <th>Client Name</th>
            <th>Mobile Number</th>
            <th>Pickup City</th>
            <th>Drop City</th>
            <th>Pickup Location</th>
            <th>Drop Location</th>
            <th>Booking Date</th>
            <th>Total Price</th>
            <th>Advance Payment</th>
          </tr>
        </thead>
        {list.length > 0 && (
          <tbody>
            {list.map((li, index) => (
              <tr key={index}>
                <td>{li.trip.tripType}</td>
                <td>{li.name}</td>
                <td>{li?.userId?.primaryPhone}</td>
                <td>{li.pickupCity}</td>
                <td>{li.dropCity}</td>
                <td>{li.pickupLocation}</td>
                <td>{li.dropoffLocation}</td>
                <td>{new Date(li.pickupDate).toLocaleDateString()}</td>
                <td>{li.totalPrice}</td>
                <td>{li.advancePayment}</td>
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
                <label htmlFor="bookingDate">Booking Date</label> 
                <input
                  type="date"
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
    </div>
  );
}
