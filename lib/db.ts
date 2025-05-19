import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the Neon database URL
export const sql = neon(process.env.DATABASE_URL!)

// Create a Drizzle client for more structured queries (optional)
export const db = drizzle(sql)

// Helper function to execute SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
