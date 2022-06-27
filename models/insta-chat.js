const instaChat = require("./insta-chat.model");

module.exports.createRoom = async function (chatCode, passphrase) {
  try {
    return await instaChat.create({ chat_code: chatCode, passphrase: passphrase });
  } catch (error) {
    console.log(error);
  }
};

module.exports.roomExists = async function (chatCode) {
  try {
    let data = await instaChat.findOne({ chat_code: chatCode }, { _id: 1 });
    if (!data?._id) {
      return { room_exists: false };
    }
    return { room_exists: true };
  } catch (error) {
    console.log(error);
  }
};

module.exports.getRoom = async function (chatCode) {
  try {
    return await instaChat.findOne({ chat_code: chatCode });
  } catch (error) {
    console.log(error);
  }
};

module.exports.joinRoom = async function (chatCode, userId) {
  try {
    return await instaChat.updateOne({ chat_code: chatCode }, { $push: { members: userId } });
  } catch (error) {
    console.log(error);
  }
};

module.exports.saveMessage = async function (chatCode, message, userId) {
  try {
    return await instaChat.updateOne({ chat_code: chatCode }, { $push: { messages: { user_id: userId, type: { reply: false, message_id: null }, text: message.text } } });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getMessages = async function (chatCode) {
  try {
    return await instaChat.findOne({ chat_code: chatCode }, { messages: 1 });
  } catch (error) {
    console.log(error);
  }
};
