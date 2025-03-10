---
sidebar_position: 40
title: User Sessions
description: Validating sessions
---

User sessions are crucial for managing **security**, **auditing**, and 
**metrics** in modern applications.

When needed, Pikku provides the entry points to providing session services.

This is supported by a combination of [middleware](../core/middleware.md) and the [userSessionService](../api/user-session-service.md) which is used by HTTP and Websockets.

Channels also allow you to change the user session anytime during their lifetime. This can be done by calling `userSessionService.set(<user session>)` from any channel function.