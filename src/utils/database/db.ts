import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env/env.schema";

export const db = drizzle(env.DATABASE_URL);
