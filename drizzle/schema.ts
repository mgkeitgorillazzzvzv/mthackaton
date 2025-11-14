import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const registration = pgTable("registration", {
	id: serial().primaryKey().notNull(),
	leaderFio: varchar("leader_fio", { length: 256 }).notNull(),
	phone: varchar({ length: 64 }).notNull(),
	email: varchar({ length: 256 }).notNull(),
	teamName: varchar("team_name", { length: 256 }).notNull(),
	membersFio: text("members_fio").notNull(),
	organization: varchar({ length: 256 }).notNull(),
	caseNumber: integer("case_number").notNull().default(1),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const user = pgTable("user", {
	id: serial().primaryKey().notNull(),
	age: integer(),
});
