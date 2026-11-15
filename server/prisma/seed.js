// Seeds categories, products and (if present) product images.
// Run:  node prisma/seed.js      (safe to run more than once)
import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { categories, products } = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const IMAGE_DIR = path.join("public", "images");

function findImage(slug) {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(IMAGE_DIR, `${slug}.${ext}`))) return `/images/${slug}.${ext}`;
  }
  return null;
}

async function main() {
  const catIds = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, description: c.description },
    });
    catIds[c.name] = row.id;
  }

  let created = 0, skipped = 0, withImage = 0;
  for (const p of products) {
    const categoryId = catIds[p.category];
    let product = await prisma.product.findFirst({ where: { name: p.name, categoryId } });
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price.toFixed(2),
          stockQuantity: p.stockQuantity,
          categoryId,
        },
      });
      created++;
    } else skipped++;

    const imageUrl = findImage(p.slug);
    if (imageUrl) {
      const has = await prisma.productImage.findFirst({ where: { productId: product.id } });
      if (!has) {
        await prisma.productImage.create({ data: { productId: product.id, imageUrl } });
        withImage++;
      }
    }
  }
  console.log(`Categories: ${categories.length} | products created: ${created}, already existed: ${skipped} | images linked: ${withImage}`);
  if (withImage === 0) console.log("No images found in public/images yet. Run: node scripts/fetch-images.js, then run this seed again.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
