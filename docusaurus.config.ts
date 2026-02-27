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
  tagline: 'The Typescript Function Backend',
  favicon: 'img/favicon.ico',
  clientModules: ['./src/github-stars.js'],

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
          remarkPlugins: [[
            require('@docusaurus/remark-plugin-npm2yarn'),
            npm2YarnConfig
          ]],
        },
        pages: {
          remarkPlugins: [[
            require('@docusaurus/remark-plugin-npm2yarn'),
            npm2YarnConfig
          ]],
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
            [
              require('@docusaurus/remark-plugin-npm2yarn'),
              npm2YarnConfig
            ],
          ],
        },
        theme: {
          customCss: ['./src/css/custom.css', 'node_modules/react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/pikku.png',
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
            // Deployment
            { label: 'Tree-Shaking', to: '/core/treeshaking' },
            { label: 'Built-in Services', to: '/core/built-in-services' },
            // Platform
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
          type: 'html',
          position: 'right',
          value: '<span>|</span>',
        },
        {
          type: 'html',
          position: 'right',
          value: '<a href="https://github.com/pikkujs/pikku" target="_blank" rel="noopener noreferrer" class="header-github-stars" aria-label="Star on GitHub"><svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg><span class="github-star-count"></span></a>',
        },
        {
          href: 'https://x.com/pikkujs',
          className: "header-link header-x-link",
          "aria-label": "X (Twitter) account",
          position: 'right',
        },
        {
          href: 'https://discord.gg/z7r4rhwJ',
          className: "header-link header-discord-link",
          "aria-label": "Discord",
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<span>|</span>',
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
          title: 'Learn',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
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
            { label: 'Discord', href: 'https://discord.gg/z7r4rhwJ' },
            { label: 'X / Twitter', href: 'https://x.com/pikkujs' },
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
