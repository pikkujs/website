import React, { useState } from 'react'
import Link from '@/components/site/Link'
import { Blob } from '@pikku/theme-brand'
import { FanScene } from './FanScene'
import { LayersScene } from './LayersScene'
import { TypesScene } from './TypesScene'
import { DeployScene } from './DeployScene'
import { NextScene } from './NextScene'
import './studio-home.css'

const GITHUB = 'https://github.com/pikkujs/pikku'

function CopyCmd({ cmd }: { cmd: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="cmd"
      aria-label={`Copy ${cmd}`}
      onClick={() => {
        try {
          void navigator.clipboard.writeText(cmd)
        } catch {
          /* clipboard unavailable: the command is still on screen */
        }
        setDone(true)
        setTimeout(() => setDone(false), 1600)
      }}
    >
      <span aria-hidden="true">$</span>
      {cmd}
      <span className="hand text-xl text-claydeep" style={{ minWidth: '3.2rem' }}>
        {done ? 'copied!' : 'copy'}
      </span>
    </button>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 md:pt-16 pb-12 md:pb-20 grid md:grid-cols-[1.05fr_1fr] gap-8 md:gap-6 items-center">
      <div>
        <p className="hand text-2xl text-clay -rotate-2 mb-3">hello, I'm Pikku. Let's build something.</p>
        <h1 className="display text-[2.6rem] leading-[1.02] sm:text-6xl md:text-[4.3rem] font-semibold">
          Write it once. <span className="scribble">Ship every app.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-soft max-w-xl leading-relaxed">
          Pikku is an open-source TypeScript framework. Write your functions once and ship them as a
          web, mobile, desktop, CLI and MCP app, on the database, auth, queue and AI you choose.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CopyCmd cmd="npx pikku dev" />
          <Link to="/getting-started" className="btn-ink">
            Get started
          </Link>
          <Link to="/docs" className="btn-line">
            Read the docs
          </Link>
        </div>
        <p className="mt-5 text-sm text-soft">
          Open source. It runs on your own machine, and what you build is yours to keep.
        </p>
      </div>
      <figure className="relative m-0">
        <FanScene />
        <figcaption className="hand text-xl text-soft mt-2 text-center">
          same function, new colours for every job
        </figcaption>
      </figure>
    </section>
  )
}

const STACK: { name: string; what: string; why: string; ink: string; wash: string }[] = [
  {
    name: 'TanStack',
    what: 'Start loaders, actions and server routes',
    why: 'Your pages call your functions directly, so there is no second API layer to write and keep in sync.',
    ink: 'var(--hue-ochre)',
    wash: '#efd9a9',
  },
  {
    name: 'React',
    what: 'The web app is plain React',
    why: 'It imports a generated, typed client. Rename a function and the compiler shows you every screen that used it.',
    ink: 'var(--hue-slate)',
    wash: '#c9dbe2',
  },
  {
    name: 'better-auth',
    what: 'Sign-in, sessions and API keys',
    why: 'The session becomes the caller of your function, so the same permission check runs on HTTP, queues and MCP alike.',
    ink: 'var(--hue-rose)',
    wash: '#ecc7cf',
  },
  {
    name: 'Vercel AI SDK',
    what: 'Runs your AI agents',
    why: 'Any provider the SDK supports works, so you change models with a string, not a rewrite.',
    ink: 'var(--hue-plum)',
    wash: '#ddd0ea',
  },
  {
    name: 'Tauri',
    what: 'Desktop, iOS and Android shells',
    why: 'The same web app ships as an installable app, with the backend bundled in when you want it offline.',
    ink: 'var(--hue-moss)',
    wash: '#d7e3c8',
  },
  {
    name: 'Kysely',
    what: 'Typed SQL',
    why: 'Queries are checked against your schema, and the types flow on into your functions and your client.',
    ink: 'var(--hue-teal)',
    wash: '#bfe0d9',
  },
  {
    name: 'Bun',
    what: 'A fast runtime and a single binary',
    why: 'Run your server on Bun, or compile the whole app into one executable you can copy anywhere.',
    ink: 'var(--hue-clay)',
    wash: '#f1d9c4',
  },
  {
    name: 'MCP',
    what: 'Model Context Protocol',
    why: 'Any function can be a tool an AI assistant calls, with the same auth and validation as everything else.',
    ink: 'var(--hue-indigo)',
    wash: '#d3d8ef',
  },
  {
    name: 'SQLite & Postgres',
    what: 'Local file or real server',
    why: 'Start on a file on your laptop and move to Postgres later. Your functions only see the interface.',
    ink: 'var(--hue-ochre)',
    wash: '#efd9a9',
  },
]

function Stack() {
  return (
    <section className="bg-paper2/70 border-y-2 border-dashed border-ink/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="hand text-2xl text-clay">the decisions are already made</p>
          <h2 className="display text-4xl md:text-5xl font-semibold leading-tight mt-1">
            Built on open source you already know.
          </h2>
          <p className="mt-4 text-lg text-soft leading-relaxed">
            Pikku ties together the tools people already pick, so week one isn't glue. Ignore any of
            them and Pikku just turns off the parts that look at it. Nothing breaks.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
          {STACK.map((s, i) => (
            <li key={s.name} className="tech" style={{ ['--wash' as string]: s.wash }}>
              <div className="flex items-center gap-3">
                <span className="tech-dot" style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
                  <Blob pose="blob" className="w-9 h-9" color={s.ink} />
                </span>
                <h3 className="display text-xl font-semibold">{s.name}</h3>
              </div>
              <p className="hand text-xl mt-3 text-soft">
                {s.what}
              </p>
              <p className="mt-1 text-soft leading-relaxed">{s.why}</p>
            </li>
          ))}
          <li
            className="tech tech-more"
            style={{ borderStyle: 'dashed', background: 'transparent' }}
          >
            <h3 className="display text-xl font-semibold">and more</h3>
            <p className="hand text-xl text-claydeep">Express, Fastify, Redis, NATS, BullMQ…</p>
            <p className="text-soft leading-relaxed">
              Each one is a small adapter behind an interface, so adding yours is a few lines.
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}

const LAYERS: { title: string; body: string }[] = [
  {
    title: 'Apps',
    body: 'A web app, the same web app wrapped for iOS and Android with Tauri, a desktop app with the backend bundled in, a CLI and an MCP server. They all call the same functions.',
  },
  {
    title: 'Your functions',
    body: 'Logic lives in one place. Auth, validation and permissions follow every function onto every wire, so you never write them twice.',
  },
  {
    title: 'Whatever is underneath',
    body: 'The database, queue, scheduler, email, secrets and AI are interfaces. Swap one for another, or leave the default. Your functions never notice.',
  },
]

function Layers() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="hand text-2xl text-clay">three layers</p>
        <h2 className="display text-4xl md:text-5xl font-semibold leading-tight mt-1">
          Apps on top. Backend underneath. Pikku in the middle.
        </h2>
        <p className="mt-4 text-lg text-soft leading-relaxed">
          Either side can change without rewriting the other, and the whole thing is ordinary
          TypeScript you can open, read and change.
        </p>
      </div>
      <div className="mt-10 md:mt-14">
        <LayersScene />
      </div>
      <ol className="mt-10 grid gap-8 md:grid-cols-3 list-none p-0">
        {LAYERS.map((l, i) => (
          <li key={l.title}>
            <p className="hand text-2xl text-clay">{i + 1}</p>
            <h3 className="display text-2xl font-semibold">{l.title}</h3>
            <p className="mt-2 text-soft leading-relaxed">{l.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

const PICKS: { row: string; hint: string; items: string[]; fill: string }[] = [
  { row: 'Wire it', hint: 'how the world reaches a function', items: ['HTTP', 'WebSockets', 'Queues', 'Cron', 'MCP', 'AI agents', 'CLI'], fill: '#c9dbe2' },
  { row: 'Store it', hint: 'where the data lives', items: ['SQLite', 'Postgres', 'Redis', 'MongoDB'], fill: '#efd9a9' },
  { row: 'Run it', hint: 'where the code runs', items: ['Cloudflare', 'Lambda', 'Node', 'Bun', 'Express', 'Fastify'], fill: '#d7e3c8' },
]

const RECIPES: { title: string; mix: string }[] = [
  { title: 'A chat app', mix: 'WebSockets + Postgres + an AI agent, on Node' },
  { title: 'A nightly report', mix: 'Cron + SQLite + a mail addon, on a small server' },
  { title: 'An assistant tool', mix: 'MCP + your existing functions, on Cloudflare' },
]

function Modular() {
  return (
    <section className="bg-paper2/70 border-y-2 border-dashed border-ink/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="hand text-2xl text-clay">pick, snap, ship</p>
          <h2 className="display text-4xl md:text-5xl font-semibold leading-tight mt-1">Modular.</h2>
          <p className="mt-4 text-lg text-soft leading-relaxed">
            Every piece is a plugin you can swap, and none of them know about each other. Mix and
            match what you need and you can build almost anything, within the types. If two pieces
            don't fit, the compiler says so before you ship.
          </p>
        </div>
        <div className="mt-10 grid gap-5">
          {PICKS.map((p) => (
            <div key={p.row} className="grid md:grid-cols-[11rem_1fr] gap-2 md:gap-6 items-center">
              <div>
                <h3 className="display text-2xl font-semibold">{p.row}</h3>
                <p className="hand text-lg text-soft">{p.hint}</p>
              </div>
              <ul className="flex flex-wrap gap-3 list-none p-0">
                {p.items.map((it, i) => (
                  <li
                    key={it}
                    className="block-piece"
                    style={{ background: p.fill, transform: `rotate(${[-1.5, 1, -0.5, 1.5][i % 4]}deg)` }}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="hand text-2xl text-clay mt-10 -rotate-1">a few mixes</p>
        <ul className="mt-3 grid gap-4 md:grid-cols-3 list-none p-0">
          {RECIPES.map((r) => (
            <li key={r.title} className="torn px-6 py-6">
              <h3 className="display text-2xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-soft leading-relaxed">{r.mix}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Framework() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 md:pb-24">
      <div className="grid md:grid-cols-2 gap-14 md:gap-12">
        <div>
          <h3 className="display text-3xl md:text-4xl font-semibold leading-tight">
            Types stitched from server to screen.
          </h3>
          <p className="mt-3 text-soft text-lg leading-relaxed">
            The types generated from your database and your functions flow all the way through the
            generated client to the interface, so a mismatch is caught before it ships.
          </p>
          <TypesScene />
        </div>
        <div>
          <h3 className="display text-3xl md:text-4xl font-semibold leading-tight">
            Carry it anywhere.
          </h3>
          <p className="mt-3 text-soft text-lg leading-relaxed">
            The same app runs serverless, on Cloudflare, or on a plain server you rent. Start on
            your laptop, choose a home later, and move house without a rewrite.
          </p>
          <DeployScene />
        </div>
      </div>
      <div className="mt-20 md:mt-28 torn px-6 py-8 md:px-12 md:py-12 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center">
        <Blob pose="blob" className="w-24 h-24 md:w-32 md:h-32 text-moss" />
        <div>
          <h3 className="display text-3xl md:text-4xl font-semibold leading-tight">
            Hundreds of addons. 120,000+ endpoints.
          </h3>
          <p className="mt-2 text-soft text-lg leading-relaxed max-w-2xl">
            Addons reach the rest of the world, from payments to mail to every OpenAPI service we
            could find. Every one is typed, and you can write your own.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/addons" className="btn-line">
            Browse the addons
          </Link>
        </div>
      </div>
    </section>
  )
}

function Close() {
  return (
    <section className="band relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <p className="hand text-2xl" style={{ color: '#f0a56f' }}>
              go on, try it
            </p>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] mt-1">
              One command to start.
            </h2>
            <p className="mt-5 text-lg max-w-xl leading-relaxed" style={{ color: '#d9cdb9' }}>
              Run it in a new folder and you have a working app on your own machine. Open source, no
              account, nothing to sign up for.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyCmd cmd="npx pikku dev" />
              <Link to="/getting-started" className="btn-ink">
                Get started
              </Link>
              <a href={GITHUB} className="btn-line">
                View on GitHub
              </a>
            </div>
          </div>
          <NextScene />
        </div>
      </div>
    </section>
  )
}

export default function StudioHome() {
  return (
    <div className="sh">
      <main>
        <Hero />
        <Stack />
        <Layers />
        <Modular />
        <Framework />
        <Close />
      </main>
    </div>
  )
}
