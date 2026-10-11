import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';

const heroCode = `# One self-contained executable
$ pikku deploy apply --provider standalone --runtime bun

Bundling project...
  + my-app                bundle   1.2 MB
Compiling with bun build --compile...
  + my-app                binary    58 MB

Build complete. .deploy/standalone/my-app/`;

const runCode = `$ ./my-app --version
my-app 1.4.0

$ ./my-app db migrate
Applied 3 migrations.

$ PIKKU_DATA_DIR=/var/lib/my-app ./my-app
Server ready on http://0.0.0.0:4002`;

const desktopCode = `# A window around the binary, run as a sidecar
$ pikku deploy apply --provider standalone \\
    --runtime bun --desktop

# Or a window onto a server you already deployed
$ pikku deploy apply --provider standalone \\
    --desktop-url https://app.example.com`;

const page: PageData = {
  meta: {
    title: 'Standalone Deploy — One Bundle or One Binary',
    description: 'Deploy a Pikku project as a single Node bundle or a self-contained executable — server, scheduler, queues, database migrations and frontend in one artifact. No cloud provider.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Deployment',
      h1: 'One bundle.\n_Or one binary._',
      lead: 'The standalone provider collapses the whole project into a single artifact — HTTP server, scheduler, queue workers, migrations and frontend — that runs on a VM, a box in a cupboard, or a laptop.',
      cta: [
        { label: 'Read the Docs', to: '/docs/deploy' },
        { label: 'How It Works', to: '#how-it-works', primary: false },
      ],
      right: { type: 'code', code: heroCode },
    },
    {
      component: 'step-cards',
      id: 'how-it-works',
      eyebrow: 'How It Works',
      h2: 'Install, build, _run_.',
      lead: 'The same deploy pipeline every other provider uses — analyze, tree-shake, bundle — ending in a directory you can copy rather than an account you have to own.',
      steps: [
        {
          title: 'Install the provider',
          desc: 'Build-time only. It never runs inside the deployed process.',
          command: 'npm install -D @pikku/deploy-standalone',
        },
        {
          title: 'Pick a runtime',
          desc: 'node ships a bundle.js you run with Node. bun compiles that bundle into one executable with no runtime on the target host at all.',
          command: 'pikku deploy apply --provider standalone --runtime bun',
        },
        {
          title: 'Copy it and run it',
          desc: 'The artifact takes its config from the environment and answers --version and --help before it opens anything — which is when you need them.',
          command: './my-app',
        },
      ],
      below: {
        type: 'codes',
        codes: [
          { filename: 'on the host', icon: 'terminal', code: runCode, language: 'bash' },
        ],
      },
    },
    {
      component: 'feature-grid',
      eyebrow: 'What Ships',
      h2: 'The whole application. _One artifact._',
      lead: 'Serverless providers split a project into a unit per function. Standalone does the opposite: everything the app needs is in the thing you copied, so there is nothing to provision alongside it.',
      variant: 'alt',
      columns: 3,
      cards: [
        { icon: 'server', title: 'HTTP server', body: 'The same node:http server pikku dev runs, or Bun.serve with native WebSockets on the bun runtime. One HTTP path in development and in production.' },
        { icon: 'clock', title: 'In-process scheduler', body: 'Cron wirings run inside the process. No EventBridge, no Cloudflare cron trigger, nothing external to keep in sync with the schedule in your code.' },
        { icon: 'layers', title: 'In-process queues', body: 'Queue workers run in the same process as everything else — enough for a single-host deployment, and the reason it needs no broker.' },
        { icon: 'database', title: 'Database and migrations', body: 'The artifact runs its own migrations: ./my-app db migrate opens the same database the next serve reads, against PIKKU_DATA_DIR so it survives a release.' },
        { icon: 'globe', title: 'Your frontend', body: 'A built frontend is served by the same server, from the same origin — so cookies, CORS and OAuth behave the way they do in development. On bun it is embedded in the binary.' },
        { icon: 'key', title: 'Secrets from the environment', body: 'No secret store to provision. Config comes from the environment of the host you put the artifact on.' },
      ],
    },
    {
      component: 'two-col',
      id: 'desktop',
      eyebrow: 'Desktop',
      h2: 'Double-clickable, _if you want it_.',
      lead: 'Add --desktop and the build also generates a Tauri shell that runs the compiled binary as a sidecar and points a webview at its origin. --desktop-url does the same for a server you have already deployed, and bundles nothing.',
      left: {
        type: 'code',
        code: { filename: 'build', icon: 'terminal', code: desktopCode, language: 'bash' },
      },
      right: {
        type: 'check-list',
        items: [
          { title: 'A sidecar, not an embed', body: 'The server runs as its own process and the window is a browser pointed at it — so auth flows work unchanged.' },
          { title: 'The server picks the port', body: 'It binds :0 and prints the port it got; the shell waits for that line rather than choosing one and racing whatever else binds it.' },
          { title: 'Closing the window stops the server', body: 'The sidecar watches its parent, so no orphan process outlives the app.' },
        ],
      },
      below: {
        type: 'note',
        icon: 'alert-triangle',
        title: 'Unsigned, and no auto-update',
        body: 'Desktop builds are not code-signed or notarized, and they never update themselves. macOS and Windows will warn on first launch, and a new version means shipping a new build. This is a known limitation of the first version, not an oversight.',
      },
    },
    {
      component: 'cta',
      h2: 'Ship it as one file',
      lead: 'Self-hosted, on-premise, air-gapped, or on a customer machine — the same project, the same commands.',
      cmd: 'npm install -D @pikku/deploy-standalone',
      buttons: [
        { label: 'Deploy Guide', to: '/docs/deploy' },
        { label: 'All Features', to: '/features', primary: false },
      ],
    },
  ],
};

export default function StandaloneDeployPage() {
  return <FeaturePage data={page} />;
}
