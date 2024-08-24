import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { emailPattern } from "../constants/Validation.constant";
import axios from "axios";
import store from "../store";
import { setTokenToLocal } from "../services/Authentication.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/css/authentication.css"; // Ensure CSS is imported

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [otpDetails, setOtpDetails] = useState(null);
  const [userType, setUserType] = useState('passenger'); // Default to passenger

  const login = async (formData) => {
    try {
      const { data } = await axios({
        url: "/api/auth/login",
        method: "POST",
        data: {
          ...formData,
          userType, // Send the userType to your API if needed
        },
      });
      if (data.status === 'TWO_STEP_AUTHENTICATION') {
        setOtpDetails(data.session);
      } else if (data.status === 'LOGIN_SUCCESS') {
        setTokenToLocal(data.session.jwtToken);
        store.dispatch({
          type: "SET_INTO_STORE",
          payload: { userInfo: data.session },
        });
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error);
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await axios({
        url: '/api/auth/verify-otp',
        method: 'POST',
        data: {
          otp, 
          sessionId: otpDetails.sessionId
        }
      });
      if (data.message) {
        toast.success(data.message);
      }
      if (data.status === 'LOGIN_SUCCESS') {
        setTokenToLocal(data.session.jwtToken);
        store.dispatch({
          type: "SET_INTO_STORE",
          payload: { userInfo: data.session },
        });
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error?.response?.data?.message || 'Something went wrong please try again!');
    }
  };

  return (
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="login-page">
        <div className="login-container">
          <div className="login-login">
            <h2 className="pt-3">{otpDetails ? 'Verify OTP' : 'Login'}</h2>

            {!otpDetails && (
              <div>
                <div className="user-type-selection">
                  <label>
                    <input
                      type="radio"
                      value="passenger"
                      checked={userType === 'passenger'}
                      onChange={() => setUserType('passenger')}
                    />
                    Passenger
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="admin"
                      checked={userType === 'admin'}
                      onChange={() => setUserType('admin')}
                    />
                    Admin
                  </label>
                </div>

                {userType === 'admin' && (
                  <form className="login-form" onSubmit={handleSubmit(login)}>
                    <input
                      type="text"
                      placeholder="Email"
                      className="login-input"
                      {...register("userName", {
                        required: "Email is required",
                        pattern: emailPattern,
                      })}
                    />
                    {errors?.userName?.message && (
                      <span>{errors?.userName?.message}</span>
                    )}
                    <input
                      className="login-input"
                      type="password"
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Min length is 6",
                        },
                      })}
                    />
                    {errors?.password?.message && (
                      <span>{errors?.password?.message}</span>
                    )}
                    <button className="btn-signup mt-4" type="submit">
                      Log In
                    </button>
                  </form>
                )}

                {userType === 'passenger' && (
                  <form className="login-form" onSubmit={handleSubmit(login)}>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="login-input"
                      {...register("phoneNumber", {
                        required: "Phone Number is required",
                      })}
                    />
                    {errors?.phoneNumber?.message && (
                      <span>{errors?.phoneNumber?.message}</span>
                    )}
                    <button className="btn-signup mt-4" type="submit">
                      Log In
                    </button>
                  </form>
                )}

                <div className="social">
                  <div
                    className="pe-3"
                    onClick={() => {
                      toast.success("hello");
                    }}
                  >
                    <i className="fab fa-google"></i> Google
                  </div>
                  <div className="fb">
                    <i className="fab fa-facebook"></i> Facebook
                  </div>
                </div>
              </div>
            )}

            {otpDetails && (
              <div>
                <input
                  className="cstm-input me-3"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter your OTP"
                />
                <button className="cstm-btn-red" onClick={verifyOtp}>
                  Verify
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
