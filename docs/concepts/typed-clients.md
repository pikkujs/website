---
sidebar_position: 40
title: Pikku Clients
description: The clients provided by Pikku
---

## Pikku Clients

Pikku offers lightweight, TypeScript-focused clients that seamlessly integrate with web fetch and WebSocket transports and protocols.

![Pikku Client](/img/pikku-fetch.gif)

### Designed for Type Safety and Efficiency

While we aimed to adhere closely to the original specifications, we made subtle enhancements to the APIs to ensure a fully typed experience. The outcome is a minimalistic client that occupies little space in your application while delivering the functionality and ease of use you’d expect from a comprehensive SDK.

### Key Features

- **TypeScript-Native:** Enjoy full type safety and IntelliSense support, enhancing your development workflow.
- **Minimal Footprint:** A tiny client size ensures your application remains lightweight and performant.
- **Enhanced APIs:** Slightly improved APIs provide a more robust and type-safe interaction with your backend services.

### Customization and Extensibility

You have the flexibility to create your own clients tailored to your specific needs. Pikku clients utilize the generated `routes.map.ts` and `channels.map.ts` files, which drive the APIs themselves. This structure allows you to extend and customize the clients while maintaining consistency and type safety across your application.
