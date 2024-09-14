import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { emailPattern, namePattern, phoneNumberShortValidation, phoneNumberValidation } from '../../constants/Validation.constant';
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import Popup from '../Popup';
const Profile = () => {
  const { register, handleSubmit, reset, formState: { errors, dirtyFields } } = useForm({ mode: 'onChange' });
  const [formData, setFormData] = useState()
  const [otpSession, setOtpSession] = useState()
  const userInfo = useSelector((state) => state.userInfo)
  const [otp, setOtp] = useState("")

  const sendOtp = async (formData) => {
    try {
      if(dirtyFields?.primaryPhone){
        const { data } = await axios({
          url: '/api/common/send-otp',
        })
        if (data?.message)
          toast.success(data?.message);
        setFormData(formData)
        setOtpSession(data.sessionId)
      } else {
        updateProfile(formData)
      }
      
    } catch (error) {
      console.log(error)
      toast.success(error?.response?.data?.message);
    }
  };

  const updateProfile = async (formData) => {
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
        toast.success(data?.message);
      resetProfile(formData)
      setOtpSession()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
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
            <label>Name <span>*</span></label>
            <input
              className="form-control"
              {...register('name', {
                required: 'Name is required',
                pattern: namePattern
              })}
              placeholder='Enter name'
              disabled={otpSession}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Email <span>*</span></label>
            <input
              className="form-control"
              {...register('email', {
                required: 'Email is required',
                pattern: emailPattern
              })}
              placeholder='Enter email'
              disabled={otpSession}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Primary Phone <span>*</span> </label>
            <input
              className="form-control"
              {...register('primaryPhone',phoneNumberValidation)}
              placeholder='Enter primary phone'
              disabled={otpSession}
            />
            {errors.primaryPhone && <p>{errors.primaryPhone.message}</p>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Secondary Phone</label>
            <input
              className="form-control"
              {...register('secondaryPhone', phoneNumberShortValidation)}
              placeholder='Enter secondary phone'
              disabled={otpSession}
            />
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label for="session-date">Date of Birth</label>
            <input
              className="form-control"
              type="date"
              id="session-date" name="session-date"
              {...register('dateOfBirth')}
              placeholder='Date of birth'
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
                placeholder='Enter city'
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>State</label>
              <input className="form-control" {...register('currentAddress.state')}
              placeholder='Enter State'
                disabled={otpSession}
              />
            </div>
            {/* <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Country</label>
              <input className="form-control" {...register('currentAddress.country')}
                disabled={otpSession}
              />
            </div> */}
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Pin code</label>
              <input className="form-control" {...register('currentAddress.zip')}
              placeholder='Enter pin code'
                disabled={otpSession}
              />
            </div>
          </div>
        </fieldset>
        {userInfo?.modules?.userType === 'ADMIN' && <div className="form-group col-lg-4 col-md-4 col-sm-12">
          <input
            className='mx-3'
            type="checkbox"
            id="twoFactorEnable"
            {...register('twoFactorEnable')}
            disabled={otpSession}
          />
          <label>Enable Two-Factor Authentication</label>
        </div>}
        <div className='d-flex justify-content-end'>
          <button type='button' className='cstm-btn-trans me-2' onClick={() => resetProfile()}>reset</button>
          <button className='cstm-btn' type="submit">Submit</button>
        </div>
      </form>
      {dirtyFields?.primaryPhone && otpSession && <div>
        <Popup isOpen={otpSession} handleClose={() => setOtpSession()}>
          <h5>Otp <span>*</span> </h5>
            <div>
              <input className="cstm-input me-3"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                />
            <button className="cstm-btn-red" onClick={()=>updateProfile(formData)}>verify</button>
          </div>
        </Popup>
      </div>}
    </div>
  );
};

export default Profile;
