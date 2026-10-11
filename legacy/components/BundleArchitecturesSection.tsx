import React from 'react';
import Heading from '@theme/Heading';
import Card from './Card';

/** Bundle architectures cards - just the three deployment options */
export function BundleArchitecturesSection() {
  const architectures = [
    {
      name: 'Monolith',
      icon: '🏢',
      description: 'Run everything in one process',
      command: 'pikku',
      bundleSize: '~2.8MB',
      includes: 'All functions, all protocols'
    },
    {
      name: 'Microservices',
      icon: '📦',
      description: 'Split by domain or feature',
      command: 'pikku --http-routes=/admin',
      altCommand: 'pikku --tags=admin',
      bundleSize: '~180KB',
      includes: 'Only admin routes + dependencies'
    },
    {
      name: 'Functions',
      icon: 'λ',
      description: 'One function per deployment',
      command: 'pikku --http-routes=/users/:id --types=http',
      bundleSize: '~50KB',
      includes: 'Single endpoint + minimal runtime'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {architectures.map((arch, idx) => (
        <Card key={idx} variant="white" className="text-center shadow-lg">
          <div className="text-6xl mb-3">{arch.icon}</div>
          <Heading as="h3" className="text-xl font-bold mb-2">
            {arch.name}
          </Heading>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {arch.description}
          </p>
          <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-900 p-2 rounded mb-2">
            {arch.command}
          </div>
          {arch.altCommand && (
            <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-900 p-2 rounded mb-2">
              {arch.altCommand}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="text-sm font-semibold text-primary mb-1">{arch.bundleSize}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{arch.includes}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
