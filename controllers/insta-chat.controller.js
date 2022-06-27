const instaChat = require("../models/insta-chat");
const cryptGen = require("../utils/crypt-gen");
const { hashKey, chkKey } = require("../utils/token-handler");

module.exports.createRoom = async function (body) {
  try {
    let { chat_code, passphrase } = body;

    passphrase = await hashKey(passphrase);

    let data = await instaChat.createRoom(chat_code, passphrase);
    if (!data?._id) {
      return { status: false, status_code: 500, message: "Unable to create room, please try again" };
    }
    return { status: true, data: data };
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};

module.exports.roomExists = async function (params) {
  try {

    let data = await instaChat.roomExists(params.room);

    return { status: true, data: data };
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};

module.exports.joinRoom = async function (params, body) {
  try {
    const userId = cryptGen.gen(12);
    const { passphrase } = body;

    let data = await instaChat.getRoom(params.room);

    if (!data?._id) {
      return { status: false, status_code: 404, message: "Chat room not found" };
    }
    if (! await chkKey(data.passphrase, passphrase)) {
      return { status: false, status_code: 401, message: "Passphrase invalid" };
    }

    let { matchedCount, modifiedCount, acknowledged } = await instaChat.joinRoom(params.room, userId);

    if (!(matchedCount && modifiedCount && acknowledged)) {
      return { status: false, status_code: 500, message: "Unable to join room at the moment, please try again" };
    }
    return { status: true, data: { user_id: userId } };
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
    let data = await instaChat.getMessages(chatCode);
    return { status: true, data: data };
  } catch (error) {
    console.error(error);
    return { status: false, status_code: 500, message: "Internal Server Error" };
  }
};
