import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { VEHICLE_TYPE, FUEL_TYPE } from "../../constants/common.constants";
import axios from "axios";
import Tooltip from "../Tooltip";

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
  
      // Format dates for the form
      const formattedData = {
        ...res.data.price,
        registrationDate: formatDateToDDMMYYYY(res.data.price.registrationDate),
        puc: formatDateToDDMMYYYY(res.data.price.puc),
        insuranceExpiryDate: formatDateToDDMMYYYY(res.data.price.insuranceExpiryDate),
        roadTax: formatDateToDDMMYYYY(res.data.price.roadTax),
        maintenanceDate:formatDateToDDMMYYYY(res.data.price.maintenanceDate),
      };
  
      reset(formattedData);
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

  function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
  }

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
            <th>Fitness Date</th>
            <th>Insurance Valide To</th>
            <th>PUC</th>
            <th>Road Tax</th>
            <th>Maintenance Date</th>
            <th>Maintenance Reason</th>
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
              <td>{li.capacity.totalNumberOfSeats}</td>
              <td>{li.capacity.luggage ? "Yes": "No"}</td>
              <td>{formatDateToDDMMYYYY(li.registrationDate)}</td>
              <td>{formatDateToDDMMYYYY(li.puc)}</td>
              <td>{formatDateToDDMMYYYY(li.insuranceExpiryDate)}</td>
              <td>{formatDateToDDMMYYYY(li.roadTax)}</td>
              <td>{formatDateToDDMMYYYY(li.maintenanceDate)}</td>
              <td>{li.maintenanceReason}</td>
              <td>
                <div className="d-flex align-items-center ">
                  <Tooltip message={'Edit'} direction="bottom">         
                    <button
                      onClick={() => getVehicleById(li._id)}
                      className="icon-btn me-2"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    </Tooltip>
                    <Tooltip message={'Delete'} direction="bottom">
                    <button
                      onClick={() => deleteVehicle(li._id)}
                      className="icon-btn"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={closeModal} title={'Add Vehicle'}>
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
                  placeholder="Enter Model Name"
                />
              </div>
            <div className="form-group col-lg-6 col-md-6 col-12">
              <label htmlFor="inputAddress">Registration Number</label>
              <input
                type="number"
                {...register("registrationNumber")}
                className="cstm-select-input"
                id="inputAddress"
                placeholder="Enter Registration Number"
              />
            </div>
            <div className="form-group col-lg-6 col-md-6 col-12">
              <label htmlFor="inputState">Fuel Type</label>
              <select {...register("fuelType")} className="cstm-select-input">
                <option value={""}>Choose Type</option>
                {FUEL_TYPE?.map((fuel, index) => (
                  <option key={index} value={fuel.value}>
                    {fuel.name}
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
                  placeholder="Enter Mileage"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputCity">Number of seat</label>
                <input
                  type="number"
                  {...register("capacity.totalNumberOfSeats")}
                  className="cstm-select-input"
                  placeholder="Number of seat"
                />
              </div>
            </div>
            
              <div className="form-group col-lg-12 col-md-12 col-12">
                <label htmlFor="inputCity">Luggage Carrier</label>
                <div className="form-check">
                  <input
                    type="radio"
                    {...register("capacity.luggage")}
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
                <label for="session-date" htmlFor="inputCity">Fitness Date</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("registrationDate")}
                  className="cstm-select-input"
                  placeholder="Enter Fitness Date"
                />
              </div>
            
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="inputCity">PUC</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("puc")}
                  className="cstm-select-input"
                  placeholder="Enter PUC Date"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="inputCity">Insurance Expiration</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("insuranceExpiryDate")}
                  className="cstm-select-input"
                  placeholder="Insurance Expiration Date"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="inputCity">Road Tax</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("roadTax")}
                  className="cstm-select-input"
                  placeholder="Road Tax Date"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="inputCity">Maintenance Date</label>
                <input
                  type="date"
                  id="session-date" name="session-date"
                  {...register("maintenanceDate")}
                  className="cstm-select-input"
                  placeholder="Maintenance Date Date"
                />
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label for="session-date" htmlFor="inputCity">Maintenance Reason</label>
                <input
                  type="text"
                  id="session-date" name="session-date"
                  {...register("maintenanceReason")}
                  className="cstm-select-input"
                  placeholder="Maintenance Reason"
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
