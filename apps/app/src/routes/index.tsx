import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/index'
import { pageHead, SITE } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => pageHead({ title: 'Pikku: full-stack TypeScript framework', description: 'Pikku is an open-source TypeScript framework: typed clients for web, mobile and desktop apps, and a backend with users, a database, queues, workflows, AI agents and MCP.', path: '/',
    jsonLd: { '@graph': [
      { '@type': 'Organization', '@id': SITE + '/#org', name: 'Pikku', url: SITE, logo: SITE + '/img/pikku.png', sameAs: ['https://github.com/pikkujs/pikku'] },
      { '@type': 'WebSite', '@id': SITE + '/#site', url: SITE, name: 'Pikku', publisher: { '@id': SITE + '/#org' } },
      { '@type': 'SoftwareSourceCode', name: 'Pikku', url: SITE, codeRepository: 'https://github.com/pikkujs/pikku', programmingLanguage: 'TypeScript', license: 'https://opensource.org/licenses/MIT', author: { '@id': SITE + '/#org' } },
    ] } }),
  component: Page,
})
