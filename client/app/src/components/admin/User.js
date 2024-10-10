import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Tooltip from "../Tooltip";
import { emailPattern, namePattern, phoneLengthValidation, phoneNumberValidation } from '../../constants/Validation.constant';
import ConfirmationModal from "../common/ConfirmationModal";
import { toast } from 'react-toastify';


export default function UserManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    getUsers();
  }, []);

  const saveUser = async (data) => {
    try {
      let res;
      if (data?._id) {
        res = await axios.put(`/api/admin/users/${data._id}`, data);
        setList(list.map(user => (user._id === data._id ? data : user)));
      } else {
        res = await axios.post("/api/admin/users", data);
        setList([res.data.user, ...list]);
      }
      closeModal();
      toast.success(res?.data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setList(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserById = async (id) => {
    try {
      const res = await axios.get(`/api/admin/users/${id}`);
      reset(res.data.user);
      setIsOpen(true);
      setIsEdit(true);
    } catch (error) {
      console.error(error);
    }
  };


  const toggleStatus = async () => {
    try {
      const user = list.find(user => user._id === selectedUserId);
      const res = await axios.patch(`/api/admin/users/${selectedUserId}`, { isActive: !user.isActive });
      setList(list.map(user => (user._id === selectedUserId ? { ...user, isActive: !user.isActive } : user)));
      toast.success(res?.data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
    setIsEdit(false);
    setSelectedUserId(null);
  };

  const downloadCSV = async () => {
    try {
      setIsDownloading(true)
      const response = await axios.get('/api/admin/user/csv-dowload', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setIsDownloading(false)
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">User Management</p>
        </div>
        <div>
          <button onClick={downloadCSV} disabled={isDownloading} className="cstm-btn-trans me-2">
            <i className="fa fa-file-download"></i> {/* Download icon */}
            Download Users CSV
          </button>
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
            <th className="">Name</th>
            <th className="">Email</th>
            <th className="">Phone</th>
            <th className="">User Type</th>
            <th className="">Status</th>
            <th className="">Action</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? list.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.primaryPhone}</td>
              <td>{user.modules.userType}</td>
              <td>
                <button
                  onClick={() => { setConfirmationOpen(true); setSelectedUserId(user._id) }}
                  className={`btn ${user.isActive ? "btn-success" : "btn-danger"}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="d-flex align-items-center">
                <Tooltip message={'Edit'} direction="bottom">
                  <button
                    onClick={() => getUserById(user._id)}
                    className="icon-btn me-2"
                    type="button"
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </Tooltip>
              </td>
            </tr>
          )) :
            <tr className='no-data'>
              <td colspan="100%">
                <div className='d-flex align-items-center justify-content-center'><div className='no-data-content'></div></div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={closeModal} title={'Add/Edit User'}>
        <form onSubmit={handleSubmit(saveUser)}>
          <div className="scroll-body">
            <div className="form-row row m-0">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    pattern: namePattern,
                  })}
                  className="cstm-select-input"
                  placeholder="Enter name"
                />
                {errors?.name && (
                  <span className="text-danger">{errors.name.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: emailPattern,
                  })}
                  className="cstm-select-input"
                  placeholder="Enter email"
                />
                {errors?.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="primaryPhone">Primary Phone</label>
                <input
                  type="text"
                  {...register("primaryPhone", phoneNumberValidation)}
                  className="cstm-select-input"
                  placeholder="Enter primary phone"
                />
                {errors?.primaryPhone?.message && (
                  <span className='error'>{errors?.primaryPhone?.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="secondaryPhone">Secondary Phone</label>
                <input
                  type="text"
                  {...register("secondaryPhone", phoneLengthValidation)}
                  className="cstm-select-input"
                  placeholder="Enter secondary phone"
                />
                {errors?.secondaryPhone?.message && (
                  <span className='error'>{errors?.secondaryPhone?.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="userType">User Type</label>
                <select {...register("modules.userType", { required: 'User Type is Required' })} className="cstm-select-input">
                  {/* <option value="" disabled>Choose Type</option> */}
                  <option value="CLIENT" disabled selected>Client</option>
                </select>
                {errors?.modules?.userType && (
                  <span className="text-danger">{errors.modules.userType.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end pt-2">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting && <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>}
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => { setConfirmationOpen(false); setSelectedUserId(null) }}
        onConfirm={toggleStatus}
        message="Are you sure you want to change the status?"
      />
    </div>
  );
}
