import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin@1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@buslink.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@buslink.com",
      phone: "+250788000000",
      password: password,
      role: "SYSTEM_ADMIN",
    },
  });

  console.log("System Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });