require('dotenv').config();
const tokenHandler = require('../utils/token-handler');
const user = require('../models/user');
const argon2 = require('argon2');

module.exports.userLogin = async function (user) {
    try {
        let res0 = await user.get_profile_data('email', user.email);

        //return if any credential is null
        if (!user.email || !user.password) { return { status: false, status_code: 400, message: "Null values not allowed!" } }

        //unhash and verify password
        if (!(await argon2.verify(res0.password, user.password))) { return { status: false, status_code: 401, message: "Invalid Credentials!" } }

        //generate new user tokens
        const jwt = tokenHandler.gen_jwt({ sub: res0.user_id });

        //return new credentials
        return { status: true, data: { user_id: user.user_id, jwt: jwt } }
    } catch (error) {
        console.error(error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }
}