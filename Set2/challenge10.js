'use strict'; 
var fs = require('fs');
const IV = Buffer.alloc(16, 0);
const KEY = "YELLOW SUBMARINE";
const CryptoJS = require("crypto-js");

fs.readFile('./Set2/challenge_10.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var data64 = data.replace(/(\r\n|\n|\r)/g, '');
    var key = CryptoJS.enc.Utf8.parse(KEY);

    var hexString = Buffer.from(data64, "base64").toString("hex");
    var dataString = Buffer.from(data64, "base64");
    var cipherBlocks = [];
    for (var u = 0; u < dataString.length; u+=16 ) {
        cipherBlocks.push(dataString.slice(u, u + 16));
    }

    var encrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(hexString) }, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding });
    var encryptedHex = encrypted.toString(CryptoJS.enc.Hex);
    var encryptedBytes = Buffer.from(encryptedHex, "hex");
    var cipheredBlocks = [];

    for (var r = 0; r < encryptedBytes.length; r += 16) {
        cipheredBlocks.push(encryptedBytes.slice(r, r + 16));
    }
    var plainMessage = Array.from({ length: cipheredBlocks.length }, () => new Array(16).fill(0));

    for (var d = 0; d < cipheredBlocks.length; d++) {
        if (d == 0) {
            for (var s = 0; s < cipheredBlocks[d].length; s++) {
                plainMessage[d][s] = cipheredBlocks[d][s];
            }

        }else {
            for (var f = 0; f < cipheredBlocks[d].length; f++) {
                plainMessage[d][f] = cipheredBlocks[d][f] ^ cipherBlocks[d-1][f];
            }
        }
    }

    let flatPlainMessage = Buffer.from(plainMessage.flat()).toString("ascii");
    console.log(flatPlainMessage);
});