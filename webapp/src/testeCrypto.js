var crypto = require("crypto-js");

//var salt = "c4352c3aa14915df8b20779f46ce349c";
var hash = crypto.SHA256("c4352c3aa14915df8b20779f46ce349c");
var key128Bits = crypto.PBKDF2("Secret Passphrase", hash, {
  keySize: 128 / 32
});
console.log(key128Bits.toString())