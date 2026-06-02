export interface AnkoreClientOptions {
  baseUrl: string
  fetch?: typeof fetch
  storage?: {
    getItem(key: string): string | null
    setItem(key: string, value: string): void
    removeItem(key: string): void
  }
}

export interface AnkoreSessionBundle {
  subjectId: string
  deviceId?: string
  sessionToken: string
  expiresAt: string
}

export function createAnkoreClient(options: AnkoreClientOptions) {
  const doFetch = options.fetch ?? globalThis.fetch.bind(globalThis)
  const baseUrl = options.baseUrl.replace(/\/$/, '')

  return {
    async bootstrapDevice(): Promise<unknown> {
      const response = await doFetch(`${baseUrl}/device`, { method: 'POST' })
      if (!response.ok) throw new Error(`Device bootstrap failed: ${response.status}`)
      return response.json()
    }
  }
}
