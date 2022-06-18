const router = require("express").Router();
const baseResponse = require("../middleware/baseResponse");
const instaChatController = require("../controllers/instaChat.controller");

router.get("", (req, res) => res.render("pages/insta-chat"));

router.patch("/:room", async function (req, res) {
  try {
    let data = await instaChatController.joinRoom(req.params);

    if (data.status != true) {
      return res.status(data.status_code).send({ status: false, message: data.message });
    }
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
});

router.post(
  "",
  async function (req, res, next) {
    try {
      res.locals.data = await instaChatController.createRoom(req.body);
      //revert response to user
      next();
    } catch (error) {
      console.error(error);
    }
  },
  baseResponse
);

router.get(
  "/:room/messages",
  async function (req, res, next) {
    try {
      res.locals.data = await instaChatController.getMessages(req.params.room);
       //revert response to user
       next();
    } catch (error) {
      console.error(error);
    }
  },
  baseResponse
);

module.exports = router;
