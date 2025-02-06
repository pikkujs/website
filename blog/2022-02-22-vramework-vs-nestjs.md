---
title: Why I haven't used nestJS
description: A very high level / personal comparison between the two frameworks
image: nestjs.svg
---

Before I begin, today is 20220222 as an ISO date. I had to blog something!

This article aims to explain why I went with writing Pikku instead of using nestJS. It's mostly for my sanity; since I just took a few months off of development and after returning wondered why I decided to create my own solution 😅.

<!-- truncate -->

So the nestJS philosophy verbatim is:

In recent years, thanks to Node.js, JavaScript has become the "lingua franca" of the web for both front and backend applications. This has given rise to awesome projects like Angular, React and Vue, which improve developer productivity and enable the creation of fast, testable, and extensible frontend applications. However, while plenty of superb libraries, helpers, and tools exist for Node (and server-side JavaScript), none of them effectively solve the main problem of - Architecture.

Nest provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by Angular.

And having worked on (large) projects directly using express/other HTTP servers, I have to admit the Architectural benefits it provides significantly helps sort out the developer landscape.

So, why didn't I go with nestJS?

### Deployment options

My first requirement was to build something that can deploy to functionless servers without including the entire HTTP-server stack across with it. Projects like [serverless-express](https://github.com/vendia/serverless-express) and [guides on how to do it with nest](https://docs.nestjs.com/faq/serverless) exist, but the issue remains that it provides a lot of code bloat to get it working (resulting in increased runtime and costs per invocation). Serverless functions aren't for everyone, especially with their random latency and warm-up times. But at the end of the day, the cost-benefit can work in your favour, especially if you factor in all the extra monitoring required to scale docker/ec2 machines/non-functional services or services that barely ever compute anything.

### Decorators

Certainly a pet peeve, but the fact both Angular and NestJS are relying so heavily on decorators [a language feature that hasn't yet passed stage 2](https://github.com/tc39/proposal-decorators) didn't boost my confidence levels (especially when I first wrote it two years ago). Stage two means it's most likely going to be included in the final spec, so this no longer matters as much.

### Angular inspiration / Services Injection

Now I have been lucky enough to work on dependency injection mechanisms in frontend javascript applications back when XML was still favoured over JSON. And the benefits are great; you get to inject different services depending on whether you're running a test, developing locally, running in the cloud, deploying in an enterprise setting. Generally, having the option to mix and match your 'runtime' requirements is excellent. But the amount of code and decorators and magic required to get it working is sometimes just really hard to wrap your head around. I'm currently working on a project where they are moving from PHP to nestJS, and the number of files used as a scaffold was pretty intense, mainly because they don't even have more than one type of service or interface to exchange.

So I guess my point is, rather than having to do [this](https://docs.nestjs.com/providers):

#### nestJS

```typescript
// Service
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];
  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}

// Controller
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}

// Application Glue
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

I find it a little easier to do [this](https://pikku.io/code/):

#### Pikku

```typescript
// Service
import { Cat } from './interfaces/cat.interface';

export class CatsService {
  private readonly cats: Cat[] = []

  create(cat: Cat) {
    this.cats.push(cat)
  }

  findAll(): Cat[] {
    return this.cats
  }
}

// Controller
export const routes: APIRoutes = [{
  method: 'post',
  route: 'v1/cats',
  func: (services, data) => services.cats.findAll(data),
  schema: 'CreateCat'
}, {
  method: 'get',
  route: 'v1/cats',
  // Normally we don't inline functions but it would make it more minimal.
  func: (services, data) => services.cats.findAll(data),
  schema: 'GetCat'
}]

// Application Glue
export const setupServices = async (config: Config): Promise<Services> => {
    console.time('Services Setup')
    const logger = new LoggerService()
    return {
        logger,
        cats: new CatsService()
    }
  }
}
```

I know that's quite a bit of code, apologies for that. However, the main point I'm trying to get across is that, at least for my coding style and ADD, having very explicit/normal functions makes more sense.

### Seperating HTTP from Logic

#### Data

Okay, so in the examples above, we can see the recommended way in which nestJS lays out its code. You have a controller that the HTTP command gets routed to, and it then parses the required data and passes it onto a service, which tends to be HTTP agnostic.

And that makes a ton of sense; you want to try and keep your HTTP behaviour as far as you can from your domain logic. Because maybe you'll move to WebSockets at some point, or HTTP5 will come out and redefine the world (insert tron code editing gif here). Or, more likely, you want to introduce a breaking HTTP API change and don't want to put the backwards compatibility into your domain layer.

It's pretty hard to argue with the above. In many ways, you can say nestJS is more potent than Pikku because it allows you to directly interact with HTTP requests within the controller. But I guess that's where I wanted to draw my line. I tried to push all the HTTP logic entirely out of the codebase and only specify the REST type and route for each HTTP API to get the data passed on.  

And why did I do that? Mostly because I never really had exposure to any API that required different behaviour over the last few years. Some APIs are XML, others are in text, some use a binary protocol, and most are JSON. But at the end of the day, almost any function pretty much follows the following rules:

    * might expect some data
    * might respond with some data
    * might throw an error if something doesn't quite work out okay
    * might do something with or without data

So rather than specifying things like:

```typescript
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

I instead make the following assumption. If I receive any data, it will follow the next set of rules:

1) Get query parameter data
2) Get path parameter data
3) Get body data
4) Merge them all
5) Provide them to the function

Currently, there is a rule of precedence, which means it overwrites the values when merging. But it probably makes sense to add a validation rule to throw an error if the values don't match going forward to avoid odd API usage.

#### Errors

Errors following a similar thought pattern. In nestJS, it has a concept of a [HttpException](https://docs.nestjs.com/exception-filters), which means if something goes wrong in your controller, you end up throwing an exception which is either HTTP based or extends an HTTP error. So if something happens in your HTTP agnostic service layer, you throw a standard JS error, which is then caught in your controller and translated to something HTTP based.

In Pikku, we again limit the flexibility of what an error can do. If you throw an Error, you usually want to provide a status code, a message, and a potential payload.

So it would look something like this:

```typescript
import { addErrors, EError } from '@pikku/backend-common/src/errors'
class CatNotFoundError extends EError {
    // This payload will be forwarded to the client if set
    public payload: Record<string, any> = {}
    constructor (bookId: string) {
        this.payload = { bookId }
    }
}
addErrors([CatNotFoundError,  { status: 404, message: 'error.cat_not_found' }])
```

Is it significantly different? Not really. But it's less documentation and verbosity - no filters or decorators needed. The extends EError is a javascript issue to get around `instanceof` not working with node_modules. That was a painful discovery 😂.

#### Typescript

Pikku is tightly bound to typescript. It automatically creates JSON validation schemas from your data types. If you're using Postgres or MySQL, it can even directly link to your data schemas to enforce the data model. So there are no DTOs, which means you also lost some of the extra functionality it provides (like default values).

#### Request Scoped Services

Honestly don't know if this is a thing you can do in nestJS or not. But in Pikku, you can lazy load services for each HTTP request.

A couple of example benefits in my projects:

- You can get any of the headers from the request via the HeaderService, which hides away HTTP requests (useful for stubbing in tests)
- You can get a custom database service per request. That means if something fails, it would automatically roll back everything. Also, having session data set on a transaction makes audit logs a breeze. You can see this in [typed-postgres](https://www.npmjs.com/package/typed-postgres)
- You can prefix all logs for a request with a UUID for better traceability
- Etc

### The good stuff

So I want to re-acknowledge that nestJS is a really powerful framework. If I didn't have a lot of time to kill during the first lockdown, plus wanting to understand the HTTP stack I'm working with (previously, I only ever used sockets, all the way back to long polling in IE6 😅). 

Things that nestJS does that Pikku doesn't / is lacking:

1) Documentation, conferences, community, almost 300 contributors
2) Lots of tests
3) Ability to tree shake depending on what services you inject
4) Documentation (This needs a second mention!)
5) The whole ecosystem of express and fastify (can be used in Pikku, but less likely on the developers' end).

## Summary

So yeah, I guess I convinced myself to keep using pikku and seeing how it goes 😅😁. If anyone reading this is interested, let me know. Happy to invest the time into writing better docs and example repos. It takes quite a bit of time, so I would instead focus on some of my projects in the meantime!

## Shameless Plug 

If you reached this part, thank you! I would love any form of feedback, whether I should use more kitten gifs or possibly less or more code examples.

I'm also currently contracting in the UK and have a strong background in nodeJS, react, terraform, AWS, real-time tech, CI and the general JS ecosystem. If you have a project you think I could help out with, feel free to contact me at yasser.fadl@vlandor.com. 