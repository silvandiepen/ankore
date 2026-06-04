<script setup lang="ts">
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'

const bemm = useBemm('ankore-page', { return: 'string' })

const paths = [
  {
    title: 'Browser products',
    items: ['Create or resume a device identity', 'Keep drafts and local product data attached', 'Upgrade to recovery without moving records'],
  },
  {
    title: 'Worker APIs',
    items: ['Verify Ankore sessions at API boundaries', 'Use subject ids as product owners', 'Attach plan and entitlement checks'],
  },
  {
    title: 'Service access',
    items: ['Issue API keys from the same identity core', 'Audit key usage by subject', 'Revoke credentials without account rewrites'],
  },
  {
    title: 'Recovery flows',
    items: ['Send challenge emails from a configured provider', 'Bind verified recovery handles', 'Restore access to the original subject'],
  },
] as const
</script>

<template>
  <main :class="bemm()">
    <section :class="bemm('hero')">
      <p :class="bemm('eyebrow')">Integrations</p>
      <h1>Adopt the parts your product actually needs.</h1>
      <p>
        Ankore is not a replacement for every account system. It is the continuity core that
        lets product state survive across anonymous, recovered, and account-backed use.
      </p>
      <Button variant="primary" to="/docs/client">Open client docs</Button>
    </section>
    <section :class="bemm('grid')" aria-label="Integration paths">
      <article v-for="path in paths" :key="path.title" :class="bemm('card')">
        <h2>{{ path.title }}</h2>
        <ul>
          <li v-for="item in path.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>

<style lang="scss">
.ankore-page {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: calc(var(--space) * 8) 0 var(--spacing);

  &__hero {
    display: grid;
    gap: var(--space-l);
    margin-bottom: var(--spacing);

    h1 {
      max-width: 12ch;
      margin: 0;
      font-size: clamp(3.5rem, 10vw, 8.5rem);
      line-height: .9;
      letter-spacing: 0;
    }

    p {
      max-width: 760px;
      color: color-mix(in srgb, currentColor, transparent 24%);
      font-size: clamp(1.2rem, 2vw, 1.5rem);
    }
  }

  &__eyebrow {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-transform: uppercase;
    font-size: .78rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space);
  }

  &__card {
    padding: var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 2rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);

    h2, h3 {
      margin-top: 0;
      letter-spacing: 0;
    }

    p, li {
      color: color-mix(in srgb, currentColor, transparent 24%);
      line-height: 1.65;
    }
  }
}

@media (max-width: 760px) {
  .ankore-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
