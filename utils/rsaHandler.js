const path = require("path");
const rsaHandler = {};
const fs = require("fs");
const NodeRSA = require("node-rsa");
const crypto = require("crypto");
// open and closed keys generation method
rsaHandler.generate = (owner) => {
  //create empty key
  let key = new NodeRSA();
  // 2048 — key length, 65537 open exponent
  key.generateKeyPair(2048, 65537);
  //save keys as pem line in pkcs8
  fs.writeFileSync(`keys/${owner}.private.pem`, key.exportKey("pkcs8-private-pem"));
  fs.writeFileSync(`keys/${owner}.public.pem`, key.exportKey("pkcs8-public-pem"));
  return true;
};

// encrypting RSA, using padding OAEP, with nodejs crypto:
rsaHandler.encrypt = (publicKey, message) => {
  let enc = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(message)
  );
  return enc.toString("base64");
};
// descrypting RSA, using padding OAEP, with nodejs crypto:
rsaHandler.decrypt = (privateKey, message) => {
  let enc = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(message, "base64")
  );
  return enc.toString();
};
// Loading RSA keys from files to variables:
rsaHandler.initLoadServerKeys = (basePath) => {
  rsaHandler.serverPub = fs.readFileSync(path.resolve(basePath, "keys", "server.public.pem"));
  rsaHandler.serverPrivate = fs.readFileSync(path.resolve(basePath, "keys", "server.private.pem"));
  rsaHandler.clientPub = fs.readFileSync(path.resolve(basePath, "keys", "client.public.pem"));
};
// Run RSA encryption test scenario. Message is encrypted, log on console in base64 format and message is decrypted and log on console.
rsaHandler.serverExampleEncrypt = () => {
  console.log("Server public encrypting");
  let enc = rsaHandler.encrypt(rsaHandler.serverPub, "Server init hello");
  console.log("Server private encrypting …");
  console.log("Encrypted RSA string ", "\n", enc);
  let dec = rsaHandler.decrypt(rsaHandler.serverPrivate, enc);
  console.log("Decrypted RSA string …");
  console.log(dec);
};rsaHandler.initLoadServerKeys("./"); rsaHandler.serverExampleEncrypt();
module.exports = rsaHandler;
