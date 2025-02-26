---
sidebar_position: 40
title: User Sessions
description: Validating sessions
---

User sessions are crucial for managing **security**, **auditing**, and 
**metrics** in modern applications.

When needed, Pikku provides the entry points to providing session services.

Currently this is supported by the [http session service](../http/http-session-service.md) which is used by HTTP and Websockets.

Channels also allow you to change the user session anytime during their lifetime. You can see how this is done via [setSession](../channels/channel-functions.md.