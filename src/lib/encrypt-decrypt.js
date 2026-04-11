/* eslint-disable no-unused-vars */
import argon2 from './argon2.js'

const deriveKey = async (password, salt) => {
  const keyMaterial = await argon2.hash({
    pass: password,
    salt,
    type: argon2.ArgonType.Argon2id,
    hashLen: 32,
    time: 3,
    mem: 65536,      
    parallelism: 1,
    raw: true
  })

  return crypto.subtle.importKey(
    'raw',
    keyMaterial.hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

export const encrypt = async (text, password) => {
  const enc = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const salt = crypto.getRandomValues(new Uint8Array(16))

  const key = await deriveKey(password, salt)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  )

  return btoa(JSON.stringify({
    ct: Array.from(new Uint8Array(ciphertext)),
    iv: Array.from(iv),
    salt: Array.from(salt),
  }))
}

export const decrypt = (fun => async (...args) => {
  const key = args.join('-')
  const cache = sessionStorage.getItem(key) 
  const decryptedData = cache
                          ? cache
                          : await fun(...args)

  if (!cache) {
    sessionStorage.setItem(key, decryptedData) 
  }
  return decryptedData
})(async (base64, password) => {
  try {
    const dec = new TextDecoder()
    const data = JSON.parse(atob(base64))
    const iv = new Uint8Array(data.iv)
    const salt = new Uint8Array(data.salt)
    const ciphertext = new Uint8Array(data.ct)

    const key = await deriveKey(password, salt)
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )
    return dec.decode(decrypted)
  } catch (e) {
    console.log(e)
    return ''
  }
})