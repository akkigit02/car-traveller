import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { formatDateAndTime, getDateAndTimeString, isSchedulabel, roundToDecimalPlaces } from "../../utils/format.util";
import { HOURLY_TYPE, TRIP_TYPE, VEHICLE_TYPE } from "../../constants/common.constants";
import Tooltip from "../Tooltip";
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { phoneNumberValidation } from "../../constants/Validation.constant";
import ConfirmationModal from "../common/ConfirmationModal";

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
  const [isConfirmBooking, setIsConfirmBooking] = useState(false)
  const [isInvoiceGenerate, setIsInvoiceGenerate] = useState(false)
  const [isFullPaymentConfirm, setIsFullPaymentConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentId, setPaymentId] = useState(null)
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

  const [scrollBar, setScrollBar] = useState({
    limit: 15,
    skip: 0,
    hasMore: false,
    isScrollLoading: false
  })

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors, isSubmitting } } = useForm({
    mode: "onChange",
    defaultValues: {
      bookingType: 'oneWay'
    }
  });

  const { register: register1, handleSubmit: handleSubmit1, reset: reset1, watch: watch1, setValue: setValue1, formState: { errors: errors1, isSubmitting: isSubmitting1 } } = useForm({
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dropCities"
  });

  useEffect(() => {
    getBookings(false);
  }, [debouncedSearchQuery]);


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

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

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
      setIsConfirmBooking(true)
      if (advanceAmount <= 0) {
        setAdvanceAmountError('Please enter advance amount')
      }
      const res = await axios.patch("/api/admin/confirm-booking/" + paymentInfo?.id, { advanceAmount });
      toast.success(res?.data?.message);
      setIsPaymentModal(false)
      setPaymentInfo({})
      setAdvanceAmountError('')
    } catch (error) {
      console.error(error);
    } finally {
      setIsConfirmBooking(false)
    }
  }

  const getBookings = async (isScroll) => {
    try {
      if (!isScroll) {
        setScrollBar((old) => ({ ...old, skip: 0 }));
      }
      const res = await axios.get("/api/admin/bookings", {
        params: {
          limit: scrollBar.limit,
          skip: scrollBar.skip,
          search: debouncedSearchQuery,
        },
      });

      const list1 = res.data.bookings.map(ele => {
        ele['isCancelable'] = isSchedulabel(ele.pickupDate, ele.pickupTime) || ele.isInvoiceGenerate || ['cancelled'].includes(ele.rideStatus);
        return ele;
      });

      if (isScroll) {
        setList((old) => old.concat(list1));
      } else {
        setList(list1);
      }

      setScrollBar((old) => ({
        ...old,
        skip: old.skip + scrollBar.limit,
        hasMore: list1.length === scrollBar.limit,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getVehicleList = async () => {
    try {
      const type = watch('bookingType') || 'oneWay'
      const { data } = await axios({
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
      setIsConfirmBooking(true)
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
    } finally {
      setIsConfirmBooking(false)
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
    if (action === 'ADD') {
      append({ dropCity: '' })
    } else if (action === 'REMOVE') {
      setCitiesData(old => ({ ...old, dropCities: old.dropCities.filter((_, i) => i !== index) }));
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

  const getDataForInvoice = (data) => {
    try {
      setIsInvoiceGenerate(true)

      reset1({
        tripType: data?.trip?.tripType,
        previousDistance: data?.totalDistance,
        id: data?._id,
        hourlyType: data?.trip?.hourlyType,
        dropDate: data?.dropDate?.date ? data?.dropDate : null
      })
    } catch (error) {
      console.error(error)
    }
  }

  const publishInvoice = async (value) => {
    try {

      const { data } = await axios({
        method: 'POST',
        url: '/api/admin/publish-invoice',
        data: value
      })

      setList(old => old.map((li) => {

        if (li._id == value.id) {
          li['payableAmount'] = data?.booking?.payableAmount
          li['dueAmount'] = data?.booking?.dueAmount
          li['isInvoiceGenerate'] = data?.booking?.isInvoiceGenerate
        }

        return li
      }))
      reset1({})
      toast.success(data?.message);
      setIsInvoiceGenerate(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleFullPayment = async () => {
    try {
      const { data } = await axios({
        method: 'PATCH',
        url: '/api/admin/payment-confirmation/' + paymentId
      })

      setList(old => old.map(li => {
        if (li.paymentId === paymentId) {
          li['isPaymentCompleted'] = true
        }

        return li
      }))
      setPaymentId(null)
      toast.success(data?.message);
    } catch (error) {
      console.error(error)
    }
  }

  const closeConfirmationModal = () => {
    setConfirmationOpen(false);
    setSelectedBookingId(null);
  };

  return (
    <div>
      <div className="row m-0 mb-2">
        <div className="col-lg-6 col-md-6 col-12">
          <p className="cstm-title">Booking Management</p>
        </div>
        <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end">
          <div className="me-3 col-8">
            <input
              type="text"
              placeholder="Search by Booking No, Name or Phone"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
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
      <div>


        <div className="table-responsive">
          <InfiniteScroll
            dataLength={list.length}
            next={() => getBookings(true)}
            hasMore={scrollBar.hasMore}
            loader={<h6>Loading...</h6>}
            endMessage={<p className="py-2">No more data to show.</p>}
          >
            <table className="cstm-table table">
              <thead>
                <tr>
                  <th>#Booking Id</th>
                  <th>Client Name</th>
                  <th>Booking Type</th>
                  <th>Mobile Number</th>
                  <th>Booking Date</th>
                  <th>Booking Amount</th>
                  <th>Due Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              {list.length > 0 && (
                <tbody>
                  {list.map((li, index) => (
                    <tr key={index}>
                      <td>#{li.bookingNo}</td>
                      <td>{li.name}</td>
                      <td>{TRIP_TYPE.find((ele) => ele.value === li.trip.tripType)?.name}</td>
                      <td>{li?.phone}</td>
                      <td>{getDateAndTimeString(li.pickupDate)}</td>
                      <td>&#8377; {roundToDecimalPlaces(li?.payableAmount) || roundToDecimalPlaces(li?.totalPrice) || '0'}</td>
                      <td>&#8377; {!li.isPaymentCompleted ? (roundToDecimalPlaces(li?.dueAmount) || roundToDecimalPlaces(li?.totalPrice) || '0') : '0'}</td>
                      <td className="d-flex align-items-center">
                        <Tooltip message={'View More'} direction="bottom">
                          <button
                            onClick={() => setPreviewData(li)}
                            className="icon-btn me-2"
                            type="button"
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                        </Tooltip>
                        <Tooltip message={'Publish Invoice'} direction="bottom">
                          <button
                            className={`icon-btn me-2 ${li.isInvoiceGenerate ? 'disabled' : ''}`}
                            onClick={() => getDataForInvoice(li)}
                            type="button"
                            disabled={li.isInvoiceGenerate}
                          >
                            <i className="fas fa-share-square"></i>
                          </button>
                        </Tooltip>
                        <Tooltip message={'Mark Full Payment'} direction="bottom">
                          <button
                            className={`icon-btn me-2 ${li.isInvoiceGenerate && li.isPaymentCompleted || !li.isInvoiceGenerate ? 'disabled' : ''}`}
                            disabled={li.isInvoiceGenerate && li.isPaymentCompleted || !li.isInvoiceGenerate}
                            onClick={() => { setPaymentId(li.paymentId); setIsFullPaymentConfirm(true); }}
                          >
                            <i className="fas fa-money-check"></i>
                          </button>
                        </Tooltip>
                        <Tooltip message={'Cancel'} direction="bottom">
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
            </table>
          </InfiniteScroll>
        </div>
      </div>
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
                  {HOURLY_TYPE.map(hour => (<option key={'hr' + hour.value} value={hour.value}>{hour.name}</option>))}
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
                  {vehicleList.map(vehicle => (<option key={'vhl' + vehicle._id} value={vehicle._id}>{VEHICLE_TYPE.find(li => li.value === vehicle.vehicleType)?.name}</option>))}
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
                        {citiesData.cities.map((ele, idx) => (<li onClick={() => { setValue(`dropCities.${index}.dropCity`, ele.city_name); setCitiesData(old => ({ ...old, dropCities: [...old.dropCities, ele._id] })) }} key={"dropCity" + index + idx} ><p className='mb-0'>{ele?.city_name}</p></li>))}
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
            <button type="submit" disabled={isSubmitting} className="cstm-btn">
              {isSubmitting && <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>}
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
          <button type="button" disabled={isConfirmBooking} className="btn btn-primary" onClick={() => confirmBooking()}>
            {isConfirmBooking && <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>}
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
              {previewData?.pickupCityName}
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
              {previewData?.dropoffLocation ? <> {previewData?.dropoffLocation} </> : '-'}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <label>Total Amount</label>
            <div className="mb-0 desti-details-2">
              {previewData?.payableAmount}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <label>Due Amount</label>
            <div className="mb-0 desti-details-2">
              {previewData?.dueAmount ? <> {previewData?.dueAmount} </> : '-'}
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
          <button type="button" className="cstm-btn" disabled={isConfirmBooking} onClick={() => confirmCancel()}>
            {isConfirmBooking && <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>}
            Confirm
          </button>
        </div>
      </Modal>}

      {isInvoiceGenerate && <Modal isOpen={isInvoiceGenerate} onClose={() => setIsInvoiceGenerate(false)} title={'Publish Invoice'}>
        <form onSubmit={handleSubmit1(publishInvoice)} className="modal-dropdown">
          <div className="scroll-body">
            <div className="form-row row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="tripType">Booking Type</label>
                <div className="cstm-select-input" >
                  {TRIP_TYPE.find(hour => hour.value === watch1('tripType'))?.name}
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="previousDistance"> Previous Distance</label>
                <div className="cstm-select-input" />
                {watch1('previousDistance')} km
              </div>
              {watch1('tripType') === 'hourly' &&
                <>
                  <div className="form-group col-lg-6 col-md-6 col-12">
                    <label htmlFor="hourlyType">Hourly Type</label>
                    <div className="cstm-select-input" >
                      {HOURLY_TYPE.find(hour => hour.value === watch1('hourlyType'))?.name}
                    </div>
                  </div>

                  <div className="form-group col-lg-6 col-md-6 col-12">
                    <label htmlFor="hourlyType">Previous Hour</label>
                    <div className="cstm-select-input">
                      {HOURLY_TYPE.find(hour => hour.value === watch1('hourlyType'))?.hour} hr
                    </div>
                    {errors1?.totalHour && (
                      <span className="text-danger">{errors1.totalHour.message}</span>
                    )}
                  </div>

                  <div className="form-group col-lg-6 col-md-6 col-12">
                    <label htmlFor="hourlyType">Total Hour</label>
                    <input
                      {...register1("totalHour", { required: 'Total hour is Required' })}
                      type='number'
                      className="cstm-select-input"
                      placeholder="Please enter total hour"
                    />
                    {errors1?.totalHour && (
                      <span className="text-danger">{errors1.totalHour.message}</span>
                    )}
                  </div>
                </>}

              {watch1('tripType') === 'roundTrip' && 
              <>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="hourlyType">Drop Date</label>
                <div className="cstm-select-input" >
                  {getDateAndTimeString(watch1('dropDate'))}
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-6 col-12 position-relative">
                <label htmlFor="hourlyType">New Drop Date</label>
                <input
                  {...register1("newDropDate", { required: 'New Drop Date is Required' })}
                  type='date'
                  className="cstm-select-input"
                  placeholder="Please enter new drop date"
                />
                {errors1?.newDropDate && (
                  <span className="text-danger">{errors1?.newDropDate?.message}</span>
                )}
              </div>
              </>}

              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="totalDistance"> Total Distance</label>
                <input
                  {...register1("totalDistance", { required: 'Total distance is Required' })}
                  className="cstm-select-input"
                  type='number'
                  placeholder="Please enter total distance"
                />

                {errors1?.totalDistance && (
                  <span className="text-danger">{errors1.totalDistance.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end pt-2">
            <button type="submit" disabled={isSubmitting1} className="cstm-btn">
              {isSubmitting1 && <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>}
              Confirm
            </button>
          </div>
        </form>
      </Modal>}

      <ConfirmationModal
        isOpen={isFullPaymentConfirm}
        onClose={() => { setIsFullPaymentConfirm(false); setPaymentId(null) }}
        onConfirm={() => handleFullPayment()}
        message="Are you sure you want to confirm full payment?"
      />
    </div>
  );
}
