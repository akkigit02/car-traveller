import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Tooltip from "../Tooltip";
import { emailPattern, namePattern, phoneNumberValidation } from '../../constants/Validation.constant';


export default function UserManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    getUsers();
  }, []);

  const saveUser = async (data) => {
    try {
      if (data?._id) {
        await axios.put(`/api/admin/users/${data._id}`, data);
        setList(list.map(user => (user._id === data._id ? data : user)));
      } else {
        const res = await axios.post("/api/admin/users", data);
        setList([res.data.user, ...list]);
      }
      closeModal();
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
      setSelectedUser(res.data.user);
      setIsOpen(true);
      setIsEdit(true);
    } catch (error) {
      console.error(error);
    }
  };


  const toggleStatus = async (id) => {
    try {
      const user = list.find(user => user._id === id);
      await axios.put(`/api/admin/users/${id}`, { isActive: !user.isActive });
      setList(list.map(user => (user._id === id ? { ...user, isActive: !user.isActive } : user)));
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    reset({});
    setIsOpen(false);
    setIsEdit(false);
    setSelectedUser(null);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <div>
          <p className="cstm-title">User Management</p>
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
            <th className="">Name</th>
            <th className="">Email</th>
            <th className="">Phone</th>
            <th className="">User Type</th>
            <th className="">Status</th>
            <th className="">Action</th>
          </tr>
        </thead>
          <tbody>
            {list.length > 0 ?list.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.primaryPhone}</td>
                <td>{user.modules.userType}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(user._id)}
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
                  <Tooltip message={'View More'} direction="bottom">
                    <button
                      onClick={() => openViewModal(user)}
                      className="icon-btn me-2"
                      type="button"
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  </Tooltip>
                </td>
              </tr>
            )):
            <tr className='no-data'>
            <td colspan="100%">
              <div className='d-flex align-items-center justify-content-center'><div  className='no-data-content'></div></div>
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
                  {...register("secondaryPhone",phoneNumberValidation)}
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
                  <option value="">Choose Type</option>
                  <option value="CLIENT">Client</option>
                </select>
                {errors?.modules?.userType && (
                  <span className="text-danger">{errors.modules.userType.message}</span>
                )}
              </div>
              <div className="form-group col-lg-6 col-md-6 col-12">
              {!isEdit && (
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    {...register("password")}
                    className="cstm-select-input"
                    placeholder="Enter password"
                    />
                </div>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end pt-2">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isViewOpen} onClose={closeViewModal} width={'w-auto'} title="View User Details">
        <div className="scroll-body">
          <table className="cstm-table">
            <thead>
              <tr>
                <th className="">Name</th>
                <th className="">Email</th>
                <th className="">Primary Phone</th>
                <th className="">Secondary Phone</th>
                <th className="">User Type</th>
                <th className="">Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedUser?.name}</td>
                <td>{selectedUser?.email}</td>
                <td>{selectedUser?.primaryPhone}</td>
                <td>{selectedUser?.secondaryPhone}</td>
                <td>{selectedUser?.modules?.userType}</td>
                <td>{selectedUser?.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}
