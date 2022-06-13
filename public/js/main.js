const cryptoRandomString = require('crypto-random-string');

global.window.cryptGen = function (length) {
    const mChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return cryptoRandomString({ length: length, characters: mChar });
}