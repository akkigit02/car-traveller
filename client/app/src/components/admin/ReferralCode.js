import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function CouponForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    mode: "onChange",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getCoupons();
  }, []);

  const saveCoupon = async (data) => {
    try {
      if (data?._id) {
        const res = await axios({
          method: "put",
          url: `/api/admin/coupons/${data._id}`,
          data: data,
        });
        setList(
          list?.map((li) => (li._id === data._id ? data : li))
        );
      } else {
        const res = await axios({
          method: "post",
          url: "/api/admin/coupons",
          data: data,
        });
        setList([res.data.coupon, ...list]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getCoupons = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/admin/coupons",
      });
      console.log(res.data.coupons)
      setList(res.data.coupons);
    } catch (error) {
      console.error(error);
    }
  };

  const getCouponById = async (id) => {
    try {
      const res = await axios({
        method: "get",
        url: `/api/admin/coupons/${id}`,
      });
  
      const couponData = res.data.coupon;
      // Format the startDate and expiryDate to YYYY-MM-DD
      couponData.startDate = couponData.startDate
        ? new Date(couponData.startDate).toISOString().split("T")[0]
        : "";
      couponData.expiryDate = couponData.expiryDate
        ? new Date(couponData.expiryDate).toISOString().split("T")[0]
        : "";
  
      reset(couponData); // Reset the form with formatted dates
      setIsOpen(true);
      setIsEdit(true);
    } catch (error) {
      console.error(error);
    }
  };  

  const closeModal = () => {
    reset({});
    setIsEdit(false);
    setIsOpen(false);
  };

  const deleteCoupon = async (id) => {
    try {
      const confirmation = window.confirm("Do you really want to delete?");
      if (!confirmation) return;
      const res = await axios({
        method: "delete",
        url: `/api/admin/coupons/${id}`,
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
          <p className="cstm-title">Coupons</p>
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
            <th>Coupon Code</th>
            <th>Discount Type</th>
            <th>Discount Value</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.length > 0 && list.map((li, index) => (
            <tr key={index}>
              <td>{li.code}</td>
              <td>{li.discountType}</td>
              <td>{li.discountValue}</td>
              <td>{li.isActive ? "Active" : "Inactive"}</td>
              <td>
                <ul className="list-inline m-0">
                  <li className="list-inline-item">
                    <button
                      onClick={() => getCouponById(li._id)}
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
                      onClick={() => deleteCoupon(li._id)}
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
      <Modal isOpen={isOpen} onClose={closeModal} title={isEdit ? 'Edit Coupon' : 'Add Coupon'}>
  <form onSubmit={handleSubmit(saveCoupon)}>
    <div className="h-100 scroll-body">
      <div className="row m-0">
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Coupon Code</label>
          <input
            type="text"
            {...register("code", { required: "Coupon Code is required" })}
            className="cstm-select-input"
            placeholder="Enter coupon code"
          />
          {errors?.code && <span className="text-danger">{errors.code.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Discount Type</label>
          <select
            {...register("discountType", { required: "Discount Type is required" })}
            className="cstm-select-input"
          >
            <option value="percentage">Percentage</option>
          </select>
          {errors?.discountType && <span className="text-danger">{errors.discountType.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Discount Value</label>
          <input
            type="number"
            {...register("discountValue", { required: "Discount Value is required" })}
            className="cstm-select-input"
            placeholder="Enter discount value"
          />
          {errors?.discountValue && <span className="text-danger">{errors.discountValue.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Max Discount Amount</label>
          <input
            type="number"
            {...register("maxDiscountAmount", { required: "Max Discount Amount is required" })}
            className="cstm-select-input"
            placeholder="Enter max discount amount"
          />
          {errors?.maxDiscountAmount && <span className="text-danger">{errors.maxDiscountAmount.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Min Booking Amount</label>
          <input
            type="number"
            {...register("minPurchaseAmount", { required: "Min Purchase Amount is required" })}
            className="cstm-select-input"
            placeholder="Enter min purchase amount"
          />
          {errors?.minPurchaseAmount && <span className="text-danger">{errors.minPurchaseAmount.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Start Date</label>
          <input
            type="date"
            {...register("startDate", { required: "Start Date is required" })}
            className="cstm-select-input"
          />
          {errors?.startDate && <span className="text-danger">{errors.startDate.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Expiry Date</label>
          <input
            type="date"
            {...register("expiryDate", { required: "Expiry Date is required" })}
            className="cstm-select-input"
          />
          {errors?.expiryDate && <span className="text-danger">{errors.expiryDate.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
          <label>Active</label>
          <select
            {...register("isActive", { required: "Active status is required" })}
            className="cstm-select-input"
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
          {errors?.isActive && <span className="text-danger">{errors.isActive.message}</span>}
        </div>
        <div className="form-group col-lg-6 col-md-6 col-12">
        <label>User Type</label>
        <select
          {...register("userType", { required: "User Type is required" })}
          className="cstm-select-input"
          placeholder="Select user type"
        >
          <option value="">Select user type</option>
          <option value="0">For All Users</option>
          <option value="1">For New Users</option>
          <option value="3">For 3+ Bookings</option>
          <option value="5">For 5+ Bookings</option>
        </select>
        {errors?.userType && <span className="text-danger">{errors.userType.message}</span>}
      </div>
      </div>
    </div>
    <div className="d-flex justify-content-end border-top mt-3 pt-2">
      <button type="submit" className="btn btn-primary">
        {isEdit ? "Update" : "Add"}
      </button>
    </div>
  </form>
</Modal>

    </div>
  );
}
