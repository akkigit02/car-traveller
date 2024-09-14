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

function Login() {
    const { register, handleSubmit, formState: { errors }, } = useForm();
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
                    <div className="signin-content">
                        {/* <div className="signin-image">
                            <figure>
                                <img className="w-100 h-100 mt-3" src={vImg} alt="logo-img" />
                            </figure>
                        </div> */}

                        <div className="signin-form">
                            <div className="w-100 d-flex justify-content-center">
                                <a href="https://dddcabs.com/index.html" rel="noopener noreferrer"><img className="h-60p mb-3" src={logo} alt="logo-img" /></a>
                            </div>
                            {otpDetails ? <OtpVerify otpDetails={otpDetails} handleOtpVerify={handleLoginSuccess} /> : <>
                                <h4 className="form-title">
                                    User Login
                                </h4>
                                <form className="register-form" onSubmit={handleSubmit(login)}>
                                    <div className="form-group-login">
                                        <label for="your_name">
                                            <i class="fa fa-mobile-alt"></i>
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
                                        <button className="form-submit">
                                            Log in
                                        </button>
                                    </div>
                                </form>
                            </>}
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

export default Login;
