import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const isProduction = process.env.NODE_ENV === "production";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  "Pulseras",
  "Collares",
  "Aretes",
  "Anillos",
  "Llaveros",
  "Bolsos",
  "Decoración",
  "Ropa",
    
];

async function main() {
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Categorías predeterminadas creadas correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });