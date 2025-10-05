import { join, relative } from "https://deno.land/std@0.207.0/path/mod.ts";

const decoder = new TextDecoder();
const projectRoot = Deno.cwd();
const denoExec = Deno.execPath();
const denoDir = join(projectRoot, ".deno");

let server: Deno.ChildProcess | null = null;

async function bundle(): Promise<boolean> {
  console.log("[bundle] Building public/main.js …");

  await ensureDenoDir();

  const command = new Deno.Command(denoExec, {
    args: [
      "bundle",
      "--import-map=import_map.json",
      "--output",
      "public/main.js",
      "src/main.tsx",
    ],
    env: { DENO_DIR: denoDir },
    stderr: "piped",
  });

  const { success, stderr } = await command.output();

  if (!success) {
    console.error("[bundle] Build failed:\n" + decoder.decode(stderr).trim());
    return false;
  }

  console.log("[bundle] Done.");
  return true;
}

async function stopServer(): Promise<void> {
  if (!server) {
    return;
  }

  try {
    server.kill("SIGTERM");
    await server.status.catch(() => undefined);
  } catch (error) {
    console.error(
      `[dev] Failed to stop server: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    server = null;
  }
}

async function startServer(): Promise<void> {
  await stopServer();

  await ensureDenoDir();

  server = new Deno.Command(denoExec, {
    args: [
      "run",
      "--allow-env",
      "--allow-net",
      "--allow-read",
      "src/server.ts",
    ],
    env: { DENO_DIR: denoDir },
    stdout: "inherit",
    stderr: "inherit",
  }).spawn();

  console.log("[dev] Server running at http://localhost:8000");
}

async function initialBuild(): Promise<void> {
  const ok = await bundle();
  if (!ok) {
    console.log("[dev] Waiting for changes to retry build…");
    return;
  }

  await startServer();
}

function formatPaths(paths: string[]): string {
  return paths.map((path) => relative(projectRoot, path)).join(", ");
}

async function watch(): Promise<void> {
  await initialBuild();

  const watcher = Deno.watchFs(["src", "public/index.html"]);
  console.log("[dev] Watching for changes…");

  for await (const event of watcher) {
    if (event.kind === "access") {
      continue;
    }

    console.log(`[dev] ${event.kind}: ${formatPaths(event.paths)}`);

    const touchesTs = event.paths.some(
      (path) => path.endsWith(".ts") || path.endsWith(".tsx")
    );
    const touchesServer = event.paths.some((path) =>
      path.endsWith("server.ts")
    );

    let bundleOk = true;

    if (touchesTs) {
      bundleOk = await bundle();
      if (!bundleOk) {
        console.log("[dev] Build failed. Fix errors to continue.");
      }
    }

    if (touchesServer) {
      if (bundleOk) {
        await startServer();
      } else {
        console.warn(
          "[dev] Server not restarted because the bundle step failed."
        );
      }
    }
  }
}

async function shutdown(): Promise<void> {
  await stopServer();
}

async function ensureDenoDir(): Promise<void> {
  await Deno.mkdir(denoDir, { recursive: true });
}

const signals: Deno.Signal[] = ["SIGINT", "SIGTERM"];
for (const signal of signals) {
  Deno.addSignalListener(signal, () => {
    shutdown().finally(() => Deno.exit());
  });
}

try {
  await watch();
} finally {
  await shutdown();
}
