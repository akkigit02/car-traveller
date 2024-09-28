import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { VEHICLE_TYPE } from "../../constants/common.constants";
import axios from "axios";
import Tooltip from "../Tooltip";
import ConfirmationModal from "../common/ConfirmationModal";

export default function VehiclePricing() {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState(VEHICLE_TYPE)
  const [isModalLoding, setIsModalLoading] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors, isSubmitting } } = useForm({
    mode: "onChange",
  });

  const HOURLY_DEFAULT = [
    { type: "8hr80km", hour: 8, distance: 80, basePrice: null },
    { type: "10hr100km", hour: 10, distance: 100, basePrice: null },
    { type: "12hr120km", hour: 12, distance: 120, basePrice: null }
  ]
  const { fields, append, remove } = useFieldArray({
    control,
    name: "similar"
  });

  useEffect(() => {
    getVehiclePrice(false);
  }, []);

  const saveVehiclePrice = async (data) => {
    try {
      if (Array.isArray(data.similar)) {
        data.similar = data.similar.map(item => item.value);
      }

      // Handle the 'hourly' field which is an array of objects
      if (data.hourly) {
        data.hourly = data.hourly.map(item => ({
          type: item.type,
          hour: item.hour,
          distance: item.distance,
          basePrice: item.basePrice,
        }));
      }

      if (data?._id) {
        await axios.put("/api/admin/vehicle-price", data);
        setList(list.map(li => (li._id === data._id ? data : li)));
      } else {
        const res = await axios.post("/api/admin/vehicle-price", data);
        setList([res.data.price, ...list]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getVehiclePrice = async () => {
    try {
      setIsModalLoading(true)
      const res = await axios.get("/api/admin/vehicle-price");
      setList(res.data.price);
      const filteredList = VEHICLE_TYPE.filter(
        (vehicle) => !res.data.price.some(dbVehicle => dbVehicle.vehicleType === vehicle.value)
      );
      setVehicleTypes(filteredList)
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalLoading(false)
    }
  };
  const getVehiclePriceById = async (id) => {
    try {
      setIsModalLoading(true)
      setIsOpen(true);
      const res = await axios.get(`/api/admin/vehicle-price/${id}`);
      const { price } = res.data;
      setIsEdit(true);
      reset(price);
      setValue('similar', price.similar.map(value => ({ value })));
      setValue('hourly', price.hourly.map(item => ({
        type: item.type,
        hour: item.hour,
        distance: item.distance,
        basePrice: item.basePrice,
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalLoading(false)
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
    setIsEdit(false);
  };

  const openViewModal = () => {
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
  };

  const deleteVehiclePrice = async () => {
    try {
      await axios.delete(`/api/admin/vehicle-price/${selectedId}`);
      const vehicleData = list.find(li => li.id == selectedId)
      const vehicleType = VEHICLE_TYPE.find(car => car.value === vehicleData.vehicleType)
      if (vehicleType) {
        setVehicleTypes((prevTypes) => [...prevTypes, vehicleType]);
      }
      setList(list.filter(li => li._id !== selectedId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">Vehicle Price</p>
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
      {/* <table className="cstm-table">
        <thead>
          <tr>
            <th className="">Image</th>
            <th className="">Type</th>
            <th className="">Name</th>
            <th className="">Minimum Fare</th>
            <th className="">Cost per km (One Way)</th>
            <th className="">Cost per km (Round Trip)</th>
            <th className="">Cost per hour</th>
            <th className="">Action</th>
          </tr>
        </thead>
          <tbody>
            {list.length > 0 ? list.map((li, index) => (
              <tr key={"list"+index}>
                <td>
                  <img style={{ height: "50px", width: "70px" }} src={li.vehicleImageUrl} alt="Vehicle"/>
                </td>
                <td>{VEHICLE_TYPE.find(item => item.value === li.vehicleType)?.name}</td>
                <td>{li.vehicleName}</td>
                <td>{li.minimumFare}</td>
                <td>{li.costPerKmOneWay}</td>
                <td>{li.costPerKmRoundTrip}</td>
                <td>{li.costPerHour}</td>
                <td className="d-flex align-items-center">
                 <Tooltip message={'Edit'} direction="bottom">
                  <button
                    onClick={() => getVehiclePriceById(li._id)}
                    className="icon-btn me-2"
                    type="button"
                  >
                    <i className="fa fa-edit"></i>
                  </button></Tooltip>
                  <Tooltip message={'View More'} direction="bottom">
                  <button
                    // onClick={() => deleteVehiclePrice(li._id)}
                    onClick={openViewModal}
                    className="icon-btn me-2"
                    type="button"
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  </Tooltip>
                  <Tooltip message={'Cancel'} direction="bottom">
                  <button
                    onClick={() => deleteVehiclePrice(li._id)}
                    className="icon-btn"
                    type="button"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  </Tooltip>
                </td>
              </tr>
            )):
            <tr className='no-data'>
            <td colSpan="100%">
              <div className='d-flex align-items-center justify-content-center'><div  className='no-data-content'></div></div>
            </td>
          </tr>
          }
          </tbody>
      </table> */}


      <div className="cstm-table-container">
        <div className="cstm-table-row cstm-header">
          <div className="cstm-table-cell">Image</div>
          <div className="cstm-table-cell">Type</div>
          <div className="cstm-table-cell">Name</div>
          <div className="cstm-table-cell">Minimum Fare</div>
          <div className="cstm-table-cell">Cost per km (One Way)</div>
          <div className="cstm-table-cell">Cost per km (Round Trip)</div>
          <div className="cstm-table-cell">Cost per hour</div>
          <div className="cstm-table-cell">Action</div>
        </div>
        {list.length > 0 ? list.map((li, index) => (
          <div key={"list" + index} className="cstm-table-row">
            <div className="cstm-table-cell" data-label="Image"><img style={{ height: "50px", width: "70px" }} src={li.vehicleImageUrl} alt="Vehicle" /></div>
            <div className="cstm-table-cell" data-label="Type">{VEHICLE_TYPE.find(item => item.value === li.vehicleType)?.name}</div>
            <div className="cstm-table-cell" data-label="Name">{li.vehicleName}</div>
            <div className="cstm-table-cell" data-label="Minimum Fare">{li.minimumFare}</div>
            <div className="cstm-table-cell" data-label="Cost per km (One Way)">{li.costPerKmOneWay}</div>
            <div className="cstm-table-cell" data-label="Cost per km (Round Trip)">{li.costPerKmRoundTrip}</div>
            <div className="cstm-table-cell" data-label="Cost per hour">{li.costPerHour}</div>
            <div className="cstm-table-cell" data-label="Action">
              <div className="d-flex align-items-center">
                <Tooltip message={'Edit'} direction="bottom">
                  <button
                    onClick={() => getVehiclePriceById(li._id)}
                    className="icon-btn me-2"
                    type="button"
                  >
                    <i className="fa fa-edit"></i>
                  </button></Tooltip>
                <Tooltip message={'View More'} direction="bottom">
                  <button
                    // onClick={() => deleteVehiclePrice(li._id)}
                    onClick={openViewModal}
                    className="icon-btn me-2"
                    type="button"
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                </Tooltip>
                <Tooltip message={'Cancel'} direction="bottom">
                  <button
                    onClick={() => {setSelectedId(li._id); setConfirmationOpen(true)}}
                    className="icon-btn"
                    type="button"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        )) :
          <div className='no-data'>
            <div colSpan="100%">
              <div className='d-flex align-items-center justify-content-center'><div className='no-data-content'></div></div>
            </div>
          </div>
        }
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title={isEdit ? 'Edit Price' : 'Add Price'}>
        {isModalLoding ? <div className="loader"></div> : <form onSubmit={handleSubmit(saveVehiclePrice)}>
          <div className="scroll-body">
            <div className="form-row row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputState">Vehicle Type *</label>
                <select {...register("vehicleType", { required: 'Vehicle Type is Required' })} disabled={isEdit} className="cstm-select-input">
                  <option value="">Choose Type</option>
                  {(isEdit ? VEHICLE_TYPE : vehicleTypes).map((vehicle, index) => (
                    <option key={"vehicle" + index} value={vehicle.value}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
                {errors?.vehicleType && (
                  <span className="text-danger">{errors.vehicleType.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputPassword4">Vehicle Name *</label>
                <input
                  type="text"
                  {...register("vehicleName", { required: 'Vehicle Name is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter vehicle name"
                />
                {errors?.vehicleName && (
                  <span className="text-danger">{errors.vehicleName.message}</span>
                )}
              </div>

              {/* Similar Field Array */}
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label>Similar</label>
                {fields.map((item, index) => (
                  <div key={"simi" + index} className="d-flex align-items-center mb-2">
                    <input
                      type="text"
                      {...register(`similar.${index}.value`, { required: 'This field is required' })}
                      className="cstm-select-input"
                      placeholder="Enter similar option"
                    />
                    <button
                      type="button"
                      className="btn btn-danger ml-2"
                      onClick={() => remove(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => append({ value: "" })}
                >
                  +
                </button>
              </div>

              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputPassword4">Image Url *</label>
                <input
                  type="text"
                  {...register("vehicleImageUrl")}
                  className="cstm-select-input"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputPassword4">Minimum Fare *</label>
                <input
                  type="number"
                  {...register("minimumFare", { required: 'Minimum Fare is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter minimum fare"
                />
                {errors?.minimumFare && (
                  <span className="text-danger">{errors.minimumFare.message}</span>
                )}
              </div>
              {/* <div className="form-group col-lg-6 col-md-6 col-12">
              <label htmlFor="inputAddress">Cost per km</label>
              <input
                type="number"
                {...register("costPerKm", { required: 'Cost Per Km is Required' })}
                className="cstm-select-input"
                placeholder="Enter cost per km"
              />
              {errors?.costPerKm && (
                <span className="text-danger">{errors.costPerKm.message}</span>
              )}
            </div> */}
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputAddress">Cost per km(One Way) *</label>
                <input
                  type="number"
                  {...register("costPerKmOneWay", { required: 'Cost Per Km is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter cost per km"
                />
                {errors?.costPerKmOneWay && (
                  <span className="text-danger">{errors.costPerKmOneWay.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputAddress">Cost per km(Round Trip)*</label>
                <input
                  type="number"
                  {...register("costPerKmRoundTrip", { required: 'Cost Per Km is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter cost per km"
                />
                {errors?.costPerKmRoundTrip && (
                  <span className="text-danger">{errors.costPerKmRoundTrip.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputAddress2">Cost per hour *</label>
                <input
                  type="number"
                  {...register("costPerHour", { required: 'Cost Per Hour is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter cost per hour"
                />
                {errors?.costPerHour && (
                  <span className="text-danger">{errors.costPerHour.message}</span>
                )}
              </div>
              {/* <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Carrier Luggage Charges</label>
                <input
                  type="number"
                  {...register("laguageCarrierCost", { required: 'Carrier Luggage Cost is Required' })}
                  className="cstm-select-input"
                  placeholder="Carrier luggage cost"
                />
                {errors?.laguageCarrierCost && (
                  <span className="text-danger">{errors.laguageCarrierCost.message}</span>
                )}
              </div> */}
              {/* <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Additional Charges</label>
                <input
                  type="number"
                  {...register("additionalCharges", { required: 'Additional Charges is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter additional cost"
                />
                {errors?.additionalCharges && (
                  <span className="text-danger">{errors.additionalCharges.message}</span>
                )}
              </div> */}
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Discount *</label>
                <input
                  type="number"
                  {...register("discount")}
                  className="cstm-select-input"
                  placeholder="Enter discount percentage"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Up to Cost per Km *</label>
                <input
                  type="number"
                  {...register("upToCostPerKm")}
                  className="cstm-select-input"
                  placeholder="Enter cost per km for the given discount"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Up to Cost per Hour *</label>
                <input
                  type="number"
                  {...register("upToCostPerHour")}
                  className="cstm-select-input"
                  placeholder="Enter cost per hour for the given discount"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Total Number of Seats *</label>
                <input
                  type="number"
                  {...register("capacity.totalNumberOfSeats", { required: 'Total Number of Seats is Required' })}
                  className="cstm-select-input"
                  placeholder="Enter total number of seats"
                />
                {errors?.capacity?.totalNumberOfSeats && (
                  <span className="text-danger">{errors.capacity.totalNumberOfSeats.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Reserved Number of Seats *</label>
                <input
                  type="number"
                  {...register("capacity.reservedNumberOfSeats")}
                  className="cstm-select-input"
                  placeholder="Enter reserved number of seats"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Driver Allowance *</label>
                <input
                  type="number"
                  {...register("driverAllowance")}
                  className="cstm-select-input"
                  placeholder="Enter driver allowance"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">AC Available</label>
                <select {...register("acAvailable")} className="cstm-select-input">
                  <option value="">Choose Availability</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div className="form-group col-lg-12 col-md-12 col-12">
                <label>Hourly Rates *</label>
                {HOURLY_DEFAULT.map((item, index) => (
                  <div key={"hour" + index} className="d-flex align-items-center mb-2 row  ">
                    <input
                      type="text"
                      {...register(`hourly.${index}.type`)}
                      className="cstm-select-input"
                      placeholder="Enter type"
                      value={item?.type}
                      disabled
                      hidden
                    />
                    <div className="form-group col-lg-4 col-md-4 col-12">
                      <label htmlFor="">Time (Hour) *</label>
                      <input
                        type="number"
                        {...register(`hourly.${index}.hour`)}
                        className="cstm-select-input ml-2"
                        placeholder="Enter hour"
                        value={item.hour}
                        disabled
                      />
                    </div>
                    <div className="form-group col-lg-4 col-md-4 col-12">
                      <label htmlFor="">Distance (Km) *</label>
                      <input
                        type="number"
                        {...register(`hourly.${index}.distance`)}
                        className="cstm-select-input ml-2"
                        placeholder="Enter distance"
                        value={item.distance}
                        disabled
                      />
                    </div>
                    <div className="form-group col-lg-4 col-md-4 col-12">
                      <label htmlFor="">Price *</label>
                      <input
                        type="number"
                        {...register(`hourly.${index}.basePrice`, {
                          required: "Price is required",
                          min: { value: 0, message: "Price must be a positive number" },
                        })}
                        className="cstm-select-input ml-2"
                        placeholder="Enter base price"
                        min={0}
                      />
                      {errors?.hourly?.[index]?.basePrice && (
                        <span className="text-danger">{errors?.hourly?.[index]?.basePrice?.message}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div className="d-flex justify-content-end pt-2"> <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting && <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>}
            {isEdit ? "Update" : "Save"}
          </button>
          </div>
        </form>}
      </Modal>
      <Modal isOpen={isViewOpen} onClose={closeViewModal} width={'w-auto'} title="View More Data">
        <div className="scroll-body">
          <table className="cstm-table">
            <thead>
              <tr>
                <th className="">Similar</th>
                <th className="">Luggage Carrier Cost</th>
                <th className="">Additional Charges</th>
                <th className="">Discount</th>
                <th className="">Up to Cost per Km</th>
                <th className="">Up to Cost per Hour</th>
                <th className="">Capacity</th>
                <th className="">AC Available</th>
                <th className="">Driver Allowance</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? list.map((li, index) => (
                <tr key={'listing' + index}>

                  <td>{li?.similar?.join()}</td>
                  <td>{li.laguageCarrierCost}</td>
                  <td>{li.additionalCharges}</td>
                  <td>{li.discount}</td>
                  <td>{li.upToCostPerKm}</td>
                  <td>{li.upToCostPerHour}</td>
                  <td>{`Seats: ${li.capacity.totalNumberOfSeats}, Reserved: ${li.capacity.reservedNumberOfSeats}`}</td>
                  <td>{li.acAvailable ? "Yes" : "No"}</td>
                  <td>{li.driverAllowance}</td>

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
      </Modal>
      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => { setConfirmationOpen(false); setSelectedId(null) }}
        onConfirm={deleteVehiclePrice}
        message="Are you sure you want to delete this vehicle detail?"
      />
    </div>
  );
}
