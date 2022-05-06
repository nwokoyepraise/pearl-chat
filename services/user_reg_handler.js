const crypt_gen = require('../utils/crypt_gen');
const user_profile_model = require('../models/user_profile_model');
const token_handle = require('../utils/token_handle')

module.exports.reg_user = async function (body) {
    try {
        var email = body?.email?.toLowerCase(),
            username = body?.username,
            user_id = crypt_gen.gen(12),
            password = body?.password;

        //check and return if email or password o username does not exist or if null
        if (!email || !password || !username) { return { status: false, status_code: 400, message: "Null values not allowed" } }

        //check if email and password is valid according model
        const valid_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!valid_email.test(email)) { return { status: false, status_code: 400, message: "User email invalid" } }

        if (password.length < 8) { return { status: false, status_code: 400, message: "Password length is too short" } }

        //check and return if user already exists in db
        let res0 = await user_profile_model.get_profile_data('email', email);

        if (res0?.email) { return { status: false, status_code: 400, message: "User already exists" } }

        let password_hash = await token_handle.hash_password(password);

        //create user
        let res1 = await user_profile_model.create_user(user_id, username, email, password_hash);

        if (!res1._id) { return { status: false, status_code: 500, message: "Unable to create user at this point, please try again later" } }

        console.log('user registered successfully!');

        //generate user jwt
        const mjwt = token_handle.gen_jwt({ sub: user_id });
        return { status: true, data: { user_id: res1.user_id, username: res1.username, email: res1.email, jwt: mjwt } }

    } catch (error) {
        console.error(error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }
}