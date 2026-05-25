// Seeds Directus with the contents of data/mock.ts.
// Idempotent: upserts by primary key.
//
//   node directus/seed.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL   = process.env.DIRECTUS_URL   ?? "http://localhost:8055";
const EMAIL = process.env.ADMIN_EMAIL    ?? "admin@centavo.mx";
const PASS  = process.env.ADMIN_PASSWORD ?? "admin";

const here = dirname(fileURLToPath(import.meta.url));
const mockPath = join(here, "..", "data", "mock.ts");

// ── Parse mock.ts as a TS module via dynamic-eval ─────────────
// We strip imports and type annotations so plain Node can run it.
async function loadMock() {
  let src = readFileSync(mockPath, "utf8");
  src = src.replace(/^import[^;]+;/gm, "");
  src = src.replace(/:\s*(Article|Author|Category|GlossaryTerm|HomePageData|Story)\[\]/g, "");
  src = src.replace(/:\s*Record<string,\s*Author>/g, "");
  src = src.replace(/:\s*HomePageData/g, "");
  src = src.replace(/export const/g, "const");
  src += "\nreturn { CATEGORIES, AUTHORS, STORIES, GLOSSARY, ARTICLES, HOME_PAGE };";
  // eslint-disable-next-line no-new-func
  return new Function(src)();
}

// ── Auth + helpers ────────────────────────────────────────────
let token;

async function login() {
  const r = await fetch(`${URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  });
  if (!r.ok) throw new Error(`login failed: ${r.status} ${await r.text()}`);
  return (await r.json()).data.access_token;
}

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
    throw new Error(`${opts.method ?? "GET"} ${path} → ${r.status} ${JSON.stringify(body)}`);
  }
  return body;
}

// Upsert: try PATCH by pk; if 404, POST.
async function upsert(collection, pkField, row) {
  const pk = row[pkField];
  const existing = await fetch(
    `${URL}/items/${collection}/${encodeURIComponent(pk)}`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (existing.ok) {
    await api(`/items/${collection}/${encodeURIComponent(pk)}`, {
      method: "PATCH",
      body: JSON.stringify(row),
    });
    console.log(`  ~ ${collection}/${pk}`);
  } else {
    await api(`/items/${collection}`, {
      method: "POST",
      body: JSON.stringify(row),
    });
    console.log(`  + ${collection}/${pk}`);
  }
}

// ── Run ───────────────────────────────────────────────────────
async function run() {
  const mock = await loadMock();
  token = await login();

  console.log("categories");
  for (const c of mock.CATEGORIES) {
    await upsert("categories", "slug", { ...c, status: "published" });
  }

  console.log("authors");
  for (const a of Object.values(mock.AUTHORS)) {
    await upsert("authors", "slug", {
      slug: a.slug,
      name: a.name,
      role: a.role,
      avatar_color: a.avatarColor ?? null,
      status: "published",
    });
  }

  console.log("stories");
  // Stories have no natural PK; we wipe and re-insert.
  const existingStories = (await api(`/items/stories?limit=-1&fields=id`)).data;
  if (existingStories.length) {
    await api(`/items/stories`, {
      method: "DELETE",
      body: JSON.stringify(existingStories.map((s) => s.id)),
    });
  }
  for (const s of mock.STORIES) {
    await api(`/items/stories`, {
      method: "POST",
      body: JSON.stringify({ ...s, status: "published" }),
    });
    console.log(`  + stories/${s.name}`);
  }

  console.log("glossary_terms");
  for (const g of mock.GLOSSARY) {
    await upsert("glossary_terms", "slug", { ...g, status: "published" });
  }

  console.log("articles");
  for (const a of mock.ARTICLES) {
    await upsert("articles", "slug", {
      slug: a.slug,
      title: a.title,
      short: a.short,
      excerpt: a.excerpt,
      category: a.category,
      author: a.author.slug,
      published_at: a.publishedAt,
      read_minutes: a.readMinutes,
      hero_image: null,
      hero_image_alt: a.heroImage?.alt ?? null,
      hero_image_caption: a.heroImage?.caption ?? null,
      body: a.body,
      body_eli5: a.bodyEli5 ?? null,
      status: "published",
    });
  }

  // ── Home Page (singleton with M2M article relations) ────────
  // Directus manages M2M junction rows through the parent item's
  // PATCH endpoint — writing directly to junction tables leaves the
  // FK null. So we PATCH the singleton with all three M2M arrays.
  console.log("home_page");
  const hp = mock.HOME_PAGE;

  await api(`/items/home_page`, {
    method: "PATCH",
    body: JSON.stringify({
      starter_steps: hp.starterSteps.map((s, i) => ({
        articles_slug: s.article.slug,
        sort: i + 1,
        color: s.color,
      })),
      trending: hp.trending.map((a, i) => ({
        articles_slug: a.slug,
        sort: i + 1,
      })),
      more_articles: hp.moreArticles.map((a, i) => ({
        articles_slug: a.slug,
        sort: i + 1,
      })),
    }),
  });
  console.log("  ~ home_page (starter_steps, trending, more_articles)");

  console.log("\ndone.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
