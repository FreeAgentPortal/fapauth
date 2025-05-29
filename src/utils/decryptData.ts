import CryptoJS, { AES } from "crypto-js";

/**
 * @description uses crypto-js to decrypt sensitive data, such as passwords
 * @param {string} data - the data to be encrypted
 * @returns {string} - the encrypted data
 *
 * @author Austin Howard
 * @version 1.0.0
 * @since 1.0.0
 * @lastmodified 2024-04-08 13:05:16
 *
 * @example
 * encryptData('sensitive data', 'key');
 * // returns 'encrypted data'
 * @see https://www.npmjs.com/package/crypto-js
 * @see https://www.npmjs.com/package/crypto-js#usage
 * @todo write tests
 */
export default function decryptData(data: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.error("Missing ENCRYPTION_KEY environment variable");
    return "";
  }

  try {
    const bytes = AES.decrypt(data, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.warn("Decryption returned an empty string – likely invalid key or corrupted data");
    }

    return decrypted;
  } catch (err) {
    console.error("Failed to decrypt data:", err);
    return "";
  }
}
