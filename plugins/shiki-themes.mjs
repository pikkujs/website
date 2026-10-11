// Shiki themes matching the paper design. Compile-time only (runs in the MDX
// build), so none of this reaches the Worker bundle.
const build = (name, type, c) => ({
  name,
  type,
  colors: { 'editor.background': c.bg, 'editor.foreground': c.plain },
  settings: [],
  tokenColors: [
    { settings: { foreground: c.plain } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.cmt, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression', 'variable.language', 'entity.name.tag', 'support.type.primitive'], settings: { foreground: c.kw } },
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'markup.inline.raw'], settings: { foreground: c.str } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'constant.other', 'support.constant'], settings: { foreground: c.num } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function', 'variable.function'], settings: { foreground: c.fn } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class', 'meta.type.annotation entity.name.type'], settings: { foreground: c.type } },
    { scope: ['variable.other.property', 'variable.other.object.property', 'meta.object-literal.key', 'support.type.property-name', 'entity.other.attribute-name', 'meta.property-name'], settings: { foreground: c.prop } },
    { scope: ['keyword.operator', 'keyword.operator.assignment', 'keyword.operator.arithmetic', 'keyword.operator.comparison'], settings: { foreground: c.op } },
    { scope: ['punctuation', 'meta.brace', 'punctuation.separator', 'punctuation.terminator'], settings: { foreground: c.punct } },
    { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: c.kw, fontStyle: 'bold' } },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    { scope: ['markup.inserted'], settings: { foreground: c.str } },
    { scope: ['markup.deleted', 'invalid'], settings: { foreground: c.kw } },
  ],
})

export const paperLight = build('pikku-paper-light', 'light', {
  bg: '#ebdfc8', plain: '#2b2219', kw: '#9a3412', str: '#55703c', num: '#8a5a00', cmt: '#6f6252',
  fn: '#3d6373', type: '#a8485f', prop: '#4b4033', op: '#5f5143', punct: '#6f6252',
})
export const paperDark = build('pikku-paper-dark', 'dark', {
  bg: '#0f0c09', plain: '#ece3d0', kw: '#e8834a', str: '#8fb5c4', num: '#e0a96b', cmt: '#8a7e6a',
  fn: '#9bb87a', type: '#d7b3e8', prop: '#9fc3cf', op: '#b3ab99', punct: '#968a76',
})
