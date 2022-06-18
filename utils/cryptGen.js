const cryptoRandomString = require("crypto-random-string");

module.exports.gen = function (length) {
  // const mChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const mChar = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return cryptoRandomString({ length: length, characters: mChar });
};
