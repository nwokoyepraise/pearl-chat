const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chat = new schema({
  chat_code: {
    type: String,
    required: [true, "chat code required"],
  },
  members: {
    type: Array,
    validate: {
      validator: function(){
        return this.members.length > 2;
      }, message: "member length can't be more than 2"
    }
  },
  passphrase: {
    type: String,
    required: [true, "passphrase required"]
  },
  messages: [
    {
      user_id: {type: String, required: [true, "user ID required"]},
      seen: { type: Date, default: null },
      type: { type: Map, required: [true, "type required"] }, //{reply: true||false (reply or not), message_id: message_id||null}
      text: { type: String },
      file: { type: Map },
      timestamp: { type: Date, default: new Date() },
    },
  ],
  timestamp: {
    type: Date,
    default: new Date(),
  },
}, {expireAfterSeconds: 86400});//delete document after 24 hours

module.exports = mongoose.model("insta_chat", chat, "insta_chat");
