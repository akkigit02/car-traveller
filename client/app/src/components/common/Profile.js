import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { emailPattern, namePattern, phoneNumberValidation } from '../../constants/Validation.constant';
import { toast } from "react-toastify";
const Profile = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' });
  const [formData, setFormData] = useState()
  const [otpSession, setOtpSession] = useState()
  const [otp, setOtp] = useState("")
  const sendOtp = async (formData) => {
    try {
      const { data } = await axios({
        url: '/api/common/send-otp',
      })
      if (data?.message)
        toast.error(data?.message);
      setFormData(formData)
      setOtpSession(data.sessionId)
    } catch (error) {
      console.log(error)
    }
  };

  const updateProfile = async () => {
    try {
      const { data } = await axios({
        url: '/api/common/profile',
        method: 'post',
        data: {
          ...formData,
          otpDetails: {
            sessionId: otpSession,
            otp
          }
        }
      })
      if (data?.message)
        toast.error(data?.message);
      resetProfile(formData)
    } catch (error) {
      console.log(error)
    }
  }

  const resetProfile = (profile) => {
    setFormData()
    setOtpSession()
    setOtp("")
    if (profile)
      reset(profile)
    else
      reset()
  }


  const getUserProfile = async () => {
    try {
      const { data } = await axios({
        url: '/api/common/profile'
      })
      reset(data.userDetails)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <div className='client-profile'>

      <form onSubmit={handleSubmit(sendOtp)}>
        <div className='row m-0'>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Name</label>
            <input
              className="form-control"
              {...register('name', {
                required: 'Name is required',
                pattern: namePattern
              })}
              disabled={otpSession}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Email</label>
            <input
              className="form-control"
              {...register('email', {
                required: 'Email is required',
                pattern: emailPattern
              })}
              disabled={otpSession}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Primary Phone</label>
            <input
              className="form-control"
              {...register('primaryPhone',
                {
                  required: 'Primary Phone is required',
                  pattern: phoneNumberValidation
                })}
              disabled={otpSession}
            />
            {errors.primaryPhone && <p>{errors.primaryPhone.message}</p>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Secondary Phone</label>
            <input
              className="form-control"
              {...register('secondaryPhone', {
                pattern: phoneNumberValidation
              })}
              disabled={otpSession}
            />
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Date of Birth</label>
            <input
              className="form-control"
              type="date"
              {...register('dateOfBirth')}
              disabled={otpSession}
            />
          </div>
        </div>
        <fieldset>
          <legend>Address</legend>
          <div className='row m-0'>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Address Line</label>
              <input
                className="form-control"
                {...register('currentAddress.addressLine')}
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>City</label>
              <input
                className="form-control"
                {...register('currentAddress.city')}
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>State</label>
              <input className="form-control" {...register('currentAddress.state')}
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Country</label>
              <input className="form-control" {...register('currentAddress.country')}
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Zip</label>
              <input className="form-control" {...register('currentAddress.zip')}
                disabled={otpSession}
              />
            </div>
          </div>
        </fieldset>
        <div className="form-group col-lg-4 col-md-4 col-sm-12">
          <input
            className='mx-3'
            type="checkbox"
            id="twoFactorEnable"
            {...register('twoFactorEnable')}
            disabled={otpSession}
          />
          <label>Enable Two-Factor Authentication</label>
        </div>
        <div className='d-flex justify-content-end'>
          <button type='button' className='cstm-btn-trans me-2' onClick={() => resetProfile()}>reset</button>
          <button className='cstm-btn' type="submit">Submit</button>
        </div>
      </form>
      {otpSession &&
        <>
          <h4 className="form-title">
            Verify OTP
          </h4>
          <div className="form-group-login">
            <label>
              <i class="fa fa-key"></i>
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP"
            />
          </div>
          <div className="form-group-login form-button">
            <button type='button' onClick={updateProfile} className="form-submit">
              Verify
            </button>
          </div>
        </>
      }
    </div>
  );
};

export default Profile;
