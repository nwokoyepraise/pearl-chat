require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const key = process.env.JWTKEY;

module.exports.genJwt = function (user) {
    return jwt.sign(user, key, { expiresIn: '86400s' });
}

module.exports.hashKey = async function (password) {
    try {
        return await argon2.hash(password);
    } catch (error) {
        console.error(error);
    }
}

module.exports.getAuth = function (auth_header) {
    let auth;
    if (!auth_header) { return '' }
    auth = auth_header.split(' ')[1];
    return auth;
}

module.exports.chkKey = async function (hash, plain) {
    try {
        return await argon2.verify(hash, plain)
    } catch (error) {
        console.log(error);
    }
}