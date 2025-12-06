'use strict'; 
XORCombination("1c0111001f010100061a024b53535009181c", "686974207468652062756c6c277320657965");
function XORCombination(string1, string2) {

    if (string1.length != string2.length) {
        console.log("strings given are not the same length.");
        return;
    }
    const buf1 = Buffer.from(string1, 'hex');
    const buf2 = Buffer.from(string2, 'hex');
    const bufResult = buf1.map((b, i) => b ^ buf2[i]);
    console.log(bufResult.toString('hex'));
}