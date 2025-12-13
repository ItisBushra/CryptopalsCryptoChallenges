'use strict'; 
const CryptoJS = require("crypto-js");
function generateRandom(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
var KEY = generateRandom(16);
var IV = generateRandom(16);
detectMode("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
function randomOracle(asciiInput, Key = KEY, Iv = IV) {
    var modeIs = Math.floor(Math.random() * 2);
    var plainTextBuffer = Buffer.from(asciiInput, "ascii");
    var appendLength = Math.floor(Math.random() * 11);
    var prependLength = Math.floor(Math.random() * 11);
    var prepend = Buffer.from(generateRandom(prependLength), "ascii");
    var append = Buffer.from(generateRandom(appendLength), "ascii");
    var WholeInput = new Uint8Array(prepend.byteLength + append.byteLength + plainTextBuffer.byteLength);
    WholeInput.set(new Uint8Array(prepend), 0);
    WholeInput.set(new Uint8Array(plainTextBuffer), prepend.byteLength);
    WholeInput.set(new Uint8Array(append), plainTextBuffer.byteLength + prepend.byteLength);
    var AESkey = CryptoJS.enc.Utf8.parse(Key);
    var result = "";
    if (modeIs == "0") {
        //ECB     
        var hexWholeInput = Buffer.from(WholeInput).toString("hex");
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(hexWholeInput), AESkey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        result = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    }
    if (modeIs == "1") {
        var AESIV = CryptoJS.enc.Utf8.parse(Iv);

        //CBC
        var hexWholeInput = Buffer.from(WholeInput).toString("hex");
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(hexWholeInput), AESkey,
            { iv: AESIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

        result = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    }
    let encryptionResult = {
        RES: result,
        MODE: modeIs
    }

    return encryptionResult;
}
function detectMode(plainInput) {
    var encryptionResult = randomOracle(plainInput);
    var encryptedString = encryptionResult.RES;
    var originalCipherBytes = Buffer.from(encryptedString, "hex");
    var count = 0;
    outerLoop:
    for (var d = 0; d < originalCipherBytes.length; d++) {
       var Array1 = originalCipherBytes[d];
       var Array2 = originalCipherBytes[d + 16];
        if (Array1 != Array2) {
            count = 0;
            continue;
        }
        if (Array1 == Array2) {
           count++;
       }
       if (count == 16) break outerLoop;
    }
    if (count == 16 && encryptionResult.MODE == "0") {
        console.log("Mode is ECB");
    }else console.log("Mode is CBC");
}