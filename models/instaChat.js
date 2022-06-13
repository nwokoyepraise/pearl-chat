const instaChat = require('./instaChat.model');

module.exports.createRoom = async function (chatCode) {
    try {
        return await instaChat.create({ chat_code: chatCode });
    } catch (error) {
        console.log(error);
    }
}