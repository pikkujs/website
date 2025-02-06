---
sidebar_position: 40
title: User Sessions
description: Validating sessions
---

User sessions are crucial for managing **security**, **auditing**, and 
**metrics** in modern applications.

When needed, Pikku provides the entry points to providing session services.

Currently this is supported by the [http session service](../22-http/20-http-session-service.md) which is used by HTTP and Websockets.

Websockets also allow you to change the user session anytime during the session. You can see how this is done [here](../23-channels/20-channel-route.md)