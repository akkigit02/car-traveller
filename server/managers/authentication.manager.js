const UserModel = require('../models/user.model');
const { comparePassword, generateSecureRandomString, generateOTP } = require('../utils/common.utils');
const { JWT_SECRET_KEY } = process.env

const getUserSession = async (userId) => {
    const loginSessionId = generateSecureRandomString(10)
    const token = JWT.sign({ sessionId: loginSessionId }, JWT_SECRET_KEY, { expiresIn: '24h' });

    const user = await UserModel.findOne({ _id: userId }, {
        status: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        primaryPhone: 1,
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
        if (!email)
            return res.status(401).send({ message: 'Incorrect email or password. Please try again.' })
        if (password)
            return res.status(401).send({ message: 'Incorrect email or password. Please try again.' })

        const user = await UserModel.findOne({ email: String(body.email) }, { password: 1, status: 1, authentication: 1, email, primaryPhone: 1 })
        if (!user) {
            return res.status(401).send({ message: 'Incorrect email or password. Please try again.' })
        }
        const isPassMatch = await comparePassword(password, user.password)
        if (isPassMatch)
            return res.status(401).send({ message: 'Incorrect email or password. Please try again.' })
        if (user.status === 'sent') {
            return res.status(401).send({ message: 'Please verified your account via otp', status: 'UN_VARIFIED' })
        }
        if (authentication?.twoFactor?.enabled) {
            const otp = generateOTP()
            const sessionId = generateSecureRandomString()
            await UserModel.updateOne({ _id: user._id }, {
                $set: {
                    'authentication.twoFactor.otp': otp,
                    'authentication.twoFactor.expiresOn': new Date(new Date().getTime() + 5),
                    'authentication.twoFactor.sessionId': sessionId
                }
            })

            // send otp 

            return res.status(200).send({ session: { otp, sessionId, email: user.email, phone: user.primaryPhone }, status: 'TWO_STEP_AUTHENTICATION' })
        }
        const userSession = await getUserSession(user._id)
        res.status(200).send({ message: 'Login Success', session: userSession, status: 'LOGIN_SUCCESS' })
    } catch (error) {
        res.status(500).send({ message: 'Something went Wrong' })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { body } = req
        const { otp, sessionId } = body
        if (!otp)
            return res.status(401).send({ message: 'Otp is required' })
        if (sessionId)
            return res.status(401).send({ message: 'Session is Expired or invalid.' })

        const user = await UserModel.findOne({ 'authentication.twoFactor.sessionId': String(sessionId) }, { password: 1, status: 1, authentication: 1, email, primaryPhone: 1 })
        if (!user) {
            return res.status(401).send({ message: 'Session Expired' })
        }
        if (new Date() > user?.authentication?.twoFactor?.expiresOn)
            return res.status(401).send({ message: 'Session Expired  Please resend otp and try again!' })
        if (user?.authentication?.twoFactor?.otp !== String(otp))
            return res.status(401).send({ message: 'Invalid Otp. please try again!' })
        await UserModel.updateOne({ _id: user._id }, {
            $unset: {
                'authentication.twoFactor.otp': 1,
                'authentication.twoFactor.expiresOn': 1,
                'authentication.twoFactor.sessionId': 1
            }
        })
        const userSession = await getUserSession(user._id)
        res.status(200).send({ message: 'Login Success', session: userSession, status: 'LOGIN_SUCCESS' })
    } catch (error) {
        res.status(500).send({ message: 'Something went Wrong' })
    }
}


module.exports = {
    login,
    verifyOtp
}