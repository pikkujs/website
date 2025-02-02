import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindPlugin from "./plugins/tailwind-config.cjs";

const config: Config = {
  title: 'Vramework',
  tagline: 'The Typescript Function Backend',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://vramework.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vramework', // Usually your GitHub org/user name.
  projectName: 'vramework-website', // Usually your repo name.

  // onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        readme: "none",
        useCodeBlocks: true,
        categorizeByGroup: false,
        cleanOutputDir: true, 
        tsconfig: "vramework/tsconfig.json",
        "entryPoints": [
          "vramework/**/index.ts",
        ],
        "entryPointStrategy": "expand",
        "skipErrorChecking": true,
        "compilerOptions": {
          "skipLibCheck": true,
          "noImplicitAny": false,
          "resolveJsonModule": true
        },
        "exclude": [
          "**/node_modules/**/*",
          "**/dist/**/*",
          "**/*.spec.ts",
          "**/*.d.ts"
        ],
      },
    ],
    tailwindPlugin
  ],

  themes: [
    '@saucelabs/theme-github-codeblock'
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
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            remarkPlugins: [
              [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
            ],
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
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
              {converters: ['pnpm']},
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
    image: 'img/vramework.png',
    respectPrefersColorScheme: true,
    navbar: {
      title: 'Vramework',
      logo: {
        alt: 'Vramework',
        src: 'img/vramework.png',
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
          href: 'https://github.com/vramework/vramework',
          className: "header-github-link",
          "aria-label": "GitHub repository",
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/vramework',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/vramework/vramework',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vramework, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
