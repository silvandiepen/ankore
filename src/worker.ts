import { normalizeConfig, type AnkoreConfig } from './config'

export interface AnkoreWorkerHandler {
  fetch(request: Request): Promise<Response>
}

export function createIdentityWorker(config: AnkoreConfig): AnkoreWorkerHandler {
  const normalized = normalizeConfig(config)

  return {
    async fetch(request: Request): Promise<Response> {
      const url = new URL(request.url)
      if (!url.pathname.startsWith(normalized.basePath)) {
        return new Response('Not found', { status: 404 })
      }

      // Placeholder until route slices are implemented.
      return Response.json({
        ok: true,
        product: normalized.product,
        basePath: normalized.basePath,
        message: 'Ankore worker scaffold ready'
      })
    }
  }
}
