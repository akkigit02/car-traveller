import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import store from "../../store";
import { setTokenToLocal } from "../../services/Authentication.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../assets/css/authentication.css"; // Ensure CSS is imported
// import vImg from "../../assets/img/loginimg.png";
import logo from "../../assets/img/logomain.png";
import OtpVerify from "../common/OtpVerify";
import { emailPattern } from "../../constants/Validation.constant";

function AdminLogin() {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const [otpDetails, setOtpDetails] = useState(null);
    const login = async (formData) => {
        try {
            const { data } = await axios({
                url: "/api/auth/login",
                method: "POST",
                data: { ...formData, userType: 'ADMIN' },
            });
            if (data.status === "TWO_STEP_AUTHENTICATION") {
                setOtpDetails(data.session);
            } else if (data.status === "LOGIN_SUCCESS") {
                handleLoginSuccess(data)
            }
            if (data.message)
                toast.success(data.message);
        } catch (error) {
            console.log(error?.response?.data?.message || error);
            toast.error(error?.response?.data?.message || "Something went wrong please try again!");
        }
    };
    const handleLoginSuccess = (data) => {
        setTokenToLocal(data.session.jwtToken);
        store.dispatch({
            type: "SET_INTO_STORE",
            payload: { userInfo: data.session },
        });
        navigate("/dashboard", { replace: true });
    }

    return (
        <>
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <section className="sign-in">
                <div className="container-login">


                <div className="row m-0">
                        <div className="col-lg-6 col-md-6 col-12 px-4 py-5 login-card-bg rounded-LTB In-mob">
                            <div className="my-5 ps-3">
                                <p className="login-text">Welcome <br></br> Back !</p>
                                <p>Enjoy affordable rides with the freedom to explore anywhere, anytime—experience limitless journeys with our car rental service!</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="signin-form p-3">
                                <div className="w-100 d-flex justify-content-center pt-3">
                                    <a href="https://dddcabs.com/index.html" rel="noopener noreferrer"><img className="h-60p mb-3" src={logo} alt="logo-img" /></a>
                                </div>
                                {otpDetails ? <OtpVerify otpDetails={otpDetails} handleOtpVerify={handleLoginSuccess} /> : <>


                                    <form className="w-100" onSubmit={handleSubmit(login)}>
                                        <div className="cstm-login-input mb-2">
                                            <label>
                                                Email
                                            </label>
                                            <input type="text" placeholder="Enter your email"
                                            {...register("userName", {
                                                required: "Email is required",
                                                pattern: emailPattern,
                                            })}
                                        />
                                        {errors?.userName?.message && (
                                            <span>{errors?.userName?.message}</span>
                                        )}
                                        </div>
                                        <div className="cstm-login-input">
                                            <label>
                                                Password
                                            </label>
                                            <input type="password" placeholder="Enter Your password"
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
                                        </div>
                                        {/* <div className="form-group-login d-flex justify-content-end">
                                        <p className="">Forgot Password</p>
                                    </div> */}
                                        <div className="form-group-login form-button">
                                            <button className="form-submit">
                                                Log in
                                            </button>
                                        </div>
                                    </form>
                                </>}
                            </div>
                        </div>



                    </div>




                    
                    {/* <div className="signin-content">

                        <div className="signin-form">
                            <div className="w-100 d-flex justify-content-center">
                                <a href="https://dddcabs.com/index.html" rel="noopener noreferrer"><img className="h-60p mb-3" src={logo} alt="logo-img" /></a>
                            </div>
                            {otpDetails ? <OtpVerify otpDetails={otpDetails} handleOtpVerify={handleLoginSuccess} /> : <>
                            <h3 className="mb-4">
                                    Login
                                </h3 >
                                <p className="mb-3">
                                Enjoy affordable rides with the freedom to explore <br></br> anywhere, anytime—experience limitless journeys<br></br> with our car rental service!
                                </p> 
                                <form className="register-form" onSubmit={handleSubmit(login)}>
                                    <div className="form-group-login">
                                        <label for="your_name">
                                            <i className="fa fa-user"></i>
                                        </label>
                                        <input type="text" placeholder="Email"
                                            {...register("userName", {
                                                required: "Email is required",
                                                pattern: emailPattern,
                                            })}
                                        />
                                        {errors?.userName?.message && (
                                            <span>{errors?.userName?.message}</span>
                                        )}
                                    </div>
                                    <div className="form-group-login">
                                        <label for="your_pass">
                                            <i className="fa fa-lock"></i>
                                        </label>
                                        <input type="password" placeholder="Password"
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
                                    </div>
                                    <div className="form-group-login d-flex justify-content-end">
                                        <p className="">Forgot Password</p>
                                    </div>
                                    <div className="form-group-login form-button">
                                        <button className="form-submit">
                                            Log in
                                        </button>
                                    </div>
                                </form>
                            </>}
                        </div>
                    </div> */}
                </div>
            </section >
        </>
    );
}

export default AdminLogin;
