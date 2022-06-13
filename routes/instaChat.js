const router = require("express").Router();
const baseResponse = require("../middleware/baseResponse");
const instaChatController = require("../controllers/instaChat.controller");

router.get("", (req, res) => res.render("pages/insta-chat"));

router.post(
  "",
  async function (req, res, next) {
    try {
      res.locals.data = await instaChatController.createRoom(req.body)
      //revert response to user
      next();
    } catch (error) {
      console.error(error);
    }
  },
  baseResponse
);

module.exports = router;
