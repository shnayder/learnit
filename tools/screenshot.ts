import { join, relative } from "https://deno.land/std@0.207.0/path/mod.ts";
import { chromium } from "npm:playwright";

async function reservePort(): Promise<number> {
  const listener = Deno.listen({ hostname: "127.0.0.1", port: 0 });
  const { port } = listener.addr as Deno.NetAddr;
  listener.close();
  return port;
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

    const artifactsDir = join(Deno.cwd(), "artifacts");
    await Deno.mkdir(artifactsDir, { recursive: true });

    const browsersPath = join(Deno.cwd(), ".playwright-browsers");
    await Deno.mkdir(browsersPath, { recursive: true });
    Deno.env.set("PLAYWRIGHT_BROWSERS_PATH", browsersPath);

    const browser = await chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();
      const url = `http://127.0.0.1:${port}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(2_000);

      const screenshotPath = join(artifactsDir, "home.png");
      await page.screenshot({ path: screenshotPath, fullPage: true });

      console.log(
        `Screenshot saved to ${relative(Deno.cwd(), screenshotPath)}`,
      );
    } finally {
      await browser.close();
    }
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
