import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { VEHICLE_TYPE } from "../../constants/common.constants";
import axios from "axios";

export default function VehiclePricing() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const { register, handleSubmit, reset } = useForm({ mode: "onChange" });

  useEffect(() => {
    getVehiclePrice();
  }, []);

  const saveVehiclePrice = async (data) => {
    try {
      if(data?._id) {
        const res = await axios({
          method: "put",
          url: "/api/admin/vehicle-price",
          data: data,
        });
        setList(list.map((li) => {
          if(li._id === data._id) {
            li = data
          }
          return li
        }));
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
      reset(res.data.price)
      setIsOpen(true)
    } catch (error) {
      console.error(error)
    }
  };

  const closeModal = () => {
    reset({})
    setIsOpen(false)
  }

  const deleteVehiclePrice = async (id) => {
    try {
      const confirmation = window.confirm('Do you really want to delete!')
      if(!confirmation) return
      const res = await axios({
        method: "delete",
        url: "/api/admin/vehicle-price/"+id,
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
          <button onClick={() => {reset({});setIsOpen(true)}}>Add Price</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Minimum Fare</th>
            <th>Cost per km</th>
            <th>Cost per hour</th>
            <th>Laguage Carrier Cost</th>
            <th>Additional Charges</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((li, index) => (
            <tr key={index}>
              <td>
                {
                  VEHICLE_TYPE.find((item) => item.value === li.vehicleType)
                    ?.name
                }
              </td>
              <td>{li.minimumFare}</td>
              <td>{li.costPerKm}</td>
              <td>{li.costPerHour}</td>
              <td>{li.laguageCarrierCost}</td>
              <td>{li.additionalCharges}</td>
              <td>
                <ul className="list-inline m-0">
                  <li className="list-inline-item">
                    <button onClick={() => getVehiclePriceById(li._id)}
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
                    <button onClick={() => deleteVehiclePrice(li._id)}
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
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(saveVehiclePrice)}>
          <div className="h-100 scroll-body">
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Vehicle Type</label>
                <select {...register("vehicleType")} className="form-control">
                  <option value={""}>Choose Type</option>
                  {VEHICLE_TYPE.map((vehicle, index) => (
                    <option key={index} value={vehicle.value}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
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
                {...register("costPerKm")}
                className="form-control"
                id="inputAddress"
                placeholder="Enter Cost per km"
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress2">Cost per hour</label>
              <input
                type="number"
                {...register("costPerHour")}
                className="form-control"
                id="inputAddress2"
                placeholder="Enter Cost per hour"
              />
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputCity">Carrier Laguage Charges</label>
                <input
                  type="number"
                  {...register("laguageCarrierCost")}
                  className="form-control"
                  placeholder="Carrier laguage cost"
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
            Add
          </button>
        </form>
      </Modal>
    </div>
  );
}
