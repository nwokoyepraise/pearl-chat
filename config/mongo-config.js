require("dotenv").config();
const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://main:${process.env.MONGO_KEY}@cluster0.4dk63.mongodb.net/pcdb?retryWrites=true&w=majority`;

const connect = async () => {
  await mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect;
