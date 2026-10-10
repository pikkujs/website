---
sidebar_position: 2
title: Native Apps
description: Package a Pikku frontend as a desktop, Android or iOS app with Tauri
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

`--identifier` defaults to `com.<npm scope>.<app name>`, taken from the root
`package.json` and with hyphens dropped: `@acme/shop` with a frontend called
`customer-app` gives `com.acme.customerapp`. A segment that would start with a
digit or be a Java keyword gets an `app` prefix. With no scope, the root
package's own name stands in, and with neither you get `com.example.<name>`.

`init` is safe to run again. Platform flags replace the saved platforms,
`--plugins` adds to the saved list, and the project is re-synced rather than
recreated. `--url` and `--bundle-server` each clear the other, so say which
one you mean.

The flags only seed the config. Every later command reads `pikku.config.json`:

```bash
npx pikku app native add customer haptics   # add plugins
npx pikku app native upgrade customer       # re-apply the config after editing it by hand
npx pikku app native check                  # compare every native project with the config
npx pikku app list                          # every app and how it ships
```

`app list` prints each app's directory, kind, who it serves, where it is served,
and for a native app its identifier, platforms, mode (`bundle`, `url` or
`sidecar`) and plugins. `add` and `upgrade` also add any missing `@tauri-apps/*`
packages and a `tauri` script to the frontend's `package.json`, at `^2`, and
never touch a version you already pinned. `init` ends by printing the next steps
for the mode and platforms you chose, and says so when no Rust toolchain
answers on the machine.

If the frontend sets `dev.port`, the app's dev window points at
`http://localhost:<port>`, so `tauri dev` runs against the same dev server you
already use.

### The native config

All of it lives at `frontends.<name>.native`:

| Key | Type | Meaning |
|-----|------|---------|
| `identifier` | `string` | Required. Bundle id and Android package name |
| `productName` | `string` | The name the OS shows. Default: the app name |
| `platforms` | `("desktop" \| "android" \| "ios")[]` | Required, at least one |
| `plugins` | `string[]` | Native plugins, see below |
| `url` | `string` | Open a deployed origin instead of bundling `dist` |
| `bundleServer` | `boolean` | Ship the compiled server as a sidecar. Desktop only |

If the app you want to package does not exist yet, `pikku app new <slug> --serves <group> --personas <ids>`
writes one from the starter template and adds its `frontends` entry. Both flags
are required; `--template`, `--primary` and `--install` (default on) are optional.

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

`url` and `bundleServer` cannot be combined. A `bundleServer` app that lists
`android` or `ios` is refused, because a phone cannot spawn a server binary.

### How the bundled server runs

The window shows the server's own origin, `http://127.0.0.1:<port>`, so the UI
and the API are one origin again: cookies stay first-party and none of the
bundled-mode auth workarounds apply. The server serves both the API and the
built frontend.

- **The port is the server's choice.** The shell starts the server with
  `PORT=0`, waits for its `pikku: ready on http://127.0.0.1:<port>` line, then
  opens the window. There is no fixed port to clash with.
- **One instance.** Launching the app a second time focuses the open window
  instead of starting a second server, because two servers would be two SQLite
  writers on one file.
- **No orphans.** The shell passes its process id as `PIKKU_PARENT_PID` and the
  server exits when that process is gone, so a crash does not leave a server
  holding the database open.
- **Data lives in the app-data directory.** A double-clicked app has no useful
  working directory, so the shell passes the platform's app-data directory as
  `PIKKU_DATA_DIR`. Keep the database, uploads and runtime state there.
- **Until the server is ready** the window shows a placeholder page from
  `ui/index.html`, which pikku owns in this mode.

`pikku deploy apply --provider standalone --runtime bun` compiles the server and
writes it to `src-tauri/binaries/<name>-<target triple>` (with `.exe` on
Windows) for every frontend with `bundleServer` set. Tauri looks the file up by
that triple, and pikku takes the triple from `rustc -vV`, falling back to the
Node platform and architecture when there is no Rust toolchain. The binary is for
the machine that built it, so build once per target platform.

## Plugins

`store`, `dialog`, `clipboard-manager`, `os`, `notification` and `geolocation`
run on every platform. `biometric`, `haptics`, `barcode-scanner` and `nfc` are
mobile-only. Pikku compiles them into the mobile build alone, so the desktop
build still compiles.

Call a plugin through its `@tauri-apps/plugin-*` package, behind a check for
`window.__TAURI_INTERNALS__`, so the same build still runs in a browser. An
unknown plugin name is refused, and the error lists the available ones.

| Plugin | Where | What it does | iOS consent key |
|--------|-------|--------------|-----------------|
| `store` | all | A persistent key-value store on the device | none |
| `dialog` | all | Native message, confirm and file-picker dialogs | none |
| `clipboard-manager` | all | Read and write the system clipboard | none |
| `os` | all | Platform, version and architecture of the host | none |
| `notification` | all | Local notifications, scheduled or immediate | none |
| `geolocation` | all | Current position and position watching | `NSLocationWhenInUseUsageDescription` |
| `biometric` | mobile | Face ID, Touch ID and Android BiometricPrompt | `NSFaceIDUsageDescription` |
| `haptics` | mobile | Vibration and impact feedback | none |
| `barcode-scanner` | mobile | Camera barcode and QR scanning | `NSCameraUsageDescription` |
| `nfc` | mobile | Read and write NFC tags | `NFCReaderUsageDescription` |

Things pikku cannot do for you:

- `biometric` only authenticates a person and stores nothing. A biometric check in
  front of a screen the server would serve to anyone is decoration, so the
  session still has to be authorised server-side.
- `nfc` on iOS also needs the Near Field Communication Tag Reading capability on
  the App ID and in the entitlements file. That is a signing concern.
- `notification` is local only. Push notifications are separate native work on
  both platforms and no plugin is set up for them.

## iOS

iOS is a platform like the others: `--ios` (or `"ios"` in `platforms`), and it is
included when you give no platform flags.

- The consent strings iOS demands for the plugins you chose are written to
  `src-tauri/Info.ios.plist` the first time. Without them, iOS terminates the app
  the first time the plugin is used rather than returning an error. Pikku writes
  placeholder wording such as "Unlock the app with Face ID." and then leaves the
  file to you, so reword it, because that text is shown to the person being asked.
  Adding a plugin later does not rewrite the plist, so `check` flags a missing
  key and you add it by hand.
- `tauri ios init` writes the Xcode project to `src-tauri/gen/apple`. Commit it,
  since signing and the app's entitlements live there.
- You need a Mac with Xcode. Use `tauri ios dev` while developing and
  `tauri ios build` for a build.
- A bundled iOS app is an offline app. A `url` app that only wraps a website is
  what the App Store rejects.
- `bundleServer` is not available on iOS.

## Android

`tauri android init` writes `src-tauri/gen/android`, which you commit. The
identifier becomes the Android `applicationId`, which is why its rules are
Android's. If you change `identifier` after generating that project, `check`
reports that `gen/android` was generated for the old one. Delete `gen/android`
and run `tauri android init` again. Use `tauri android dev` while developing and
`tauri android build --apk` for an APK. You need the Android SDK and NDK.

## Icons

`init` writes a flat placeholder icon so the first `tauri build` has something to
package. Replace it with `bun run tauri icon <your-icon.png>`, which makes every
size each platform asks for.

## The identifier

Each app has one identifier, used on every platform, and it must be **unique
across apps**. Two apps that share one replace each other on install and share
a data directory. `init` refuses a clash and `check` reports one.

Android sets the format: no hyphens, no segment starting with a digit, and no
Java keyword. macOS also rejects an identifier ending in `.app`. You can change
the identifier freely until the first store release, and never afterwards.

## What `check` looks for

`pikku app native check [name]` reports each problem as an error or a warning
with the fix beside it. It looks at:

- identifiers shared between apps, and identifiers a platform refuses;
- `platforms` empty, `url` malformed, an unknown plugin, or `bundleServer` with a
  mobile platform;
- an `ssr` frontend in bundled mode;
- `tauri.conf.json` keys, `Cargo.toml` plugin blocks and pikku's own files
  drifting from the config (fix: `upgrade`), or the `Cargo.toml` markers missing;
- `src/lib.rs` not calling `pikku::plugins`, or spawning a sidecar when
  `bundleServer` is off, or the reverse (fix: re-run `init`);
- an iOS app whose `Info.ios.plist` lacks a key a plugin needs;
- `gen/android` built for a different identifier;
- a warning when `dist` has no `index.html` yet. Pikku never builds your frontend.

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

Builds are unsigned and there is no auto-update. On first launch, macOS needs
right-click → Open, Windows shows SmartScreen, and an Android debug APK can be
sideloaded. A signed release needs keys, held by your CI as secrets. A shipped
build stays the version it was, since no updater is wired in.
