import { prisma } from "./config/prisma.js";
async function main() {
  // Fetch all users
  const users = await prisma.productImage.findMany();
  console.log("All users:", users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
