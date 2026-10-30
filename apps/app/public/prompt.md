# Pikku — get set up, then load the right skill

You are an AI agent. This file gets Pikku and its skills onto this machine and
tells you which skill to load. After that it is done: the skill owns the work, so
do not carry on from this file.

Everything here is open source and needs no account.

## 1. Decide what this is

If the request already makes it clear, do not ask. Otherwise ask exactly one
question:

> Is this a **new project**, a **conversion of an existing app**, or an **n8n
> workflow import**?

| It is | You load |
|---|---|
| A new project | `pikku-build` |
| A conversion of an existing app | `pikku-software-archaeology` on the old code, then `pikku-build` to rebuild it, with `pikku-convert-screen` for each old screen or page |
| An n8n workflow import | `pikku-n8n-import` |

## 2. Set up

A new project and a conversion both start from a fresh Pikku project:

    bun create pikku@latest --name <app-name> --package-manager bun --skip-install
    cd <app-name>
    bun install

Install is a separate step on purpose: the scaffolder's built-in install can be
intercepted by corepack, which does not support bun, and fail quietly. Run
`ls node_modules | head` and confirm it is not empty before going on.
(`npm create pikku@latest` works the same if bun is missing.)

An n8n import runs inside a Pikku project, so use the one you are in, or make one
the same way if you are not in one.

Then install the skills. This writes them to disk and loads nothing, so it costs
you no context:

    bunx --bun pikku skills install

For pi add `--agent pi`, for opencode add `--agent opencode`. For those two, the
skills that are pipeline stages also become subagents you can run.

## 3. Load the skill and hand over

Read `SKILL.md` for the skill you chose in §1, from your skills directory, and
follow it. **The skills are the spec.** If you are about to guess at an API, there
is a skill for it: read that instead.

For `pikku-build`, follow its "Which mode" table. A new project is the full, real
version unless the person said **"quick"** (a spike or a demo) or **"platform"**
(everything Pikku does, to prove it). Read only the references it sends you to.

Before your first screen, read `AGENTS.md` at the project root. When the dev
server is up and when you hand over, print the links `bun run dev` printed: the
app and the API.

## Reference

- API surface, every door you import from and what each exports: https://pikku.dev/api-surface.md
- Issues, and where to send anything the skills got wrong: https://github.com/pikkujs/pikku/issues
