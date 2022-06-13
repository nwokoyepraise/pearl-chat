const mongoose = require("mongoose");
const mongo_conn = require("../config/mongo_config");
const schema = mongoose.Schema;

const chat = new schema({
  chat_code: {
    type: String,
    required: [true, "chat code required"],
  },
  members: {
    type: Array,
    unique: true,
    required: [true, "members required"],
  },
  messages: [
    {
      seen: { type: Date, default: null },
      type: { type: Map, required: [true, "type required"] }, //{type: 0||1 (reply or not), message_id: message_id}
      text: { type: String },
      file: { type: Map },
      timestamp: { type: Date, default: new Date() },
    },
  ],
  timestamp: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongo_conn.model("insta_chat", chat, "insta_chat");
