const router = require("express").Router();
const baseResponse = require("../middleware/baseResponse");
const instaChatController = require("../controllers/instaChat.controller");

router.get("", (req, res) => res.render("pages/insta-chat"));

router.patch("/:room", async function (req, res) {
    try {
        let { matchedCount, modifiedCount, acknowledged } = await instaChatController.joinRoom(req.params, "QIY");
        if (!(matchedCount && modifiedCount && acknowledged)) {
           return res.status(404).send( { status: false, message: "Chat room not found" });
        }
        res.status(200).send( { status: true, message: "Successful" });
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

module.exports = router;
