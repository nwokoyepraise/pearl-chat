const instaChat = require('./instaChat.model');

module.exports.createRoom = async function (chatCode) {
    try {
        return await instaChat.create({ chat_code: chatCode });
    } catch (error) {
        console.log(error);
    }
}

module.exports.joinRoom = async function (chatCode, userId) {
    try {
        return await instaChat.updateOne({chat_code: chatCode}, { $push: {members: userId}});
    } catch (error) {
        console.log(error);
    }
}