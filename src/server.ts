import { serveDir } from "https://deno.land/std@0.207.0/http/file_server.ts";

const port = Number(Deno.env.get("PORT") ?? 8000);

async function handler(request: Request): Promise<Response> {
  const response = await serveDir(request, {
    fsRoot: "public",
    quiet: true,
  });

  if (response.status !== 404) {
    return response;
  }

  const url = new URL(request.url);
  const looksLikeAsset = url.pathname.split("/").pop()?.includes(".") ?? false;

  if (looksLikeAsset) {
    return response;
  }

  const html = await Deno.readTextFile("public/index.html");
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

console.log(`🚀 LearnIt dev server running at http://localhost:${port}`);

Deno.serve({ port }, handler);
