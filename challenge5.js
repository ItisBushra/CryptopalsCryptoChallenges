'use strict'; 

console.log(XORASCII("Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal", "ICE"));
function XORASCII(TextString, Key, type = "ascii") {
    var keyValue = [];
    var keystrValue = "";

    for (var k = 0; k < Key.length; k++)  keyValue = Key.split('');
    for (var i = 0; i < (TextString.length) / Key.length; i++) {
        for (var j = 0; j < keyValue.length; j++) {
            keystrValue +=keyValue[j];
            if (keystrValue.length == TextString.length) break;
        }
    }
    if (type == "ascii") {
        var textBuffer = Buffer.from(TextString, 'utf8').toString('hex');
        var buf1 = Buffer.from(textBuffer, 'hex'); 
    }
    else var buf1 = Buffer.from(TextString, 'hex');
    var hexString1 = Buffer.from(keystrValue, 'utf8').toString('hex');  // to hex
    const buf2 = Buffer.from(hexString1, 'hex'); //to buffer
    const bufResult = buf1.map((b, i) => b ^ buf2[i])

    return bufResult.toString("hex");

}