// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  output: 'static',
  outDir: '../docs-dist',

  integrations: [
    starlight({
      title: '飞码扣文档',
      description: '为 GitHub Copilot 提供中国 AI 模型支持的 VS Code 扩展文档',

      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      defaultLocale: 'root',

      sidebar: [
        {
          label: '从这里开始',
          collapsed: false,
          items: [
            { label: '简介', link: '/' },
            { label: '快速入门', link: '/guides/quickstart' },
            { label: '安装', link: '/guides/installation' },
          ],
        },
        {
          label: '用户指南',
          items: [
            { label: '认证', link: '/guides/authentication' },
            { label: '使用模型', link: '/guides/using-models' },
            { label: '配置', link: '/guides/configuration' },
          ],
        },
        {
          label: '开发',
          items: [
            { label: '开发设置', link: '/dev/setup' },
            { label: '测试', link: '/dev/testing' },
            { label: '构建', link: '/dev/building' },
          ],
        },
        {
          label: '参考',
          items: [
            { label: '支持的模型', link: '/reference/models' },
            { label: 'API 参考', link: '/reference/api' },
            { label: '配置参考', link: '/reference/config' },
          ],
        },
      ],

      social: [
        {
          icon: 'github',
          label: 'GitHub',
          ariaLabel: 'GitHub Repository',
          href: 'https://github.com/feima-tech/feima-copilot-llms-extension',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/feima-tech/feima-copilot-llms-extension/edit/main',
      },
      lastUpdated: true,
    }),
  ],

  site: 'https://feima.tech',
  base: '/docs',
});