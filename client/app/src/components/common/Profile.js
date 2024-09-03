import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { emailPattern, namePattern, phoneNumberValidation } from '../../constants/Validation.constant';

const Profile = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' });

  const onSubmit = async (formData) => {


  };

  const getUserProfile = async () => {
    try {
      const { data } = await axios({
        url: '/api/common/profile'
      })
      reset(data.userDetails)
    } catch (error) {

    }
  }


  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <div className='client-profile'>

    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='row m-0'>
      <div className="form-group col-md-6">
        <label>Name</label>
        <input
        class="form-control"
          {...register('name', {
            required: 'Name is required',
            pattern: namePattern
          })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div className="form-group col-md-6">
        <label>Email</label>
        <input
        class="form-control"
          {...register('email', {
            required: 'Email is required',
            pattern: emailPattern
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div className="form-group col-md-6">
        <label>Primary Phone</label>
        <input
        class="form-control"
          {...register('primaryPhone',
            {
              required: 'Primary Phone is required',
              pattern: phoneNumberValidation
            })}
        />
        {errors.primaryPhone && <p>{errors.primaryPhone.message}</p>}
      </div>
      <div className="form-group col-md-6">
        <label>Secondary Phone</label>
        <input
        class="form-control"
        {...register('secondaryPhone', {
          pattern: phoneNumberValidation
        }
        )} />
      </div>
      <div className="form-group col-md-6"> 
        <label>Date of Birth</label>
        <input
        class="form-control"
         type="date"
          {...register('dateOfBirth')}
        />
      </div>
      </div>
      <fieldset>
        <legend>Address</legend>
        <div className='row m-0'>
        <div className="form-group col-md-6">
          <label>Address Line</label>
          <input 
          class="form-control"
           {...register('currentAddress.addressLine')} />
        </div>
        <div className="form-group col-md-6">
          <label>City</label>
          <input 
          class="form-control"
           {...register('currentAddress.city')} />
        </div>
        <div className="form-group col-md-6">
          <label>State</label>
          <input class="form-control" {...register('currentAddress.state')} />
        </div>
        <div className="form-group col-md-6">
          <label>Country</label>
          <input class="form-control" {...register('currentAddress.country')} />
        </div>
        <div className="form-group col-md-6">
          <label>Zip</label>
          <input class="form-control" {...register('currentAddress.zip')} />
        </div>
        </div>
      </fieldset>
      <div className="form-group col-md-6">
        <input
        className='mx-3'
          type="checkbox"
          id="twoFactorEnable"
          {...register('twoFactorEnable')}
          />
          <label>Enable Two-Factor Authentication</label>
      </div>
      <div className='d-flex justify-content-end'>
      <button type='button' className='cstm-btn-trans me-2' onClick={() => reset()}>reset</button>
      <button className='cstm-btn' type="submit">Submit</button>
      </div>
    </form>
    </div>
  );
};

export default Profile;
