'use strict'; 
var fs = require('fs');
const KEY = "YELLOW SUBMARINE";
const CryptoJS = require("crypto-js");

fs.readFile('challenge_7.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var key = CryptoJS.enc.Utf8.parse(KEY);
    var data64 = data.replace(/(\r\n|\n|\r)/g, '');
    var hexString = Buffer.from(data64, "base64").toString("hex");
    var decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(hexString) }, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding });
    console.log(decrypted.toString(CryptoJS.enc.Utf8));
});
