const router = require('express').Router();
const user_reg_handler = require('../services/user_reg_handler');
const base_response = require('../middleware/base_response')

module.exports = router.post('', async function (req, res, next) {
    try {
        res.locals.data = await user_reg_handler.reg_user(req.body);
        //revert response to user
        next();

    } catch (error) {
        console.error(error);
    }
});

