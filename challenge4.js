'use strict';
const { XORHEX } = require("./challenge3.js");

const Frequencies = {
    A: 8.55, K: 0.81, U: 2.68, B: 1.60, L: 4.21, V: 1.06,
    C: 3.16, M: 2.53, W: 1.83, D: 3.87, N: 7.17, X: 0.19, E: 12.10, O: 7.47,
    Y: 1.72, F: 2.18, P: 2.07, Z: 0.11, G: 2.09, Q: 0.10, H: 4.96, R: 6.33,
    I: 7.33, S: 6.73, J: 0.22, T: 8.94
};
const letters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
];

var fs = require('fs');
fs.readFile('challenge_4.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const lines = data.split(/\r?\n/);
    for (var i = 0; i < lines.length; i++)  XORHEX(lines[i], letters);
});

