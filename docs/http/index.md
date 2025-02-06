---
sidebar_position: 0 
title: HTTP Routes
description: Mapping HTTP calls to functions  
---

HTTP API routes in Pikku serve as the entry points for handling HTTP requests. When a request is made, an HTTP API route listens on the specified path and processes the request by calling a function. The process involves:

- **Validating the session (if required)**
- **Extracting and validating request data**
- **Handling permissions**
- **Returning a success response or an error code**

// TODO: Image to define process

## Defining API Routes

An API route is a configuration object that defines the behavior for a specific HTTP request. Here is an example that demonstrates setting up routes for fetching and updating a book:

```typescript reference title="book.function.ts"
https://raw.githubusercontent.com/pikku/express-middleware-starter/blob/master/src/books.function.ts
```


## Validation

Pikku automatically ensures that any parameters used in the paths are inside of the data object. If they are missing it would throw an error.

It also automatically extracts the input type and creates a schema to validate against. This will be run using `ajv` whenever the route is called.

## Data Handling

Pikku automatically merges request data from query parameters, path parameters, and the request body. If conflicting data is found (e.g., `bookId` in the path and body don't match), an error is thrown to ensure consistency. 

For instance, given the following route and request:

```typescript
/v1/book/:bookId
```

```typescript
httpPost(`/v1/book/abc?bookId=abc`, {
    bookId: 'abc'
});
```

If all sources match, the request proceeds. If there are discrepancies, an error is generated.

### Handling Data Conflicts

Pikku takes a strict approach to prevent conflicts between different data sources. Below are three common approaches to handling data conflicts:

| **Approach**                         | **Pros**                                                                 | **Cons**                                                                    |
|--------------------------------------|--------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **1. Explicit Source Selection**     | - Clear and unambiguous.                                                 | - Requires more code to handle data from each source explicitly.            |
|                                      | - Reduces accidental conflicts.                                          | - Tedious when sharing many parameters across different sources.            |
|                                      | - Ideal for generating documentation.                                    |                                                                             |
| **2. Establish Priority Rules**      | - Allows flexibility without needing explicit handling for each source.  | - Implicit rules can lead to unexpected behavior.                           |
|                                      | - Convenient for simple cases.                                           | - Debugging becomes harder in the event of priority conflicts.              |
| **3. Fail Fast for Conflicting Data**| - Enforces consistency upfront.                                          | - Introduces additional error-handling logic.                               |
|                                      | - Flags ambiguous situations early, ensuring data integrity.             | - Users must provide consistent values across all sources.                  |

## API Documentation Generation

One of Pikku’s goals is to support automatic generation of API documentation, such as Swagger files. Although this is a work in progress, contributions to the project are encouraged. Any suggestions can be submitted via [GitHub](https://github.com/pikku/pikku).

## Scalability and Verbosity

While the current approach may seem verbose, it has proven effective for managing strict TypeScript validation across all layers. Each API route ensures that data is validated at both compile time and runtime. Though scalability remains a concern, future improvements may streamline the definition of routes by leveraging TypeScript’s features.

For example, a request without a session cannot invoke an `APIFunction` that requires one. This is enforced by the type system, preventing issues at compile time.

## Summary

API routes in Pikku map HTTP requests to functions, providing a structured, consistent approach to request handling. This method guarantees data validation, error handling, and session management, ensuring that requests are handled securely and efficiently. In future iterations, improvements to scalability, schema inference, and documentation generation will be explored.