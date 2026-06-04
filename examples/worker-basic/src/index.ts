import { createIdentityWorker } from 'ankore/worker'
import config from '../ankore.config.json' with { type: 'json' }

export default createIdentityWorker(config)
