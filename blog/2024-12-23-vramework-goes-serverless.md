---
title: "Pikku has gone serverless 🚀"  
description: Cloudflare and AWS support has been added
---

# Pikku has just gone serverless 🚀

_Just in time for Christmas!_

I know, the day before Christmas isn’t exactly the best day for announcements, but I’m about to put away my keyboard until next year and wanted one final blog entry before taking a break. And I’m excited to share that Pikku now has **official support** for serverless on AWS and Cloudflare — complete with examples!

This milestone has been really interesting. Different serverless solutions definitely don’t think alike, especially when it comes to websockets. My main goal was to prove Pikku can handle websockets (along with HTTP and scheduled tasks, which were a breeze) and do it all in a way that you can get up and running as quickly as possible.

After a few days of headbanging, we ended up with three new backends in the [workspace-starter](https://github.com/pikku/workspace-starter) repo, each offering a different serverless approach:

---

## 1. Serverless (AWS Lambda)

This is the classic [Serverless](https://www.serverless.com/) setup using a `yaml` file to deploy Lambda functions in AWS. If you want your scheduled tasks and HTTP APIs running in no time, this one’s a solid pick. Just grab the template, follow the instructions, and you’re good to go.

## 2. Serverless Websocket (AWS)

This is also powered by Serverless but kept separate since websockets aren’t everyone’s cup of tea. For those who do need websockets, this example includes a PostgreSQL subscription and channel store. (Normally, AWS suggests DynamoDB, but since we're already on PostgreSQL, why not stick with it?) I’ll share more documentation on these stores in the next release.

## 3. Cloudflare Workers

Last but definitely not least: **Cloudflare Workers**. This lets us deploy HTTP, scheduled tasks, and websocket connections via Cloudflare—a more cost-efficient solution than AWS in many cases. They offer something called a [Websocket server with Hibernation](https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/), which cuts down on costs by suspending the server when there are no connections. Combine that with [Durable Objects](https://developers.cloudflare.com/durable-objects/examples/durable-object-in-memory-state/), and there’s no need for an external database like on AWS.

I’ve only tested this in Wrangler (the offline Cloudflare runner), so it’s still in beta. Depending on feedback, we can also create adapters for other websocket solutions Cloudflare provides.

---

## Wrapping Up

That’s it for now! There are some other improvements (and a few breaking changes) coming soon, but they can wait until next year. 

Have a wonderful holiday season, and see you all in the new year!  