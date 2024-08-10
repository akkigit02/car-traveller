const UserModel = require('../models/user.model');
const { comparePassword, generateSecureRandomString, generateOTP } = require('../utils/common.utils');
const { JWT_SECRET_KEY } = process.env
const JWT = require("jsonwebtoken");

const getUserSession = async (userId) => {
    const loginSessionId = generateSecureRandomString(10)
    const token = JWT.sign({ sessionId: loginSessionId }, JWT_SECRET_KEY, { expiresIn: '24h' });

    const user = await UserModel.findOne({ _id: userId }, {
        firstName: 1,
        lastName: 1,
        email: 1,
        primaryPhone: 1,
        modules: 1
    }).lean()
    await UserModel.updateOne({ _id: userId }, {
        $set: {
            'authentication.loginSessionId': loginSessionId
        }
    })
    return {
        ...user,
        jwtToken: token
    }
}

const login = async (req, res) => {
    try {
        const { body } = req
        const { userName, password } = body
        if (!userName || !password) {
            return res.status(400).send({ message: 'Email and password are required.' });
        }
        const user = await UserModel.findOne({ $or: [{ email: String(body.userName) }, { primaryPhone: String(body.userName) }] }, { password: 1, status: 1, authentication: 1, email: 1, primaryPhone: 1, modules: 1 })
        console.log(user)
        if (!user) {
            return res.status(401).send({ message: 'Incorrect username or password. Please try again.' })
        }
        const isPassMatch = await comparePassword(password, user.password)
        console.log
        if (!isPassMatch)
            return res.status(401).send({ message: 'Incorrect username or password. Please try again.' })
        if (user.status === 'sent') {
            return res.status(403).send({ message: 'Please verify your account via OTP.', status: 'UNVERIFIED' })
        }
        if (user?.authentication?.twoFactor?.enabled) {
            const otp = generateOTP()
            const sessionId = generateSecureRandomString()
            await UserModel.updateOne({ _id: user._id }, {
                $set: {
                    'authentication.twoFactor.otp': otp,
                    'authentication.twoFactor.expiresOn': new Date(new Date().getTime() + 300000),
                    'authentication.twoFactor.sessionId': sessionId
                }
            })

            // send otp 

            return res.status(200).send({ session: { otp, sessionId, email: user.email, phone: user.primaryPhone, modules: user.modules }, status: 'TWO_STEP_AUTHENTICATION' })
        }
        const userSession = await getUserSession(user._id)
        res.status(200).send({ message: 'Login successful.', session: userSession, status: 'LOGIN_SUCCESS' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong. Please try again later.' })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { body } = req
        const { otp, sessionId } = body
        if (!otp || !sessionId) {
            return res.status(400).send({ message: 'OTP and session ID are required.' });
        }
        const user = await UserModel.findOne({ 'authentication.twoFactor.sessionId': String(sessionId) }, { status: 1, authentication: 1, email: 1, primaryPhone: 1 })
        if (!user) {
            return res.status(401).send({ message: 'Session expired or invalid. Please resend OTP and try again.' })
        }
        console.log(new Date(), user?.authentication?.twoFactor?.expiresOn)
        if (new Date() > user?.authentication?.twoFactor?.expiresOn)
            return res.status(401).send({ message: 'Session expired. Please resend OTP and try again.' })
        if (user?.authentication?.twoFactor?.otp !== String(otp))
            return res.status(401).send({ message: 'Invalid OTP. Please try again.' })
        await UserModel.updateOne({ _id: user._id }, {
            $unset: {
                'authentication.twoFactor.otp': 1,
                'authentication.twoFactor.expiresOn': 1,
                'authentication.twoFactor.sessionId': 1
            }
        })
        const userSession = await getUserSession(user._id)
        res.status(200).send({ message: 'Login successful.', session: userSession, status: 'LOGIN_SUCCESS' })
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong. Please try again later.' })
    }
}

const verifySession = async (req, res) => {
    try {

        const { query } = req
        if (!query?.token)
            return res.status(401).send({ message: 'Session expired or invalid. Please login again' })
        try {
            JWT.verify(query?.token, JWT_SECRET_KEY)
        } catch (error) {
            return res.status(401).send({ message: 'Session expired or invalid. Please login again' })
        }
        const token = JWT.decode(query.token)
        if (!token?.sessionId)
            return res.status(401).send({ message: 'Session expired or invalid. Please login again' })
        const user = await UserModel.findOne({ 'authentication.loginSessionId': String(token?.sessionId) }, { status: 1, authentication: 1, email: 1, primaryPhone: 1 })
        console.log(113, user)
        if (!user)
            return res.status(401).send({ message: 'Session expired or invalid. Please login again' })
        const userSession = await getUserSession(user._id)
        return res.status(200).send({ message: 'Login successful.', session: userSession, status: 'LOGIN_SUCCESS' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong. Please try again later.' })

    }
}


const signup = async (req, res) => {
    try {

        const { body } = req
        if (!body.phoneNumber)
            return res.status(500).send({ message: 'Phone Number is required' })
        if (!body.email)
            return res.status(500).send({ message: 'Email is required' })

        const user = await UserModel.findOne({ primaryPhone: String(body.phoneNumber) }, { modules: 1 })
        if (user) {
            if (user.modules.userType !== 'CLIENT') {
                return res.status(500).send({ message: 'Phone Number already exist.' })
            }

        }
        return res.status(200).send({ message: '' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong. Please try again later.' })

    }
}


const sendOtp = async (req, res) => {
    try {
        const { body } = req
        if (!body.phoneNumber)
            return res.status(500).send({ message: 'Phone Number is required' })
        if (!body.email)
            return res.status(500).send({ message: 'Email is required' })
        let user = await UserModel.findOne({ primaryPhone: String(body.phoneNumber) }, { modules: 1 })
        if (user && user.modules.userType !== 'CLIENT')
            return res.status(500).send({ message: 'Phone Number already exist.' })
        else {

            user = await UserModel.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                primaryPhone: body.phoneNumber,
                modules: {
                    userType: 'CLIENT'
                }
            })
        }
        const otp = generateOTP()
        console.log(otp)
        const sessionId = generateSecureRandomString()
        await UserModel.updateOne({ _id: user._id }, {
            $set: {
                'authentication.twoFactor.otp': otp,
                'authentication.twoFactor.expiresOn': new Date(new Date().getTime() + 300000),
                'authentication.twoFactor.sessionId': sessionId
            }
        })
        return res.status(200).send({ sessionId: sessionId, status: 'TWO_STEP_AUTHENTICATION' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong. Please try again later.' })
    }
}




module.exports = {
    login,
    verifyOtp,
    verifySession,
    signup,
    sendOtp
}