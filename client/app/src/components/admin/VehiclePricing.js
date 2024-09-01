import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { VEHICLE_TYPE } from "../../constants/common.constants";
import axios from "axios";

export default function VehiclePricing() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState(VEHICLE_TYPE)
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
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
    getVehiclePrice();
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
      const res = await axios.get("/api/admin/vehicle-price");
      setList(res.data.price);
      const filteredList = VEHICLE_TYPE.filter(
        (vehicle) => !res.data.price.some(dbVehicle => dbVehicle.vehicleType === vehicle.value)
      );
      setVehicleTypes(filteredList)
    } catch (error) {
      console.error(error);
    }
  };

  const getVehiclePriceById = async (id) => {
    try {
      const res = await axios.get(`/api/admin/vehicle-price/${id}`);
      const { price } = res.data;
      reset(price);
      setValue('similar', price.similar.map(value => ({ value })));
      setValue('hourly', price.hourly.map(item => ({
        type: item.type,
        hour: item.hour,
        distance: item.distance,
        basePrice: item.basePrice,
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

  const deleteVehiclePrice = async (id) => {
    const isConfirmed = window.confirm("Do you really want to delete?");
    if (!isConfirmed) return;
    try {
        await axios.delete(`/api/admin/vehicle-price/${id}`);
        const vehicleData = list.find(li => li.id == id)
        const vehicleType = VEHICLE_TYPE.find(car => car.value === vehicleData.vehicleType)
        if (vehicleType) {
          setVehicleTypes((prevTypes) => [...prevTypes, vehicleType]);
        }
        setList(list.filter(li => li._id !== id));
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
      <table className="cstm-table">
        <thead>
          <tr>
            <th className="">Image</th>
            <th className="">Type</th>
            <th className="">Name</th>
            <th className="">Similar</th>
            <th className="">Minimum Fare</th>
            <th className="">Cost per km</th>
            <th className="">Cost per hour</th>
            <th className="">Luggage Carrier Cost</th>
            <th className="">Additional Charges</th>
            <th className="">Discount</th>
            <th className="">Up to Cost per Km</th>
            <th className="">Up to Cost per Hour</th>
            <th className="">Capacity</th>
            <th className="">AC Available</th>
            <th className="">Driver Allowance</th>
            <th className="">Action</th>
          </tr>
        </thead>
        {list.length > 0 && (
          <tbody>
            {list.map((li, index) => (
              <tr key={index}>
                <td>
                  <img style={{ height: "50px", width: "70px" }} src={li.vehicleImageUrl} alt="Vehicle"/>
                </td>
                <td>{VEHICLE_TYPE.find(item => item.value === li.vehicleType)?.name}</td>
                <td>{li.vehicleName}</td>
                <td>{li?.similar?.join()}</td>
                <td>{li.minimumFare}</td>
                <td>{li.costPerKm}</td>
                <td>{li.costPerHour}</td>
                <td>{li.laguageCarrierCost}</td>
                <td>{li.additionalCharges}</td>
                <td>{li.discount}</td>
                <td>{li.upToCostPerKm}</td>
                <td>{li.upToCostPerHour}</td>
                <td>{`Seats: ${li.capacity.totalNumberOfSeats}, Reserved: ${li.capacity.reservedNumberOfSeats}`}</td>
                <td>{li.acAvailable ? "Yes" : "No"}</td>
                <td>{li.driverAllowance}</td>
                <td className="d-flex align-items-center">
                  <button
                    onClick={() => getVehiclePriceById(li._id)}
                    className="icon-btn me-2"
                    type="button"
                    title="Edit"
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                  <button
                    onClick={() => deleteVehiclePrice(li._id)}
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
      <Modal isOpen={isOpen} onClose={closeModal} title={'Add Price'}>
        <form onSubmit={handleSubmit(saveVehiclePrice)}>
          <div className="h-100 scroll-body">
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Vehicle Type</label>
                <select {...register("vehicleType", { required: 'Vehicle Type is Required' })} className="form-control">
                  <option value="">Choose Type</option>
                  {vehicleTypes.map((vehicle, index) => (
                    <option key={index} value={vehicle.value}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
                {errors?.vehicleType && (
                  <span className="text-danger">{errors.vehicleType.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Vehicle Name</label>
                <input
                  type="text"
                  {...register("vehicleName", { required: 'Vehicle Name is Required' })}
                  className="form-control"
                  placeholder="Enter vehicle name"
                />
                {errors?.vehicleName && (
                  <span className="text-danger">{errors.vehicleName.message}</span>
                )}
              </div>

              {/* Similar Field Array */}
              <div className="form-group col-md-12">
                <label>Similar</label>
                {fields.map((item, index) => (
                  <div key={item.id} className="d-flex align-items-center mb-2">
                    <input
                      type="text"
                      {...register(`similar.${index}.value`, { required: 'This field is required' })}
                      className="form-control"
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
                  className="btn btn-primary"
                  onClick={() => append({ value: "" })}
                >
                  +
                </button>
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Image Url</label>
                <input
                  type="text"
                  {...register("vehicleImageUrl")}
                  className="form-control"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Minimum Fare</label>
                <input
                  type="number"
                  {...register("minimumFare", { required: 'Minimum Fare is Required' })}
                  className="form-control"
                  placeholder="Enter minimum fare"
                />
                {errors?.minimumFare && (
                  <span className="text-danger">{errors.minimumFare.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress">Cost per km</label>
              <input
                type="number"
                {...register("costPerKm", { required: 'Cost Per Km is Required' })}
                className="form-control"
                placeholder="Enter cost per km"
              />
              {errors?.costPerKm && (
                <span className="text-danger">{errors.costPerKm.message}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress2">Cost per hour</label>
              <input
                type="number"
                {...register("costPerHour", { required: 'Cost Per Hour is Required' })}
                className="form-control"
                placeholder="Enter cost per hour"
              />
              {errors?.costPerHour && (
                <span className="text-danger">{errors.costPerHour.message}</span>
              )}
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Carrier Luggage Charges</label>
                <input
                  type="number"
                  {...register("laguageCarrierCost", { required: 'Carrier Luggage Cost is Required' })}
                  className="form-control"
                  placeholder="Carrier luggage cost"
                />
                {errors?.laguageCarrierCost && (
                  <span className="text-danger">{errors.laguageCarrierCost.message}</span>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Additional Charges</label>
                <input
                  type="number"
                  {...register("additionalCharges", { required: 'Additional Charges is Required' })}
                  className="form-control"
                  placeholder="Enter additional cost"
                />
                {errors?.additionalCharges && (
                  <span className="text-danger">{errors.additionalCharges.message}</span>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Discount</label>
                <input
                  type="number"
                  {...register("discount")}
                  className="form-control"
                  placeholder="Enter discount percentage"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Up to Cost per Km</label>
                <input
                  type="number"
                  {...register("upToCostPerKm")}
                  className="form-control"
                  placeholder="Enter cost per km for the given discount"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Up to Cost per Hour</label>
                <input
                  type="number"
                  {...register("upToCostPerHour")}
                  className="form-control"
                  placeholder="Enter cost per hour for the given discount"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Total Number of Seats</label>
                <input
                  type="number"
                  {...register("capacity.totalNumberOfSeats", { required: 'Total Number of Seats is Required' })}
                  className="form-control"
                  placeholder="Enter total number of seats"
                />
                {errors?.capacity?.totalNumberOfSeats && (
                  <span className="text-danger">{errors.capacity.totalNumberOfSeats.message}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Reserved Number of Seats</label>
                <input
                  type="number"
                  {...register("capacity.reservedNumberOfSeats")}
                  className="form-control"
                  placeholder="Enter reserved number of seats"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">AC Available</label>
                <select {...register("acAvailable")} className="form-control">
                  <option value="">Choose Availability</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div className="form-group col-md-12">
                <label>Hourly Rates</label>
                {HOURLY_DEFAULT.map((item, index) => (
                  <div key={item.id} className="d-flex align-items-center mb-2">
                    <input
                      type="text"
                      {...register(`hourly.${index}.type`)}
                      className="form-control"
                      placeholder="Enter type"
                      value={item?.type}
                      disabled
                      hidden
                    />
                    <div className="form-group col-md-6">
                    <label htmlFor="">Time (Hour)</label>
                    <input
                      type="number"
                      {...register(`hourly.${index}.hour`)}
                      className="form-control ml-2"
                      placeholder="Enter hour"
                      value={item.hour}
                      disabled
                    />
                    </div>
                    <div className="form-group col-md-6">
                    <label htmlFor="">Distance (Km)</label>
                    <input
                      type="number"
                      {...register(`hourly.${index}.distance`)}
                      className="form-control ml-2"
                      placeholder="Enter distance"
                      value={item.distance}
                      disabled
                    />
                    </div>
                    <div className="form-group col-md-6">
                    <label htmlFor="">Price</label>
                    <input
                      type="number"
                      {...register(`hourly.${index}.basePrice`, {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be a positive number" },
                      })}
                      className="form-control ml-2"
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
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Driver Allowance</label>
                <input
                  type="number"
                  {...register("driverAllowance")}
                  className="form-control"
                  placeholder="Enter driver allowance"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Update" : "Save"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
