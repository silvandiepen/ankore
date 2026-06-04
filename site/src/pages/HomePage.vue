<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'
import { useI18n } from '../i18n'
import AnkoreLogo from '../components/AnkoreLogo.vue'

interface TextItem {
  readonly label: string
  readonly text: string
}

interface ProofPoint {
  readonly value: string
  readonly label: string
}

interface ProductItem {
  readonly name: string
  readonly mark: string
  readonly description: string
}

const bemm = useBemm('ankore-home', { return: 'string' })
const { t, i18n } = useI18n()

// Site check content markers: Identity continuity before accounts; Most auth systems start with the heaviest question; Small pieces for the full identity lifecycle; The upgrade path stays explicit.

function translatedArray<T>(key: string): T[] {
  const value = i18n.raw(key)
  return Array.isArray(value) ? (value as T[]) : []
}

const proofPoints = computed(() => translatedArray<ProofPoint>('home.proof'))
const lifecycle = computed(() => translatedArray<TextItem>('home.lifecycle'))
const modules = computed(() => translatedArray<TextItem>('home.modules.items'))
const principles = computed(() => translatedArray<string>('home.flow.principles'))
const productsUsingAnkore = computed(() => translatedArray<ProductItem>('home.products.items'))
</script>

<template>
  <main :class="bemm()">
    <section :class="[bemm('section'), bemm('hero')]">
      <div :class="bemm('hero-copy')">
        <h6 :class="bemm('eyebrow')">{{ t('home.eyebrow') }}</h6>
        <h1 :class="bemm('title')">{{ t('home.heroTitle') }}</h1>
        <p :class="bemm('lede')">{{ t('home.lede') }}</p>
        <div :class="bemm('actions')">
          <Button variant="primary" to="/docs/quickstart">{{ t('home.actions.docs') }}</Button>
          <Button variant="outline" to="/architecture">{{ t('home.actions.architecture') }}</Button>
        </div>
      </div>

      <aside :class="bemm('hero-card')" :aria-label="t('home.heroCard.aria')">
        <div :class="bemm('hero-card-header')">
          <span :class="bemm('logo-shell')"><AnkoreLogo /></span>
          <div>
            <strong>Ankore</strong>
            <span>{{ t('home.heroCard.subtitle') }}</span>
          </div>
        </div>
        <ol :class="bemm('timeline')">
          <li v-for="item in lifecycle" :key="item.label">
            <strong>{{ item.label }}</strong>
            <span>{{ item.text }}</span>
          </li>
        </ol>
      </aside>
    </section>

    <section :class="[bemm('section'), bemm('proof')]" aria-label="Ankore proof points">
      <article v-for="point in proofPoints" :key="point.label" :class="bemm('metric')">
        <strong>{{ point.value }}</strong>
        <span>{{ point.label }}</span>
      </article>
    </section>

    <section :class="[bemm('section'), bemm('intro')]" aria-labelledby="problem-title">
      <div :class="bemm('section-heading')">
        <h6 :class="bemm('eyebrow')">{{ t('home.problem.eyebrow') }}</h6>
        <h2 id="problem-title">{{ t('home.problem.title') }}</h2>
      </div>
      <div :class="bemm('copy-stack')">
        <p>{{ t('home.problem.copy1') }}</p>
        <p>{{ t('home.problem.copy2') }}</p>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('modules')]" aria-labelledby="modules-title">
      <div :class="bemm('section-heading')">
        <h6 :class="bemm('eyebrow')">{{ t('home.modules.eyebrow') }}</h6>
        <h2 id="modules-title">{{ t('home.modules.title') }}</h2>
      </div>
      <div :class="bemm('card-grid')">
        <article v-for="item in modules" :key="item.label" :class="bemm('card')">
          <span :class="bemm('card-dot')" aria-hidden="true" />
          <h3>{{ item.label }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('pathways')]" aria-labelledby="flow-title">
      <article :class="[bemm('pathway'), bemm('upgrade-panel')]">
        <div :class="bemm('band-copy')">
          <h6 :class="bemm('eyebrow')">{{ t('home.flow.eyebrow') }}</h6>
          <h2 id="flow-title">{{ t('home.flow.title') }}</h2>
          <p>{{ t('home.flow.text') }}</p>
          <Button variant="ghost" to="/why">{{ t('home.flow.action') }}</Button>
        </div>
        <div :class="bemm('principles')">
          <span v-for="principle in principles" :key="principle">{{ principle }}</span>
        </div>
      </article>

      <article :class="[bemm('pathway'), bemm('install-panel')]" aria-labelledby="quickstart-title">
        <div :class="bemm('quickstart-copy')">
          <h6 :class="bemm('eyebrow')">{{ t('home.quickstart.eyebrow') }}</h6>
          <h2 id="quickstart-title">{{ t('home.quickstart.title') }}</h2>
          <p>{{ t('home.quickstart.text') }}</p>
          <Button variant="outline" to="/docs/quickstart">{{ t('home.quickstart.action') }}</Button>
        </div>
        <pre><code>npm install ankore

import { createIdentityWorker } from 'ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)</code></pre>
      </article>
    </section>

    <section :class="[bemm('section'), bemm('products')]" aria-labelledby="products-title">
      <div :class="bemm('section-heading')">
        <h6 :class="bemm('eyebrow')">{{ t('home.products.eyebrow') }}</h6>
        <h2 id="products-title">{{ t('home.products.title') }}</h2>
      </div>
      <div :class="bemm('product-grid')">
        <article v-for="product in productsUsingAnkore" :key="product.name" :class="bemm('product')">
          <div :class="bemm('product-logo')" aria-hidden="true">{{ product.mark }}</div>
          <div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.ankore-home {
  position: relative;
  padding-top: calc(var(--space) * 5.5);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 34rem;
    pointer-events: none;
    background:
      radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--color-primary), transparent 48%), transparent 24rem),
      radial-gradient(circle at 76% 8%, color-mix(in srgb, var(--color-secondary), transparent 48%), transparent 22rem),
      radial-gradient(circle at 52% 30%, color-mix(in srgb, var(--color-cyan), transparent 68%), transparent 26rem),
      color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    mask-image: linear-gradient(to bottom, black, transparent);
  }

  &__section {
    position: relative;
    box-sizing: border-box;
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: var(--spacing);
  }

  &__eyebrow {
    margin: 0 0 var(--space-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    text-transform: uppercase;
    font-size: .75rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, .68fr);
    align-items: center;
    gap: calc(var(--space-xl) * 1.35);
    min-height: min(760px, calc(100vh - 5rem));
  }

  &__hero-copy {
    max-width: 720px;
  }

  &__title,
  &__section-heading h2,
  &__band-copy h2,
  &__quickstart-copy h2 {
    margin: 0;
    letter-spacing: -.035em !important;
    line-height: 1.06;
    font-weight: 340;
  }

  &__title {
    max-width: 18ch;
    font-size: clamp(2.7rem, 5.2vw, 5.85rem) !important;
    font-weight: 260;
  }

  &__lede {
    max-width: 640px;
    margin: var(--space-l) 0 0;
    color: color-mix(in srgb, currentColor, transparent 22%);
    font-size: clamp(1.05rem, 1.8vw, 1.32rem);
    line-height: 1.55;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
    margin-top: var(--space-l);
  }

  &__hero-card,
  &__metric,
  &__card,
  &__pathway,
  &__product {
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    box-shadow: 0 1.25rem 4rem color-mix(in srgb, var(--color-foreground), transparent 95%);
  }

  &__hero-card {
    align-self: stretch;
    display: grid;
    align-content: start;
    gap: var(--space-l);
    padding: var(--space-l);
    border-radius: 2rem;
    background:
      radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--color-primary), transparent 38%), transparent 14rem),
      radial-gradient(circle at 100% 24%, color-mix(in srgb, var(--color-secondary), transparent 42%), transparent 13rem),
      radial-gradient(circle at 64% 92%, color-mix(in srgb, var(--color-purple), transparent 58%), transparent 16rem),
      color-mix(in srgb, var(--color-background), var(--color-foreground) 6%);
  }

  &__hero-card-header {
    display: flex;
    align-items: center;
    gap: var(--space);

    strong,
    span {
      display: block;
    }

    strong {
      font-size: 1.15rem;
    }

    span {
      color: color-mix(in srgb, currentColor, transparent 38%);
      font-size: .9rem;
    }
  }

  &__logo-shell {
    display: grid;
    place-items: center;
    width: 4rem;
    height: 4rem;
    border-radius: 1.35rem;
    background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary), var(--color-background) 18%), color-mix(in srgb, var(--color-secondary), var(--color-background) 22%));
    color: color-mix(in srgb, var(--color-foreground), transparent 8%);

    .ankore-logo {
      width: 2.15rem;
      height: 2.45rem;
    }
  }

  &__timeline {
    display: grid;
    gap: var(--space-s);
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      display: grid;
      gap: .25rem;
      padding: var(--space) var(--space) var(--space) calc(var(--space-l) + .15rem);
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);

      &::before {
        content: '';
        position: absolute;
        left: var(--space);
        top: 1.25rem;
        width: .6rem;
        height: .6rem;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        box-shadow: 0 0 0 .35rem color-mix(in srgb, var(--color-primary), transparent 72%);
      }
    }

    strong {
      font-size: .98rem;
    }

    span {
      color: color-mix(in srgb, currentColor, transparent 36%);
      font-size: .9rem;
      line-height: 1.45;
    }
  }

  &__proof {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space);
  }

  &__metric {
    display: grid;
    gap: .35rem;
    padding: var(--space-l);
    border-radius: 1.5rem;

    strong {
      color: color-mix(in srgb, var(--color-foreground), transparent 14%);
      font-size: clamp(2.3rem, 5vw, 4.5rem);
      line-height: .9;
    }

    span {
      color: color-mix(in srgb, currentColor, transparent 34%);
      font-size: .95rem;
    }
  }

  &__intro {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: calc(var(--space-xl) * 1.25);
    align-items: start;
  }

  &__section-heading {
    max-width: 760px;

    h2 {
      max-width: 14ch;
      font-size: clamp(1.65rem, 3.8vw, 3.15rem);
      font-weight: 360;
    }
  }

  &__copy-stack {
    display: grid;
    gap: var(--space-l);
    color: color-mix(in srgb, currentColor, transparent 20%);
    font-size: clamp(1rem, 1.7vw, 1.22rem);
    line-height: 1.65;

    p {
      margin: 0;
    }
  }

  &__modules {
    display: grid;
    gap: var(--space-l);
  }

  &__card-grid,
  &__product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space);
  }

  &__card {
    position: relative;
    min-height: 13rem;
    padding: var(--space-l);
    border-radius: 1.5rem;

    h3 {
      margin: calc(var(--space-l) * 1.55) 0 var(--space-s);
      font-size: 1.2rem;
      letter-spacing: 0;
    }

    p {
      margin: 0;
      color: color-mix(in srgb, currentColor, transparent 34%);
      line-height: 1.55;
    }
  }

  &__card-dot {
    position: absolute;
    top: var(--space-l);
    left: var(--space-l);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: .9rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 7%);

    &::after {
      content: '';
      position: absolute;
      inset: .78rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--color-foreground), transparent 18%);
    }
  }

  &__pathways {
    display: grid;
    gap: var(--space-l);
    padding: var(--spacing);
  }

  &__pathway {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: var(--space-l);
    padding: var(--spacing);
    border-radius: 2rem;
  }

  &__upgrade-panel {
    border: 1px solid color-mix(in srgb, var(--color-primary), transparent 70%);
    background:
      radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--color-primary), transparent 58%), transparent 18rem),
      color-mix(in srgb, var(--color-background), var(--color-primary) 8%);
  }

  &__install-panel {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
    border: 1px solid color-mix(in srgb, var(--color-secondary), transparent 70%);
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--color-background), var(--color-secondary) 10%), color-mix(in srgb, var(--color-background), var(--color-foreground) 3%));
  }

  &__band-copy,
  &__quickstart-copy {
    p {
      color: color-mix(in srgb, currentColor, transparent 28%);
      line-height: 1.6;
    }

    h2 {
      font-size: clamp(1.55rem, 3.2vw, 2.65rem);
    }
  }

  &__principles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-s);
    align-content: start;

    span {
      display: flex;
      align-items: center;
      min-height: 5rem;
      padding: var(--space);
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);
      color: color-mix(in srgb, currentColor, transparent 14%);
      font-weight: 750;
    }
  }

  pre {
    margin: 0;
    min-height: 100%;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
  }

  &__products {
    display: grid;
    gap: var(--space-l);
  }

  &__product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__product {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space);
    align-items: start;
    min-height: 10rem;
    padding: var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    border-radius: 1.5rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);

    h3 {
      margin: 0 0 var(--space-xs);
      font-size: 1.2rem;
    }

    p {
      margin: 0;
      color: color-mix(in srgb, currentColor, transparent 34%);
      line-height: 1.55;
    }
  }

  &__product-logo {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-foreground), transparent 12%);
    color: var(--color-background);
    font-weight: 850;
    letter-spacing: -.03em;
  }

  @media (max-width: 900px) {
    &__hero,
    &__pathway,
    &__install-panel {
      grid-template-columns: 1fr;
    }

    &__card-grid,
    &__product-grid {
      grid-template-columns: 1fr;
    }

    &__title {
      max-width: 100%;
    }
  }

  @media (max-width: 640px) {
    padding-top: calc(var(--space) * 3.5);

    &__proof,
    &__principles {
      grid-template-columns: 1fr;
    }

    &__pathway,
    &__hero-card,
    &__card,
    &__product {
      border-radius: 1.25rem;
      padding: var(--space);
    }

    &__timeline li {
      grid-template-columns: 1fr;
    }
  }
}
</style>
