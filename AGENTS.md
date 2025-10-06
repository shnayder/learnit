# Agent Notes

## Deno setup

- If `deno` is missing, run `./scripts/install-deno.sh` and add `./.deno-runtime/bin` to your `PATH`
  for the session (`export PATH="$(pwd)/.deno-runtime/bin:$PATH"`).
- All project tasks set `DENO_TLS_CA_STORE=system` so dependency downloads work inside the Codex
  container.
- Run `./scripts/install-playwright-deps.sh` once per container to install the system libraries
  Chromium needs.

## Screenshot task

- Run `deno task screenshot` to capture a snapshot of the home page (`artifacts/home.png`).
- The task starts the local server, then uses Playwright (through Deno's npm integration) to drive
  Chromium.
- Playwright downloads its browser binaries to `.playwright-browsers/`; cache that directory if you
  want to reuse it across sessions.
- Linux containers still need `./scripts/install-playwright-deps.sh` once for system libs. On macOS
  the script exits quickly but will fail if the Xcode Command Line Tools are missing.
