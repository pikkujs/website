import type { SurfaceEntryPoint, SurfaceLeaf, SurfaceStep } from './surface.types';

/* ════════════════════════════════════════════════════════════════
   Copied from packages/console/src/components/surface/surface-steps.ts.

   The prose is the console's, word for word, because the order and the
   sentences are what the page teaches — a second wording of the same six
   steps would be a second product.

   `isEntrypoint` is not here: static/api/surface.json is written with that
   filter already applied (scripts/generate-api-surface.mjs), so the type and
   interface exports never reach the client at all.
   ════════════════════════════════════════════════════════════════ */

export interface StepDefinition {
  step: SurfaceStep;
  /** What the reader is doing here, in the words they would use themselves. */
  prose: string;
}

export const STEPS: StepDefinition[] = [
  {
    step: 'create a function',
    prose:
      'Everything starts as a function. It receives its data without knowing whether that arrived as a path param, a query string, a message body or a queue job, so nothing you write here has to be rewritten when the transport changes.',
  },
  {
    step: 'enhance it',
    prose:
      'Give it the things a function needs to be worth calling: typed errors it can throw, configuration it can read, and secrets and credentials it never has to hold itself.',
  },
  {
    step: 'wire it up',
    prose:
      'Now decide how the outside world reaches it. Each wiring is one call, and a function can carry several — the same handler answering an HTTP route, a queue job and an MCP tool.',
  },
  {
    step: 'guard it',
    prose:
      'Say who may call it. Sessions come from auth, scopes gate the call outside the permission pool, and neither lives inside the function body.',
  },
  {
    step: 'orchestrate it',
    prose:
      'Compose functions into something longer-running: a workflow with durable steps and retries, or an agent that chooses which of them to call.',
  },
  {
    step: 'test it',
    prose:
      'Drive the whole thing the way a user would, in scenarios that run against a real server rather than a mocked one.',
  },
];

export interface StepGroup {
  step: SurfaceStep;
  prose: string;
  leaves: SurfaceLeaf[];
}

export const stepsOf = (entryPoint: SurfaceEntryPoint): StepGroup[] =>
  STEPS.map(({ step, prose }) => ({
    step,
    prose,
    leaves: entryPoint.leaves.filter((leaf) => leaf.step === step),
  })).filter((group) => group.leaves.length > 0);

export const proseFor = (step: SurfaceStep): string =>
  STEPS.find((each) => each.step === step)?.prose ?? '';
