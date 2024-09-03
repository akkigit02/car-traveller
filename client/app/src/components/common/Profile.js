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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input
          {...register('name', {
            required: 'Name is required',
            pattern: namePattern
          })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: emailPattern
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Primary Phone</label>
        <input
          {...register('primaryPhone',
            {
              required: 'Primary Phone is required',
              pattern: phoneNumberValidation
            })}
        />
        {errors.primaryPhone && <p>{errors.primaryPhone.message}</p>}
      </div>
      <div>
        <label>Secondary Phone</label>
        <input {...register('secondaryPhone', {
          pattern: phoneNumberValidation
        }
        )} />
      </div>
      <div>
        <label>Date of Birth</label>
        <input type="date"
          {...register('dateOfBirth')}
        />
      </div>

      <fieldset>
        <legend>Address</legend>
        <div>
          <label>Address Line</label>
          <input {...register('currentAddress.addressLine')} />
        </div>
        <div>
          <label>City</label>
          <input {...register('currentAddress.city')} />
        </div>
        <div>
          <label>State</label>
          <input {...register('currentAddress.state')} />
        </div>
        <div>
          <label>Country</label>
          <input {...register('currentAddress.country')} />
        </div>
        <div>
          <label>Zip</label>
          <input {...register('currentAddress.zip')} />
        </div>
      </fieldset>
      <div>
        <label>Enable Two-Factor Authentication</label>
        <input
          type="checkbox"
          id="twoFactorEnable"
          {...register('twoFactorEnable')}
        />
      </div>
      <button type='button' onClick={() => reset()}>reset</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Profile;
