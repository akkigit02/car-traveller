import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { formatDateAndTime, getDateAndTimeString, isSchedulabel } from "../../utils/format.util";
import { HOURLY_TYPE, TRIP_TYPE, VEHICLE_TYPE } from "../../constants/common.constants";
import Tooltip from "../Tooltip";
import { toast } from 'react-toastify';
import { phoneNumberValidation } from "../../constants/Validation.constant";

export default function BookingManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [previewData, setPreviewData] = useState(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // For confirmation
  const [timeOptions, setTimeOptions] = useState([]);
  const [minDate, setMinDate] = useState(null)
  const [vehicleList, setVehicleList] = useState([])
  const [isPaymentModal, setIsPaymentModal] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState({})
  const [advanceAmount, setAdvanceAmount] = useState(null)
  const [advanceAmountError, setAdvanceAmountError] = useState('')
  const [suggestions, setSuggestions] = useState({
    pickupLocationId: '',
    dropLocationId: '',
    addresses: [],
    type: '',
  });
  const [citiesData, setCitiesData] = useState({
    pickupCityId: '',
    dropCityId: '',
    cities: [],
    type: '',
    dropCities: []
  })

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      bookingType: 'oneWay'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dropCities"
  });

  useEffect(() => {
    getBookings();
  }, []);

  useEffect(() => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const pickupDate = `${year}-${month}-${day}`
    setMinDate(pickupDate);

    setTimeOtion(pickupDate);

    setValue('bookingDate', pickupDate);
    getVehicleList()
    // setValue('reshedulePickupTime', data.pickupTime);
  }, [isOpen])

  const saveBooking = async (data) => {
    try {
      data['pickupCityId'] = citiesData?.pickupCityId
      data['dropCityId'] = citiesData?.dropCityId
      data['dropCities'] = citiesData?.dropCities
      data['pickupLocationId'] = suggestions?.pickupLocationId
      data['dropLocationId'] = suggestions?.dropLocationId
      const res = await axios.post("/api/admin/bookings", data);
      let info = res.data.booking
      setPaymentInfo({
        distance: info.totalDistance,
        price: info.payablePrice,
        id: info._id
      })
      setList([info, ...list]);
      setIsOpen(false);
      setIsPaymentModal(true)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const confirmBooking = async () => {
    try {
      if(advanceAmount <= 0) {
        setAdvanceAmountError('Please enter advance amount')
      }
      const res = await axios.patch("/api/admin/confirm-booking/"+ paymentInfo?.id, { advanceAmount });
      toast.success(res?.data?.message);
      setIsPaymentModal(false)
      setPaymentInfo({})
      setAdvanceAmountError('')
    } catch (error) {
      console.error(error);
    }
  }

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

  const getVehicleList = async () => {
    try {
      const type = watch('bookingType') || 'oneWay'
      const {data} = await axios({
        method: 'GET',
        url: `/api/admin/vehicle-type/${type}`
      })

      setVehicleList(data?.vehicleList)
    } catch (error) {
      console.error(error)
    }
  }

  const getAddressSuggetion = async (search = '', type) => {
    try {
      let response = null
      let cityId = type === 'pickupLocation' ? citiesData?.pickupCityId : citiesData?.dropCityId
      response = await axios.get(`/api/client/places-suggestion`, { params: { search, cityId: cityId || null } });
      setSuggestions(old => ({ ...old, addresses: response.data.address, type: type }))
    } catch (error) {
      console.error(error)
    }
  }

  const getCitySuggestions = async (search = '', type, index) => {
    try {
      let response = await axios.get(`/api/client/cities?search=${search}`);
      setCitiesData(old => ({ ...old, cities: response.data.cities, type: type }))
    } catch (error) {
      console.error(error)
    }
  }
  const closeModal = () => {
    reset({});
    setSuggestions({
      pickupLocationId: '',
      dropLocationId: '',
      addresses: [],
      type: '',
    });
    setCitiesData({
      pickupCityId: '',
      dropCityId: '',
      cities: [],
      type: '',
      dropCities: []
    })
    setIsOpen(false);
    setPreviewData(null)
    remove()
  };

  const cancelBooking = async (bookingId) => {
    try {
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
      console.error(error);
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

  const handleBookingType = (event) => {
    setValue('bookingType', event)
    if (event === 'roundTrip') {
      setValue('returnDate', watch('bookingDate'))
      append({ dropCity: '' })
    }
    else remove()
    setValue('pickupCity', '')
    setValue('dropCity', '')
    setValue('hourlyType', '')
    setValue('pickupLocation', '')
    setValue('dropLocation', '')
    setValue('vehicleId', '')
    setSuggestions({
      pickupLocationId: '',
      dropLocationId: '',
      addresses: [],
      type: '',
    });
    setCitiesData({
      pickupCityId: '',
      dropCityId: '',
      cities: [],
      type: '',
      dropCities: []
    })
    getVehicleList()
  }

  const handleOnFocus = (search, type) => {
    if (['pickupLocation', 'dropLocation'].includes(type))
      getAddressSuggetion(search, type)
    else
      getCitySuggestions(search, type)
  }

  const handleOnChange = (search, type) => {
    if (['pickupLocation', 'dropLocation'].includes(type))
      getAddressSuggetion(search, type)
    else
      getCitySuggestions(search, type)
  }

  const handleOnBlur = (type) => {
    if (['pickupLocation', 'dropLocation'].includes(type))
      setTimeout(() => {
        setSuggestions(old => ({ ...old, type: '', addresses: [] }))
      }, 250)
    else
      setTimeout(() => {
        setCitiesData(old => ({ ...old, type: '', cities: [] }))
      }, 250)
  }

  const handleDynamicField = (index, action) => {
    if(action === 'ADD') {
      append({dropCity: ''})
    } else if(action === 'REMOVE') {
      setCitiesData(old => ({...old, dropCities: old.dropCities.filter((_, i) => i !== index)}));
      remove(index)
    }
  }

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
    setValue('bookingDate', e.target.value);
    if (watch('bookingType') === 'roundTrip') {
      setValue('returnDate', e.target.value);
    }
    date.setHours(0, 0, 0, 0);
    setTimeOtion(date);
    setValue('pickupTime', '00:15 AM');
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
        <form onSubmit={handleSubmit(saveBooking)} className="modal-dropdown">
          <div className="scroll-body">
            <div className="form-row row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="bookingType">Booking Type</label>
                <select
                  {...register("bookingType", { required: 'Booking Type is Required' })}
                  className="cstm-select-input" onChange={(e) => handleBookingType(e.target.value)}
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
              {watch('bookingType') === 'hourly' && <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="hourlyType">Hourly Type</label>
                <select
                  {...register("hourlyType", { required: 'Hourly Type is Required' })}
                  className="cstm-select-input" >
                    <option value='' disabled>Please Select</option>
                  {HOURLY_TYPE.map(hour => (<option value={hour.value}>{hour.name}</option>))}
                </select>
                {errors?.hourlyType && (
                  <span className="text-danger">{errors.hourlyType.message}</span>
                )}
              </div>}

              {watch('bookingType') && <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="vehicleId">Vehicle Type</label>
                <select
                  {...register("vehicleId", { required: 'Vehicle is Required' })}
                  className="cstm-select-input"
                >
                  <option value='' disabled>Please Select</option>
                 {vehicleList.map(vehicle => (<option value={vehicle._id}>{VEHICLE_TYPE.find(li => li.value === vehicle.vehicleType)?.name}</option>))}
                </select>
                {errors?.vehicleId && (
                  <span className="text-danger">{errors.vehicleId.message}</span>
                )}
              </div>}
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
                  {...register("primaryPhone", phoneNumberValidation)}
                  className="cstm-select-input"
                  placeholder="Enter mobile number"
                />
                {errors?.primaryPhone && (
                  <span className="text-danger">{errors.primaryPhone.message}</span>
                )}
              </div>
              {watch('bookingType') !== 'cityCab' && <>
                <div className="form-group col-lg-6 col-md-6 col-12 position-relative">
                  <label htmlFor="pickupCity">Pickup City</label>
                  <input
                    type="text"
                    {...register("pickupCity", { required: 'Pickup City is Required' })}
                    className="cstm-select-input"
                    placeholder="Enter pickup city"
                    onFocus={(e) => handleOnFocus(e.target.value, 'pickupCity')}
                    onChange={(e) => handleOnChange(e.target.value, 'pickupCity')}
                    onBlur={(e) => handleOnBlur('pickupCity')}
                  />
                  {errors?.pickupCity && (
                    <span className="text-danger">{errors.pickupCity.message}</span>
                  )}
                  {citiesData.type === 'pickupCity' &&
                  <ul className='suggestion-list'>
                    {citiesData.cities.map((ele, idx) => (<li onClick={() => { setValue('pickupCity', ele.city_name); setCitiesData(old => ({ ...old, pickupCityId: ele._id })) }} key={"pickUp" + idx} ><p className='mb-0'>{ele?.city_name}</p></li>))}
                  </ul>}
                </div>
                
                {watch('bookingType') === 'oneWay' && <div className="form-group col-lg-6 col-md-6 col-12 position-relative">
                  <label htmlFor="dropCity">Drop City</label>
                  <input
                    type="text"
                    {...register("dropCity", { required: 'Drop City is Required' })}
                    className="cstm-select-input"
                    placeholder="Enter drop city"
                    onFocus={(e) => handleOnFocus(e.target.value, 'dropCity')}
                    onChange={(e) => handleOnChange(e.target.value, 'dropCity')}
                    onBlur={(e) => handleOnBlur('dropCity')}
                  />
                  {errors?.dropCity && (
                    <span className="text-danger">{errors.dropCity.message}</span>
                  )}
                  {citiesData.type === 'dropCity' &&
                  <ul className='suggestion-list'>
                    {citiesData.cities.map((ele, idx) => (<li onClick={() => { setValue('dropCity', ele.city_name); setCitiesData(old => ({ ...old, dropCityId: ele._id })) }} key={"dropCi" + idx} ><p className='mb-0'>{ele?.city_name}</p></li>))}
                  </ul>}
                </div>
                }
                
                {watch('bookingType') === 'roundTrip' && fields.map((field, index) => (
                  <div className="form-group col-lg-6 col-md-6 col-12 position-relative" key={field.id}>
                    <label htmlFor={`dropCities.${index}.dropCity`}>Drop City {index + 1}</label>
                    <input
                      type="text"
                      {...register(`dropCities.${index}.dropCity`, { required: 'Drop City is Required' })}
                      className="cstm-select-input"
                      placeholder="Enter drop city"
                      onFocus={(e) => handleOnFocus(e.target.value, `dropCities.${index}.dropCity`)}
                      onChange={(e) => handleOnChange(e.target.value, `dropCities.${index}.dropCity`)}
                      onBlur={(e) => handleOnBlur(`dropCities.${index}.dropCity`)}
                    />
                    {errors?.dropCities?.[index]?.dropCity && (
                      <span className="text-danger">{errors.dropCities[index]?.dropCity?.message}</span>
                    )}

                    {citiesData.type === `dropCities.${index}.dropCity` &&
                      <ul className='suggestion-list'>
                        {citiesData.cities.map((ele, idx) => (<li onClick={() => { setValue(`dropCities.${index}.dropCity`, ele.city_name); setCitiesData(old => ({ ...old, dropCities: [...old.dropCities, ele._id] })) }} key={"dropCity"+index + idx} ><p className='mb-0'>{ele?.city_name}</p></li>))}
                      </ul>}

                    {fields.length > 1 && (
                      <button type="button" onClick={() => handleDynamicField(index, 'REMOVE')}>
                        -
                      </button>
                    )}

                    {index === fields.length - 1 && (
                      <button type="button" onClick={() => handleDynamicField(index, 'ADD')}>
                        +
                      </button>
                    )}
                  </div>
                ))}

              </>}
              {(watch('pickupCity') || watch('bookingType') === 'cityCab') && <div className="form-group col-lg-6 col-md-6 col-12 position-relative">
                <label htmlFor="pickupLocation">Pickup Location</label>
                <input
                  type="text"
                  {...register("pickupLocation", { required: 'Pickup Location is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter pickup location"
                  onFocus={(e) => handleOnFocus(e.target.value, 'pickupLocation')}
                  onChange={(e) => handleOnChange(e.target.value, 'pickupLocation')}
                  onBlur={(e) => handleOnBlur('pickupLocation')}
                />
                {errors?.pickupLocation && (
                  <span className="text-danger">{errors.pickupLocation.message}</span>
                )}
                {suggestions.type === 'pickupLocation' &&
                <ul className='suggestion-list'>
                  {suggestions.addresses.map((ele, idx) => (<li onClick={() => { setValue('pickupLocation', ele.address); setSuggestions(old => ({ ...old, pickupLocationId: ele.placeId })) }} key={"pickUpLo" + idx} ><p className='mb-0'>{ele?.address}</p></li>))}
                </ul>}
              </div>}

              

              {(['cityCab', 'oneWay'].includes(watch('bookingType')) || watch('dropCity')) && <div className="form-group col-lg-6 col-md-6 col-12 position-relative">
                <label htmlFor="dropLocation">Drop Location</label>
                <input
                  type="text"
                  {...register("dropLocation", { required: 'Drop Location is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter drop location"
                  onFocus={(e) => handleOnFocus(e.target.value, 'dropLocation')}
                  onChange={(e) => handleOnChange(e.target.value, 'dropLocation')}
                  onBlur={(e) => handleOnBlur('dropLocation')}
                />
                {errors?.dropLocation && (
                  <span className="text-danger">{errors.dropLocation.message}</span>
                )}
                {suggestions.type === 'dropLocation' &&
                <ul className='suggestion-list'>
                  {suggestions.addresses.map((ele, idx) => (<li onClick={() => { setValue('dropLocation', ele.address); setSuggestions(old => ({ ...old, dropLocationId: ele.placeId })) }} key={"dropLocation" + idx} ><p className='mb-0'>{ele?.address}</p></li>))}
                </ul>}
              </div>}
              
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="bookingDate">Booking Date</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("bookingDate", { required: 'Booking Date is Required' })}
                  className="cstm-select-input"
                  min={minDate}
                  onChange={(e) => handleDateChange(e)}
                />
                {errors?.bookingDate && (
                  <span className="text-danger">{errors.bookingDate.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                  <label>Pickup Time</label>
                  <select className="cstm-select-input" {...register('pickupTime', { required: 'Time is required' })}>
                    {timeOptions.map((option, index) => (
                      option > new Date().setMinutes(new Date().getMinutes() + 90) && (
                        <option key={index} value={formatDateAndTime(option, 'hh:mm A')}>
                          {formatDateAndTime(option, 'hh:mm A')}
                        </option>
                      )
                    ))}
                  </select>
                  {errors?.pickupTime && <span className="text-danger">{errors.pickupTime.message}</span>}
                </div>
              {watch('bookingType') === 'roundTrip' && <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="returnDate">Return Date</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("returnDate", { required: 'Return Date is Required' })}
                  className="cstm-select-input"
                  min={watch('bookingDate')}
                />
                {errors?.returnDate && (
                  <span className="text-danger">{errors.returnDate.message}</span>
                )}
              </div>}
            </div>
          </div>
          <div className="d-flex justify-content-end pt-2">
            <button type="submit" className="cstm-btn">
              Proceed
            </button>
          </div>
        </form>
      </Modal>

    
      {isPaymentModal && <Modal isOpen={isPaymentModal} onClose={() => setIsPaymentModal(false)} title={'Confirm Booking'}>
        <div className="row m-0">
          <div className="form-group col-lg-6 col-md-6 col-12">
            <label for="session-date">Distance</label>
            <div className="cstm-select-input">
                {paymentInfo?.distance}
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-12">
            <label for="session-date">Total Amount</label>
            <div className="cstm-select-input">
            {paymentInfo?.price}
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-12">
            <label for="session-date">Advance Amount</label>
            <input
              type="number"
              className="cstm-select-input"
              onChange={(e) => setAdvanceAmount(e.target.value)}
            />
            {advanceAmountError?.length > 0 && <span className="text-danger">{advanceAmountError}</span>}
          </div>
        </div>
        <div className="d-flex justify-content-end border-top mt-3 pt-2">
          <button type="button" className="btn btn-primary" onClick={() => setIsPaymentModal(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={() => confirmBooking()}>
            Confirm
          </button>
        </div>
      </Modal>}


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
