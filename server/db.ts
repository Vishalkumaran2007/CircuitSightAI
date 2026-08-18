import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { CircuitMessage, CircuitThread, InsertUser, circuitMessages, circuitThreads, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.emailVerified !== undefined) {
      values.emailVerified = user.emailVerified;
      updateSet.emailVerified = user.emailVerified;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listCircuitThreads(userId: number): Promise<CircuitThread[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(circuitThreads).where(eq(circuitThreads.userId, userId)).orderBy(desc(circuitThreads.updatedAt));
}

export async function getCircuitThread(userId: number, threadId: number): Promise<CircuitThread | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(circuitThreads).where(eq(circuitThreads.id, threadId)).limit(1);
  const thread = result[0];
  return thread?.userId === userId ? thread : undefined;
}

export async function listCircuitMessages(userId: number, threadId: number): Promise<CircuitMessage[]> {
  const thread = await getCircuitThread(userId, threadId);
  if (!thread) return [];
  const db = await getDb();
  if (!db) return [];
  return db.select().from(circuitMessages).where(eq(circuitMessages.threadId, threadId)).orderBy(circuitMessages.createdAt);
}

export async function createCircuitThread(userId: number, title: string): Promise<CircuitThread> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable.");
  const result = await db.insert(circuitThreads).values({ userId, title });
  const threadId = Number((result as unknown as [{ insertId: number }])[0]?.insertId);
  const thread = await getCircuitThread(userId, threadId);
  if (!thread) throw new Error("Circuit thread could not be created.");
  return thread;
}

export async function addCircuitMessage(input: {
  userId: number;
  threadId: number;
  role: "user" | "assistant";
  content: string;
  attachmentName?: string | null;
}): Promise<void> {
  const thread = await getCircuitThread(input.userId, input.threadId);
  if (!thread) throw new Error("Circuit thread was not found.");
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable.");
  await db.insert(circuitMessages).values({ ...input, attachmentName: input.attachmentName ?? null });
  await db.update(circuitThreads).set({ updatedAt: new Date() }).where(eq(circuitThreads.id, input.threadId));
}
