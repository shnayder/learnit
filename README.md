# LearnIt

A Deno + React starter for a learning tracker app. The current build ships a simple "hello world" style page with mock guitar practice data, plus a minimal tooling setup so you can iterate quickly.

## Prerequisites

- [Deno](https://deno.land/) v1.37 or newer (the project relies on built-in `deno task` and `deno bundle`).

You can install a local copy of Deno into the repository by running:

```bash
$ ./scripts/install-deno.sh
$ export PATH="$(pwd)/.deno-runtime/bin:$PATH"
$ ./scripts/install-playwright-deps.sh
```

The helper script defaults to version `v2.5.3`. Override the `DENO_VERSION` or `INSTALL_DIR`
environment variables if you need a different toolchain or install location.

`install-playwright-deps.sh` installs the apt packages Playwright requires for headless Chromium. Run it once per container.

## Available tasks

```bash
# Compile the React entry point to public/main.js
$ deno task build

# Start the static server (expects an existing bundle)
$ deno task start

# Watch mode: rebuild the bundle + restart the server on changes
$ deno task dev

# Formatting and linting helpers
$ deno task fmt
$ deno task lint

# Capture a headless browser screenshot of the home page (writes artifacts/home.png)
$ deno task screenshot
```

`deno task dev` will produce a bundle and boot the server. The watcher keeps an eye on TypeScript/TSX files under `src/` and restarts the server if the backend code changes. Fix any bundle errors reported in the terminal and the watcher will pick up again automatically.

`deno task screenshot` spins up the local server in the background, runs `npx playwright screenshot` against it, and stores a snapshot of the home page at `artifacts/home.png`. The first run downloads the Chromium browser via Playwright, so it may take longer than subsequent runs.

## Project structure

```
.
├── deno.json          # Deno configuration, tasks, and JSX options
├── import_map.json    # Maps React imports to esm.sh for Deno
├── public/
│   ├── index.html     # Root document with basic styling
│   └── (main.js)      # Generated bundle (ignored by git)
├── src/
│   ├── App.tsx        # Hello world React view
│   ├── main.tsx       # Frontend entry point
│   └── server.ts      # Deno static file server + SPA fallback
└── tools/
    └── dev.ts         # Simple watcher that rebuilds & restarts the server
```

## Next steps

- Replace the mocked learning items in `src/App.tsx` with real data handling.
- Expand the server to expose an API layer or integrate with persistent storage.
- Add tests or type-safe domain models for learning goals, practice sessions, and scheduling.
