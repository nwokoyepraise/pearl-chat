(function () {
  "use strict";

  var crypto = window.crypto.subtle;
  var rsaParams = { name: "RSA-OAEP", hash: { name: "SHA-1" } };

  function arrayBufferToBase64String(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = "";
    for (var i = 0; i < byteArray.byteLength; i++) {
      byteString += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(byteString);
  }

  async function genKeyPair() {
    return await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  async function exportToJwkFormat(key) {
    try {
      return await window.crypto.subtle.exportKey("jwk", key);
    } catch (error) {
      console.error(error);
    }
  }

  async function importPublicKey(keyInJwkFormat) {
    try {
      return await window.crypto.subtle.importKey(
        "jwk",
        keyInJwkFormat,
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt"]
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function importPrivateKey(keyInJwkFormat) {
    try {
      return await window.crypto.subtle.importKey(
        "jwk",
        keyInJwkFormat,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function publicEncrypt(keyInJwkFormat, message) {
    try {
      let enc = new TextEncoder().encode(message);
      let encrypted = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        keyInJwkFormat,
        enc
      );
      return arrayBufferToBase64String(encrypted);
    } catch (error) {
      console.error(error);
    }
  }

  async function privateDecrypt(keyInJwkFormat, encryptedBase64Message) {
    try {
      let decrypted = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        keyInJwkFormat,
        encryptedBase64Message
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error(error);
    }
  }

window.rsaHandler = {
    genKeyPair: genKeyPair,
    exportToJwkFormat: exportToJwkFormat,
    importPrivateKey: importPrivateKey,
    importPublicKey: importPublicKey,
    privateDecrypt: privateDecrypt,
    publicEncrypt: publicEncrypt,
  };
})();
