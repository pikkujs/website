import React from 'react'
import Link from '@docusaurus/Link'
import { AsciiMascot } from './AsciiMascot'
import { HeroDecorations } from './HeroDecorations'
import { Zap, Blocks, Palette, Package } from 'lucide-react'
import './asciiHero.css'

const features = [
  { icon: <Zap className="w-4 h-4" />, label: 'Fast' },
  { icon: <Blocks className="w-4 h-4" />, label: 'Modular' },
  { icon: <Palette className="w-4 h-4" />, label: 'Creative' },
  { icon: <Package className="w-4 h-4" />, label: 'Open' },
]

export function AsciiHero() {
  return (
    <>
      <section
        className="w-full relative overflow-hidden"
        style={{ backgroundColor: '#f8f7f4' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-20 lg:pt-20 lg:pb-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left column — copy */}
            <div className="w-full lg:w-1/2">
              <div className="mb-6">
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5"
                  style={{
                    backgroundColor: '#f1e8fb',
                    color: '#7c3aed',
                    border: '1px solid #ddd6fe',
                  }}
                >
                  <span style={{ color: '#ec4899' }}>TypeScript</span> Function Framework
                </span>
              </div>

              <h1
                className="text-5xl md:text-6xl font-bold leading-tight mb-6"
                style={{
                  fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
                  color: '#0f172a',
                }}
              >
                One function.
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Every protocol.
                </span>
              </h1>

              <p
                className="text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
                style={{ color: '#475569' }}
              >
                Write your backend once. Pikku wires it to HTTP, WebSocket, queues, cron, AI agents, workflows, and more — same auth, same validation, zero rewrites.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  to="/getting-started"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold no-underline transition-all hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                  }}
                >
                  Get Started in 5 Minutes
                </Link>
                <Link
                  to="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold no-underline transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  See How It Works
                </Link>
              </div>

              {/* Feature strip */}
              <div className="flex flex-wrap gap-5">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2"
                    style={{ color: '#64748b' }}
                  >
                    <span style={{ color: '#94a3b8' }}>{f.icon}</span>
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — ASCII mascot */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center min-h-[300px] lg:min-h-[420px]">
              <HeroDecorations />
              <div className="relative z-10">
                <AsciiMascot />
              </div>
            </div>
          </div>
        </div>

        {/* Built with Pikku logos */}
        <div className="max-w-screen-xl mx-auto w-full px-6 pb-8 pt-2">
          <p
            className="text-center text-xs font-semibold tracking-widest uppercase mb-0"
            style={{ color: '#94a3b8' }}
          >
            Built with Pikku
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6">
            {[
              { name: 'AgreeWe', logo: 'agreewe-dark.png', url: 'https://www.agreewe.com' },
              { name: 'HeyGermany', logo: 'heygermany-dark.svg', url: 'https://hey-germany.com' },
              { name: 'marta', logo: 'marta-light.svg', url: 'https://marta.de' },
              { name: 'BambooRose', logo: 'bamboorose-dark.png', url: 'https://bamboorose.com' },
              { name: 'Calligraphy Cut', logo: 'calligraphycut-dark.svg', url: 'https://calligraphy-cut.com' },
            ].map((company) => (
              <Link
                key={company.name}
                href={company.url}
                className="flex items-center justify-center px-4 py-3 rounded-lg transition-opacity no-underline"
                title={company.name}
                style={{ opacity: 0.4 }}
              >
                <img
                  src={`img/logos/${company.logo}`}
                  alt={company.name}
                  width={120}
                  height={40}
                  loading="lazy"
                  className="object-contain"
                  style={{ filter: 'grayscale(100%) brightness(0.3)' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Light-to-dark gradient edge */}
      <div className="ascii-hero-edge" />
    </>
  )
}
