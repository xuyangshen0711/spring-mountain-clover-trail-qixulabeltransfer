import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { isMigrationFile, migrationName, pendingMigrations } from "./migration-plan.mjs";

const projectRoot = () => join(dirname(fileURLToPath(import.meta.url)), "..");

test("_migrations keys on basename, not path", () => {
  assert.equal(migrationName("/migrations/0002_todos.sql"), "0002_todos.sql");
  assert.equal(migrationName("migrations/auth/0001_auth.sql"), "0001_auth.sql");
  assert.equal(migrationName("0001_auth.sql"), "0001_auth.sql");
});

test("a file already applied from another directory does not re-apply", () => {
  // _migrations keys on basename, so a file the database already ran must not
  // run again just because it is globbed under a different path.
  assert.deepEqual(pendingMigrations(["/migrations/0001_a.sql"], ["0001_a.sql"]), []);
});

test("pending migrations are returned in name order", () => {
  assert.deepEqual(
    pendingMigrations(
      ["/migrations/0003_c.sql", "/migrations/0001_a.sql", "/migrations/0002_b.sql"],
      ["0001_a.sql"],
    ),
    [
      { name: "0002_b.sql", path: "/migrations/0002_b.sql" },
      { name: "0003_c.sql", path: "/migrations/0003_c.sql" },
    ],
  );
});

test("non-.sql entries are dropped (readdir also yields the auth/ directory)", () => {
  assert.equal(isMigrationFile("auth"), false);
  assert.deepEqual(pendingMigrations(["auth", "README.md"], []), []);
});

test("every file in migrations/ is a real, ordered migration", () => {
  const entries = readdirSync(join(projectRoot(), "migrations"));
  assert.ok(entries.length > 0, "migrations/ must not be empty");
  const planned = pendingMigrations(entries, []);
  assert.deepEqual(
    planned.map((m) => m.name),
    entries.filter(isMigrationFile).sort(),
  );
});
