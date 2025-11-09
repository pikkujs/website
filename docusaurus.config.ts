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
  onBrokenMarkdownLinks: 'throw',

  markdown: {
    mermaid: true,
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
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'why',
        path: 'why',
        routeBasePath: 'why',
        sidebarPath: false,
      },
    ],
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
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
    respectPrefersColorScheme: true,
    announcementBar: {
      id: 'pikku-0.10',
      content:
        '🚀 <strong>Pikku 0.10 is here!</strong> — Smart tree-shaking, CLI support, and middleware improvements. <a target="_blank" rel="noopener noreferrer" href="/blog/2025/11/09/pikku-0.10">Read more →</a>',
      backgroundColor: '#4F46E5',
      textColor: '#FFFFFF',
      isCloseable: true,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
    navbar: {
      title: 'Pikku',
      logo: {
        alt: 'Pikku',
        src: 'img/pikku.png',
      },
      items: [
        {
          to: '/why',
          label: 'Why?',
          position: 'right',
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
      copyright: `MIT License\nCopyright © 2020-${new Date().getFullYear()} Yasser Fadl & Pikku Contributors.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
