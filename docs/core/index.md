---
sidebar_position: 0
title: Getting Started
description: How does it work?
---

This set of articles covers the **core fundamentals** of Pikku. To understand how Pikku operates, we'll go over the express-middleware setup.

## Prerequisites

Ensure that [Node.js](https://nodejs.org) (version >= 18) is installed on the operating system.

### Setup

Begin by installing the starter project using **npm create**:

```bash npm2yarn
npm create pikku@latest
```

Which will then guide you through starting a project:

<AsciinemaPlayer type="installing" autoPlay />

#### Core Files

Here's a brief overview of there core files:

| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `start.ts`                   | uWebsocketServer / entry point                                                                                |
| `services.ts`               | Contains all the Pikku services management                                              |
| `channels.ts`  | Websockets
| `http.ts`  | HTTP Endpoints
| `scheduled-tasks.ts` | Cron Jobs
| `types/application-types.d.ts` | Application types


### The config file

The `pikku.config.json` file is used to drive the pikku CLI tool.

:::info
The pikku CLI tool is used to:
- Index all your API routes.
- Generate the route schemas.
- Create typescript declaration files to aid developers.

For more info you can checkout the CLI documentation.

:::

```json reference 
https://raw.githubusercontent.com/pikkujs/yarn-workspace-starter/blob/master/pikku.config.json
```

#### Generated Files

The two files we use within our code are `pikku-bootstrap.gen.ts` and `pikku-types.gen.ts`. The rest are generated in order to create types to improve your developer experience, as well as documentation and schemas to validate input against.

##### Core Files

| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `pikku-schemas/`                   | Directory containing all validation schemas                                                                                     |
| `pikku-bootstrap.gen.ts`               | Main bootstrap file that imports all required files                                                 |
| `pikku-types.gen.ts`  | TypeScript type definitions for the application                                                       |
| `pikku-functions.gen.ts` | Generated function definitions |
| `pikku-functions-meta.gen.ts` | Metadata for all functions |
| `pikku-rpc-meta.gen.ts` | RPC metadata |
| `pikku-rpc-map.gen.ts` | RPC mapping definitions |
| `pikku-bootstrap-*.gen.ts` | Event-specific bootstrap files |

##### Transport Files

| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `pikku-http-routes.gen.ts` | HTTP route definitions |
| `pikku-http-routes-meta.gen.ts` | HTTP route metadata |
| `pikku-http-routes-map.gen.d.ts` | TypeScript declarations for HTTP route mapping |
| `pikku-channels.gen.ts` | WebSocket channel definitions |
| `pikku-channels-meta.gen.ts` | Channel metadata |
| `pikku-channels-map.gen.d.ts` | TypeScript declarations for channel mapping |
| `pikku-schedules.gen.ts` | Scheduled task definitions |
| `pikku-schedules-meta.gen.ts` | Scheduled task metadata |

