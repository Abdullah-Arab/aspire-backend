// src/db/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("priority", ["High", "Medium", "Low"]);
export const statusEnum = pgEnum("status", [
  "In Progress",
  "Completed",
  "Pending",
]);
