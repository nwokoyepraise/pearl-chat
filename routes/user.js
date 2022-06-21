const router = require('express').Router();
const userController = require('../controllers/user.controller');
const baseResponse = require('../middleware/base-response')

module.exports = router.post('', async function (req, res, next) {
    try {
        res.locals.data = await userController.reg_user(req.body);
        //revert response to user
        next();

    } catch (error) {
        console.error(error);
    }
}, baseResponse);

