// src/services/userService.ts
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getUserById = async (userId: string) => {
  return db.select().from(users).where(eq(users.id, userId)).limit(1);
};
