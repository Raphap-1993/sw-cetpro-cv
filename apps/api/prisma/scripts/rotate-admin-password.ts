import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

async function main() {
  const email =
    process.env.ROTATE_ADMIN_EMAIL?.trim() ||
    process.env.SEED_ADMIN_EMAIL?.trim() ||
    "";
  const password = readRequiredEnv("ROTATE_ADMIN_PASSWORD");

  if (!email) {
    throw new Error("Missing ROTATE_ADMIN_EMAIL or SEED_ADMIN_EMAIL.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    throw new Error(`Admin user not found: ${email}`);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: {
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true
    }
  });

  console.log(`Rotated admin password for ${email}`);
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "rotate-admin-password-failed"
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
