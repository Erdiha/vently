// src/utils/encryptMessage.js
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

const KEY =EncodedVideoChunk. // Use a valid key string

export function encrypt(data) {
  return AES.encrypt(JSON.stringify(data), KEY).toString()
}

export function decrypt(cipherText) {
  try {
    const bytes = AES.decrypt(cipherText, KEY)
    return JSON.parse(bytes.toString(Utf8))
  } catch (err) {
    console.warn('Decryption failed')
    return null
  }
}
