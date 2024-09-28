import axios from 'axios';
import React, { useState } from 'react'
import { toast } from "react-toastify";
function OtpVerify({ otpDetails, handleOtpVerify }) {
    const [otp, setOtp] = useState("");
    const [isButtonLoad, setIsButtonLoad] = useState(false)

    const verifyOtp = async () => {
        try {
            setIsButtonLoad(true)
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
        } finally {
            setIsButtonLoad(false)
        }
    };
    return (
        <>
            <h4 className="mb-4">
                Verify OTP
            </h4>
            <p className=" mb-3">
            Verify OTP for quick, secure access. Protect your<br></br> account with a simple code, ensuring<br></br> safety and preventing unauthorized entry. </p> 
           
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
                <button onClick={verifyOtp} disabled={isButtonLoad} className="form-submit">
                    {isButtonLoad && <div class="spinner-border text-primary" role="status">
                        <span class="sr-only"></span>
                    </div>}
                    Verify
                </button>
            </div>
        </>
    )
}

export default OtpVerify