import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import tommorowNight from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night';
import github from 'react-syntax-highlighter/dist/esm/styles/hljs/github'
SyntaxHighlighter.registerLanguage('javascript', js)
import { useColorMode } from '@docusaurus/theme-common';
import React, { PropsWithChildren } from "react";

export const Code: React.FunctionComponent<PropsWithChildren<{ className?: string, language?: string }>> = ({ children, language, className }) => {
  const { isDarkTheme } = useColorMode();
  return <SyntaxHighlighter className={className} code={children} language={language} style={isDarkTheme ? tommorowNight : github} />
}