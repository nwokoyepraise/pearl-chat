const cryptoRandomString = require("crypto-random-string");

global.window.cryptGen = function (length) {
  const mChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return cryptoRandomString({ length: length, characters: mChar });
};

global.window.genChatCode = function () {
  const mChar = "abcdefghijklmnopqrstuvwxyz";
  let data = cryptoRandomString({ length: 10, characters: mChar });
  let code = "";
  data.split("").forEach(function (element, index) {
    if (index == 2 || index == 6) {
      code = `${code}${element}-`;
    } else {
      code = code + element;
    }
  });
  return code;
};
