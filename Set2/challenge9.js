'use strict'; 
PKCS7("YELLOW SUBMARINE", 23);
function PKCS7(asciistring, blockLength) {
    var bufferString = Buffer.from(asciistring, "ascii");
    var paddingLength = blockLength - bufferString.length;
    for (var i = 0; i < paddingLength; i++) {
        //b = Buffer.concat([b, Buffer.from([newByte])]);

        bufferString = Buffer.concat([bufferString, Buffer.from([paddingLength])]);
    }

    var paddedAsciiString = Buffer.from(bufferString).toString("ascii");
    console.log(JSON.stringify(paddedAsciiString));
}