---
title: Service Lookup Continued
description: A bit more detail as to why we use service lookups
image: cloud-service
---

So I got some great feedback on hackernews on a couple of things and wanted to write a bit more of an opinion piece.

<!-- truncate -->

First, some commenters informed me that the term `service injection` is incorrect -  it should be `service lookup`. I will be updating the docs on the site accordingly!

So the first thing I need to clarify is that all functions receive a `service lookup` object that contains a list of all the different services you can use. Usually, the services include message queues, database, cache, and a selection of other things.

If you want to skip to my pro/cons, that's the last section!

### Brief History

The first time I started using `service lookups` was in a frontend framework where the idea was that you could quickly develop components in the frontend vs stubbed or real services by just setting the environment. Doing so was incredibly important because it was a FinTech solution where we had to simulate lots of different states. We provided fake data to test results (connection status, prices, etc.) via workbench tools. Doing so allows us to avoid having to write stub backend services. Those would need to do the whole roundtrip through the server (which would have been a hassle, especially since our backend language selection was Java or C).

Then came the real-time node server [deepstream.io](https://deepstream.io/). Deepstream is a super flexible real-time node server where you can swap out any of the subcomponents via a plugin architecture. You can use any cache (Redis/Memcache), database (Postgres/MongoDB), clustering mechanism (vertical scaling/Redis pub-sub), permissions layer (config based/function-based), protocol layer (WebSocket, uWS, MQTT, HTTP). Without using a form of interface, it would have been tough to connect all those systems. Having the services passed in made it much easier to allow different APIs to talk to each other.

Finally came deepstreamHub, the enterprise version of deepstream.io. deepstreamHub required us to allow things to run locally for enterprise machines and use AWS services for the cloud offering. We managed to get the entire thing running on Kubernetes and via local services in less than a day using service lookups.

### Pikku

I started working on personal projects after deepstreamHub, and I was doing so while travelling due to the failed startup misery recovery process. So my main requirement was that everything should work offline. I didn't want to deal with flaky connections, and to be honest, I was coding for fun, so constantly deploying wasn't the top of my requirements!

I also personally love the idea behind koa and other abstraction layers that remove the concept of HTTP from your core code. 

I used that sort of approach for having the same API code being consumed by:

  1) using deepstream.io RPCs
  2) using WebSocket connections as a mode of transport (similar to [featherJS](https://feathersjs.com/))
  3) HTTP

Also, just having unit tests run without needing to load up express or mock out singletons is a nice benefit IMO

So developing locally, I use:

  1) A local secret store
  2) A local Postgres
  3) An empty email service
  4) A local file service / uploader (express + reaper)

And deploying on AWS, I use:

  1) AWS Secrets
  2) AWS RDS Postgres
  3) SES (although I'm moving to SendGrid)
  4) AWS S3 + Cloudfront for private content

When developing locally, the services are:

```typescript
export interface SingletonServices {
    secrets: LocalSecretStore
    database: PostgresClient
    email: LocalEmailService
    content: LocalContentService
}
```

Let's take a deeper dive into the ContentService interface:

```typescript
export interface ContentService {
  // This signs the content key so that cloudfront can serve it (if private)
  signContentKey: (contentKey: string) => Promise<string>
  // This returns the upload url required to upload the file, and the assetKey to usually save in the database
  getUploadURL: (contentKey: string, contentType: string) => Promise<{ uploadUrl: string; assetKey: string }>
}
```

So what this does here is mimic the API required for uploading and sharing files in S3 and Cloudfront.

I use two different implementations, one for local development and one for AWS:

Locally I used reaper in express:

```typescript
public async signURL(url: string): Promise<string> {
  return `${url}?signed=true`
}

public async signContentKey(assetKey: string): Promise<string> {
  return `http://localhost:4002/assets/${assetKey}?signed=true`
}

public async getUploadURL(assetKey: string) {
  this.logger.info(`going to upload with key: ${assetKey}`)
  return {
    uploadUrl: `http://localhost:4002/v1/reaper/${assetKey}`,
    assetKey
  }
}
```

And with AWS, I use AWS APIs:


```typescript
public async signURL(url: string) {
  try {
    return getCDNSignedUrl(url, this.signConfig)
  } catch (e: any) {
    this.logger.error(`Error signing url: ${url}`)
    return url
  }
}

public async getUploadURL(Key: string, ContentType: string) {
  const command = new PutObjectCommand({
    Bucket: `content.${this.config.domain}`,
    Key,
    ContentType,
  })
  return {
    uploadUrl: await getS3SignedUrl(this.s3, command, {
      expiresIn: 3600,
    }),
    assetKey: Key
  }
}
```

And in any API, I can now do:

```typescript
const getSignedUrl = pikkuFunc<SignFileUpload, SignFileUploadResult>(async ({ content }, data, session) => {
  const { key, contentType } = generateKey(session.userId, data)
  const { uploadUrl, assetKey } = await content.getUploadURL(key, contentType)
  return {
    uploadUrl,
    assetKey,
  }
})
```

If running locally, it would then live in a `.upload` directory on my dist. If running vs AWS, it would then live in the bucket. Same paths and everything. It can even go as far as to check if the content is `private access` or not for complete testing.

So now multiply this by the number of services used (as mentioned in pt1, we use notification services, salesforce, hologram, etc.).

### Notes

#### Why not just use the cloud? It's the actual environment!

So I get this point a lot when I talk to people about local vs cloud development. My *(personal)* opinion is that companies that spin-up entire AWS accounts for each developer are going at it wrong. I know that's a strong statement, and I don't mean offence. Conflicting opinions are what leads to so many exciting solutions!

The reason I think it's wrong is that:
1) it's slow (to apply infra changes everywhere)
2)  it's hard to decouple from those services if you ever decide to ship an enterprise edition or move to another cloud suddenly (like cloudflare if AWS costs are too insane)
3) it's pretty expensive
4) debugging is occasionally a pain compared to locally

The main question I usually like to ask is: what benefit do you get out of it? In the case of `aws incognito`, I understand implementing user management is a pain. However, what's the downside of running rabbitMQ locally vs creating an SQS queue? Or not sending real-time notifications into the void? Or not uploading useless files inside of S3?

Is it possible we got a bit too excited about current settings and just ended up uploading our functions to serverless via hot deploy because we can? Or that docker and Kubernetes are so incredible that we run complex infrastructure locally to mimic production, regardless of the CPU/Memory overhead? Running my side projects on the side, I sure don't want to tell anyone who helps that I'll need to give them AWS access to add a few simple features.

#### Why not use factory methods and stick to it is more functional?

That works entirely. I didn't want to create factory methods because I  like the autocompletion provided by just writing `services` and seeing what shows up. So far, I have built a few complex SaaS products with a maximum of ten services. Also, factories require the same amount of work to be set up as services.

#### Using singleton services is not the same as using global state

I mean, it is, but it isn't. It is because you can only have one, and hence the state is just encapsulated within a scope similar to global. But it isn't because being encapsulated and part of a simple lifecycle manager provides benefits instead of just having it imported.

Let's take a database connection. I worked on a few projects that do this:

```typescript
import pg from 'pg'
import { dbCredentials } from 'config'

const pool = new Pool(dbCredentials)

const doSomething = async () => {
    const connection = await this.pool.connect()
    // do something with connection
    await connection.release()
}

process.on('SIGINT', () => {
    // cleanup pool
})

export default pool
```

Now, this isn't wrong, but it will create that instance whenever someone imports that class. Also, if you want to pass in your credentials from somewhere else, like the secret service, you need to use async loading to ensure that it was loaded first, which is also a hassle.

If you instead go with:

```typescript
import pg from 'pg'
import { dbCredentials } from 'config'

export class Database {
    public pool: Pool

    constructor (dbCredentials: any) {
        this.pool = new Pool(dbCredentials)
    }

    public async isReady () {
       // check connection works 
    }

    public async close () {
      // cleanup pool
    }
}
```

You now benefit from not having to depend on process calls (which is helpful since the order of teardown occasionally matters). You can also ensure you create it after you retrieve the DB credentials from another async service. And you can ensure the connection details work. Yes, it adds a couple of milliseconds to startup time, but it's easier to validate fails on startup than when it's needed.

#### You can also quickly mock imported singletons in node. It is a bit dirtier but possible.

But why? I have written a lot of tests, and mocking services was always a huge pain (proxyquire in my experience). Why not just put a simple API on top and let Sinon mock it out for you in seconds?

```typescript
 // Given
const services = { 
    database: sinon.createStubInstance(Database)
}
```

#### Non singleton services

It's worth also mentioning again that we use both singleton services (pool database connections, realtime services) and session services (client database connections, header services, etc). The main difference is a session service is create for each request and is aware of the actual user session / user request. This is useful for things like having a transaction automatically create in the database with the correct session id set (for automatic audit logs) or anything else.

#### Singleton services are not local state holders!

This part is pretty important. Singleton services are singletons only because they sometimes need to hold a connection! They should never be used to share details across multiple invocations. This isn't something I can guarantee but it's the same as any lambda invocation. If it isn't on an external disk don't be upset if it gets lost! The only reason they are singletons and not functions is because of database pools / the way configuration works in certain third party APIs. A service could just be an object you pass in if you want (`isReady` and `close` APIs are optional). 

#### Not for everyone

I completely get how alot of people prefer doing things differently. There isn't always a right or wrong! I hope I provided a few insights into why I find this approach easier though.

### Feedback wanted

I would love some feedback on why you think this might be a terrible approach. I understand that dependency injection / service lookups in other solutions can get very complex and involve config files and hair pulling. If there's anything you think can be improved or products in common please let me know!