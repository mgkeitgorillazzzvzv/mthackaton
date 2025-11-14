CREATE TABLE "registration" (
	"id" serial PRIMARY KEY NOT NULL,
	"leader_fio" varchar(256) NOT NULL,
	"phone" varchar(64) NOT NULL,
	"email" varchar(256) NOT NULL,
	"team_name" varchar(256) NOT NULL,
	"members_fio" text NOT NULL,
	"organization" varchar(256) NOT NULL,
	"case_number" varchar(10) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer
);
