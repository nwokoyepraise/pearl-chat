const router = require('express').Router();
const user_auth_handler = require('../services/user_auth_handler');

module.exports = router.post('', async function (req, res, next) {
    try {

        res.locals.data = await user_auth_handler.login(req.body);
        //revert response to user
        next();

    } catch (error) {
        console.error(error);
    }
});

