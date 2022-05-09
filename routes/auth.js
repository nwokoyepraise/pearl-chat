const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const baseResponse = require('../middleware/baseResponse');

module.exports = router.post('', async function (req, res, next) {
    try {

        res.locals.data = await authController.userLogin(req.body);
        //revert response to user
        next();

    } catch (error) {
        console.error(error);
    }
}, baseResponse);

