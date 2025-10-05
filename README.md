# LearnIt

A Deno + React starter for a learning tracker app. The current build ships a simple "hello world" style page with mock guitar practice data, plus a minimal tooling setup so you can iterate quickly.

## Prerequisites

- [Deno](https://deno.land/) v1.37 or newer (the project relies on built-in `deno task` and `deno bundle`).

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
```

`deno task dev` will produce a bundle and boot the server. The watcher keeps an eye on TypeScript/TSX files under `src/` and restarts the server if the backend code changes. Fix any bundle errors reported in the terminal and the watcher will pick up again automatically.

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
