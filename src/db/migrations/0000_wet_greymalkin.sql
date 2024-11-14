CREATE TYPE "public"."priority" AS ENUM('High', 'Medium', 'Low');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('In Progress', 'Completed', 'Pending');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" varchar(255) NOT NULL,
	"entity" varchar(100),
	"entity_id" uuid,
	"timestamp" timestamp DEFAULT now(),
	"details" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"target_date" date,
	"is_completed" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"deadline" date,
	"is_completed" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reference_id" uuid NOT NULL,
	"reference_type" varchar(50) NOT NULL,
	"status" "status" DEFAULT 'Pending',
	"progress_notes" text,
	"progress_date" timestamp DEFAULT now(),
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"goal_id" uuid,
	"milestone_id" uuid,
	"task_id" uuid,
	"reminder_date" timestamp NOT NULL,
	"message" text,
	"is_sent" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"milestone_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"priority" "priority" DEFAULT 'Medium',
	"due_date" date,
	"is_completed" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aspire_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "aspire_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_audit_logs" ADD CONSTRAINT "aspire_audit_logs_user_id_aspire_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aspire_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_goals" ADD CONSTRAINT "aspire_goals_user_id_aspire_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aspire_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_milestones" ADD CONSTRAINT "aspire_milestones_goal_id_aspire_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."aspire_goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_progress" ADD CONSTRAINT "aspire_progress_user_id_aspire_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aspire_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_reminders" ADD CONSTRAINT "aspire_reminders_user_id_aspire_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aspire_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_reminders" ADD CONSTRAINT "aspire_reminders_goal_id_aspire_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."aspire_goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_reminders" ADD CONSTRAINT "aspire_reminders_milestone_id_aspire_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."aspire_milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_reminders" ADD CONSTRAINT "aspire_reminders_task_id_aspire_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."aspire_tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspire_tasks" ADD CONSTRAINT "aspire_tasks_milestone_id_aspire_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."aspire_milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
