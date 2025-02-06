---
sidebar_position: 0
title: Getting Started
description: How does it work?
---

This set of articles covers the **core fundamentals** of Pikku. To understand how Pikku operates, a basic CRUD application will be built, demonstrating fundamental features at an introductory level.

## Prerequisites

Ensure that [Node.js](https://nodejs.org) (version >= 18) is installed on the operating system.

### Setup

Begin by installing the starter project using **Git**:

```bash npm2yarn
# Clone the project
git clone https://github.com/pikku/express-middleware-starter.git project
# Enter the directory
cd project
# Setup dependencies
npm install
# Run pikku cli
npx @pikku/cli
```

The `project` directory will be created, node modules will be installed, and pikku files will be created:

```bash title="Project structure"
.pikku/
  pikku-schemas/
    schemas/
      CreateBook.schema.json
      JustBookId.schema.json
    register.ts
  pikku-bootstrap.ts
  pikku-routes-map.d.ts
  pikku-routes.ts
  pikku-types.d.ts
bin/
  main.ts
src/
  config.ts
  services.ts
  books.service.ts
  books.function.ts
types/
  books.types.d.ts
pikku.config.json
```

#### Core Files

Here's a brief overview of there core files:

| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `main.ts`                   | The entry point                                                                                           |
| `config.ts`                 | The configuration used by the server                                                                      |
| `services.ts`               | A function that creates all the expected services required                                                 |
| `book.service.ts` | A simple book service                                                                                     |
| `books.function.ts`  | The glue between services and http calls
| `pikku.config.json`  | The config used by the pikku CLI tool      

#### Generated Files

:::info
The two files we use are `pikku-bootstrap.ts` and `pikku-types.d.ts`. The rest are generated in order to either help provide autocompletion / type checks or for runtime purposes.
:::


| **File**                    | **Description**                                                                                             |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `pikku-schemas/`                   | The directory that contains all the schemas we'll validate calls against                                                                                     |
| `pikku-schemas/register.ts`                 | Imports all the schemas and adds them to pikku                                                              |
| `pikku-bootstrap.ts`               | Imports the required files into our runtime                                                 |
| `pikku-routes.ts` | Imports all the files with routes in them                                                          |
| `pikku-types.d.ts`  | Provides types to be used in the application                                                       |

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
https://raw.githubusercontent.com/pikku/express-middleware-starter/blob/master/pikku.config.json
```

