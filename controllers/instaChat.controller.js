const instaChat = require("../models/instaChat");

module.exports.createRoom = async function (body) {
  try {
    let { chat_code } = body;

    let data = await instaChat.createRoom(chat_code);
    if (!data?._id) {
        return { status: false, status_code: 500, message: "Unable to create room, please try again" };
    }
    return { status: true, data: data };
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};