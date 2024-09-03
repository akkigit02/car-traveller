import axios from 'axios';
import React, { useState } from 'react'
import { toast } from "react-toastify";
function OtpVerify({ otpDetails, handleOtpVerify }) {
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        try {
            const { data } = await axios({
                url: "/api/auth/verify-otp",
                method: "POST",
                data: {
                    otp,
                    sessionId: otpDetails.sessionId,
                },
            });
            if (data.message) {
                toast.success(data.message);
            }
            if (data.status === "LOGIN_SUCCESS") {
                if (handleOtpVerify)
                    handleOtpVerify(data)
            }
        } catch (error) {
            console.log(error.response.data);
            toast.error(error?.response?.data?.message || "Something went wrong please try again!");
        }
    };
    return (
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
                <button onClick={verifyOtp} className="form-submit">
                    Verify
                </button>
            </div>
        </>
    )
}

export default OtpVerify