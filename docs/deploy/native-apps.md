---
sidebar_position: 2
title: Native Apps
description: Package a Pikku frontend as a desktop or Android app with Tauri
ai: true
---

# Native Apps

A native app is one of your [`frontends`](../pikku-cli/configuration.md#frontends)
packaged in a [Tauri](https://tauri.app) shell, so people install it rather than
visit it. It is still the same frontend: the configuration lives on its
`frontends` entry, and the Tauri project is written beside it and committed.

```
apps/customer/            ← frontends.customer.cwd
  package.json            ← gains @tauri-apps/cli, @tauri-apps/api and one package per plugin
  dist/                   ← frontends.customer.dist, which the app packages
  src-tauri/              ← the native project, committed
```

## Creating one

```bash
npx pikku app native init customer
```

`init` saves a `native` entry on the frontend and writes `src-tauri/` from it:

```json
{
  "frontends": {
    "customer": {
      "cwd": "apps/customer",
      "kind": "spa",
      "native": {
        "identifier": "com.acme.customer",
        "platforms": ["desktop", "android"],
        "plugins": ["store", "biometric"]
      }
    }
  }
}
```

| Flag | Meaning |
|------|---------|
| `--desktop` `--android` `--ios` | Platforms. None given: desktop, Android and iOS; desktop alone with `--bundle-server` |
| `--identifier <id>` | Bundle id and Android package name. Default `com.<npm scope>.<app name>` |
| `--product-name <name>` | The name the OS shows. Default: the app name |
| `--url <origin>` | Open a deployed server instead of bundling `dist` |
| `--bundle-server` | Ship the compiled pikku server inside the app (desktop only) |
| `--plugins <list>` | Native plugins, comma-separated |

The flags only seed the config. Every later command reads `pikku.config.json`:

```bash
npx pikku app native add customer haptics   # add plugins
npx pikku app native upgrade customer       # re-apply the config after editing it by hand
npx pikku app native check                  # compare every native project with the config
npx pikku app list                          # every app and how it ships
```

## Modes

| Config | The window shows | Platforms |
|--------|------------------|-----------|
| *(default)* | `dist`, bundled into the app | desktop, Android, iOS |
| `"url": "https://…"` | a deployed server's own origin | desktop, Android, iOS |
| `"bundleServer": true` | the compiled server, run as a sidecar | desktop only |

**Bundled (the default)** works offline and is what an app store expects. The
page's origin is the app's own — `tauri://localhost` on macOS, iOS and Linux,
`http://tauri.localhost` on Windows and Android — so your API is cross-origin:

- authenticate with a bearer token, stored with the `store` plugin, rather than a cookie;
- allow both origins in the server's CORS rules;
- read the API base from a build-time variable such as `VITE_API_URL`, not
  `window.location.origin`;
- social login leaves through the system browser and returns through a deep link.

A `kind: "ssr"` frontend cannot be bundled, because there is no server in the
app to render it. `init` refuses it; use `--url`, or build it as a static SPA.

**URL** opens a deployed server, so auth keeps working exactly as in a browser.
Nothing is bundled, the app shows nothing without a network, and the App Store
rejects an app that only wraps a website.

**Bundled server** ships the compiled server inside a desktop app — a whole
offline, single-machine product. The server binary is built by
`pikku deploy apply --provider standalone --runtime bun`, which installs it into
`src-tauri/binaries/` of every frontend with `bundleServer` set. That directory
is gitignored, because the binary is built for one platform.

`url` and `bundleServer` cannot be combined.

## Plugins

`store`, `dialog`, `clipboard-manager`, `os`, `notification` and `geolocation`
run on every platform. `biometric`, `haptics`, `barcode-scanner` and `nfc` are
mobile-only. Pikku compiles them into the mobile build alone, so the desktop
build still compiles.

Call a plugin through its `@tauri-apps/plugin-*` package, behind a check for
`window.__TAURI_INTERNALS__`, so the same build still runs in a browser. For
iOS, the consent strings are written to `src-tauri/Info.ios.plist`; reword them
for your app.

## The identifier

Each app has one identifier, used on every platform, and it must be **unique
across apps**. Two apps that share one replace each other on install and share
a data directory. `init` refuses a clash and `check` reports one.

Android sets the format: no hyphens, no segment starting with a digit, and no
Java keyword. macOS also rejects an identifier ending in `.app`. You can change
the identifier freely until the first store release, and never afterwards.

## What is committed, and who owns it

The whole of `src-tauri/` is committed and is yours to edit. Pikku rewrites only
these parts, on every `add` and `upgrade`:

| Pikku rewrites | You own |
|----------------|---------|
| `src/pikku.rs` — every plugin's initialiser | `src/lib.rs` and `src/main.rs`, which call `pikku::plugins(builder)` once |
| `capabilities/pikku.json` and `capabilities/pikku-mobile.json` | every other capability file |
| the `# pikku:plugins` and `# pikku:mobile-plugins` blocks in `Cargo.toml` | the rest of `Cargo.toml` |
| `identifier`, `productName`, `build.frontendDist` and `bundle.externalBin` in `tauri.conf.json` | every other key, including the window list |
| missing `@tauri-apps/*` entries in `package.json` | the rest, including versions you pinned |

Icons, `gen/android` and `gen/apple` are yours as well. Put your own crates
outside the marked blocks. `add` refuses to guess if a marker has been deleted,
and `check` reports a `lib.rs` that no longer calls `pikku::plugins`.

## Building

Generating the project only writes files, so it succeeds on a machine that
cannot build the result. From the frontend's directory, after installing:

```bash
bun run tauri dev                                           # against the frontend's dev server
bun run tauri build                                         # after building dist
bun run tauri android init && bun run tauri android build --apk
bun run tauri ios init && bun run tauri ios build           # on a Mac
```

Desktop needs a Rust toolchain. Android also needs the Android SDK and NDK, and
iOS needs Xcode on a Mac. `android init` and `ios init` write
`src-tauri/gen/android` and `src-tauri/gen/apple`. Commit them, because signing
settings and the manifest live there.

### In CI

Nothing in `src-tauri/` depends on the machine that generated it. Build the
frontend once, upload `dist/` as an artifact, and run `tauri build` on one
runner per platform. A `bundleServer` app also needs the standalone bun deploy
to run on each runner first, because its server binary is built per platform.

Builds are unsigned. On first launch, macOS needs right-click → Open, Windows
shows SmartScreen, and an Android debug APK can be sideloaded. A signed release
needs keys, held by your CI as secrets.
