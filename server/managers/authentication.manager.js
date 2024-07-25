const UserModel = require('../models/user.model')


const login = async (req, res) => {
    try {
        const { body } = req
        if (email) {
            const user = await UserModel.findOne({ email: String(body.email) }, { password: 1 })
            if(!user){
                return res.status(401).send({ message: 'Incorrect email or password. Please try again.' })
            }
        }


        res.status(200).send({ message: 'Login Success' })
    } catch (error) {
        res.status(500).send({ message: 'Something went Wrong' })
    }
}

module.exports = {
    login
}