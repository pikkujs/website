import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { Pk, Symbols } from './Pk'
import { FanScene } from './FanScene'
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
      <span className="hand text-xl text-clay" style={{ minWidth: '3.2rem' }}>
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

const STACK = ['TanStack', 'React', 'better-auth', 'Vercel AI SDK', 'Tauri', 'Kysely', 'Bun', 'MCP', 'SQLite & Postgres']

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
        <ul className="mt-10 flex flex-wrap gap-3 list-none p-0">
          {STACK.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
          <li className="chip" style={{ borderStyle: 'dashed', background: 'transparent' }}>
            and more
          </li>
        </ul>
      </div>
    </section>
  )
}

const LAYERS: {
  n: React.ReactNode
  radius: string
  title: string
  body: string
}[] = [
  {
    n: '1',
    radius: '52% 48% 50% 50% / 48% 52% 48% 52%',
    title: 'Apps',
    body: 'A web app, the same web app wrapped for iOS and Android with Tauri, a desktop app with the backend bundled in, a CLI and an MCP server. They all call the same functions.',
  },
  {
    n: <Pk className="w-12 h-12 text-clay -scale-x-100" />,
    radius: '48% 52% 46% 54% / 52% 46% 54% 48%',
    title: 'Your functions',
    body: 'Logic lives in one place. Auth, validation and permissions follow every function onto every wire, so you never write them twice.',
  },
  {
    n: '3',
    radius: '54% 46% 52% 48% / 46% 54% 48% 52%',
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
      <ol className="mt-12 md:mt-16 grid gap-10 md:grid-cols-3 md:gap-8 list-none p-0">
        {LAYERS.map((l) => (
          <li key={l.title} className="flex md:block gap-5">
            <div className="num" style={{ borderRadius: l.radius }}>
              {l.n}
            </div>
            <div className="md:mt-6">
              <h3 className="display text-2xl font-semibold">{l.title}</h3>
              <p className="mt-2 text-soft leading-relaxed">{l.body}</p>
            </div>
          </li>
        ))}
      </ol>
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
        <Pk className="w-24 h-24 md:w-32 md:h-32 text-moss" />
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
      <Symbols />
      <main>
        <Hero />
        <Stack />
        <Layers />
        <Framework />
        <Close />
      </main>
    </div>
  )
}
