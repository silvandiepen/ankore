import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defaultDocsSlug, docsPages } from './docs'

export const docsRoutePaths = [
  '/docs',
  '/docs/why',
  '/docs/quickstart',
  '/docs/config',
  '/docs/api',
  '/docs/client',
  '/docs/storage',
  '/docs/security',
  '/docs/email',
  '/docs/release',
  '/docs/troubleshooting',
] as const

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  { path: '/why', name: 'why', component: () => import('./pages/WhyPage.vue') },
  { path: '/architecture', name: 'architecture', component: () => import('./pages/ArchitecturePage.vue') },
  { path: '/integrations', name: 'integrations', component: () => import('./pages/IntegrationsPage.vue') },
  {
    path: '/docs',
    component: () => import('./pages/DocsLayout.vue'),
    children: [
      { path: '', redirect: `/docs/${defaultDocsSlug}` },
      ...docsPages.map((page) => ({
        path: page.slug,
        name: `docs-${page.slug}`,
        component: () => import('./pages/DocPage.vue'),
        props: { slug: page.slug },
      })),
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 96 }
    return { left: 0, top: 0 }
  },
})
