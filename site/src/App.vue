<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, PillHeader } from '@sil/ui'

const docs = [
  'Why', 'Quickstart', 'Config', 'API', 'Client', 'Storage', 'Security', 'Email', 'Release', 'Troubleshooting'
]

const activeDoc = ref('Quickstart')
const currentPath = computed(() => `#${activeDoc.value.toLowerCase()}`)

const navItems = [
  { label: 'Why', href: '#why' },
  { label: 'Quickstart', href: '#quickstart' },
  { label: 'Docs', href: '#docs' },
  { label: 'Security', href: '#security' }
]
</script>

<template>
  <PillHeader
    brand-suffix="Ankore"
    brand-aria-label="Ankore home"
    brand-to="/"
    color-mode="dark"
    :nav-items="navItems"
    :current-path="currentPath"
  >
    <template #brand-mark>
      <span class="brand-mark" aria-hidden="true">A</span>
    </template>
  </PillHeader>

  <main class="ankore-site">
    <section id="why" class="hero section">
      <p class="eyebrow">anchor + encore</p>
      <h1>Identity continuity for products that work before accounts.</h1>
      <p class="lede">Ankore gives Tiko, Mikki, and other Sil products one small identity core: subject, device, session, optional account, recovery, API keys, entitlements, and audit trails.</p>
      <div class="hero__actions">
        <Button variant="primary" href="#quickstart">Start quick</Button>
        <Button variant="outline" href="https://github.com/silvandiepen/ankore" external>GitHub</Button>
      </div>
    </section>

    <section class="section problem-grid">
      <article>
        <span>Problem</span>
        <h2>Login walls break the first useful moment.</h2>
        <p>Child-facing apps and disposable tools need to start now, not after a password, provider picker, or inbox trip.</p>
      </article>
      <article>
        <span>Solution</span>
        <h2>Continuity first. Accounts later.</h2>
        <p>Bootstrap a subject/device/session immediately. Add email, recovery, billing, and control only when the product needs them.</p>
      </article>
    </section>

    <section id="quickstart" class="section quickstart">
      <div>
        <p class="eyebrow">10-minute path</p>
        <h2>One tiny Worker.</h2>
        <p>Install the package, bind D1, set a pepper, deploy the Worker, and call <code>POST /v1/identity/device</code>.</p>
      </div>
      <pre><code>import { createIdentityWorker } from 'ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)</code></pre>
    </section>

    <section class="section fit-grid">
      <article>
        <h2>Tiko</h2>
        <p>Device-first identity for child-facing apps. No login wall. Optional caregiver recovery and admin control.</p>
      </article>
      <article>
        <h2>Mikki</h2>
        <p>Anonymous-first personal tools. Optional accounts for sync, recovery, ownership, billing, entitlements, and API keys.</p>
      </article>
    </section>

    <section id="docs" class="section docs-shell">
      <div class="docs-shell__intro">
        <p class="eyebrow">Docs</p>
        <h2>Everything needed to implement Ankore.</h2>
        <p>The repo now carries the docs with the package, so implementation guidance versions with the code.</p>
      </div>
      <div class="docs-tabs" role="tablist" aria-label="Ankore documentation sections">
        <button v-for="doc in docs" :key="doc" type="button" :class="['doc-tab', { 'doc-tab--active': activeDoc === doc }]" @click="activeDoc = doc">{{ doc }}</button>
      </div>
      <article class="doc-card">
        <h3>{{ activeDoc }}</h3>
        <p v-if="activeDoc === 'Quickstart'">Install Ankore, create a Worker entrypoint, bind D1 as IDENTITY_DB, set ANKORE_TOKEN_PEPPER, apply migrations, then bootstrap a session.</p>
        <p v-else-if="activeDoc === 'API'">Documented routes include device bootstrap, session validation/refresh/logout, email challenges, account summary, API keys, and entitlements.</p>
        <p v-else-if="activeDoc === 'Security'">Ankore hashes secret material, avoids passwords in v1, uses generic recovery responses, and keeps CORS explicit.</p>
        <p v-else>See the matching Markdown file in <code>docs/{{ activeDoc.toUpperCase() }}.md</code> for purpose, example, config, security notes, verification, and limits.</p>
      </article>
    </section>

    <section id="security" class="section architecture">
      <p class="eyebrow">Architecture</p>
      <h2>Product app → Ankore Worker → D1 → optional email provider.</h2>
      <div class="flow" aria-label="Ankore architecture flow">
        <span>Product app</span>
        <span>Ankore Worker</span>
        <span>D1 identity store</span>
        <span>Email provider</span>
      </div>
    </section>
  </main>
</template>
