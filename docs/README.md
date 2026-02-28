# Feima Copilot Documentation

A Docs-as-Code system built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) for the feima-copilot-llms-extension VS Code extension.

## Overview

This is a **Docs-as-Code** system where documentation is written in Markdown alongside the source code, built with a static site generator, and deployed via CI/CD.

## Architecture

```
feima-copilot-llms-extension/              # Main project
├── src/                                   # Extension source code
├── docs/                                  # Documentation site (this directory)
│   ├── src/
│   │   ├── content/docs/                  # Markdown documentation
│   │   │   ├── index.md                  # Chinese landing page (root locale)
│   │   │   ├── guides/                   # User guides (Chinese)
│   │   │   ├── reference/                # API/reference docs (Chinese)
│   │   │   ├── dev/                      # Developer docs (Chinese)
│   │   │   └── en/                       # English locale
│   │   └── content/config.ts             # Content collection schema
│   ├── astro.config.mjs                  # Astro + Starlight config
│   ├── package.json                      # Docs dependencies
│   └── public/                           # Static assets
├── docs/dist/                            # Built documentation (not committed)
└── dist/                                 # Extension build (esbuild)
```

## Key Design Decisions

### Build Output Location

The docs build to `docs/dist/` (inside the `docs/` directory). This keeps the output alongside `docs/node_modules/` so Node.js can resolve SSR-externalized packages during the build.

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',
  outDir: './dist',           // Inside docs/ — keeps module resolution working
  site: process.env.SITE_URL ?? 'https://ivenxu.github.io',
  base: process.env.BASE_PATH ?? '/feima-copilot-llms-extension',
});
```

### Multi-Deployment Configuration

The `site` and `base` values differ per deployment target and are controlled via environment variables at build time:

| Target | `SITE_URL` | `BASE_PATH` | Final URL |
|--------|-----------|------------|-----------|
| GitHub Pages (default) | `https://ivenxu.github.io` | `/feima-copilot-llms-extension` | https://ivenxu.github.io/feima-copilot-llms-extension/ |
| Alibaba OSS/CDN | `https://feima.tech` | `/docs` | https://feima.tech/docs/ |

The CI builds the site **twice** — once per target — using different env vars, ensuring correct asset paths for each deployment.

### Separate Package Management

- `/package.json` → Extension dependencies and build scripts
- `/docs/package.json` → Documentation dependencies only

### Root-Level `/docs` Directory

Documentation lives at the project root (following patterns used by Vite, Astro, etc.), not in a separate `/website` directory.

## Development

### Start Local Dev Server

```bash
# From project root
npm run docs:dev

# Or directly in docs/ directory
cd docs
npm run dev
```

Visit http://localhost:4321/feima-copilot-llms-extension to view the site. Changes auto-reload.

> **Note:** The local dev server uses the default `BASE_PATH` (`/feima-copilot-llms-extension`).
> To use a different base locally, set the env var: `BASE_PATH=/docs npm run dev`

### Build for Production

```bash
npm run docs:build
```

Output is written to `docs/dist/` (inside the `docs/` directory).

### Preview Production Build

```bash
npm run docs:preview
```

Serves the built `docs/dist/` locally for final verification.

## Content Structure

### Navigation (Sidebar)

The sidebar is defined in `astro.config.mjs`:

```javascript
sidebar: [
  {
    label: 'Start Here',
    items: [
      { label: 'Introduction', link: '/' },
      { label: 'Quick Start', link: '/guides/quickstart' },
      { label: 'Installation', link: '/guides/installation' },
    ],
  },
  {
    label: 'User Guide',
    items: [
      { label: 'Authentication', link: '/guides/authentication' },
      { label: 'Using Models', link: '/guides/using-models' },
      { label: 'Configuration', link: '/guides/configuration' },
    ],
  },
  {
    label: 'Development',
    items: [
      { label: 'Development Setup', link: '/dev/setup' },
      { label: 'Testing', link: '/dev/testing' },
      { label: 'Building', link: '/dev/building' },
    ],
  },
]
```

### Adding New Pages

1. Create a `.md` file in `src/content/docs/` (or subdirectory)
2. Add frontmatter:

```markdown
---
title: Page Title
description: Page description
---

# Your content here
```

3. Update sidebar in `astro.config.mjs` to include the new page

### Bilingual Support

Chinese is the **root locale** and English lives under `en/`:

```
src/content/docs/
├── index.md              # Chinese (root locale)
├── guides/quickstart.md  # Chinese
└── en/
    ├── index.md          # English
    └── guides/
        └── quickstart.md # English
```

Pages without an English translation fall back to the Chinese version automatically.

The language switcher is shown in the sidebar. Both languages are served from the same build.

## Deployment

### Dual Deployment Strategy

The documentation is deployed to both GitHub Pages (global) and Alibaba OSS + CDN (China) from the same source. The CI builds the site **twice** with different environment variables:

| Target | `SITE_URL` | `BASE_PATH` | URL |
|--------|-----------|------------|-----|
| GitHub Pages | `https://ivenxu.github.io` | `/feima-copilot-llms-extension` | https://ivenxu.github.io/feima-copilot-llms-extension/ |
| Alibaba OSS | `https://feima.tech` | `/docs` | https://feima.tech/docs/ |

Both deployments serve the full bilingual site (CN + EN) — users switch language via the sidebar picker.

### CI/CD Pipeline

Deployment is automated via `.github/workflows/deploy-docs.yml`:

1. Triggers on push to `main` branch (changes to `docs/**` or `README.md`)
2. `build` job:
   - Installs dependencies once
   - Builds with GitHub Pages config → uploads as `upload-pages-artifact`
   - Builds with OSS config → uploads as `docs-oss` artifact
3. `deploy-github-pages` job: deploys to GitHub Pages
4. `deploy-oss` job: downloads `docs-oss` artifact, deploys to Alibaba OSS, refreshes CDN

### Required GitHub Secrets (China Deployment)

Configure these in repository settings:

| Secret | Purpose |
|--------|---------|
| `ALIYUN_ACCESS_KEY_ID` | Alibaba Cloud Access Key ID |
| `ALIYUN_ACCESS_KEY_SECRET` | Alibaba Cloud Access Key Secret |
| `ALIYUN_OSS_BUCKET` | OSS bucket name |
| `ALIYUN_OSS_REGION` | OSS region (e.g., `cn-hangzhou`) |

## Scripts (Root package.json)

| Script | Action |
|--------|--------|
| `npm run docs:dev` | Start dev server |
| `npm run docs:build` | Build production site |
| `npm run docs:preview` | Preview production build |
| `npm run ext:build` | Build extension |
| `npm run ext:compile` | Compile extension for development |

## Technologies

| Technology | Purpose |
|------------|---------|
| **Astro** | Static site generator |
| **Starlight** | Documentation framework (theme, navigation, search) |
| **Markdown** | Content authoring |
| **TypeScript** | Content schema validation |
| **GitHub Actions** | CI/CD deployment |
| **GitHub Pages** | Global hosting |
| **Alibaba OSS** | China hosting |

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build)
- [Project Repository](https://github.com/feima-tech/feima-copilot-llms-extension)