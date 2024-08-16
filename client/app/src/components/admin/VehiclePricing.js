import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { VEHICLE_TYPE } from "../../constants/common.constants";
import axios from "axios";

export default function VehiclePricing() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { register, handleSubmit, reset,setValue , control, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "similar"
  });

  useEffect(() => {
    getVehiclePrice();
  }, []);

  const saveVehiclePrice = async (data) => {
    try {
      // Convert the 'similar' array from an array of objects to an array of strings
      if (Array.isArray(data.similar)) {
        data.similar = data.similar.map(item => item.value);
      }
  
      if (data?._id) {
        const res = await axios({
          method: "put",
          url: "/api/admin/vehicle-price",
          data: data,
        });
        setList(
          list.map((li) => {
            if (li._id === data._id) {
              li = data;
            }
            return li;
          })
        );
      } else {
        const res = await axios({
          method: "POST",
          url: "/api/admin/vehicle-price",
          data: data,
        });
        setList([res.data.price, ...list]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };  

  const getVehiclePrice = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/admin/vehicle-price",
      });

      setList(res.data.price);
    } catch (error) {
      console.error(error);
    }
  };

  const getVehiclePriceById = async (id) => {
    try {
      const res = await axios({
        method: "get",
        url: `/api/admin/vehicle-price/${id}`,
      });
      reset(res.data.price);
      setValue('similar', res.data.price.similar.map(value => ({ value })));
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
    try {
      const confirmation = window.confirm("Do you really want to delete!");
      if (!confirmation) return;
      const res = await axios({
        method: "delete",
        url: "/api/admin/vehicle-price/" + id,
      });
      setList(list.filter((li) => li._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div>
          <h2>Vehicle Price</h2>
        </div>
        <div>
          <button
            onClick={() => {
              reset({});
              setIsOpen(true);
            }}
          >
            Add Price
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th className="p-2 my-2">Image</th>
            <th className="p-2 my-2">Type</th>
            <th className="p-2">Name</th>
            <th className="p-2 my-2">Similar</th>
            <th className="p-2 my-2">Minimum Fare</th>
            <th className="p-2 my-2">Cost per km</th>
            <th className="p-2 mx-2">Cost per hour</th>
            <th className="p-2">Laguage Carrier Cost</th>
            <th className="p-2">Additional Charges</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        {list.length &&
        <tbody>
          {list?.map((li, index) => (
            <tr key={index}>
              <td>
                <div className="car-list-items mb-3 car-image bg-cover">
                  <img
                    style={{ height: "50px", width: "70px" }}
                    src={li.vehicleImageUrl}
                  />
                </div>
              </td>
              <td>
                {
                  VEHICLE_TYPE.find((item) => item.value === li.vehicleType)
                    ?.name
                }
              </td>
              <td>{li.vehicleName}</td>
              <td>{li?.similar?.join()}</td>
              <td>{li.minimumFare}</td>
              <td>{li.costPerKm}</td>
              <td>{li.costPerHour}</td>
              <td>{li.laguageCarrierCost}</td>
              <td>{li.additionalCharges}</td>
              <td>
                <ul className="list-inline m-0">
                  <li className="list-inline-item">
                    <button
                      onClick={() => getVehiclePriceById(li._id)}
                      className="btn btn-success btn-sm rounded-0"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </li>
                  <li className="list-inline-item">
                    <button
                      onClick={() => deleteVehiclePrice(li._id)}
                      className="btn btn-danger btn-sm rounded-0"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>}
      </table>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(saveVehiclePrice)}>
          <div className="h-100 scroll-body">
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Vehicle Type</label>
                <select {...register("vehicleType",{
                    required: 'Vehicle Type is Required'
                  })} className="form-control">
                  <option value={""}>Choose Type</option>
                  {VEHICLE_TYPE.map((vehicle, index) => (
                    <option key={index} value={vehicle.value}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
                {errors?.vehicleType && (
                  <span className="text-danger">
                    {errors.vehicleType.message}
                  </span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Vehicle Name</label>
                <input
                  type="text"
                  {...register("vehicleName",{
                    required: 'Vehicle Name is Required'
                  })}
                  className="form-control"
                  placeholder="Enter vehicle name"
                />
                {errors?.vehicleName && (
                  <span className="text-danger">
                    {errors.vehicleName.message}
                  </span>
                )}
              </div>

              {/* Similar Field Array */}
              <div className="form-group col-md-12">
                <label>Similar</label>
                {fields.map((item, index) => (
                  <div key={item.id} className="d-flex align-items-center mb-2">
                    <input
                      type="text"
                      {...register(`similar.${index}.value`, {
                        required: 'This field is required'
                      })}
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
                  {...register("minimumFare")}
                  className="form-control"
                  placeholder="Enter minimum fare"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress">Cost per km</label>
              <input
                type="number"
                {...register("costPerKm",{
                  required: 'Cost Per Km is Required'
                })}
                className="form-control"
                id="inputAddress"
                placeholder="Enter cost per km"
              />
              {errors?.costPerKm && (
                  <span className="text-danger">
                    {errors.costPerKm.message}
                  </span>
                )}
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress2">Cost per hour</label>
              <input
                type="number"
                {...register("costPerHour",{
                  required: 'Cost Per Hour is Required'
                })}
                className="form-control"
                id="inputAddress2"
                placeholder="Enter cost per hour"
              />
              {errors?.costPerHour && (
                  <span className="text-danger">
                    {errors.costPerHour.message}
                  </span>
                )}
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Carrier Laguage Charges</label>
                <input
                  type="number"
                  {...register("laguageCarrierCost")}
                  className="form-control"
                  placeholder="Carrier luggage cost"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Additional Charges</label>
                <input
                  type="number"
                  {...register("additionalCharges")}
                  className="form-control"
                  placeholder="Enter additional cost"
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
