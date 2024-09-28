import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { emailPattern, namePattern, phoneNumberShortValidation, phoneNumberValidation } from '../../constants/Validation.constant';
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import Popup from '../Popup';
const Profile = () => {
  const { register, handleSubmit, reset, formState: { errors, dirtyFields, isSubmitting } } = useForm({ mode: 'onChange' });
  const [formData, setFormData] = useState()
  const [otpSession, setOtpSession] = useState()
  const userInfo = useSelector((state) => state.userInfo)
  const [otp, setOtp] = useState("")
  const [isButtonLoad, setIsButtonLoad] = useState(false)

  const sendOtp = async (formData) => {
    try {
      if (dirtyFields?.primaryPhone) {
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
      setIsButtonLoad(true)
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
    } finally {
      setIsButtonLoad(false)
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
              className="cstm-select-input"
              {...register('name', {
                required: 'Name is required',
                pattern: namePattern
              })}
              placeholder='Enter name'
              disabled={otpSession}
            />
            {errors.name && <span className="text-danger">{errors.name.message}</span>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Email <span>*</span></label>
            <input
              className="cstm-select-input"
              {...register('email', {
                required: 'Email is required',
                pattern: emailPattern
              })}
              placeholder='Enter email'
              disabled={otpSession}
            />
            {errors.email && <span className="text-danger">{errors.email.message}</span>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Primary Phone <span>*</span> </label>
            <input
              className="cstm-select-input"
              {...register('primaryPhone', phoneNumberValidation)}
              placeholder='Enter primary phone'
              disabled={otpSession}
            />
            {errors.primaryPhone && <span className="text-danger">{errors.primaryPhone.message}</span>}
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Secondary Phone</label>
            <input
              className="cstm-select-input"
              {...register('secondaryPhone', phoneNumberShortValidation)}
              placeholder='Enter secondary phone'
              disabled={otpSession}
            />
          </div>
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label for="session-date">Date of Birth</label>
            <input
              className="cstm-select-input"
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
                className="cstm-select-input"
                {...register('currentAddress.addressLine')}
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>City</label>
              <input
                className="cstm-select-input"
                {...register('currentAddress.city')}
                placeholder='Enter city'
                disabled={otpSession}
              />
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>State</label>
              <input className="cstm-select-input" {...register('currentAddress.state')}
                placeholder='Enter State'
                disabled={otpSession}
              />
            </div>
            {/* <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Country</label>
              <input className="cstm-select-input" {...register('currentAddress.country')}
                disabled={otpSession}
              />
            </div> */}
            <div className="form-group col-lg-4 col-md-4 col-sm-12">
              <label>Pin code</label>
              <input className="cstm-select-input" {...register('currentAddress.zip')}
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
          <button className='cstm-btn' disabled={isSubmitting} type="submit">
            {isSubmitting && <div class="spinner-border text-primary" role="status">
              <span class="sr-only"></span>
            </div>}
            Submit
          </button>
        </div>
      </form>
      {dirtyFields?.primaryPhone && otpSession && <div>
        <Popup isOpen={otpSession} handleClose={() => setOtpSession()}>
          <h5>OTP <span>*</span> </h5>
          <div>
            <input className="cstm-input me-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP"
            />
            <button className="cstm-btn-red" disabled={isButtonLoad} onClick={() => updateProfile(formData)}>
            {isButtonLoad && <div class="spinner-border text-primary" role="status">
              <span class="sr-only"></span>
            </div>}
              Verify</button>
          </div>
        </Popup>
      </div>}
    </div>
  );
};

export default Profile;
