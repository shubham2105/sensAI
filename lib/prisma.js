import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client is reused across
// jot reloads dusing development. Without this, each time our application reloads, a new
// instance of the Prisma client would be created, potentially leading to connection issues
