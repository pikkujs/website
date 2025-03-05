---
sidebar_position: 5
title: Personal Motivation
description: The motivation behind creating Pikku
---

Hey there!

Thanks for stopping by. My journey began during the COVID lockdown in a small Indonesian village, where I first built a project called Pikku—the precursor to Pikku. I needed a cost-effective, serverless solution that also allowed for local development with Express. At that time, offline serverless emulators were frustrating, and maintaining endless tests and manual schema updates in typical JavaScript apps felt like a chore.

I longed for a system where types derived directly from the database could flow seamlessly through the entire app, eliminating tedious null exceptions or missing / renamed fields. So, I built a lightweight framework that extracted types from postgres, auto-generated schemas, managed permissions, and handled authentication.

Over the years I have also always ended up using services. I found that developing large applications usually benefited greatly by having logic properly contained (and swappable), specially when trying to deploy things to multiple different environments. Having a framework that makes it intuitive to use and test was extremely important.

Then about a year ago, new work projects emerged that required a solution flexible enough to work both serverless and on traditional servers—for HTTP, cron jobs, and more. That’s when I evolved Pikku into Pikku—a minimal, function-first framework that strips away the fluff so you can focus on your business logic and deploy anywhere. 

Pikku’s focus is on delivering a seamless, simple, type-safe development experience regardless of what and how you deploy. Whether it's Websockets, HTTP or Scheduled Tasks (with more in the making), Pikku empowers you to build scalable, cost-efficient applications with minimal overhead.

In short, Pikku is my answer to modern development complexities—a tool designed to let you spend more time coding your specific logic and less time trying to figure out how to deploy it or integrate different tooling for the common tasks.