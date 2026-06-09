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
const EMAIL = process.env.ADMIN_EMAIL    ?? "admin@centavos.mx";
const PASS  = process.env.ADMIN_PASSWORD ?? "admin";

const WEB_USER_EMAIL = "web@centavos.mx";
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

  // ── Drop legacy starter_steps (replaced by home_page M2M) ──
  if (await exists("/collections/starter_steps")) {
    await api("/collections/starter_steps", { method: "DELETE" });
    console.log("- dropped starter_steps (replaced by home_page M2M)");
  }

  // ── home_page (singleton) ─────────────────────────────────
  await createSingleton("home_page", { icon: "home", sort: 6 });

  // Junction: home_page ←→ articles (starter steps)
  await createJunction("home_page_starter_steps");
  await addField("home_page_starter_steps", "home_page_id",  { type: "integer", meta: { hidden: true }, schema: { foreign_key_table: "home_page", foreign_key_column: "id" } });
  await addField("home_page_starter_steps", "articles_slug", { type: "string",  meta: { hidden: true }, schema: { foreign_key_table: "articles",  foreign_key_column: "slug" } });
  await addField("home_page_starter_steps", "sort",          { type: "integer", meta: { hidden: true } });
  await addField("home_page_starter_steps", "color", {
    type: "string",
    meta: {
      interface: "select-dropdown",
      options: { choices: [
        { text: "Peach", value: "peach" },
        { text: "Sand",  value: "sand" },
        { text: "Sky",   value: "sky" },
      ]},
      width: "half",
    },
    schema: { default_value: "peach", is_nullable: false },
  });

  // Junction: home_page ←→ articles (trending)
  await createJunction("home_page_trending");
  await addField("home_page_trending", "home_page_id",  { type: "integer", meta: { hidden: true }, schema: { foreign_key_table: "home_page", foreign_key_column: "id" } });
  await addField("home_page_trending", "articles_slug", { type: "string",  meta: { hidden: true }, schema: { foreign_key_table: "articles",  foreign_key_column: "slug" } });
  await addField("home_page_trending", "sort",          { type: "integer", meta: { hidden: true } });

  // Junction: home_page ←→ articles (more articles)
  await createJunction("home_page_more_articles");
  await addField("home_page_more_articles", "home_page_id",  { type: "integer", meta: { hidden: true }, schema: { foreign_key_table: "home_page", foreign_key_column: "id" } });
  await addField("home_page_more_articles", "articles_slug", { type: "string",  meta: { hidden: true }, schema: { foreign_key_table: "articles",  foreign_key_column: "slug" } });
  await addField("home_page_more_articles", "sort",          { type: "integer", meta: { hidden: true } });

  // M2M alias fields on home_page
  await addField("home_page", "starter_steps",  { type: "alias", meta: { interface: "list-m2m", special: ["m2m"], options: { template: "{{articles_slug.title}}", junctionFieldsWrite: ["sort", "color"] } } });
  await addField("home_page", "trending",       { type: "alias", meta: { interface: "list-m2m", special: ["m2m"], options: { template: "{{articles_slug.title}}" } } });
  await addField("home_page", "more_articles",  { type: "alias", meta: { interface: "list-m2m", special: ["m2m"], options: { template: "{{articles_slug.title}}" } } });

  // ── home_page ad slot (rendered below "Empieza por aquí") ────
  await addField("home_page", "ad_divider", {
    type: "alias",
    meta: {
      interface: "presentation-divider",
      special: ["alias", "no-data"],
      options: { title: "Anuncio (slot bajo «Empieza por aquí»)", color: "#FF8A4C" },
      width: "full",
    },
  });
  await addField("home_page", "ad_enabled", {
    type: "boolean",
    meta: { interface: "boolean", width: "half", note: "Mostrar el anuncio en la home" },
    schema: { default_value: false, is_nullable: false },
  });
  await addField("home_page", "ad_label", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Etiqueta visible (ej. «Anuncio», «Patrocinado»)" },
    schema: { default_value: "Anuncio" },
  });
  await addField("home_page", "ad_brand", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Marca / anunciante" },
  });
  await addField("home_page", "ad_cta", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Texto del botón (ej. «Comprar ahora»)" },
  });
  await addField("home_page", "ad_headline", {
    type: "string",
    meta: { interface: "input", width: "full", note: "Título del anuncio" },
  });
  await addField("home_page", "ad_body", {
    type: "text",
    meta: { interface: "input-multiline", width: "full", note: "Descripción corta" },
  });
  await addField("home_page", "ad_href", {
    type: "string",
    meta: { interface: "input", width: "full", note: "URL de afiliado / destino" },
  });
  await addField("home_page", "ad_image", {
    type: "uuid",
    meta: { interface: "file-image", display: "image", special: ["file"], width: "half" },
    schema: { foreign_key_table: "directus_files" },
  });
  await addField("home_page", "ad_image_alt", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Texto alternativo de la imagen" },
  });

  // ── home_page app showcase (hero arriba del blog) ────────────
  await addField("home_page", "app_divider", {
    type: "alias",
    meta: {
      interface: "presentation-divider",
      special: ["alias", "no-data"],
      options: { title: "App Centavos (hero principal)", color: "#ED7E3C" },
      width: "full",
    },
  });
  await addField("home_page", "app_enabled", {
    type: "boolean",
    meta: { interface: "boolean", width: "half", note: "Mostrar la app como hero de la home" },
    schema: { default_value: false, is_nullable: false },
  });
  await addField("home_page", "app_kicker", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Texto pequeño arriba del título" },
    schema: { default_value: "Nuestra app · iOS y Android" },
  });
  await addField("home_page", "app_headline", {
    type: "string",
    meta: { interface: "input", width: "full", note: "Título grande (ej. «Tu lana, bajo control»)" },
  });
  await addField("home_page", "app_body", {
    type: "text",
    meta: { interface: "input-multiline", width: "full", note: "Pitch corto de la app" },
  });
  await addField("home_page", "app_store_url", {
    type: "string",
    meta: { interface: "input", width: "half", note: "URL en App Store" },
  });
  await addField("home_page", "app_play_url", {
    type: "string",
    meta: { interface: "input", width: "half", note: "URL en Google Play" },
  });
  await addField("home_page", "app_screenshot", {
    type: "uuid",
    meta: { interface: "file-image", display: "image", special: ["file"], width: "half" },
    schema: { foreign_key_table: "directus_files" },
  });
  await addField("home_page", "app_screenshot_alt", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Texto alternativo del screenshot" },
  });
  await addField("home_page", "app_features", {
    type: "json",
    meta: {
      interface: "list",
      special: ["cast-json"],
      width: "full",
      note: "Funciones de la app (gastos, suscripciones, presupuestos)",
      options: {
        template: "{{ emoji }} {{ title }}",
        fields: [
          { field: "emoji",       name: "Emoji",       type: "string", meta: { interface: "input", width: "half" } },
          { field: "title",       name: "Título",      type: "string", meta: { interface: "input", width: "half" } },
          { field: "description", name: "Descripción", type: "text",   meta: { interface: "input-multiline", width: "full" } },
        ],
      },
    },
  });

  // newsletter_subscribers (double opt-in via Resend)
  await createSubscribersCollection();
  await addField("newsletter_subscribers", "email", {
    type: "string",
    meta: { interface: "input", required: true, width: "full", options: { trim: true, iconLeft: "alternate_email" } },
    schema: { is_unique: true, is_nullable: false },
  });
  await addField("newsletter_subscribers", "confirm_token", {
    type: "string",
    meta: { interface: "input", hidden: true, readonly: true, note: "Cleared once the subscriber confirms" },
  });
  await addField("newsletter_subscribers", "unsubscribe_token", {
    type: "string",
    meta: { interface: "input", hidden: true, readonly: true, note: "Stable per-subscriber token embedded in every send" },
    schema: { is_nullable: false },
  });
  await addField("newsletter_subscribers", "confirmed_at", {
    type: "timestamp",
    meta: { interface: "datetime", readonly: true, width: "half" },
  });
  await addField("newsletter_subscribers", "unsubscribed_at", {
    type: "timestamp",
    meta: { interface: "datetime", readonly: true, width: "half" },
  });
  await addField("newsletter_subscribers", "source", {
    type: "string",
    meta: { interface: "input", width: "half", note: "Where they signed up from (e.g. homepage_footer)" },
  });
  await addField("newsletter_subscribers", "language", {
    type: "string",
    meta: { interface: "input", width: "half" },
    schema: { default_value: "es" },
  });
  await addField("newsletter_subscribers", "ip_hash", {
    type: "string",
    meta: { interface: "input", hidden: true, readonly: true, note: "SHA-256(ip + salt) for abuse rate limiting" },
  });

  // Register M2O relations so `?fields=author.*` joins work
  await ensureRelation({ collection: "glossary_terms", field: "category", related: "categories" });
  await ensureRelation({ collection: "articles",       field: "category", related: "categories" });
  await ensureRelation({ collection: "articles",       field: "author",   related: "authors" });
  await ensureRelation({ collection: "articles",       field: "hero_image", related: "directus_files" });
  await ensureRelation({ collection: "home_page",      field: "ad_image",   related: "directus_files" });
  await ensureRelation({ collection: "home_page",      field: "app_screenshot", related: "directus_files" });

  // Register M2M relations for home_page
  // starter_steps
  await ensureRelation({ collection: "home_page_starter_steps", field: "home_page_id",  related: "home_page",
    meta: { one_field: "starter_steps", sort_field: "sort", junction_field: "articles_slug" } });
  await ensureRelation({ collection: "home_page_starter_steps", field: "articles_slug", related: "articles",
    meta: { one_field: null, junction_field: "home_page_id" } });
  // trending
  await ensureRelation({ collection: "home_page_trending", field: "home_page_id",  related: "home_page",
    meta: { one_field: "trending", sort_field: "sort", junction_field: "articles_slug" } });
  await ensureRelation({ collection: "home_page_trending", field: "articles_slug", related: "articles",
    meta: { one_field: null, junction_field: "home_page_id" } });
  // more_articles
  await ensureRelation({ collection: "home_page_more_articles", field: "home_page_id",  related: "home_page",
    meta: { one_field: "more_articles", sort_field: "sort", junction_field: "articles_slug" } });
  await ensureRelation({ collection: "home_page_more_articles", field: "articles_slug", related: "articles",
    meta: { one_field: null, junction_field: "home_page_id" } });

  // Lock down: revoke public perms, create a read-only Web role with a static token
  const allCollections = [
    "categories", "authors", "stories", "glossary_terms", "articles",
    "home_page", "home_page_starter_steps", "home_page_trending", "home_page_more_articles",
    "directus_files",
  ];
  await revokePublicRead(allCollections);
  const newToken = await ensureWebUser(allCollections);
  if (newToken) writeTokenToEnv(newToken);

  console.log("\ndone. open http://localhost:8055 (admin@centavos.mx / admin)");
}

async function createSingleton(name, opts = {}) {
  if (await exists(`/collections/${name}`)) {
    console.log(`= collection ${name} (singleton)`);
    return;
  }
  const { icon, sort } = opts;
  await api("/collections", {
    method: "POST",
    body: JSON.stringify({
      collection: name,
      meta: { singleton: true, icon, sort },
      schema: { name },
      fields: [
        { field: "id", type: "integer", meta: { hidden: true, interface: "input", readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      ],
    }),
  });
  console.log(`+ collection ${name} (singleton)`);
}

async function createJunction(name) {
  if (await exists(`/collections/${name}`)) {
    console.log(`  = junction ${name}`);
    return;
  }
  await api("/collections", {
    method: "POST",
    body: JSON.stringify({
      collection: name,
      meta: { hidden: true, icon: "import_export" },
      schema: { name },
      fields: [
        { field: "id", type: "integer", meta: { hidden: true, interface: "input", readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      ],
    }),
  });
  console.log(`  + junction ${name}`);
}

async function createSubscribersCollection() {
  const name = "newsletter_subscribers";
  if (await exists(`/collections/${name}`)) {
    console.log(`= collection ${name}`);
    return;
  }
  await api("/collections", {
    method: "POST",
    body: JSON.stringify({
      collection: name,
      meta: {
        icon: "mark_email_read",
        note: "Newsletter subscribers (double opt-in)",
        sort: 10,
        display_template: "{{email}}",
        archive_field: "status",
        archive_value: "unsubscribed",
        unarchive_value: "pending",
      },
      schema: { name },
      fields: [
        {
          field: "id",
          type: "integer",
          meta: { hidden: true, interface: "input", readonly: true },
          schema: { is_primary_key: true, has_auto_increment: true },
        },
        {
          field: "status",
          type: "string",
          meta: {
            width: "half",
            interface: "select-dropdown",
            options: {
              choices: [
                { text: "Pending",      value: "pending" },
                { text: "Confirmed",    value: "confirmed" },
                { text: "Unsubscribed", value: "unsubscribed" },
              ],
            },
            display: "labels",
            display_options: {
              showAsDot: true,
              choices: [
                { text: "Pending",      value: "pending",      foreground: "#18222F", background: "#FFD79A" },
                { text: "Confirmed",    value: "confirmed",    foreground: "#FFFFFF", background: "#2ECDA7" },
                { text: "Unsubscribed", value: "unsubscribed", foreground: "#FFFFFF", background: "#A2B5CD" },
              ],
            },
          },
          schema: { default_value: "pending", is_nullable: false },
        },
        {
          field: "date_created",
          type: "timestamp",
          meta: {
            special: ["date-created"],
            interface: "datetime",
            readonly: true,
            width: "half",
            display: "datetime",
          },
        },
      ],
    }),
  });
  console.log(`+ collection ${name}`);
}

async function ensureRelation({ collection, field, related, meta: extraMeta }) {
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
      meta: { sort_field: null, ...extraMeta },
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

async function ensureNewsletterPermissions(policyId) {
  const collection = "newsletter_subscribers";
  const perms = (await api(`/permissions?filter[policy][_eq]=${policyId}&filter[collection][_eq]=${collection}&limit=-1`)).data;
  const have = new Set(perms.map((p) => p.action));
  for (const action of ["read", "create", "update"]) {
    if (have.has(action)) continue;
    await api(`/permissions`, {
      method: "POST",
      body: JSON.stringify({
        policy: policyId,
        collection,
        action,
        fields: ["*"],
        permissions: {},
        validation: {},
      }),
    });
    console.log(`  + ${action} perm on ${collection}`);
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

  await ensureNewsletterPermissions(policy.id);

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
