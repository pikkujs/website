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
https://raw.githubusercontent.com/pikkujs/express-middleware-starter/blob/master/pikku.config.json
```

#### Generated Files

The two files we use within our code are `pikku-bootstrap.gen.ts` and `pikku-types.gen.d.ts`. The rest are generated in order to create types to improve your developer experience, as well as documentation and schemas to validate input against. 

<details>
 <summary>The generated files, not needed for quick start.</summary>

| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `pikku-schemas/`                   | The directory that contains all the schemas we'll validate calls against                                                                                     |
| `pikku-schemas/register.ts`                 | Imports all the schemas and adds them to pikku                                                              |
| `pikku-bootstrap.ts`               | Imports the required files into our runtime                                                 |
| `pikku-routes.ts` | Imports all the files with routes in them                                                          |
| `pikku-types.d.ts`  | Provides types to be used in the application                                                       |

</details>

