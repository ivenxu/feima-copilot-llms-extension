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
│   │   │   ├── index.md                  # English landing page
│   │   │   ├── guides/                   # User guides
│   │   │   ├── reference/                # API/reference docs
│   │   │   ├── dev/                      # Developer docs
│   │   │   └── zh-cn/                    # Chinese translations
│   │   ├── i18n/ui.ts                    # UI translations (EN/ZH)
│   │   └── content.config.ts             # Content schema
│   ├── astro.config.mjs                  # Astro + Starlight config
│   ├── package.json                      # Docs dependencies
│   └── public/                           # Static assets
├── docs-dist/                            # Built documentation (not committed)
└── dist/                                 # Extension build (esbuild)
```

## Key Design Decisions

### Build Conflict Avoidance

The extension uses esbuild (outputs to `dist/`) and Astro defaults to `./dist`. To avoid conflicts, the docs are configured to build to `../docs-dist/`:

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',
  outDir: '../docs-dist',  // Points to parent directory
  base: '/docs',           // URL prefix
});
```

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

Visit http://localhost:4321/docs to view the site. Changes auto-reload.

### Build for Production

```bash
npm run docs:build
```

Output is written to `../docs-dist/` (at project root).

### Preview Production Build

```bash
npm run docs:preview
```

Serves the built `docs-dist/` locally for final verification.

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

Chinese translations go in `src/content/docs/zh-cn/`:

```
src/content/docs/
├── index.md              # English
├── guides/quickstart.md  # English
└── zh-cn/
    ├── index.md          # Chinese translation
    └── guides/
        └── quickstart.md # Chinese translation
```

Pages without Chinese translations fallback to English automatically.

## Deployment

### Dual Deployment Strategy

The documentation is deployed to both GitHub Pages (global) and Alibaba OSS + CDN (China):

| Target | URL | Use Case |
|--------|-----|----------|
| GitHub Pages | https://feima.tech/docs | Global users |
| Alibaba OSS | https://docs.feima.cn | China users |

### CI/CD Pipeline

Deployment is automated via `.github/workflows/deploy-docs.yml`:

1. Triggers on push to `main` branch (changes to `docs/**` or `README.md`)
2. Runs `npm run docs:build`
3. Uploads artifact
4. Deploys to GitHub Pages
5. Deploys to Alibaba OSS and refreshes CDN

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