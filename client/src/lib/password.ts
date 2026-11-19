// No look-alike characters (0/O, 1/l/I), since the admin reads it out or types it to the agent.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

export function generatePassword(length = 16): string {
  // Bytes at or above this would make the first characters of the alphabet more likely (modulo bias).
  const limit = 256 - (256 % ALPHABET.length)
  let password = ''

  while (password.length < length) {
    for (const byte of crypto.getRandomValues(new Uint8Array(length))) {
      if (byte < limit && password.length < length) password += ALPHABET[byte % ALPHABET.length]
    }
  }

  return password
}
