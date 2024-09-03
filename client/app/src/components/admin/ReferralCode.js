import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { VEHICLE_TYPE, FUEL_TYPE } from "../../constants/common.constants";
import axios from "axios";

export default function ReferralCode() {

    const [isOpen, setIsOpen] = useState(false);
    const [list, setList] = useState([]);
    const { register, handleSubmit, reset } = useForm({ mode: "onChange" });
    const [isEdit, setIsEdit] = useState(false)
  
    useEffect(() => {
      getVehicle();
    }, []);
  
    const saveVehicle = async (data) => {
      try {
        if (data?._id) {
          const res = await axios({
            method: "put",
            url: "/api/admin/referral",
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
            url: "/api/admin/referral",
            data: data,
          });
          setList([res.data.ReferralCode, ...list]);
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
          url: "/api/admin/referral",
        });
  
        setList(res.data.ReferralCodes);
      } catch (error) {
        console.error(error);
      }
    };
  
    const getVehicleById = async (id) => {
      try {
        const res = await axios({
          method: "get",
          url: `/api/admin/referral/${id}`,
        });
        reset(res.data.ReferralCode);
        setIsOpen(true);
        setIsEdit(true)
      } catch (error) {
        console.error(error);
      }
    };
  
    const closeModal = () => {
      reset({});
      setIsEdit(false)
      setIsOpen(false);
    };
  
    const deleteVehicle = async (id) => {
      try {
        const confirmation = window.confirm("Do you really want to delete!");
        if (!confirmation) return;
        const res = await axios({
          method: "delete",
          url: "/api/admin/referral/" + id,
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
            <th>Referral Code</th>
            <th>Discount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.length > 0 && list?.map((li, index) => (
            <tr key={index}>
              <td>
                {li.name}
              </td>
              <td>{li.discount}</td>
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
      <Modal isOpen={isOpen} onClose={closeModal} title={isEdit ? 'Edit Referral Code' : 'Add Referral Code'}>
        <form onSubmit={handleSubmit(saveVehicle)}>
          <div className="h-100 scroll-body">
            <div className="row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="inputPassword4">Referral Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="cstm-select-input"
                  placeholder="Enter referral name"
                />
              </div>
            <div className="form-group col-lg-6 col-md-6 col-12">
              <label htmlFor="inputAddress">Discount <span>%</span> </label>
              <input
                type="number"
                {...register("discount")}
                className="cstm-select-input"
                placeholder="Enter discount"
              />
            </div>
            </div>
          </div>
          <div className="d-flex justify-content-end border-top mt-3 pt-2">
            <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update' : 'Add'}
          </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
