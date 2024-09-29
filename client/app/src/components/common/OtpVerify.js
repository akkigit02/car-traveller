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
            {/* <h6 className="mb-4">
                Verify OTP
            </h6> */}
            
            <div className="cstm-login-input mt-5">
                <label>
                    OTP
                </label>
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your OTP"
                />
            </div>
            <div className="form-group-login form-button">
                <button onClick={verifyOtp} disabled={isButtonLoad} className="form-submit">
                    Verify
                    {isButtonLoad && <div className="spinner-border spinner-border-sm text-white ms-2" role="status">
                        <span className="sr-only"></span>
                    </div>}
                </button>
            </div>
        </>
    )
}

export default OtpVerify