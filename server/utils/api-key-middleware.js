const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const UserModel = require('../models/user.model')
const jwtUserAuthentication = async (req, res, next) => {
    try {
        const { token } = req.headers;
        /**
         * Check whether the token is provided in header
         * else return response with 401.
         */
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        /**
         * Verify the token with the secret key
         */
        const decodedToken = jwt.decode(token);
        const { sessionId } = decodedToken;

        const userData = await UserModel.findOne({ "authentication.loginSessionId": sessionId, }).lean();
        if (!userData)
            return res.status(401).send({
                auth: false,
                message: 'User Not found.',
            });
        jwt.verify(token, JWT_SECRET_KEY, (err) => {
            /**
             * If the token is valid, check if the token
             * has not been expired else send 401 with code: 'TokenExpiredError'.
             */
            if (err && err.name === 'TokenExpiredError') return res.status(401).send({ code: 'TokenExpiredError', message: 'Token expired.' });

            /**
             * If the token is invalid, send 401.
             */
            if (err && err.name !== 'TokenExpiredError') return res.status(401).send({ message: 'Failed to authenticate token.' });

            /**
             * If all the above conditions are false, move to next().
             */
            req['userId'] = userData._id;
            req['user'] = userData;
            next();
        });
    } catch (error) {
        console.log(error)
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
};

module.exports = {
    jwtUserAuthentication
}