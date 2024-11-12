import {
  uuid,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  pgTableCreator,
  integer,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `aspire_${name}`);

// Users Table
export const users = createTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // phone: varchar("phone", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// Goals Table
export const goals = createTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  target_date: date("target_date"),
  is_completed: boolean("is_completed").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

// Milestones Table
export const milestones = createTable("milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  goal_id: uuid("goal_id")
    .references(() => goals.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  deadline: date("deadline"),
  is_completed: boolean("is_completed").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

// Tasks Table
export const tasks = createTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  milestone_id: uuid("milestone_id")
    .references(() => milestones.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 50 }), // e.g., "High", "Medium", "Low"
  due_date: date("due_date"),
  is_completed: boolean("is_completed").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

// Progress Tracking Table
export const progress = createTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  goal_id: uuid("goal_id").references(() => goals.id),
  milestone_id: uuid("milestone_id").references(() => milestones.id),
  task_id: uuid("task_id").references(() => tasks.id),
  status: varchar("status", { length: 100 }), // e.g., "In Progress", "Completed"
  progress_notes: text("progress_notes"),
  progress_date: timestamp("progress_date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

// Reminders Table
export const reminders = createTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  goal_id: uuid("goal_id").references(() => goals.id),
  milestone_id: uuid("milestone_id").references(() => milestones.id),
  task_id: uuid("task_id").references(() => tasks.id),
  reminder_date: timestamp("reminder_date").notNull(),
  message: text("message"),
  is_sent: boolean("is_sent").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

// Audit Logs Table
export const audit_logs = createTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "Created Goal", "Updated Task"
  entity: varchar("entity", { length: 100 }), // e.g., "Goal", "Milestone", "Task"
  entity_id: uuid("entity_id"), // ID of the entity affected
  timestamp: timestamp("timestamp").defaultNow(),
  details: text("details"), // Additional details if needed
});

// Indexes (Optional: To Optimize Queries)
uniqueIndex("users_email_idx").on(users.email);
