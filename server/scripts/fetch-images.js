// Downloads one real photo per product from Wikimedia Commons (no API key needed).
// Run:  node scripts/fetch-images.js          (Node 18+, safe to re-run: existing images are skipped)
//
// Output:
//   public/images/<slug>.jpg|png   the photos (max 800px wide)
//   public/images/credits.json     author + license + Commons page for each photo (needed for attribution)
//   public/images/review.html      contact sheet - open it in a browser to spot-check every match
//
// Wrong photo for a product? Add an entry to data/image-overrides.json:
//   { "socks": "wool socks", "air-fryer": "File:Air fryer.jpg" }
// (slug -> a different search term, or an exact "File:..." title), delete that image, re-run.
import fs from "fs";
import path from "path";

const API = "https://commons.wikimedia.org/w/api.php";
const UA = "EcommerceSeedPack/1.0 (student project; image fetch script)";
const { products } = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const overrides = fs.existsSync("data/image-overrides.json")
  ? JSON.parse(fs.readFileSync("data/image-overrides.json", "utf8"))
  : {};
const DIR = path.join("public", "images");
fs.mkdirSync(DIR, { recursive: true });

const creditsFile = path.join(DIR, "credits.json");
const credits = fs.existsSync(creditsFile)
  ? JSON.parse(fs.readFileSync(creditsFile, "utf8"))
  : [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s = "") =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
const EXT = { "image/jpeg": "jpg", "image/png": "png" };
const BAD_WORDS =
  /\b(logo|icon|diagram|map|flag|svg|drawing|illustration|screenshot|poster|stamp|coat of arms|vector)\b/i;

async function api(params, tries = 4) {
  const url = `${API}?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429 || res.status >= 500) {
      await sleep(3000 * (i + 1));
      continue;
    }
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  }
  throw new Error("API busy, try again later");
}

const INFO = {
  prop: "imageinfo",
  iiprop: "url|mime|size|extmetadata",
  iiurlwidth: "800",
};

async function candidates(query) {
  if (/^file:/i.test(query)) {
    const j = await api({ action: "query", titles: query, ...INFO });
    return Object.values(j.query?.pages ?? {});
  }
  const j = await api({
    action: "query",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "15",
    gsrsearch: `${query} filetype:bitmap`,
    ...INFO,
  });
  const words = query
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  const score = (pg) =>
    words.filter((w) => pg.title.toLowerCase().includes(w)).length;
  return Object.values(j.query?.pages ?? {}).sort(
    (a, b) => score(b) - score(a) || (a.index ?? 0) - (b.index ?? 0),
  );
}

function usable(page) {
  const ii = page.imageinfo?.[0];
  if (!ii || !EXT[ii.mime]) return null;
  if (ii.width < 500 || ii.height < 400) return null;
  if (BAD_WORDS.test(page.title)) return null;
  const m = ii.extmetadata ?? {};
  if (
    m.NonFree?.value === "true" ||
    /fair use|non-free/i.test(m.LicenseShortName?.value ?? "")
  )
    return null;
  return ii;
}

const failed = [];
let ok = 0;
for (const p of products) {
  const existing = ["jpg", "png"]
    .map((e) => path.join(DIR, `${p.slug}.${e}`))
    .find(fs.existsSync);
  if (existing) {
    ok++;
    continue;
  }
  try {
    const queries = [
      ...new Set([
        overrides[p.slug] ?? p.imageQuery,
        p.name,
        `${p.imageQuery} product`,
      ]),
    ];
    let pick = null;
    for (const q of queries) {
      for (const page of await candidates(q)) {
        const ii = usable(page);
        if (ii) {
          pick = { page, ii };
          break;
        }
      }
      if (pick) break;
    }
    if (!pick) throw new Error("no suitable photo found");
    const { page, ii } = pick;
    let img;
    for (let i = 0; i < 5; i++) {
      // retry on rate limit (429) / server errors
      img = await fetch(ii.thumburl || ii.url, {
        headers: { "User-Agent": UA },
      });
      if (img.status !== 429 && img.status < 500) break;
      const wait =
        (Number(img.headers.get("retry-after")) || 5 * (i + 1)) * 1000;
      console.log(`  rate limited, waiting ${wait / 1000}s...`);
      await sleep(wait);
    }
    if (!img.ok) throw new Error(`download ${img.status}`);
    const file = `${p.slug}.${EXT[ii.mime]}`;
    fs.writeFileSync(
      path.join(DIR, file),
      Buffer.from(await img.arrayBuffer()),
    );
    const m = ii.extmetadata ?? {};
    credits.push({
      product: p.name,
      file,
      title: page.title,
      author: strip(m.Artist?.value).slice(0, 80) || "Unknown",
      license: m.LicenseShortName?.value || "See page",
      licenseUrl: m.LicenseUrl?.value || null,
      source: ii.descriptionurl,
    });
    ok++;
    console.log(`✓ ${p.name}  ←  ${page.title}`);
  } catch (e) {
    failed.push(p.name);
    console.log(`✗ ${p.name} (${e.message})`);
  }
  await sleep(1200); // be polite (upload.wikimedia.org rate-limits fast downloads) to Wikimedia
}

fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));

// Contact sheet for quick visual review
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const cards = credits
  .map(
    (c) =>
      `<figure><img src="${c.file}" loading="lazy"><figcaption><b>${esc(c.product)}</b><br>${esc(c.title)}<br><small>${esc(c.author)} · ${esc(c.license)}</small></figcaption></figure>`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(DIR, "review.html"),
  `<!doctype html><meta charset="utf-8"><title>Image review</title><style>body{font:14px system-ui;margin:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}figure{margin:0}img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px}</style>\n${cards}`,
);

console.log(
  `\nDone: ${ok}/${products.length} images. Failed: ${failed.length}`,
);
if (failed.length)
  fs.writeFileSync(path.join(DIR, "missing.txt"), failed.join("\n"));
if (failed.length)
  console.log(
    "Add overrides in data/image-overrides.json for:",
    failed.join(", "),
  );
console.log("Open public/images/review.html to check the matches.");
