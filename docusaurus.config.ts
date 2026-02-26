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
    announcementBar: {
      id: 'pikku-console',
      content:
        '🚀 <strong>New: The Pikku Console</strong> — A visual control plane to explore functions, test agents, and manage your app. <a href="/docs/console">Learn more →</a>',
      backgroundColor: '#4F46E5',
      textColor: '#FFFFFF',
      isCloseable: true,
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
            { label: 'HTTP', to: '/wires/http' },
            { label: 'WebSocket', to: '/wires/websocket' },
            { label: 'RPC', to: '/wires/rpc' },
            { label: 'Queue', to: '/wires/queue' },
            { label: 'Cron', to: '/wires/cron' },
            { label: 'CLI', to: '/wires/cli' },
            { label: 'Workflows', to: '/wires/workflow' },
            { label: 'AI Agents', to: '/wires/bot' },
            { label: 'MCP', to: '/wires/mcp' },
            { label: 'Triggers', to: '/wires/trigger' },
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
          href: 'https://github.com/pikkujs/pikku',
          className: "header-link header-github-link",
          "aria-label": "GitHub repository",
          position: 'right',
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
            { label: 'Getting Started', to: '/docs' },
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
