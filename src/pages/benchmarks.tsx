import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Copy, Check } from 'lucide-react';

/** Client-only chart wrapper — ApexCharts accesses `window` on import */
function ApexChart({
  options,
  series,
  type,
  height,
}: {
  options: Record<string, any>;
  series: any[];
  type: string;
  height: number;
}) {
  return (
    <BrowserOnly
      fallback={
        <div
          className="bg-neutral-900/30 rounded-xl animate-pulse"
          style={{ height }}
        />
      }
    >
      {() => {
        // react-apexcharts exports the component directly (no .default)
        const Chart = require('react-apexcharts');
        return (
          <Chart options={options} series={series} type={type} height={height} />
        );
      }}
    </BrowserOnly>
  );
}

/* ═══════════════════════════════════════════
   Benchmark Data
   autocannon: 100 connections, 10 s, pipelining 10
   ═══════════════════════════════════════════ */

const SCENARIOS = ['bare', 'schema', 'middleware', 'full', 'param'] as const;

const RUNTIMES = {
  express: {
    label: 'Express',
    baseline: [48_250, 37_007, 47_702, 35_629, 32_353],
    pikku: [23_554, 17_851, 25_453, 18_302, 10_501],
  },
  fastify: {
    label: 'Fastify',
    baseline: [40_552, 35_402, 62_050, 44_154, 71_850],
    pikku: [52_195, 35_994, 50_202, 34_394, 49_206],
  },
  uws: {
    label: 'uWS',
    baseline: [158_237, 131_696, 163_235, 147_699, 175_347],
    pikku: [87_661, 74_502, 78_195, 66_392, 82_547],
  },
  bun: {
    label: 'Bun',
    baseline: [27_405, 77_830, 27_507, 77_811, 24_307],
    pikku: [22_304, 48_774, 21_003, 43_202, 20_804],
  },
} as const;

const FETCH_DATA = [155_357, 97_338, 139_355, 88_779, 131_690];

const FULL_IDX = 3;

/* ═══════════════════════════════════════════
   Chart Defaults
   ═══════════════════════════════════════════ */

const COLORS = {
  baseline: '#6b7280',
  pikku: '#06b6d4',
  fetch: '#a78bfa',
};

function baseChartOptions(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    chart: {
      type: 'bar',
      background: 'transparent',
      foreColor: '#a3a3a3',
      toolbar: { show: false },
      animations: { enabled: true, speed: 500 },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '58%',
        borderRadius: 3,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    fill: { opacity: 1 },
    tooltip: {
      theme: 'dark',
      y: { formatter: (v: number) => `${v.toLocaleString()} req/s` },
    },
    colors: [COLORS.baseline, COLORS.pikku],
    legend: {
      position: 'top',
      labels: { colors: '#a3a3a3' },
      fontSize: '13px',
      markers: { size: 5, shape: 'circle' as const, offsetX: -3 },
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      padding: { left: 4, right: 4 },
    },
    yaxis: {
      title: {
        text: 'Requests / sec',
        style: { color: '#525252', fontSize: '11px', fontWeight: 500 },
      },
      labels: {
        style: { colors: '#737373', fontSize: '11px' },
        formatter: (v: number) =>
          v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v),
      },
    },
    ...overrides,
  };
}

/* ═══════════════════════════════════════════
   Reusable Pieces
   ═══════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
      {children}
    </span>
  );
}

function ChartCard({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-5 pt-4 pb-0">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="px-2">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Charts
   ═══════════════════════════════════════════ */

function FullPostChart() {
  const options = baseChartOptions({
    xaxis: {
      categories: ['Express', 'Fastify', 'uWS', 'Bun'],
      labels: {
        style: { colors: '#d4d4d4', fontSize: '14px', fontWeight: 600 },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => `${(v / 1000).toFixed(1)}k`,
      offsetY: -22,
      style: { fontSize: '12px', fontWeight: 700, colors: ['#d4d4d4'] },
    },
  });

  const series = [
    {
      name: 'Baseline',
      data: [
        RUNTIMES.express.baseline[FULL_IDX],
        RUNTIMES.fastify.baseline[FULL_IDX],
        RUNTIMES.uws.baseline[FULL_IDX],
        RUNTIMES.bun.baseline[FULL_IDX],
      ],
    },
    {
      name: 'Pikku',
      data: [
        RUNTIMES.express.pikku[FULL_IDX],
        RUNTIMES.fastify.pikku[FULL_IDX],
        RUNTIMES.uws.pikku[FULL_IDX],
        RUNTIMES.bun.pikku[FULL_IDX],
      ],
    },
  ];

  return (
    <ApexChart options={options} series={series} type="bar" height={400} />
  );
}

function RuntimeChart({
  runtimeKey,
}: {
  runtimeKey: keyof typeof RUNTIMES;
}) {
  const d = RUNTIMES[runtimeKey];
  const options = baseChartOptions({
    xaxis: {
      categories: [...SCENARIOS],
      labels: { style: { colors: '#a3a3a3', fontSize: '11px' } },
    },
    legend: { fontSize: '11px' },
  });

  const series = [
    { name: 'Baseline', data: [...d.baseline] },
    { name: 'Pikku', data: [...d.pikku] },
  ];

  return (
    <ApexChart options={options} series={series} type="bar" height={300} />
  );
}

function FetchChart() {
  const options = baseChartOptions({
    colors: [COLORS.fetch],
    xaxis: {
      categories: [...SCENARIOS],
      labels: { style: { colors: '#a3a3a3', fontSize: '12px' } },
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => `${(v / 1000).toFixed(1)}k`,
      offsetY: -22,
      style: { fontSize: '12px', fontWeight: 700, colors: ['#d4d4d4'] },
    },
  });

  const series = [{ name: 'Pikku fetch()', data: [...FETCH_DATA] }];

  return (
    <ApexChart options={options} series={series} type="bar" height={300} />
  );
}

/* ═══════════════════════════════════════════
   Page Sections
   ═══════════════════════════════════════════ */

function Hero() {
  return (
    <div className="wire-hero-benchmarks w-full relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-blue-500/8 blur-[60px]" />
      </div>

      <header className="flex flex-col max-w-screen-xl mx-auto w-full pt-16 pb-12 lg:pt-20 lg:pb-16 px-6">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-400 border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 rounded mb-6 w-fit">
          Performance
        </span>

        <Heading
          as="h1"
          className="font-jakarta text-5xl md:text-6xl font-bold mb-5 leading-tight max-w-2xl"
        >
          <span className="text-white">Benchmarks</span>
        </Heading>

        <p className="text-xl font-medium leading-relaxed text-neutral-300 max-w-2xl">
          Pikku is an abstraction layer — it adds overhead so you can write
          your functions once and deploy to Express, Fastify, uWS, or any
          runtime. Here are the real numbers.
        </p>
      </header>
    </div>
  );
}

function FullPostSection() {
  const stats = [
    {
      value: '18,302',
      runtime: 'Express',
      overhead: '49%',
      note: 'Includes express.json() overhead on all routes',
    },
    {
      value: '34,394',
      runtime: 'Fastify',
      overhead: '22%',
      note: 'Pikku adds routing, middleware, and permissions',
    },
    {
      value: '66,392',
      runtime: 'uWS',
      overhead: '55%',
      note: 'Still handles 66k+ requests per second',
    },
    {
      value: '43,202',
      runtime: 'Bun',
      overhead: '44%',
      note: 'Native Bun HTTP with Pikku abstraction layer',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionLabel>Real-World Scenario</SectionLabel>
          <Heading
            as="h2"
            className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Full pipeline:{' '}
            <span className="text-cyan-400">POST with auth + validation</span>
          </Heading>
          <p className="text-base text-neutral-400 max-w-xl mx-auto">
            The functions themselves are no-ops — this measures pure framework
            overhead: body parsing, schema validation, middleware, and
            permissions checks.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ChartCard>
            <FullPostChart />
          </ChartCard>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto mt-8">
          {stats.map((card) => (
            <div
              key={card.runtime}
              className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 text-center"
            >
              <div className="text-2xl font-bold text-cyan-400 font-jakarta">
                {card.value}
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                Pikku + {card.runtime}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {card.overhead} overhead &middot; {card.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AllScenariosSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionLabel>Full Breakdown</SectionLabel>
          <Heading
            as="h2"
            className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Every scenario,{' '}
            <span className="text-cyan-400">side by side</span>
          </Heading>
          <p className="text-base text-neutral-400 max-w-2xl mx-auto mb-8">
            Five test scenarios from minimal to full pipeline. All numbers in
            requests per second.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto text-left">
            {[
              {
                name: 'bare',
                tag: 'GET',
                desc: 'Minimal — no body, no middleware, no auth',
              },
              {
                name: 'schema',
                tag: 'POST',
                desc: 'JSON body parsing with schema validation',
              },
              {
                name: 'middleware',
                tag: 'GET',
                desc: 'One session middleware layer',
              },
              {
                name: 'full',
                tag: 'POST',
                desc: 'Two middleware + permissions + body parsing',
              },
              {
                name: 'param',
                tag: 'GET',
                desc: 'URL parameter extraction (/items/:id)',
              },
            ].map((s) => (
              <div
                key={s.name}
                className="bg-[#0d0d0d] border border-neutral-800 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {s.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-0 leading-snug">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {(['express', 'fastify', 'uws', 'bun'] as const).map((key) => (
            <ChartCard key={key} title={RUNTIMES[key].label}>
              <RuntimeChart runtimeKey={key} />
            </ChartCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FetchSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionLabel>Pure Core Throughput</SectionLabel>
          <Heading
            as="h2"
            className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-3"
          >
            In-process with{' '}
            <span className="text-violet-400">fetch()</span>
          </Heading>
          <p className="text-base text-neutral-400 max-w-xl mx-auto">
            No network, no HTTP server — just a direct{' '}
            <code className="text-violet-300 text-sm">fetch()</code> call into
            Pikku's core. This isolates the framework overhead from network
            latency.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ChartCard>
            <FetchChart />
          </ChartCard>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto mt-8">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-violet-400 font-jakarta">
              155,357
            </div>
            <div className="text-sm font-semibold text-white mt-1">
              Peak req/s
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              bare scenario (GET)
            </div>
          </div>
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-violet-400 font-jakarta">
              0.006ms
            </div>
            <div className="text-sm font-semibold text-white mt-1">
              Lowest avg latency
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              bare scenario — pure function speed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MethodologySection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700/30 to-transparent" />

      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-10">
          <SectionLabel>Methodology</SectionLabel>
          <Heading
            as="h2"
            className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-3"
          >
            How we tested
          </Heading>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-bold text-white mb-3">
              HTTP benchmarks
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&bull;</span>
                <span>
                  <strong className="text-neutral-300">autocannon</strong> —
                  100 connections, 10-second runs, pipelining factor of 10
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&bull;</span>
                <span>
                  Each runtime tested with identical Pikku function: body
                  parsing, session middleware, permissions check
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&bull;</span>
                <span>
                  Baselines use the same route logic implemented natively for
                  each framework
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-3">
              fetch() benchmark
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">&bull;</span>
                <span>
                  1,000 warmup iterations followed by 10,000 measured
                  iterations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">&bull;</span>
                <span>
                  Direct in-process call — no network overhead, no HTTP server
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">&bull;</span>
                <span>
                  Measures pure Pikku core: routing, middleware, validation,
                  response serialization
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-amber-500/5 border border-amber-500/15 rounded-xl px-6 py-4 max-w-3xl mx-auto">
          <p className="text-sm text-neutral-300 mb-0">
            <strong className="text-amber-400">Note on Express:</strong> The{' '}
            <code className="text-amber-300 text-xs">express.json()</code>{' '}
            middleware is added upstream in the Pikku Express adapter (required
            for POST body parsing). This adds overhead to <em>all</em> routes
            including GETs, which inflates the Pikku Express numbers slightly
            compared to the baseline where body parsing is only applied to POST
            routes.
          </p>
        </div>

        <div className="text-center mt-8">
          <a
            href="https://github.com/pikkujs/pikku/tree/main/benchmarks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors no-underline"
          >
            View benchmark source on GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-cyan-500/8 blur-[80px]" />
      </div>

      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading
          as="h2"
          className="font-jakarta text-3xl md:text-4xl font-bold mb-4 text-white leading-tight"
        >
          Write once. Deploy fast.
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          One function, every runtime. Start building with Pikku in minutes.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-cyan-500/40 transition-all mb-10"
          onClick={copyToClipboard}
          role="button"
          tabIndex={0}
        >
          <span className="text-cyan-400/70 select-none">$ </span>npm create
          pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/getting-started"
            className="bg-cyan-500 text-white hover:bg-cyan-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 no-underline hover:text-white hover:no-underline"
          >
            Get Started
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 no-underline hover:no-underline"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Page
   ═══════════════════════════════════════════ */

export default function BenchmarksPage() {
  return (
    <Layout
      title="Benchmarks"
      description="Pikku performance benchmarks — Express, Fastify, uWS, and in-process fetch() compared."
    >
      <Hero />
      <main>
        <FullPostSection />
        <AllScenariosSection />
        <FetchSection />
        <MethodologySection />
        <CTASection />
      </main>
    </Layout>
  );
}
