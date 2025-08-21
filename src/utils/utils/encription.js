import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const key = CryptoJS.enc.Utf8.parse(secretKey);
const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

export function encryptAES(strToEncrypt) {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(strToEncrypt),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  } catch (e) {
    return `Error while encrypting: ${e}`;
  }
}

export function decryptAES(strToDecrypt) {
  try {
    const decrypted = CryptoJS.AES.decrypt(strToDecrypt, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return `Error while decrypting: ${e}`;
  }
}
