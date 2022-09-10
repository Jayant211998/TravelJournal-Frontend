
import { JSEncrypt } from "jsencrypt";


var encrypt = new JSEncrypt();
var publicKey = process.env.REACT_APP_PUBLIC_KEY;

var privateKey = process.env.REACT_APP_PRIVATE_KEY;

// Assign our encryptor to utilize the public key.
encrypt.setPublicKey(publicKey);

var decrypt = new JSEncrypt();
decrypt.setPrivateKey(privateKey);


export default [encrypt,decrypt]; 