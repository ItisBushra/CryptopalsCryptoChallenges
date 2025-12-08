'use strict'; 
var fs = require('fs');
const CryptoJS = require("crypto-js");

fs.readFile('./Set1/challenge_8.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const lines = data.split(/\r?\n/);
    var found = false;
    outerLoop:
    for (var i = 0; i < lines.length; i++)
    {
        var possibleCiphertext = lines[i];
        var blocksBytes = Buffer.from(possibleCiphertext, "hex");
        let block = [];
        for (var r = 0; r < blocksBytes.length; r += 16) {
            block.push(blocksBytes.slice(r, r + 16));
        }
        for (var d = 0; d < block.length; d++) {
            for (var a = 0; a < block.length; a++) {
                var currentArray1 = block[d];
                var currentArray2 = block[a];
                if (a == d) continue;
                for (var t = 0; t < currentArray2.length; t++) {
                    if (currentArray1[t] == currentArray2[t]) found = true;
                    else {
                        found = false;
                        break;
                    }
                }
                if (found == true) {
                    console.log("FOUND line number: ", i);
                    break outerLoop;
                }
            }
        }
       
    }
});