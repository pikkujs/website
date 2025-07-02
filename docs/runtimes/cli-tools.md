---
sidebar_position: 13
title: CLI Tools
description: Build powerful command line applications
---

# CLI Tools

Pikku allows you to build powerful command-line interfaces using the same functions you use for web APIs. This provides consistency across your application and enables code reuse between different interfaces.

## Overview

CLI tools in Pikku provide:
- Argument parsing and validation
- Interactive prompts
- Progress indicators
- Configuration file support
- Help generation
- Type-safe command definitions

## Creating CLI Commands

CLI commands are built using regular Pikku functions:

```typescript
import { pikkuSessionlessFunc } from '@pikku/core'
import { addCLICommand } from '@pikku/cli'

export const generateReport = pikkuSessionlessFunc<
  { format: 'json' | 'csv'; dateRange: string; output?: string },
  { fileName: string; recordCount: number }
>(async ({ logger, kysely }, { format, dateRange, output }) => {
  logger.info(`Generating ${format} report for ${dateRange}`)
  
  const data = await kysely
    .selectFrom('analytics')
    .selectAll()
    .where('createdAt', '>=', new Date(dateRange))
    .execute()
  
  const fileName = output || `report-${Date.now()}.${format}`
  
  if (format === 'json') {
    await writeJSON(fileName, data)
  } else {
    await writeCSV(fileName, data)
  }
  
  logger.info(`Report saved to ${fileName}`)
  
  return { 
    fileName, 
    recordCount: data.length 
  }
})

addCLICommand({
  name: 'generate-report',
  description: 'Generate analytics report',
  func: generateReport,
  options: {
    format: {
      type: 'string',
      choices: ['json', 'csv'],
      default: 'json',
      description: 'Output format for the report'
    },
    dateRange: {
      type: 'string',
      required: true,
      description: 'Date range for the report (YYYY-MM-DD)'
    },
    output: {
      type: 'string',
      description: 'Output file name (optional)'
    }
  },
  examples: [
    'generate-report --dateRange 2024-01-01 --format csv',
    'generate-report --dateRange 2024-01-01 --output monthly-report.json'
  ]
})
```

## Interactive Commands

Create interactive CLI tools with prompts:

```typescript
export const setupProject = pikkuSessionlessFunc<
  { 
    name?: string
    template?: string
    database?: string
    features?: string[]
  },
  { projectPath: string; configFile: string }
>(async ({ logger, prompt, fs }, options) => {
  // Interactive prompts for missing options
  const projectName = options.name || await prompt.text({
    message: 'What is your project name?',
    validate: (value) => value.length > 0 || 'Project name is required'
  })
  
  const template = options.template || await prompt.select({
    message: 'Choose a project template:',
    choices: [
      { name: 'REST API', value: 'rest-api' },
      { name: 'WebSocket Server', value: 'websocket' },
      { name: 'Full Stack', value: 'fullstack' }
    ]
  })
  
  const database = options.database || await prompt.select({
    message: 'Choose a database:',
    choices: [
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'MySQL', value: 'mysql' },
      { name: 'SQLite', value: 'sqlite' }
    ]
  })
  
  const features = options.features || await prompt.multiselect({
    message: 'Select additional features:',
    choices: [
      { name: 'Authentication', value: 'auth' },
      { name: 'Real-time updates', value: 'realtime' },
      { name: 'Background jobs', value: 'queues' },
      { name: 'File uploads', value: 'uploads' }
    ]
  })
  
  // Generate project
  const projectPath = await generateProject({
    name: projectName,
    template,
    database,
    features
  })
  
  const configFile = path.join(projectPath, 'pikku.config.json')
  
  logger.info(`Project ${projectName} created at ${projectPath}`)
  
  return { projectPath, configFile }
})

addCLICommand({
  name: 'setup',
  description: 'Setup a new Pikku project',
  func: setupProject,
  options: {
    name: {
      type: 'string',
      description: 'Project name'
    },
    template: {
      type: 'string',
      choices: ['rest-api', 'websocket', 'fullstack'],
      description: 'Project template'
    },
    database: {
      type: 'string',
      choices: ['postgresql', 'mysql', 'sqlite'],
      description: 'Database type'
    },
    features: {
      type: 'array',
      description: 'Additional features to include'
    }
  }
})
```

## Progress Indicators

Show progress for long-running operations:

```typescript
export const migrateDatabase = pikkuSessionlessFunc<
  { source: string; target: string; batchSize?: number },
  { migrated: number; errors: number }
>(async ({ logger, progress, db }, { source, target, batchSize = 1000 }) => {
  const totalRecords = await db.countRecords(source)
  let migrated = 0
  let errors = 0
  
  const progressBar = progress.create({
    title: 'Migrating database',
    total: totalRecords,
    format: '{title} [{bar}] {percentage}% | {value}/{total} | ETA: {eta}s'
  })
  
  for (let offset = 0; offset < totalRecords; offset += batchSize) {
    try {
      const batch = await db.getBatch(source, offset, batchSize)
      await db.insertBatch(target, batch)
      
      migrated += batch.length
      progressBar.update(migrated)
      
    } catch (error) {
      logger.error(`Migration error at offset ${offset}:`, error)
      errors++
    }
  }
  
  progressBar.stop()
  
  logger.info(`Migration complete: ${migrated} records, ${errors} errors`)
  
  return { migrated, errors }
})
```

## Configuration Files

Support configuration files for complex commands:

```typescript
export const deployProject = pikkuSessionlessFunc<
  { 
    config?: string
    environment?: string
    dryRun?: boolean 
  },
  { deployed: boolean; services: string[] }
>(async ({ logger, fs }, { config, environment = 'production', dryRun = false }) => {
  // Load configuration
  const configFile = config || 'deploy.config.json'
  const deployConfig = await fs.readJSON(configFile)
  
  const envConfig = deployConfig.environments[environment]
  if (!envConfig) {
    throw new Error(`Environment ${environment} not found in config`)
  }
  
  const services = envConfig.services || []
  
  logger.info(`${dryRun ? 'Simulating' : 'Starting'} deployment to ${environment}`)
  
  for (const service of services) {
    logger.info(`Deploying ${service.name}...`)
    
    if (!dryRun) {
      await deployService(service, envConfig)
    }
  }
  
  logger.info(`Deployment ${dryRun ? 'simulation' : ''} complete`)
  
  return {
    deployed: !dryRun,
    services: services.map(s => s.name)
  }
})

addCLICommand({
  name: 'deploy',
  description: 'Deploy project to specified environment',
  func: deployProject,
  options: {
    config: {
      type: 'string',
      description: 'Path to deployment configuration file'
    },
    environment: {
      type: 'string',
      default: 'production',
      description: 'Target environment for deployment'
    },
    dryRun: {
      type: 'boolean',
      default: false,
      description: 'Simulate deployment without making changes'
    }
  },
  configSchema: {
    type: 'object',
    properties: {
      environments: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            services: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  config: { type: 'object' }
                }
              }
            }
          }
        }
      }
    }
  }
})
```

## CLI Application Setup

Set up your CLI application:

```typescript
// cli.ts
import { createCLIApp } from '@pikku/cli'
import { createSingletonServices } from './services'

// Import all your commands
import './commands/generate-report'
import './commands/setup-project'
import './commands/deploy'

const main = async () => {
  const singletonServices = await createSingletonServices()
  
  const app = createCLIApp({
    name: 'my-cli-tool',
    version: '1.0.0',
    description: 'A powerful CLI tool built with Pikku',
    singletonServices,
    
    // Global options
    globalOptions: {
      verbose: {
        type: 'boolean',
        description: 'Enable verbose logging',
        alias: 'v'
      },
      config: {
        type: 'string',
        description: 'Path to configuration file',
        alias: 'c'
      }
    }
  })
  
  await app.run()
}

main().catch(console.error)
```

## Building and Distribution

### Package.json Configuration

```json
{
  "name": "my-cli-tool",
  "version": "1.0.0",
  "bin": {
    "my-tool": "./dist/cli.js"
  },
  "scripts": {
    "build": "tsc",
    "cli": "node dist/cli.js"
  },
  "dependencies": {
    "@pikku/cli": "^0.6.0",
    "@pikku/core": "^0.6.0"
  }
}
```

### Global Installation

```bash
# Build the CLI
npm run build

# Install globally
npm install -g .

# Use the CLI
my-tool generate-report --dateRange 2024-01-01 --format csv
```

## Advanced Features

### Subcommands

```typescript
addCLICommand({
  name: 'database',
  description: 'Database management commands',
  subcommands: {
    migrate: {
      description: 'Run database migrations',
      func: migrateDatabase,
      options: {
        target: { type: 'string', required: true }
      }
    },
    seed: {
      description: 'Seed database with test data',
      func: seedDatabase,
      options: {
        environment: { type: 'string', default: 'development' }
      }
    },
    backup: {
      description: 'Create database backup',
      func: backupDatabase,
      options: {
        output: { type: 'string', required: true }
      }
    }
  }
})
```

### Custom Validation

```typescript
addCLICommand({
  name: 'process-files',
  description: 'Process files with validation',
  func: processFiles,
  options: {
    input: {
      type: 'string',
      required: true,
      validate: async (path) => {
        if (!await fs.exists(path)) {
          throw new Error(`Input path ${path} does not exist`)
        }
        return true
      }
    },
    threads: {
      type: 'number',
      default: 4,
      validate: (value) => {
        if (value < 1 || value > 32) {
          throw new Error('Threads must be between 1 and 32')
        }
        return true
      }
    }
  }
})
```

## Testing CLI Commands

```typescript
import { testCLICommand } from '@pikku/testing'

describe('Generate Report Command', () => {
  it('should generate JSON report', async () => {
    const result = await testCLICommand(generateReport, [
      '--dateRange', '2024-01-01',
      '--format', 'json'
    ])
    
    expect(result.exitCode).toBe(0)
    expect(result.output.fileName).toMatch(/\.json$/)
    expect(result.output.recordCount).toBeGreaterThan(0)
  })
  
  it('should handle invalid date range', async () => {
    const result = await testCLICommand(generateReport, [
      '--dateRange', 'invalid-date',
      '--format', 'json'
    ])
    
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Invalid date range')
  })
})
```

CLI tools in Pikku provide a powerful way to create consistent, type-safe command-line interfaces that share code with your web applications while offering rich interactive features.