---
title: UI Packages
description: Mantine, layout panels, workflow graphs, agent chat and voice
---

# UI Packages

Beyond the React client hooks, Pikku publishes the UI pieces its own console and
templates are built from. They are optional — an app can use `@pikku/react`
alone — but they encode conventions (i18n gates, viewport layout, graph layout)
that are otherwise rebuilt by hand.

## `@pikku/mantine`

Mantine components with i18n-tightened types: the component props that render
display text accept the `I18nNode` gate, so untranslated copy is a type error
rather than a review comment. It re-exports the Mantine components, overriding
the text-bearing ones.

```bash
npm install @pikku/mantine
```

| Entry | What it provides |
| --- | --- |
| `@pikku/mantine/core` | The gated component set (`Button`, `Anchor`, `Badge`, `Text`, `NavLink`, …) plus the rest of Mantine's exports |
| `@pikku/mantine/theme` | The shared Pikku theme |
| `@pikku/mantine/dev` | The rendered dev actor switcher, built on the logic in `@pikku/react` |

## `@pikku/react-layout-panel`

Viewport-bound React layout primitives — a shell, scrollable panels, a stage, a
phone tab bar and sheet, and a nav dock. It is what keeps a desktop-style console
and a phone-sized app sharing one component tree.

```typescript
import {
  Shell, ShellRow, Stage, Panel, Sheet,
} from '@pikku/react-layout-panel'
```

## `@pikku/workflow-graph`

Renders a Pikku workflow as an interactive graph — the same view as the console's
workflow page.

```typescript
import { WorkflowGraphView, WorkflowGraphFlow, createWorkflowFlow, useElkLayout } from '@pikku/workflow-graph'
```

- `WorkflowGraphView` — the ready-made graph for a workflow's meta
- `WorkflowGraphFlow` with `nodeTypes` / `edgeTypes` — the underlying flow for
  custom layouts
- `createWorkflowFlow` / `useElkLayout` — build the flow data and run ELK layout

## `@pikku/assistant-ui`

[assistant-ui](https://www.assistant-ui.com) bindings for Pikku AI agents:
runtime, approvals and message conversion.

```typescript
import { PikkuAgentChat, useFileAttachment, modelSupportsVision } from '@pikku/assistant-ui'
```

`PikkuAgentChat` is the drop-in chat surface; `useFileAttachment` handles
upload-then-send attachments, and `modelSupportsVision` reports whether the
selected model can accept them.

## `@pikku/voice-agents`

Headless browser primitives for voice conversations with Pikku AI agents:
persistent microphone, silence detection, speech playback and barge-in.

```typescript
import {
  VoiceSession,
  AudioPlaybackQueue,
  detectSilence,
  spokenApproval,
  interpretConsent,
  useVoiceConversation,
  useAudioInputs,
} from '@pikku/voice-agents'
```

The package is headless on purpose — it owns microphone capture, playback and
turn-taking, and leaves the UI to you. `spokenApproval` / `interpretConsent`
cover the approvals a voice agent needs before acting.

## Next Steps

- **[React](./react.md)** — provider, hooks and dev actors
- **[Internationalization](./i18n.md)** — the message gate Mantine enforces
- **[AI Agents](../wiring/ai-agents/index.md)** — the agents these UIs talk to
