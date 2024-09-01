import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function BookingManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
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
      if (Array.isArray(data.bookings)) {
        data.bookings = data.bookings.map(item => ({
          bookingType: item.bookingType,
          clientName: item.clientName,
          mobileNumber: item.mobileNumber,
          pickupCity: item.pickupCity,
          dropCity: item.dropCity,
          pickupLocation: item.pickupLocation,
          dropLocation: item.dropLocation,
          bookingDate: item.bookingDate,
          price: item.price,
        }));
      }

      if (data?._id) {
        await axios.put("/api/admin/bookings", data);
        setList(list.map(li => (li._id === data._id ? data : li)));
      } else {
        const res = await axios.post("/api/admin/bookings", data);
        setList([res.data.booking, ...list]);
      }
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

  const getBookingById = async (id) => {
    try {
      const res = await axios.get(`/api/admin/bookings/${id}`);
      const { booking } = res.data;
      reset(booking);
      setValue('bookings', booking.bookings.map(item => ({
        bookingType: item.bookingType,
        clientName: item.clientName,
        mobileNumber: item.mobileNumber,
        pickupCity: item.pickupCity,
        dropCity: item.dropCity,
        pickupLocation: item.pickupLocation,
        dropLocation: item.dropLocation,
        bookingDate: item.bookingDate,
        price: item.price,
      })));
      setIsOpen(true);
      setIsEdit(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
    setIsEdit(false);
  };

  const deleteBooking = async (id) => {
    try {
      if (window.confirm("Do you really want to delete!")) {
        await axios.delete(`/api/admin/bookings/${id}`);
        setList(list.filter(li => li._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
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
      <table className="cstm-table">
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
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        {list.length > 0 && (
          <tbody>
            {list.map((li, index) => (
              <tr key={index}>
                <td>{li.bookingType}</td>
                <td>{li.clientName}</td>
                <td>{li.mobileNumber}</td>
                <td>{li.pickupCity}</td>
                <td>{li.dropCity}</td>
                <td>{li.pickupLocation}</td>
                <td>{li.dropLocation}</td>
                <td>{new Date(li.bookingDate).toLocaleDateString()}</td>
                <td>{li.price}</td>
                <td className="d-flex align-items-center">
                  <button
                    onClick={() => getBookingById(li._id)}
                    className="icon-btn me-2"
                    type="button"
                    title="Edit"
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                  <button
                    onClick={() => deleteBooking(li._id)}
                    className="icon-btn"
                    type="button"
                    title="Delete"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <Modal isOpen={isOpen} onClose={closeModal} title={isEdit ? 'Edit Booking' : 'Add Booking'}>
        <form onSubmit={handleSubmit(saveBooking)}>
          <div className="h-100 scroll-body">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="bookingType">Booking Type</label>
                <input
                  type="text"
                  {...register("bookingType", { required: 'Booking Type is Required' })}
                  className="form-control"
                  placeholder="Enter booking type"
                />
                {errors?.bookingType && (
                  <span className="text-danger">{errors.bookingType.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="clientName">Client Name</label>
                <input
                  type="text"
                  {...register("clientName", { required: 'Client Name is Required' })}
                  className="form-control"
                  placeholder="Enter client name"
                />
                {errors?.clientName && (
                  <span className="text-danger">{errors.clientName.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="text"
                  {...register("mobileNumber", { required: 'Mobile Number is Required' })}
                  className="form-control"
                  placeholder="Enter mobile number"
                />
                {errors?.mobileNumber && (
                  <span className="text-danger">{errors.mobileNumber.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="pickupCity">Pickup City</label>
                <input
                  type="text"
                  {...register("pickupCity", { required: 'Pickup City is Required' })}
                  className="form-control"
                  placeholder="Enter pickup city"
                />
                {errors?.pickupCity && (
                  <span className="text-danger">{errors.pickupCity.message}</span>
                )}
              </div>
              <div className="form-group col-md6">
                <label htmlFor="dropCity">Drop City</label>
                <input
                  type="text"
                  {...register("dropCity", { required: 'Drop City is Required' })}
                  className="form-control"
                  placeholder="Enter drop city"
                />
                {errors?.dropCity && (
                  <span className="text-danger">{errors.dropCity.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="pickupLocation">Pickup Location</label>
                <input
                  type="text"
                  {...register("pickupLocation", { required: 'Pickup Location is Required' })}
                  className="form-control"
                  placeholder="Enter pickup location"
                />
                {errors?.pickupLocation && (
                  <span className="text-danger">{errors.pickupLocation.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="dropLocation">Drop Location</label>
                <input
                  type="text"
                  {...register("dropLocation", { required: 'Drop Location is Required' })}
                  className="form-control"
                  placeholder="Enter drop location"
                />
                {errors?.dropLocation && (
                  <span className="text-danger">{errors.dropLocation.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="bookingDate">Booking Date</label>
                <input
                  type="date"
                  {...register("bookingDate", { required: 'Booking Date is Required' })}
                  className="form-control"
                />
                {errors?.bookingDate && (
                  <span className="text-danger">{errors.bookingDate.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  {...register("price", { required: 'Price is Required' })}
                  className="form-control"
                  placeholder="Enter price"
                />
                {errors?.price && (
                  <span className="text-danger">{errors.price.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="cstm-btn">
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
