
import { uuid, pgTable, varchar, timestamp, pgTableCreator } from "drizzle-orm/pg-core";


export const createTable = pgTableCreator((name) => `aspire_${name}`);

export const users = createTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: varchar({ length: 255 }).notNull().unique(),
});

export const userStreaks = createTable("user_streaks", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => users.id),
  date_opened: timestamp().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});



