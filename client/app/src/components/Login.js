import React from 'react'
import { useForm } from "react-hook-form"
import { emailPattern } from '../constants/Validation.constant'
import axios from 'axios'
function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const login = async (formData) => {
        try {
            const { data } = await axios({
                url: '/api/auth/login',
                method: 'post',
                data: {
                    userName: formData.userName,
                    password: formData.password
                }
            })
            localStorage.setItem('state', JSON.stringify({ token: data.session.jwtToken }))
        } catch (error) {
            console.log(error?.response?.data?.message || error)
        }
    }



    return (
        <>
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <form onSubmit={handleSubmit(login)}>
                <h3>Login Here</h3>

                <label >Username</label>
                <input type="text" placeholder="Email or Phone"
                    {...register("userName", {
                        required: "Email is required",
                        pattern: emailPattern,
                    })}
                />
                {errors?.userName?.message && <span>{errors?.userName?.message}</span>}
                <label >Password</label>
                <input
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
                {errors?.password?.message && <span>{errors?.password?.message}</span>}
                <button type='submit'> Log In</button>
                <div className="social">
                    <div className="go"><i className="fab fa-google"></i>  Google</div>
                    <div className="fb"><i className="fab fa-facebook"></i>  Facebook</div>
                </div>
            </form>
        </>
    )
}

export default Login