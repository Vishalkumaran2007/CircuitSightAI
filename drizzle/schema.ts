import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const idkPreferences = mysqlTable("idk_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  explanationLevel: mysqlEnum("explanationLevel", ["beginner", "intermediate", "advanced"]).default("intermediate").notNull(),
  responseStyle: mysqlEnum("responseStyle", ["concise", "balanced", "detailed"]).default("balanced").notNull(),
  sarcasmEnabled: boolean("sarcasmEnabled").default(false).notNull(),
  technicalTerminology: boolean("technicalTerminology").default(true).notNull(),
  preferVisuals: boolean("preferVisuals").default(true).notNull(),
  suggestImprovements: boolean("suggestImprovements").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("idk_preferences_user_idx").on(table.userId)]);

export type IdkPreferences = typeof idkPreferences.$inferSelect;
export type InsertIdkPreferences = typeof idkPreferences.$inferInsert;

export const circuitThreads = mysqlTable("circuit_threads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("circuit_threads_user_idx").on(table.userId)]);

export const circuitMessages = mysqlTable("circuit_messages", {
  id: int("id").autoincrement().primaryKey(),
  threadId: int("threadId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  attachmentName: varchar("attachmentName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  index("circuit_messages_thread_idx").on(table.threadId),
  index("circuit_messages_user_idx").on(table.userId),
]);

export const circuitFeedback = mysqlTable("circuit_feedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  threadId: int("threadId").notNull(),
  messageId: int("messageId"),
  feedbackType: mysqlEnum("feedbackType", ["correction", "confirmation", "clarification"]).notNull(),
  correctionText: text("correctionText").notNull(),
  evidenceNotes: text("evidenceNotes"),
  reviewStatus: mysqlEnum("reviewStatus", ["pending", "accepted", "rejected"]).default("pending").notNull(),
  sourceCheckNotes: text("sourceCheckNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  index("circuit_feedback_user_idx").on(table.userId),
  index("circuit_feedback_thread_idx").on(table.threadId),
]);

export type CircuitThread = typeof circuitThreads.$inferSelect;
export type CircuitMessage = typeof circuitMessages.$inferSelect;
export type CircuitFeedback = typeof circuitFeedback.$inferSelect;
export type InsertCircuitFeedback = typeof circuitFeedback.$inferInsert;
