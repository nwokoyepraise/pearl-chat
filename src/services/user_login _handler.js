require('dotenv').config();
const token_handle = require('../utils/token_handle');

module.exports = async function (user) {
    try {
        //generate new user tokens
        const jwt = token_handle.gen_jwt({ sub: user.user_id });

        //return new credentials
        return { status: true, data: { user_id: user.user_id, jwt: jwt } }
    } catch (error) {
        console.error(error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }
}