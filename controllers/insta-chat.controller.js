const instaChat = require("../models/insta-chat");
const cryptGen = require("../utils/crypt-gen");
const argon2 = require("argon2");
const { hashKey } = require("../utils/token-handler");

module.exports.createRoom = async function (body) {
  try {
    let { chat_code, passcode } = body;

    passcode = await hashKey(passcode);

    let data = await instaChat.createRoom(chat_code, passcode);
    if (!data?._id) {
        return { status: false, status_code: 500, message: "Unable to create room, please try again" };
    }
    return { status: true, data: data };
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};

module.exports.joinRoom = async function (params) {
  try {
    let userId = cryptGen.gen(12);
    let { matchedCount, modifiedCount, acknowledged } = await instaChat.joinRoom(params.room, userId);
    if (!(matchedCount && modifiedCount && acknowledged)) {
      return { status: false, status_code: 404, message: "Chat room not found" };
   }
   return {status: true, data: {user_id: userId}}
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};

module.exports.saveMessage = async function (chatCode, message, userId) {
  try {

    return await instaChat.saveMessage(chatCode, message, userId);
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};

module.exports.getMessages = async function (chatCode) {
  try {

    let data =  await instaChat.getMessages(chatCode);
    return {status: true, data: data}
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};

