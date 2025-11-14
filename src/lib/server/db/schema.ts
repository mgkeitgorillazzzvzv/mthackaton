import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});


export const registration = pgTable('registration', {
	id: serial('id').primaryKey(),
	leaderFio: varchar('leader_fio', { length: 256 }).notNull(),
	phone: varchar('phone', { length: 64 }).notNull(),
	email: varchar('email', { length: 256 }).notNull(),
	teamName: varchar('team_name', { length: 256 }).notNull(),
	membersFio: text('members_fio').notNull(),
	organization: varchar('organization', { length: 256 }).notNull(),
	caseNumber: integer('case_number').notNull().default(1),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});
