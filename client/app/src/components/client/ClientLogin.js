import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import store from "../../store";
import { setTokenToLocal } from "../../services/Authentication.service";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/authentication.css"; // Ensure CSS is imported
import logo from "../../assets/img/logomain.png";
import OtpVerify from "../common/OtpVerify";

function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const [otpDetails, setOtpDetails] = useState(null);
    const login = async (formData) => {
        try {
            const { data } = await axios({
                url: "/api/auth/login",
                method: "POST",
                data: { ...formData, userType: 'CLIENT' },
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


                                    <form className="register-form" onSubmit={handleSubmit(login)}>
                                        <div className="cstm-login-input">
                                            <label>
                                                Mobile Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter your number"
                                                {...register("phoneNumber", {
                                                    required: "Phone Number is required",
                                                })}
                                            />
                                            {errors?.phoneNumber?.message && (
                                                <span>{errors?.phoneNumber?.message}</span>
                                            )}
                                        </div>
                                        <div className="form-group-login form-button">
                                            <button disabled={isSubmitting} className="form-submit">
                                                Log in
                                                {isSubmitting && <div className="spinner-border spinner-border-sm text-white ms-2" role="status">
                                                    <span className="sr-only"></span>
                                                </div>}
                                            </button>
                                        </div>
                                        <div className="col-lg-12 d-flex" >
                                            <Link
                                                to={`/term-condition`}
                                                className={`list-group-item list-group-item-action py-2`}
                                            >
                                                <span style={{ color: 'blue' }}>Terms & Conditions</span>
                                            </Link>
                                            <Link
                                                to={`/refund-policy`}
                                                className={`list-group-item list-group-item-action py-2`}
                                            >
                                                <span style={{ color: 'blue' }}>Refund Policy</span>
                                            </Link>
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
                                            <i className="fa fa-mobile-alt"></i>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            {...register("phoneNumber", {
                                                required: "Phone Number is required",
                                            })}
                                        />
                                        {errors?.phoneNumber?.message && (
                                            <span>{errors?.phoneNumber?.message}</span>
                                        )}
                                    </div>
                                    <div className="form-group-login form-button">
                                        <button disabled={isSubmitting} className="form-submit">
                                            {isSubmitting && <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>}
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

export default Login;
