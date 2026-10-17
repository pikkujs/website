import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/index'
import { pageHead, SITE } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => pageHead({ title: 'Pikku: build every app, own every piece', description: 'Open-source TypeScript framework. Write your functions once and ship them as a web, mobile, desktop, CLI and MCP app, on the stack you choose.', path: '/',
    jsonLd: { '@graph': [
      { '@type': 'Organization', '@id': SITE + '/#org', name: 'Pikku', url: SITE, logo: SITE + '/img/pikku.png', sameAs: ['https://github.com/pikkujs/pikku'] },
      { '@type': 'WebSite', '@id': SITE + '/#site', url: SITE, name: 'Pikku', publisher: { '@id': SITE + '/#org' } },
      { '@type': 'SoftwareSourceCode', name: 'Pikku', url: SITE, codeRepository: 'https://github.com/pikkujs/pikku', programmingLanguage: 'TypeScript', license: 'https://opensource.org/licenses/MIT', author: { '@id': SITE + '/#org' } },
    ] } }),
  component: Page,
})
