import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindPlugin from "./plugins/tailwind-config.cjs";

const npm2YarnConfig = {
  sync: true,
  converters: [
    'yarn',
    'pnpm',
    'bun'
  ],
}

const config: Config = {
  title: 'Pikku',
  tagline: 'Run a whole platform from one command',
  favicon: 'img/favicon.ico',

  stylesheets: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap',
  ],

  headTags: [
    {
      tagName: 'meta',
      attributes: { property: 'og:type', content: 'website' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'twitter:card', content: 'summary_large_image' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'Pikku',
        description: 'Open-source TypeScript backend platform — one command runs database, auth, content, email, secrets, workflows and AI agents locally, identical to production. Deploy anywhere.',
        url: 'https://pikku.dev',
        codeRepository: 'https://github.com/pikkujs/pikku',
        programmingLanguage: 'TypeScript',
        license: 'https://opensource.org/licenses/MIT',
        author: {
          '@type': 'Organization',
          name: 'Pikku',
          url: 'https://pikku.dev',
        },
      }),
    },
  ],

  // Set the production url of your site here
  url: 'https://pikku.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pikku', // Usually your GitHub org/user name.
  projectName: 'pikku-website', // Usually your repo name.

  // onBrokenLinks: 'ignore',
  onBrokenAnchors: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: [
    '@saucelabs/theme-github-codeblock',
    '@docusaurus/theme-mermaid'
  ],
  
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    tailwindPlugin,
  ],

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-SNE58L9QKR',
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/pikkujs/website/tree/main/',
          remarkPlugins: [
            require('./plugins/remark-snippets.cjs'),
            [require('@docusaurus/remark-plugin-npm2yarn'), npm2YarnConfig],
          ],
        },
        pages: {
          remarkPlugins: [
            require('./plugins/remark-snippets.cjs'),
            [require('@docusaurus/remark-plugin-npm2yarn'), npm2YarnConfig],
          ],
        },
        blog: {
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/pikkujs/website/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          remarkPlugins: [
            require('./plugins/remark-snippets.cjs'),
            [require('@docusaurus/remark-plugin-npm2yarn'), npm2YarnConfig],
          ],
        },
        theme: {
          customCss: ['./src/css/custom.css', 'node_modules/react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/pikku.png',
    metadata: [
      { name: 'description', content: 'Open-source TypeScript backend platform — one command runs database, auth, content, email, secrets, workflows and AI agents locally, identical to production. Deploy anywhere.' },
      { property: 'og:site_name', content: 'Pikku' },
      { name: 'twitter:site', content: '@pikkujs' },
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    algolia: {
      appId: 'CE37WLYS11',
      apiKey: 'e6cedad541bb44c2f7f26ddb63d27c92',
      indexName: 'pikku',
    },
    mermaid: {
      theme: { light: 'dark', dark: 'dark' },
    },
    navbar: {
      title: 'Pikku',
      logo: {
        alt: 'Pikku',
        src: 'img/pikku.png',
      },
      items: [
        {
          type: 'search',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Features',
          position: 'right',
          items: [
            // Core
            { label: 'Functions', to: '/core/function' },
            { label: 'Services', to: '/core/services' },
            { label: 'Security', to: '/core/security' },
            { label: 'Versioning', to: '/core/versioning' },
            { label: 'Secrets & Variables', to: '/core/secrets' },
            // Protocols
            { label: 'HTTP', to: '/wires/http' },
            { label: 'WebSocket', to: '/wires/websocket' },
            { label: 'RPC', to: '/wires/rpc' },
            { label: 'MCP', to: '/wires/mcp' },
            // Scheduling & Processing
            { label: 'Queue', to: '/wires/queue' },
            { label: 'Cron', to: '/wires/cron' },
            { label: 'Triggers', to: '/wires/trigger' },
            { label: 'CLI', to: '/wires/cli' },
            // AI & Orchestration
            { label: 'AI Agents', to: '/wires/bot' },
            { label: 'Workflows', to: '/wires/workflow' },
            { label: 'Dynamic Workflows', to: '/dynamic-workflows' },
            { label: 'Gateway', to: '/wires/gateway' },
            // Deployment
            { label: 'Cloudflare Workers', to: '/deploy/cloudflare' },
            { label: 'AWS Serverless', to: '/deploy/serverless' },
            { label: 'Azure Functions', to: '/deploy/azure' },
            // Platform
            { label: 'Tree-Shaking', to: '/core/treeshaking' },
            { label: 'Built-in Services', to: '/core/built-in-services' },
            { label: 'Console', to: '/core/console' },
            { label: 'Addons', to: '/core/addons' },
            { label: 'Benchmarks', to: '/benchmarks' },
          ],
        },
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'right',
          label: 'Docs',
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'skills',
        //   position: 'right',
        //   label: 'Skills',
        // },
        {
          to: '/blog',
          label: 'Blog',
          position: 'right'
        },
        {
          href: 'https://pikkufabric.com',
          position: 'right',
          label: 'Fabric',
        },
        {
          type: 'html',
          position: 'right',
          value: '<a href="https://github.com/pikkujs/pikku" target="_blank" rel="noopener noreferrer" class="header-link header-github-link" aria-label="GitHub repository"><svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></a>',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Pikku',
        src: 'img/pikku.png',
        href: '/',
        width: 40,
        height: 40,
      },
      links: [
        {
          title: 'Product',
          items: [
            { label: 'Overview', to: '/' },
            { label: 'For developers', to: '/developers' },
            { label: 'Features', to: '/features' },
            { label: 'Benchmarks', to: '/benchmarks' },
            { label: 'Fabric — managed hosting', href: 'https://pikkufabric.com' },
          ],
        },
        {
          title: 'Learn',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            { label: 'Documentation', to: '/docs' },
            { label: 'Wiring (HTTP, WS, Queues…)', to: '/docs/wiring/http' },
            { label: 'Runtimes', to: '/docs/runtimes/fastify-plugin' },
            { label: 'CLI Reference', to: '/docs/pikku-cli' },
            { label: 'The Console', to: '/docs/console' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/pikkujs/pikku' },
            { label: 'Blog', to: '/blog' },
          ],
        },
      ],
      copyright: `MIT License · Copyright © 2020–${new Date().getFullYear()} Yasser Fadl & Pikku Contributors.`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
