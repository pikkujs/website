import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

interface PackageManagerTabsProps {
  npm: string;
  yarn: string;
  pnpm: string;
  bun: string;
}

export default function PackageManagerTabs({ npm, yarn, pnpm, bun }: PackageManagerTabsProps) {
  return (
    <Tabs groupId="package-manager">
      <TabItem value="npm" label="npm" default>
        <CodeBlock language="bash">{npm}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        <CodeBlock language="bash">{yarn}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language="bash">{pnpm}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="Bun">
        <CodeBlock language="bash">{bun}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
