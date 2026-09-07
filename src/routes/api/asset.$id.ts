import { createFileRoute } from "@tanstack/react-router";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/api/asset/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id?.trim() ?? "";
        if (!UUID_RE.test(id)) {
          return new Response("not found", { status: 404 });
        }
        const { getSql } = await import("@/lib/db");
        const sql = await getSql();
        const rows = await sql<{ mime: string; body: string }>`
          select mime, body from style_assets where id = ${id}
        `;
        const row = rows[0];
        if (!row?.body) return new Response("not found", { status: 404 });
        const bytes = Buffer.from(row.body, "base64");
        return new Response(bytes, {
          headers: {
            "Content-Type": row.mime || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Length": String(bytes.length),
          },
        });
      },
    },
  },
});
