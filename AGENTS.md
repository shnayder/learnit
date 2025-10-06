# Agent Notes

## Deno setup
- If `deno` is missing, run `./scripts/install-deno.sh` and add `./.deno-runtime/bin` to your `PATH` for the session (`export PATH="$(pwd)/.deno-runtime/bin:$PATH"`).
- All project tasks set `DENO_TLS_CA_STORE=system` so dependency downloads work inside the Codex container.
- Run `./scripts/install-playwright-deps.sh` once per container to install the system libraries Chromium needs.

## Screenshot task
- To capture a screenshot of the running app from the container, use `deno task screenshot`.
- The task starts the local server, runs the Playwright CLI via `npx`, and writes `artifacts/home.png`.
- The task requires network access on the container because Playwright downloads Chromium on first run.
