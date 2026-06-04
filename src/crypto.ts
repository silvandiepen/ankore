export interface HashSecretOptions {
  pepper: string
  product: string
  purpose: string
}

const TOKEN_BYTES = 32

export function randomToken(prefix = ''): string {
  const bytes = new Uint8Array(TOKEN_BYTES)
  globalThis.crypto.getRandomValues(bytes)
  return `${prefix}${base64Url(bytes)}`
}

export async function hashSecret(secret: string, options: HashSecretOptions): Promise<string> {
  const material = `${options.product}:${options.purpose}:${options.pepper}:${secret}`
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(material))
  return `sha256:${hex(new Uint8Array(digest))}`
}

export function constantTimeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a)
  const right = new TextEncoder().encode(b)
  const length = Math.max(left.length, right.length)
  let diff = left.length ^ right.length

  for (let index = 0; index < length; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }

  return diff === 0
}

function base64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index] ?? 0)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}
