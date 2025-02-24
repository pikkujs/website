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
    tailwindPlugin
  ],

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-5W0GS8T059',
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/pikkujs/website/tree/master/',
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
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/pikku.png',
    respectPrefersColorScheme: true,
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
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'right',
          label: 'Docs',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'right'
        },
        {
          href: 'https://github.com/pikkujs/pikku',
          className: "header-github-link",
          "aria-label": "GitHub repository",
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Vlandor, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
