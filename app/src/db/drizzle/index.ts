import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'
import * as schema from '../schema'

declare global {
    var db: any | undefined
}
if (!globalThis.db) {
    globalThis.db = postgres(process.env.DATABASE_URL!, {
        max_lifetime: 60 * 30,
        idle_timeout: 120,
        connection: {
            application_name: 'Metaversy-App',
        },
    })
}
// await globalThis.db.connect()
if (process.env.NODE_ENV === 'development') globalThis.db = globalThis.db

// { schema } is used for relational queries
export const db = drizzle(globalThis.db, { schema })