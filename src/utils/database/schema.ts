import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Пример таблицы шаблона. Удалите/переименуйте под свою задачу,
 * затем: bun run db:generate && bun run db:migrate
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
