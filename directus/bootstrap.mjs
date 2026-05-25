// Bootstraps the Directus schema + read-only Web user for centavos.
// Run once after `docker compose up -d`:
//   node directus/bootstrap.mjs
//
// Idempotent: skips collections/fields/relations that already exist.
// On first run, creates a static read-only token and writes it to .env.local.

import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL   = process.env.DIRECTUS_URL   ?? "http://localhost:8055";
const EMAIL = process.env.ADMIN_EMAIL    ?? "admin@centavo.mx";
const PASS  = process.env.ADMIN_PASSWORD ?? "admin";

const WEB_USER_EMAIL = "web@centavo.mx";
const here = dirname(fileURLToPath(import.meta.url));
const envPath = join(here, "..", ".env.local");

// ───────────────────────── auth ─────────────────────────
async function login() {
  const r = await fetch(`${URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  });
  if (!r.ok) throw new Error(`login failed: ${r.status} ${await r.text()}`);
  return (await r.json()).data.access_token;
}

let token;
async function api(path, opts = {}) {
  const r = await fetch(`${URL}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...(opts.headers ?? {}),
    },
  });
  if (r.status === 204) return null;
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const code = body?.errors?.[0]?.extensions?.code;
    if (code === "RECORD_NOT_UNIQUE" || code === "INVALID_PAYLOAD") {
      return { __skipped: true, code, body };
    }
    throw new Error(`${opts.method ?? "GET"} ${path} → ${r.status} ${JSON.stringify(body)}`);
  }
  return body;
}

async function exists(path) {
  const r = await fetch(`${URL}${path}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return r.ok;
}

// ───────────────────────── helpers ─────────────────────────
async function createCollection(name, opts = {}) {
  if (await exists(`/collections/${name}`)) {
    console.log(`= collection ${name}`);
    return;
  }
  const { primaryKey = "id", icon, note, sort, displayTemplate } = opts;
  const pkField =
    primaryKey === "id"
      ? { field: "id", type: "integer", meta: { hidden: true, interface: "input", readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } }
      : { field: primaryKey, type: "string", meta: { interface: "input", required: true, width: "full" }, schema: { is_primary_key: true, is_nullable: false } };
  await api("/collections", {
    method: "POST",
    body: JSON.stringify({
      collection: name,
      meta: { icon, note, sort, display_template: displayTemplate, archive_field: "status", archive_value: "archived", unarchive_value: "draft" },
      schema: { name },
      fields: [pkField, ...statusFields()],
    }),
  });
  console.log(`+ collection ${name}`);
}

function statusFields() {
  return [
    {
      field: "status",
      type: "string",
      meta: {
        width: "full",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Published", value: "published" },
            { text: "Draft", value: "draft" },
            { text: "Archived", value: "archived" },
          ],
        },
        display: "labels",
        display_options: {
          showAsDot: true,
          choices: [
            { text: "Published", value: "published", foreground: "#FFFFFF", background: "#2ECDA7" },
            { text: "Draft",     value: "draft",     foreground: "#18222F", background: "#D3DAE4" },
            { text: "Archived",  value: "archived",  foreground: "#FFFFFF", background: "#A2B5CD" },
          ],
        },
      },
      schema: { default_value: "draft", is_nullable: false },
    },
  ];
}

async function addField(collection, field, def) {
  if (await exists(`/fields/${collection}/${field}`)) {
    console.log(`  = ${collection}.${field}`);
    return;
  }
  await api(`/fields/${collection}`, {
    method: "POST",
    body: JSON.stringify({ field, ...def }),
  });
  console.log(`  + ${collection}.${field}`);
}

// ───────────────────────── schema ─────────────────────────
async function run() {
  token = await login();

  // categories
  await createCollection("categories", { primaryKey: "slug", icon: "category", displayTemplate: "{{name}}", sort: 1 });
  await addField("categories", "name",  { type: "string",  meta: { interface: "input", required: true } });
  await addField("categories", "blurb", { type: "string",  meta: { interface: "input" } });
  await addField("categories", "count", { type: "integer", meta: { interface: "input", note: "Article count (denormalized)" }, schema: { default_value: 0 } });

  // authors
  await createCollection("authors", { primaryKey: "slug", icon: "person", displayTemplate: "{{name}}", sort: 2 });
  await addField("authors", "name",         { type: "string", meta: { interface: "input", required: true } });
  await addField("authors", "role",         { type: "string", meta: { interface: "input" } });
  await addField("authors", "avatar_color", { type: "string", meta: { interface: "select-color" } });

  // stories
  await createCollection("stories", { icon: "format_quote", displayTemplate: "{{name}} — {{role}}", sort: 3 });
  await addField("stories", "name",  { type: "string", meta: { interface: "input", required: true } });
  await addField("stories", "role",  { type: "string", meta: { interface: "input" } });
  await addField("stories", "quote", { type: "text",   meta: { interface: "input-multiline", required: true } });

  // glossary_terms
  await createCollection("glossary_terms", { primaryKey: "slug", icon: "book", displayTemplate: "{{term}}", sort: 4 });
  await addField("glossary_terms", "term",       { type: "string", meta: { interface: "input", required: true } });
  await addField("glossary_terms", "category",   {
    type: "string",
    meta: { interface: "select-dropdown-m2o", display: "related-values", display_options: { template: "{{name}}" }, special: ["m2o"], width: "half" },
    schema: { foreign_key_table: "categories", foreign_key_column: "slug" },
  });
  await addField("glossary_terms", "definition", { type: "text", meta: { interface: "input-multiline", required: true } });
  await addField("glossary_terms", "eli5",       { type: "text", meta: { interface: "input-multiline", note: "Explain like I'm 5" } });

  // articles
  await createCollection("articles", { primaryKey: "slug", icon: "article", displayTemplate: "{{title}}", sort: 5 });
  await addField("articles", "title",        { type: "string",   meta: { interface: "input", required: true, width: "full" } });
  await addField("articles", "short",        { type: "string",   meta: { interface: "input", note: "Short title for cards" } });
  await addField("articles", "excerpt",      { type: "text",     meta: { interface: "input-multiline", width: "full" } });
  await addField("articles", "category",     {
    type: "string",
    meta: { interface: "select-dropdown-m2o", display: "related-values", display_options: { template: "{{name}}" }, special: ["m2o"], width: "half" },
    schema: { foreign_key_table: "categories", foreign_key_column: "slug" },
  });
  await addField("articles", "author",       {
    type: "string",
    meta: { interface: "select-dropdown-m2o", display: "related-values", display_options: { template: "{{name}}" }, special: ["m2o"], width: "half" },
    schema: { foreign_key_table: "authors", foreign_key_column: "slug" },
  });
  await addField("articles", "published_at", { type: "timestamp", meta: { interface: "datetime", width: "half" } });
  await addField("articles", "read_minutes", { type: "integer",   meta: { interface: "input", width: "half" } });

  // Hero image (Directus files M2O)
  await addField("articles", "hero_image", {
    type: "uuid",
    meta: { interface: "file-image", display: "image", special: ["file"], width: "full" },
    schema: { foreign_key_table: "directus_files" },
  });
  await addField("articles", "hero_image_alt",     { type: "string", meta: { interface: "input", width: "half" } });
  await addField("articles", "hero_image_caption", { type: "string", meta: { interface: "input", width: "half" } });

  // Body blocks as JSON. Shape mirrors ArticleBlock[] in types/index.ts.
  await addField("articles", "body", {
    type: "json",
    meta: {
      interface: "input-code",
      options: { language: "json" },
      special: ["cast-json"],
      width: "full",
      note: "ArticleBlock[] — paragraph | heading | image | pullquote | tip | chart | recap | story",
    },
  });
  await addField("articles", "body_eli5", {
    type: "json",
    meta: {
      interface: "input-code",
      options: { language: "json" },
      special: ["cast-json"],
      width: "full",
      note: "Optional ELI5 version of body",
    },
  });

  // Register M2O relations so `?fields=author.*` joins work
  await ensureRelation({ collection: "glossary_terms", field: "category", related: "categories" });
  await ensureRelation({ collection: "articles",       field: "category", related: "categories" });
  await ensureRelation({ collection: "articles",       field: "author",   related: "authors" });
  await ensureRelation({ collection: "articles",       field: "hero_image", related: "directus_files" });

  // Lock down: revoke public perms, create a read-only Web role with a static token
  await revokePublicRead(["categories", "authors", "stories", "glossary_terms", "articles", "directus_files"]);
  const newToken = await ensureWebUser(["categories", "authors", "stories", "glossary_terms", "articles", "directus_files"]);
  if (newToken) writeTokenToEnv(newToken);

  console.log("\ndone. open http://localhost:8055 (admin@centavo.mx / admin)");
}

async function ensureRelation({ collection, field, related }) {
  const existing = (await api(`/relations/${collection}/${field}`).catch(() => null))?.data;
  if (existing) {
    console.log(`  = relation ${collection}.${field} → ${related}`);
    return;
  }
  await api(`/relations`, {
    method: "POST",
    body: JSON.stringify({
      collection,
      field,
      related_collection: related,
      meta: { sort_field: null },
      schema: { on_delete: "SET NULL" },
    }),
  });
  console.log(`  + relation ${collection}.${field} → ${related}`);
}

// ── Lockdown: strip public read perms on our collections ─────
async function revokePublicRead(collections) {
  const policies = (await api(`/policies?limit=-1`)).data;
  const publicPolicy = policies.find((p) => p.icon === "public");
  if (!publicPolicy) return;
  const perms = (await api(`/permissions?filter[policy][_eq]=${publicPolicy.id}&limit=-1`)).data;
  const toDelete = perms.filter((p) => p.action === "read" && collections.includes(p.collection));
  if (!toDelete.length) {
    console.log(`  = public read already revoked`);
    return;
  }
  await api(`/permissions`, {
    method: "DELETE",
    body: JSON.stringify(toDelete.map((p) => p.id)),
  });
  console.log(`  - revoked public read on ${toDelete.map((p) => p.collection).join(", ")}`);
}

// ── Read-only Web policy + role + user with static token ─────
async function ensureReadPermissions(policyId, collections) {
  const perms = (await api(`/permissions?filter[policy][_eq]=${policyId}&limit=-1`)).data;
  const has = new Set(perms.filter((p) => p.action === "read").map((p) => p.collection));
  for (const c of collections) {
    if (has.has(c)) continue;
    await api(`/permissions`, {
      method: "POST",
      body: JSON.stringify({
        policy: policyId,
        collection: c,
        action: "read",
        fields: ["*"],
        permissions: {},
        validation: {},
      }),
    });
  }
}

async function ensureWebUser(collections) {
  // 1) Policy
  let policies = (await api(`/policies?filter[name][_eq]=Web&limit=1`)).data;
  let policy = policies[0];
  if (!policy) {
    policy = (await api(`/policies`, {
      method: "POST",
      body: JSON.stringify({
        name: "Web",
        icon: "language",
        description: "Read-only access for the Next.js frontend",
        admin_access: false,
        app_access: false,
      }),
    })).data;
    console.log(`  + policy Web`);
  } else {
    console.log(`  = policy Web`);
  }

  await ensureReadPermissions(policy.id, collections);
  console.log(`  = read perms on ${collections.length} collections`);

  // 2) Role
  let roles = (await api(`/roles?filter[name][_eq]=Web&limit=1`)).data;
  let role = roles[0];
  if (!role) {
    role = (await api(`/roles`, {
      method: "POST",
      body: JSON.stringify({ name: "Web", icon: "language", description: "Next.js frontend" }),
    })).data;
    console.log(`  + role Web`);
  } else {
    console.log(`  = role Web`);
  }

  // 3) Attach policy to role via directus_access (idempotent)
  const access = (await api(`/access?filter[role][_eq]=${role.id}&filter[policy][_eq]=${policy.id}&limit=1`)).data;
  if (!access.length) {
    await api(`/access`, {
      method: "POST",
      body: JSON.stringify({ role: role.id, policy: policy.id, sort: 1 }),
    });
    console.log(`  + attached Web policy to Web role`);
  }

  // 4) User with static token
  const users = (await api(`/users?filter[email][_eq]=${encodeURIComponent(WEB_USER_EMAIL)}&fields=id,token&limit=1`)).data;
  if (users.length && users[0].token) {
    console.log(`  = user ${WEB_USER_EMAIL} (token already set — leaving as is)`);
    return null;
  }

  const token = randomBytes(32).toString("hex");
  if (users.length) {
    await api(`/users/${users[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ token, role: role.id, status: "active" }),
    });
    console.log(`  ~ user ${WEB_USER_EMAIL} (set new token)`);
  } else {
    await api(`/users`, {
      method: "POST",
      body: JSON.stringify({
        email: WEB_USER_EMAIL,
        first_name: "Web",
        last_name: "Client",
        token,
        role: role.id,
        status: "active",
      }),
    });
    console.log(`  + user ${WEB_USER_EMAIL}`);
  }
  return token;
}

function writeTokenToEnv(token) {
  // When pointed at a remote Directus (prod deploy), don't clobber the local
  // .env.local with a token meant for another environment. Just print it so
  // the operator can paste it into Vercel / their secret manager.
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(URL);
  if (!isLocal) {
    console.log("\n──────── Web user token (paste into your host's env) ────────");
    console.log(`DIRECTUS_TOKEN=${token}`);
    console.log("──────────────────────────────────────────────────────────────");
    return;
  }

  const line = `DIRECTUS_TOKEN=${token}`;
  if (!existsSync(envPath)) {
    writeFileSync(envPath, `${line}\n`, "utf8");
    console.log(`  + wrote ${line.split("=")[0]} to .env.local`);
    return;
  }
  const cur = readFileSync(envPath, "utf8");
  const updated = /^DIRECTUS_TOKEN=.*/m.test(cur)
    ? cur.replace(/^DIRECTUS_TOKEN=.*/m, line)
    : cur.replace(/\n?$/, `\n${line}\n`);
  writeFileSync(envPath, updated, "utf8");
  console.log(`  ~ updated DIRECTUS_TOKEN in .env.local`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
