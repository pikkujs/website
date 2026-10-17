import { Prism } from 'prism-react-renderer'

// prism-react-renderer ships without a shell grammar. This one covers what the site's terminal snippets use:
// `#` comments, quoted strings, $variables, a leading `$` prompt, flags, shell keywords and pipes/redirects.
Prism.languages.bash = {
  comment: { pattern: /(^|\s)#.*/, lookbehind: true, greedy: true },
  string: { pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/, greedy: true },
  variable: /\$(?:\w+|\{[^}]+\}|\([^)]*\))/,
  keyword: /\b(?:if|then|else|elif|fi|for|while|until|do|done|case|esac|in|function|export|return|exit|set|source)\b/,
  builtin: /\b(?:cd|echo|cat|ls|mkdir|rm|cp|mv|curl|git|npm|npx|pnpm|yarn|bun|node|docker|pikku|wrangler)\b/,
  'attr-name': { pattern: /(^|\s)--?[A-Za-z][\w-]*(?:=[^\s]*)?/, lookbehind: true },
  number: /\b\d+(?:\.\d+)*\b/,
  operator: /&&|\|\||[|<>]=?|;;?|\\$/m,
  punctuation: /[{}()[\]]/,
}
Prism.languages.shell = Prism.languages.bash
