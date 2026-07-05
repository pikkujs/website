---
title: EmailService
ai: true
---

The EmailService sends outbound email — plain text, HTML, or rendered templates. It is registered as the `emailService` singleton service and is available in functions via `services.emailService`.

## Interface

```typescript reference title="email-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/email-service.ts
```

## Methods

### `send(input: SendEmailInput): Promise<SendEmailResult>`

Sends an email.

- **Parameters:**
  - `input`: One of three shapes (see below) plus common envelope fields
- **Returns:** Promise resolving to `{ messageId? }`

`SendEmailInput` is a union — provide exactly one of `text`, `html`, or `template`:

| Shape | Fields |
|-------|--------|
| Text | `{ text: string }` |
| HTML | `{ html: string, text?: string }` — optional plain-text fallback |
| Template | `{ template: { name, locale?, data? } }` — rendered server-side by name |

All shapes share the envelope fields: `to` (string or array), and optional `from`, `cc`, `bcc`, `replyTo`, `headers`, `subject`.

## Usage Example

```typescript
export const sendWelcomeEmail = pikkuFunc<{ email: string; name: string }, void>(
  async (services, data) => {
    await services.emailService.send({
      to: data.email,
      subject: 'Welcome!',
      template: {
        name: 'welcome',
        data: { name: data.name },
      },
    })
  }
)
```

## Implementations

### LocalEmailService (built-in)

Logs the email as structured JSON to the console instead of sending — the development default, so `pikku dev` can capture and preview outbound mail without a provider.

```typescript
import { LocalEmailService } from '@pikku/core/services'
const emailService = new LocalEmailService()
```

```typescript reference title="local-email-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-email-service.ts
```

### Production providers

Provider integrations (Resend, SES, SMTP, …) ship as addons or are implemented in your project — the interface is a single `send` method, so wrapping any provider SDK is a few lines:

```typescript
import type { EmailService, SendEmailInput, SendEmailResult } from '@pikku/core/services'

class ResendEmailService implements EmailService {
  constructor(private resend: Resend, private defaultFrom: string) {}

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const { data } = await this.resend.emails.send({
      from: input.from ?? this.defaultFrom,
      to: input.to,
      subject: input.subject ?? '',
      html: 'html' in input ? input.html : undefined,
      text: 'text' in input ? input.text : undefined,
    })
    return { messageId: data?.id }
  }
}
```

## Registration

```typescript
const singletonServices = await createSingletonServices(config, {
  emailService: new LocalEmailService(),
})
```
