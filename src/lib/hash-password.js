const encoder = new TextEncoder()

const PEPPER = 'client_*#U(J#F*UJ(*#Y(&y2dh3fjodjg89J)(J#d,lksdgm0rt9*()'

const toHex = buffer => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const hashPassword = async password => {
  const input = encoder.encode(password + PEPPER)

  const key = await crypto.subtle.importKey(
    'raw',
    input,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-512',
      salt: encoder.encode('fixed_salt_v1'),
      iterations: 300000,
    },
    key,
    4096
  )

  return toHex(derivedBits)
}

export default hashPassword