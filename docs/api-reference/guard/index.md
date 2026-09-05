---
title: 'Guard it'
sidebar_position: 0
description: 'Who may call a function, and under which scope or role.'
---

# Guard it

Who may call a function, and under which scope or role.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/auth`](./auth.md) | 7 | Who may call a function, and what the call is made with: permissions that see the request, auth gates that run before it, and the credentials a function borrow… |
| [`#pikku/scopes`](./scopes.md) | 2 | The scopes a caller can hold and the roles that grant them, gating a call outside the permission pool. |
