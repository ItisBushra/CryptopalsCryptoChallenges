'use strict';
const CryptoJS = require("crypto-js");
const printableAsciiRegex = /^[\x09\x0A\x0D\x20-\x7E]$/;

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
function randomOracle(asciiInput, Key = KEY) {
    const plainTextBuffer = Buffer.from(asciiInput, "ascii");
    const appendData = Buffer.from(
        "Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK",
        "base64"
    );
    const WholeInput = Buffer.concat([plainTextBuffer, appendData]);
    const AESkey = CryptoJS.enc.Utf8.parse(Key);
    const wordArray = CryptoJS.lib.WordArray.create(WholeInput);

    const encrypted = CryptoJS.AES.encrypt(wordArray, AESkey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return Buffer.from(encrypted.ciphertext.toString(CryptoJS.enc.Hex), "hex");
}
function FindBlockSize() {
    var char = "";
    var currentBufferlength = 0;
    var cipherBufferBlockLength = 0;
    for (var i = 1; i < 100; i++) {
        char += "A";
        var result = randomOracle(char);
        var charBuffer = Buffer.from(char, "ascii");
        var cipherBufferLength = 0;
        if (currentBufferlength != 0 && currentBufferlength != result.byteLength) {
            var cipherBufferBlockLength = Math.abs(currentBufferlength - result.byteLength);
            cipherBufferLength = currentBufferlength - (charBuffer.byteLength);
            return [currentBufferlength, cipherBufferBlockLength, cipherBufferLength];
        }
        currentBufferlength = result.byteLength;
    }
}
const [TARGETCOMPLETELEN, BLOCKLEN, TARGETLEN] = FindBlockSize();
function detectMode(BLOCKLEN) {
    var count = 0;
    var mode = "";
    var string = "A".repeat(BLOCKLEN * 3)
    var resultDetectBuffer = randomOracle(string);
    for (var d = 0; d < resultDetectBuffer.length; d++) {
        var Array1 = resultDetectBuffer[d];
        var Array2 = resultDetectBuffer[d + 16];
        if (Array1 != Array2) {
            count = 0;
            continue;
        }
        if (Array1 == Array2) {
            count++;
        }
        if (count == 16) break;
    }
    if (count == 16) {
        mode = "ECB";
    } else mode = "CBC";
    return mode;
}

var result = decryptTarget(TARGETLEN, BLOCKLEN);
console.log(result);

function decryptTarget(targetLength, targetblockLength) {
    var knownBytes = [];
    var mode = detectMode(targetblockLength);
    if (mode != "ECB") {
        console.log("encryption is not in ECB mode.");
        return;
    }
    else {
        var padding = TARGETCOMPLETELEN - TARGETLEN;
        for (var i = 0; i < targetLength; i++) {
            var targetBlockIndex = Math.floor(i / BLOCKLEN);
            var craftedInput = "A".repeat(BLOCKLEN - (knownBytes.length % BLOCKLEN) - 1);
            var craftedTarget = randomOracle(craftedInput);
            for (var j = 0; j < 256; j++) {
                const guess = String.fromCharCode(j);
                if (!printableAsciiRegex.test(guess)) continue;
                var testInput = craftedInput + knownBytes.join("") + guess;
                var testedCipher = randomOracle(testInput);
                var craftedTargetBlock = craftedTarget.slice(targetBlockIndex * BLOCKLEN, (targetBlockIndex * BLOCKLEN) + BLOCKLEN);
                var testedCipherBlock = testedCipher.slice(targetBlockIndex * BLOCKLEN, (targetBlockIndex * BLOCKLEN) + BLOCKLEN);

                if (craftedTargetBlock.equals(testedCipherBlock)) {
                    knownBytes.push(guess);
                    break;
                }
            }
        }
        var targetMessage = knownBytes.join("");
        return targetMessage;
    }
}