---
title: Service Lookup
description: How and why pikku uses services
image: service.svg
---

Quick intro, Pikku is a thin wrapper ontop of express / serverless / any request-response mechanism that hides away all the boiler plate. The goal is for a user to be able to be able to add an endpoint, with schemas, permissions and session management without actually having to do any boiler plate.

<!-- truncate -->

But as much as pure/immutable functional programming is amazing (give something in, gives you something back, never changing) it's hard to use in some cases (like database connections or integration with content management systems).

And there's also the issue around testing, cloud development and local development. Sometimes it's just easier to use interfaces with quick API access.

This is where pikkus service management comes into play.

### Examples

So a function in pikku has three inputs and one output:

For example, the simplest examples don't really need state:

```typescript
const helloWorld: APIFunctionSessionless<{ name: string }> = async (services, data) => {
    return `Hey there ${data.name}!`
}
```

But let's say you now have a user session and want to get the user:

```typescript
const helloWorld: APIFunction<void> = async (services, data, session) => {
    // Option one is your username is encoded in the session.. 
    // but that isn't really a great choice
    if (session.name) {
        return `Hey there ${session.name}!`        
    }
    // Option two, you need to get it from the database
    // This is using the postgres-typed library
    const user = await services.database.crudGet('user', ['name'], { userId: session.userId }, new NotFoundError())
    return `Hey there ${user.name}!`   
}
```

Let's break down what just happened. Our services contains a database driver and we ran a query using it, which gave us the name of the user.

But lets say we have now have a whole bunch of reactions:

```typescript
const helloWorldNoisy: APIFunction<void> = async (services, data, session) => {
    const user = await services.database.crudGet('user', ['name', 'email'], { userId: session.userId }, new NotFoundError())

    // You could use an email service
    await servces.email.setHelloEmail(user)
    // A realtime service
    await services.realtime.sendEvent(session.userId, `Hey there ${user.name}!`)
    // A slack service
    await services.slack.sendHelloMessage(session.userId, `Hey there ${user.name}!`)

    return `Hey there ${user.name}!`   
}
```

Makes it easier to read right?

But while readability is important, what happens under the hood is even more so.

When developing locally, you don't want to have all of those things to actually have happened. Would make things pretty cluttered!

And that's where dependency injection comes in handy!

### Seting up services

All service management is done in a single setup services class:

```typescript
export const setupServices = async (config: Config): Promise<Services> => {
    // The sessionService is the only service really needed for pikku to work. This is just 
    // a placeholder for cleaner code
    const sessionService = new SessionService()

    const slack = new Slack(config)
    // Wenever an error happens we send a slack notification, hence the dependency
    const logger = new PinoLogger(slack)
    const databasePool = new PGDatabasePool(config.pgCredentials, logger)

    const email = new EmailService()

    const services = { config, logger, secrets, databasePool,jwt, files, sessionService }

    const createSessionServices = async (services: SingletonServices, headers: Record<string, any>, session: UserSession): Promise<Services> => {
        return {
            ...(services as any),
            database: new PGDatabaseClient(services.databasePool, services.logger, session?.userId)
        }
    }

    return { ...services, createSessionServices } as never as Services // 🙈
  }
  ```

That method does two important things:

1) It creates the `SingletonServices`. These services are long lived and typically start with the process and end once it's complete. This includes things like database pools, or third-party APIs that are usually just wrappers around HTTP. If you have a websocket connection would live here as well.. but it wouldn't be very lambda friendly..

2) It creates the `SessionServices` (named `Services` for short). These are what are actually provided to the API functions and are scoped to the current session of the API call. It's worth making sure these are lazy loaded! If they aren't needed for the session it isn't worth doing the initial work. For example with a database, don't get the connection until your first query. This is useful for things like:

    - Putting all database queries in a transaction automatically, with the userId set on the database session which allows audit logs to magically work.
    - Abstracting header details from the APIFunctions (pikku hides away all HTTP concepts so the code is deployment library agnostic)

### There are two ways you can do dependency injection

1) Create an entire stub for a service and figure it out in the setup layer

```typescript
export class SlackStub {
    public async sendHelloMessage(message: string) {
        // do nothing
    }
}

const setupServices = () => { 
    // ...
    const slack = process.env.NODE_ENV === 'production' ? new Slack(config) : new SlackStub(config)
    // ...
}
```

2) Allow some services to decide what to do

```typescript
export class Slack {
    public async sendHelloMessage(message: string) {
        this.sendMessage(message)
    }

    private async sendMessage (message: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Would have sent a slack message')
            return
        }

        // Do the actual slack notification
    }
}
```

I'm usually in favour of the second since it's less duplication and you don't need to create an interface that multiple classes rely on.

### Testing 

The final benefit we'll mention is you can easily test your services with awesome libraries like sinon.

```typescript
describe('hello function', () => {
    it('sends a slack notification', () => {
        // Given
        const services = { 
            slack: sinon.createStubInstance(slack),
            // ...
        }

        // When
        await helloWorldNoisy(services, {}, { userId: '1234' })

        // Then
        sinon.assert.calledOnce(services.slack.sendHelloMessage)
        sinon.assert.calledWith(services.slack.sendHelloMessage, `Hey there ${user.name}!`)
    })
})
```

The final benefit is that you can switch out services really easily, if you want to use socketIO locally but ably.io remotely for example, pretty simple. It's just normal interfaces after all!

### Some example services we wrote / use:

* JWT

    used to sign and decrypt jwt tokens

* Secrets

    used to get secrets from AWS secret store / local env / elsewhere

* Notification

    used to send notifications within a web application

* Realtime

    sending realtime notifications to ably.io

* S3 Content *(included)*

    doing all the S3 related content work, like file signing (both uploads and cloudfront)

* Local Content *(included)*

    doing file management locally / using express and reaper

* Salesforce

    integrating code with salesforce

The list goes on...

And that's it as a crash course to why we used services!