'use strict'; 
var fs = require('fs');

const Frequencies = {
    A: 8.55, K: 0.81, U: 2.68, B: 1.60, L: 4.21, V: 1.06,
    C: 3.16, M: 2.53, W: 1.83, D: 3.87, N: 7.17, X: 0.19, E: 12.10, O: 7.47,
    Y: 1.72, F: 2.18, P: 2.07, Z: 0.11, G: 2.09, Q: 0.10, H: 4.96, R: 6.33,
    I: 7.33, S: 6.73, J: 0.22, T: 8.94, ' ': 13.00
};
function findSingleByteKey(bytes) {
    var bestScore = 0;
    var bestKey = 0;
    for (var j = 0; j < 256; j++) {
        var result = Buffer.alloc(bytes.length);

        for (var b = 0; b < bytes.length; b++) {
            result[b] = bytes[b] ^ j;
        }
       
        var frequencyscore = FrequencyCalculater(result.toString('ascii', 0, result.length));
        if (frequencyscore > bestScore ) {
            bestScore = frequencyscore;
            bestKey = j;
        }
    }
    return bestKey;

}

function FrequencyCalculater(asciiString) {
    var score = 0;
    var upperCaseStr = asciiString.toUpperCase();

    for (var i = 0; i < upperCaseStr.length; i++) {
        const char = upperCaseStr[i];
        if (Frequencies[char]) {
            score += Frequencies[char];
        } else if (char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126) {
            score -= 100;
        }
    }

    return score;
}

let KEYSIZE = Array.from({ length: 39 }, (e, i) => 2 + i * 1);
BreakCipher(KEYSIZE, "challenge_6.txt");
function BreakCipher(KEYSIZE, fileName) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        let element = [];
        let MinElement = [];
        var data64 = data.replace(/(\r\n|\n|\r)/g, '');
        const bytes = Buffer.from(data64, "base64");

        for (var i = 0; i < KEYSIZE.length; i++) { 
            var AveragePerKeysize = 0;
            for (var s = 0; s < KEYSIZE[i]*4; s += KEYSIZE[i]){
                var firstElement = [];
                var secondElement = [];
                for (var j = s; j < s+ (2 * KEYSIZE[i]); j++) {
                    if (j < s + KEYSIZE[i]) firstElement.push(bytes[j]);
                    else secondElement.push(bytes[j]);
                }

               //turn into binary
                var ascFirst = firstElement.map(num => num.toString(2).padStart(8, '0'));
                var ascSecond = secondElement.map(num => num.toString(2).padStart(8, '0'));
                var distanceSize = 0;
                for (var n = 0; n < ascFirst.length; n++) {
                    distanceSize += HammingDistance(ascFirst[n], ascSecond[n], "binary");
                }          

                //Normalize this result by dividing by KEYSIZE.
                var normilizedDistance = distanceSize / KEYSIZE[i];
                AveragePerKeysize += normilizedDistance;           
       
            }       
            var KeySizeHammingDistanceAverage = AveragePerKeysize / 4;
    
            var ValuePerKeySize = {
            KeySize: KEYSIZE[i],
            Value: KeySizeHammingDistanceAverage
            }
            element.push(ValuePerKeySize);
        }

        // getting the smallest key length
        element.sort((a, b) => a.Value - b.Value);
        for (var w = 0; w < 3; w++) {
            let MinSingleElements = {
                MinKeySize: element[w].KeySize,
                MinDistance: KeySizeHammingDistanceAverage
            }
            MinElement.push(MinSingleElements);
        }

        //break the ciphertext into blocks of KEYSIZE length.
        for (var y = 2; y < MinElement.length; y++) {
            let CurrentKeySize = MinElement[y].MinKeySize;

            var CipherBlocks = [];
            for (var k = 0; k < bytes.length; k += CurrentKeySize) {
                CipherBlocks.push(bytes.slice(k, k + CurrentKeySize));
            }

            var transposedBlock = [];  
            //transpose the blocks
            for (var c = 0; c < CurrentKeySize; c++) {
                var block = [];
                for (var l = 0; l < CipherBlocks.length; l++) {
                    if (c < CipherBlocks[l].length) {
                        block[l] = CipherBlocks[l][c];
                    } else continue;
                }
                transposedBlock.push(block);
            }

            var KeyWord = Buffer.alloc(CurrentKeySize);
            for (var q = 0; q < transposedBlock.length; q++) KeyWord[q] = findSingleByteKey(transposedBlock[q]);

            var K = KeyWord.toString("ascii");
            let decrypted = '';
            console.log(K);
            for (let i = 0; i < bytes.length; i++) {
                const decryptedChar = bytes[i] ^ KeyWord[i % CurrentKeySize];
                decrypted += String.fromCharCode(decryptedChar);
            }
            console.log(decrypted);
        }
    });
}
function HammingDistance(string1, string2, type = "utf8") {
    var firstElement = "";
    var secondElement = "";
    if (string1.length !== string2.length) {
        throw new Error("Inputs must have the same length");
    }
    switch (type) {
        case "base64":
            firstElement = Buffer.from(string1, "base64");
            secondElement = Buffer.from(string2, "base64");
            break;
        case "hex":
            firstElement = Buffer.from(string1, "hex");
            secondElement = Buffer.from(string2, "hex");
            break;

        case "binary":
            if (string2.length % 8 !== 0) {
                throw new Error("Binary string must be a multiple of 8 bits");
            }
            const bytes1 = [];
            const bytes2 = [];

            for (let i = 0; i < string2.length; i += 8) {
                bytes1.push(parseInt(string1.slice(i, i + 8), 2));
                bytes2.push(parseInt(string2.slice(i, i + 8), 2));
            }
            firstElement = Uint8Array.from(bytes1);
            secondElement = Uint8Array.from(bytes2);
            break;

        case "utf8":
        default:
            firstElement = new TextEncoder().encode(string1);
            secondElement = new TextEncoder().encode(string2);
    }

    let dist = 0;
    for (let i = 0; i < firstElement.length; i++) {
        let x = firstElement[i] ^ secondElement[i];
        while (x) {
            dist += x & 1;
            x >>= 1;
        }
    }
    return dist;
}