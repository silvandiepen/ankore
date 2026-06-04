import { describe, expect, it } from 'vitest'
import { constantTimeEqual, hashSecret, randomToken } from '../src/crypto'

describe('crypto helpers', () => {
  it('generates URL-safe high-entropy tokens', () => {
    const first = randomToken()
    const second = randomToken()

    expect(first).not.toEqual(second)
    expect(first.length).toBeGreaterThanOrEqual(43)
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('hashes secrets with product purpose and pepper separation', async () => {
    const one = await hashSecret('token', { pepper: 'pepper-a', product: 'tiko', purpose: 'session' })
    const two = await hashSecret('token', { pepper: 'pepper-a', product: 'tiko', purpose: 'device' })
    const three = await hashSecret('token', { pepper: 'pepper-b', product: 'tiko', purpose: 'session' })

    expect(one).toMatch(/^sha256:/)
    expect(one).not.toEqual(two)
    expect(one).not.toEqual(three)
  })

  it('compares hashes without leaking simple equality behavior', () => {
    expect(constantTimeEqual('abc', 'abc')).toBe(true)
    expect(constantTimeEqual('abc', 'abd')).toBe(false)
    expect(constantTimeEqual('abc', 'abcd')).toBe(false)
  })
})
