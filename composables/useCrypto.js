import CryptoJS from "crypto-js";

export const useCrypto = () => {

  const encrypt = (value) => {
    if (!value) return null;
    const config = useRuntimeConfig();
    const SECRET_KEY_CRYPTO = config.public.secretKey;
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY_CRYPTO).toString();
    return encryptedValue
  }
  const decrypt = (value) => {
    if (!value) return null;
    const config = useRuntimeConfig();
    const SECRET_KEY_CRYPTO = config.public.secretKey;
    const decryptedValue = CryptoJS.AES.decrypt(value, SECRET_KEY_CRYPTO).toString(CryptoJS.enc.Utf8);
    return decryptedValue
  }

  return {
    encrypt, 
    decrypt
  }

}