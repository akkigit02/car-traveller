import React from "react";
import { useForm } from "react-hook-form";
import { emailPattern } from "../constants/Validation.constant";
import axios from "axios";
import store from "../store";
import { setTokenToLocal } from "../services/Authentication.service";
import { toast } from "react-toastify";
import { style } from "../assets/css/authentication.css";
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (formData) => {
    try {
      const { data } = await axios({
        url: "/api/auth/login",
        method: "POST",
        data: {
          userName: formData.userName,
          password: formData.password,
        },
      });
      setTokenToLocal(data.session.jwtToken);
      store.dispatch({
        type: "SET_INTO_STORE",
        payload: { userInfo: data.session },
      });
    } catch (error) {
      console.log(error?.response?.data?.message || error);
    }
  };
  return (
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="login-page">
        <div class="login-container">
          <div class="login-login">
            <h2 className="pt-3">Login</h2>
            <form className="login-form" onSubmit={handleSubmit(login)}>
              {/* <label>Username</label> */}
              <input
                type="text"
                placeholder="Email or Phone"
                className="login-input"
                {...register("userName", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
              />
              {errors?.userName?.message && (
                <span>{errors?.userName?.message}</span>
              )}
              {/* <label>Password</label> */}
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
                {" "}
                Log In
              </button>
              <div className="social">
                <div
                  className="pe-3"
                  onClick={() => {
                    toast.success("hello   ");
                  }}
                >
                  <i className="fab fa-google"></i> Google
                </div>
                <div className="fb">
                  <i className="fab fa-facebook"></i> Facebook
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <form action="#">
                <input className='login-input' type="email" required placeholder="Email">
                <input className='login-input' type="password" required placeholder="Password">
                <div class="options">
                    <input className='login-input' type="checkbox">
                    <label for="remember">Remember me!</label>
                    <a href="#">Forgot password?</a>
                </div>
                <button>Login</button>
                <p>Don't have an account?<br><a href="#">Register</a></p>
            </form> */}
    </>
  );
}

export default Login;
