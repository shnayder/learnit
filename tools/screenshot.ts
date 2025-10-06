async function reservePort(): Promise<number> {
  const listener = Deno.listen({ hostname: "127.0.0.1", port: 0 });
  const { port } = listener.addr as Deno.NetAddr;
  listener.close();
  return port;
}

async function runCommand(
  command: string,
  args: string[],
  env?: Record<string, string>,
): Promise<void> {
  const process = new Deno.Command(command, {
    args,
    stdout: "inherit",
    stderr: "inherit",
    env,
  }).spawn();

  const status = await process.status;
  if (!status.success) {
    throw new Error(`${command} ${args.join(" ")} failed with code ${status.code}`);
  }
}

async function main(): Promise<void> {
  const port = await reservePort();

  const serverCommand = new Deno.Command(Deno.execPath(), {
    args: ["task", "start"],
    stdout: "piped",
    stderr: "piped",
    env: {
      ...Deno.env.toObject(),
      PORT: String(port),
    },
  });

  const server = serverCommand.spawn();

  const stdoutReader = server.stdout
    .pipeThrough(new TextDecoderStream())
    .getReader();
  const stderrReader = server.stderr
    .pipeThrough(new TextDecoderStream())
    .getReader();

  async function waitForServerReady(): Promise<void> {
    const readySignal = `🚀 LearnIt dev server running at http://localhost:${port}`;
    while (true) {
      const { value, done } = await stdoutReader.read();
      if (done) {
        throw new Error("Server exited before signaling readiness");
      }

      if (value) {
        console.log(value.trim());
        if (value.includes(readySignal)) {
          return;
        }
      }
    }
  }

  async function drainStderr(): Promise<void> {
    while (true) {
      const { value, done } = await stderrReader.read();
      if (done) {
        return;
      }

      if (value) {
        console.error(value.trimEnd());
      }
    }
  }

  const stderrPromise = drainStderr();

  try {
    await waitForServerReady();

    const artifactsDir = "artifacts";
    await Deno.mkdir(artifactsDir, { recursive: true });

    const browsersPath = `${Deno.cwd()}/.playwright-browsers`;
    const playwrightEnv = {
      ...Deno.env.toObject(),
      PLAYWRIGHT_BROWSERS_PATH: browsersPath,
    };

    await runCommand("npx", ["--yes", "playwright", "install", "chromium"], playwrightEnv);
    await runCommand("npx", [
      "--yes",
      "playwright",
      "screenshot",
      "--wait-for-timeout=2000",
      `http://127.0.0.1:${port}`,
      `${artifactsDir}/home.png`,
    ], playwrightEnv);

    console.log("Screenshot saved to artifacts/home.png");
  } finally {
    try {
      server.kill("SIGTERM");
    } catch {
      // Server already exited.
    }
    await server.status.catch(() => {});
    await stdoutReader.cancel();
    await stderrReader.cancel();
    try {
      await stderrPromise;
    } catch {
      // Ignore cancellation errors.
    }
  }
}

await main();
