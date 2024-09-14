import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { VEHICLE_TYPE, FUEL_TYPE } from "../../constants/common.constants";
import axios from "axios";

export default function VehiclePricing() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const { register, handleSubmit, reset } = useForm({ mode: "onChange" });

  useEffect(() => {
    getVehicle();
  }, []);

  const saveVehicle = async (data) => {
    try {
      if (data?._id) {
        const res = await axios({
          method: "put",
          url: "/api/admin/vehicle",
          data: data,
        });
        setList(
          list?.map((li) => {
            if (li._id === data._id) {
              li = data;
            }
            return li;
          })
        );
      } else {
        const res = await axios({
          method: "POST",
          url: "/api/admin/vehicle",
          data: data,
        });
        setList([res.data.price, ...list]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getVehicle = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/admin/vehicle",
      });

      setList(res.data.price);
    } catch (error) {
      console.error(error);
    }
  };

  const getVehicleById = async (id) => {
    try {
      const res = await axios({
        method: "get",
        url: `/api/admin/vehicle/${id}`,
      });
      reset(res.data.price);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
  };

  const deleteVehicle = async (id) => {
    try {
      const confirmation = window.confirm("Do you really want to delete!");
      if (!confirmation) return;
      const res = await axios({
        method: "delete",
        url: "/api/admin/vehicle/" + id,
      });
      setList(list.filter((li) => li._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">Vehicle Detail</p>
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
            <th>Vehicle Type</th>
            <th>Model Name</th>
            <th>Registration Number</th>
            <th>Fuel Type</th>
            <th>Mileage</th>
            <th>No of Seat</th>
            <th>Laguage Carrier</th>
            <th>Registration Date</th>
            <th>Insurance Valide To</th>
            <th>Policy Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((li, index) => (
            <tr key={index}>
              <td>
                {VEHICLE_TYPE?.find((item) => item.value === li.type)?.name}
              </td>
              <td>{li.modelName}</td>
              <td>{li.registrationNumber}</td>
              <td>
                {FUEL_TYPE?.find((item) => item.value === li.fuelType)?.name}
              </td>
              <td>{li.mileage}</td>
              <td>{li.capacity.numberOfSeat}</td>
              <td>{li.capacity.laguage}</td>
              <td>{li.registrationDate}</td>
              <td>{li.insurance.policyNumber}</td>
              <td>{li.insurance.expiryDate}</td>
              <td>
                <ul className="list-inline m-0">
                  <li className="list-inline-item">
                    <button
                      onClick={() => getVehicleById(li._id)}
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
                      onClick={() => deleteVehicle(li._id)}
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
      <Modal isOpen={isOpen} onClose={closeModal} title={'add vehicle'}>
        <form onSubmit={handleSubmit(saveVehicle)}>
          <div className="scroll-body">
            <div className="row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputState">Vehicle Type</label>
                <select {...register("type")} className="cstm-select-input">
                  <option value={""}>Choose Type</option>
                  {VEHICLE_TYPE?.map((vehicle, index) => (
                    <option key={index} value={vehicle.value}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputPassword4">Model Name</label>
                <input
                  type="number"
                  {...register("modelName")}
                  className="cstm-select-input"
                  placeholder="Enter minimum fare"
                />
              </div>
            <div className="form-group col-lg-6 col-md-6 col-12">
              <label htmlFor="inputAddress">Registration Number</label>
              <input
                type="number"
                {...register("registrationNumber")}
                className="cstm-select-input"
                id="inputAddress"
                placeholder="Enter Cost per km"
              />
            </div>
            <div className="form-group col-lg-6 col-md-6 col-12">
              <label htmlFor="inputState">Fuel Type</label>
              <select {...register("fuelType")} className="cstm-select-input">
                <option value={""}>Choose Type</option>
                {FUEL_TYPE?.map((vehicle, index) => (
                  <option key={index} value={vehicle.value}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Mileage</label>
                <input
                  type="number"
                  {...register("mileage")}
                  className="cstm-select-input"
                  placeholder="Carrier laguage cost"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Number of seat</label>
                <input
                  type="number"
                  {...register("capacity.numberOfSeat")}
                  className="cstm-select-input"
                  placeholder="Enter additional cost"
                />
              </div>
            </div>
            
              <div className="form-group col-lg-12 col-md-12 col-12">
                <label htmlFor="inputCity">Language Carrier</label>
                <div className="form-check">
                  <input
                    type="radio"
                    {...register("capacity.language")}
                    className="form-check-input"
                    id="languageYes"
                    value="yes"
                  />
                  <label className="form-check-label" htmlFor="languageYes">
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    {...register("capacity.language")}
                    className="form-check-input"
                    id="languageNo"
                    value="no"
                  />
                  <label className="form-check-label" htmlFor="languageNo">
                    No
                  </label>
                </div>
              </div>

            <div className="row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Registration Date</label>
                <input
                  type="date"
                  {...register("registrationDate")}
                  className="cstm-select-input"
                  placeholder="Enter additional cost"
                />
              </div>
            
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Policy Number</label>
                <input
                  type="date"
                  {...register("insurance.policyNumber")}
                  className="cstm-select-input"
                  placeholder="Enter additional cost"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Insurance Expiration</label>
                <input
                  type="date"
                  {...register("insurance.expiryDate")}
                  className="cstm-select-input"
                  placeholder="Enter additional cost"
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end border-top mt-3 pt-2">
            <button type="submit" className="btn btn-primary">
            Add
          </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
